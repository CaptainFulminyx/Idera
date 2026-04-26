import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for safe inline rendering
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Custom renderer — open links in new tab
const renderer = new marked.Renderer()
renderer.link = (href, title, text) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`
}
marked.use({ renderer })

export function renderContent(raw) {
  if (!raw) return ''
  const html = marked.parse(raw)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p','br','strong','em','code','pre','a','ul','ol','li','blockquote'],
    ALLOWED_ATTR: ['href','title','target','rel'],
  })
}

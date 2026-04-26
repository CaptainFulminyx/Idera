/**
 * Fetches OG metadata for a URL via a public proxy.
 * Falls back gracefully — never throws to the caller.
 */
export async function fetchOgMeta(url) {
  try {
    // Use a CORS-friendly OG scraper proxy
    const endpoint = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return null
    const data = await res.json()
    const html = data.contents

    const getMeta = (prop) => {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'))
      return match ? match[1] : null
    }

    const getTitle = () => {
      const og = getMeta('title')
      if (og) return og
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return m ? m[1].trim() : null
    }

    return {
      ogTitle:       getTitle(),
      ogDescription: getMeta('description'),
      ogImageUrl:    getMeta('image'),
    }
  } catch {
    return null
  }
}

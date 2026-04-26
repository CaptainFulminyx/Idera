<script setup>
import { ref, computed, inject, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'
import { renderContent } from '@/lib/markdown'

const props = defineProps({
  post: { type: Object, required: true },
})

const auth     = useAuthStore()
const feed     = useFeedStore()
const openAuth = inject('openAuth')

const open         = ref(false)
const replyText    = ref('')
const replying     = ref(false)
const replyError   = ref('')
const replyInputRef = ref(null)

// Touch/swipe detection for mobile swipe-right → open reply
const touchStartX = ref(0)
const touchStartY = ref(0)

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX.value
  const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.value)
  if (dx > 48 && dy < 40) { // swipe right
    toggleThread()
    if (!open.value) focusReply()
  }
}

async function toggleThread() {
  open.value = !open.value
  if (open.value && !feed.replies[props.post.$id]) {
    await feed.fetchReplies(props.post.$id)
  }
  if (open.value) {
    await nextTick()
    replyInputRef.value?.focus()
  }
}

function focusReply() {
  nextTick(() => replyInputRef.value?.focus())
}

async function submitReply() {
  if (!auth.isLoggedIn) { openAuth(); return }
  if (!replyText.value.trim()) return
  replyError.value = ''
  replying.value   = true
  try {
    await feed.createReply({
      content:  replyText.value.trim(),
      postId:   props.post.$id,
      userId:   auth.user.$id,
      callsign: auth.callsign,
    })
    replyText.value = ''
    await nextTick()
    scrollRepliesBottom()
  } catch (e) {
    replyError.value = e?.message || 'reply failed'
  } finally {
    replying.value = false
  }
}

const repliesEl = ref(null)
function scrollRepliesBottom() {
  nextTick(() => {
    if (repliesEl.value) repliesEl.value.scrollTop = repliesEl.value.scrollHeight
  })
}

const typeConfig = {
  thought: { label: 'thought', color: '#e8e8f0', bg: '#1e1e28' },
  project: { label: 'project', color: '#e8ff47', bg: '#252510' },
  help:    { label: 'help?',   color: '#47d4ff', bg: '#0f2030' },
  rant:    { label: 'rant',    color: '#ff6b6b', bg: '#2a1010' },
}

const tc = computed(() => typeConfig[props.post.type] || typeConfig.thought)

const postHtml    = computed(() => renderContent(props.post.content))
const currentReplies = computed(() => feed.replies[props.post.$id] || [])
const isLoadingReplies = computed(() => feed.loadingReplies[props.post.$id])

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}
</script>

<template>
  <article
    class="bg-[#111118] border border-[#1e1e28] hover:border-[#2a2a35] transition-colors"
    :style="open ? `border-color: #2a2a35` : ''"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >

    <!-- ── Post header ── -->
    <div class="px-4 pt-3.5 pb-1 flex items-start gap-3">
      <!-- Avatar / callsign initial -->
      <div
        class="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold font-mono mt-0.5"
        :style="`background: ${tc.bg}; color: ${tc.color}`"
      >
        {{ post.callsign?.slice(0, 2) }}
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-[#e8e8f0] font-mono">{{ post.callsign }}</span>
          <!-- Type badge -->
          <span
            class="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 font-mono"
            :style="`color: ${tc.color}; background: ${tc.bg}`"
          >{{ tc.label }}</span>
          <span class="text-[10px] text-[#3a3a48] font-mono ml-auto">{{ timeAgo(post.$createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- ── Post content ── -->
    <div class="px-4 pb-3 pl-[3.25rem]">
      <div
        class="post-prose text-sm text-[#c8c8d8] leading-relaxed font-mono"
        v-html="postHtml"
      />

      <!-- OG card for projects -->
      <a
        v-if="post.url && (post.ogTitle || post.ogDescription)"
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 flex gap-3 border border-[#2a2a35] border-l-2 border-l-[#47d4ff] p-3 hover:bg-[#18181f] transition-colors no-underline block"
      >
        <img
          v-if="post.ogImageUrl"
          :src="post.ogImageUrl"
          class="w-14 h-14 object-cover shrink-0 opacity-80"
          alt=""
        />
        <div class="min-w-0">
          <p v-if="post.ogTitle" class="text-[12px] font-bold text-[#e8e8f0] font-mono truncate">{{ post.ogTitle }}</p>
          <p v-if="post.ogDescription" class="text-[10px] text-[#6b6b80] font-mono mt-0.5 line-clamp-2">{{ post.ogDescription }}</p>
          <p class="text-[9px] text-[#3a3a48] font-mono mt-1 truncate">{{ post.url }}</p>
        </div>
      </a>
      <!-- URL only (no OG) -->
      <a
        v-else-if="post.url"
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 text-[11px] text-[#47d4ff] font-mono hover:underline block truncate"
      >{{ post.url }}</a>
    </div>

    <!-- ── Post footer ── -->
    <div class="px-4 pb-3 pl-[3.25rem] flex items-center gap-4">
      <button
        @click="toggleThread"
        class="flex items-center gap-1.5 text-[10px] text-[#6b6b80] hover:text-[#e8e8f0] transition-colors font-mono group"
      >
        <svg class="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span>{{ post.replyCount || 0 }}</span>
        <span class="opacity-0 group-hover:opacity-100 transition-opacity">{{ open ? 'close' : 'replies' }}</span>
      </button>

      <span class="text-[10px] text-[#3a3a48] font-mono">score {{ post.score || 0 }}</span>
    </div>

    <!-- ══ Inline Thread (Telegram-style) ══ -->
    <div v-if="open" class="border-t border-[#1e1e28] animate-expand">

      <!-- Replies list -->
      <div
        ref="repliesEl"
        class="max-h-80 overflow-y-auto px-4 py-3 space-y-3"
      >
        <!-- Loading -->
        <div v-if="isLoadingReplies" class="text-center py-4">
          <span class="text-[10px] text-[#6b6b80] font-mono">loading thread...</span>
        </div>

        <!-- Empty -->
        <div v-else-if="currentReplies.length === 0" class="text-center py-4">
          <span class="text-[10px] text-[#3a3a48] font-mono">no replies yet. be first.</span>
        </div>

        <!-- Reply messages -->
        <template v-else>
          <div
            v-for="(reply, i) in currentReplies"
            :key="reply.$id"
            class="flex gap-2.5 animate-fade-in"
            :style="`animation-delay: ${i * 0.03}s`"
          >
            <!-- Tiny avatar -->
            <div class="w-5 h-5 rounded-full bg-[#1e1e28] shrink-0 flex items-center justify-center text-[8px] font-bold font-mono text-[#6b6b80] mt-0.5">
              {{ reply.callsign?.slice(0,2) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-1.5 flex-wrap">
                <!-- Self vs others — subtle teal highlight -->
                <span
                  class="text-[10px] font-bold font-mono"
                  :class="auth.callsign === reply.callsign ? 'text-[#47d4ff]' : 'text-[#6b6b80]'"
                >{{ reply.callsign }}</span>
                <span class="text-[9px] text-[#2a2a35] font-mono">{{ timeAgo(reply.$createdAt) }}</span>
              </div>
              <div
                class="post-prose text-[12px] text-[#c8c8d8] leading-relaxed mt-0.5 font-mono"
                v-html="renderContent(reply.content)"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- Reply input bar -->
      <div class="border-t border-[#1e1e28] px-3 py-2.5 flex items-end gap-2">
        <div
          v-if="auth.isLoggedIn"
          class="w-5 h-5 rounded-full bg-[#252525] flex items-center justify-center text-[8px] font-bold text-[#47d4ff] font-mono shrink-0 mb-1"
        >
          {{ auth.callsign?.slice(0,2) }}
        </div>

        <textarea
          ref="replyInputRef"
          v-model="replyText"
          :placeholder="auth.isLoggedIn ? 'reply...' : 'join to reply'"
          :readonly="!auth.isLoggedIn"
          @click="!auth.isLoggedIn && openAuth()"
          rows="1"
          class="flex-1 bg-[#0a0a0f] border border-[#2a2a35] text-[#e8e8f0] text-[12px] font-mono px-2.5 py-1.5 placeholder:text-[#3a3a48] focus:outline-none focus:border-[#e8ff47] resize-none transition-colors leading-relaxed"
          style="min-height: 34px; max-height: 100px; overflow-y: auto; field-sizing: content;"
          @keydown.enter.exact.prevent="submitReply"
          @keydown.enter.shift.exact="replyText += '\n'"
        />

        <button
          @click="submitReply"
          :disabled="replying || !replyText.trim()"
          class="shrink-0 w-8 h-8 flex items-center justify-center bg-[#e8ff47] text-[#0a0a0f] hover:bg-[#d4eb3a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors mb-px"
        >
          <svg v-if="!replying" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <span v-else class="text-[9px] font-mono">…</span>
        </button>
      </div>

      <p v-if="replyError" class="px-4 pb-2 text-[10px] text-[#ff6b6b] font-mono">⚠ {{ replyError }}</p>
    </div>

  </article>
</template>

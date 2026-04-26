<script setup>
import { ref, inject, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFeedStore } from '@/stores/feed'
import { fetchOgMeta } from '@/lib/ogFetch'

const auth    = useAuthStore()
const feed    = useFeedStore()
const openAuth = inject('openAuth')

const content  = ref('')
const type     = ref('thought')
const url      = ref('')
const ogMeta   = ref(null)
const ogLoading = ref(false)
const busy     = ref(false)
const error    = ref('')
const expanded = ref(false)

const types = [
  { key: 'thought', label: 'thought', color: '#e8e8f0' },
  { key: 'project', label: 'project', color: '#e8ff47' },
  { key: 'help',    label: 'help?',   color: '#47d4ff' },
  { key: 'rant',    label: 'rant',    color: '#ff6b6b' },
]

// Auto-fetch OG when URL changes (debounced)
let ogTimer = null
watch(url, (val) => {
  ogMeta.value = null
  clearTimeout(ogTimer)
  if (!val || type.value !== 'project') return
  const trimmed = val.trim()
  if (!/^https?:\/\//.test(trimmed)) return
  ogTimer = setTimeout(async () => {
    ogLoading.value = true
    try {
      ogMeta.value = await fetchOgMeta(trimmed)
    } finally {
      ogLoading.value = false
    }
  }, 800)
})

watch(type, () => { url.value = ''; ogMeta.value = null })

async function submit() {
  if (!auth.isLoggedIn) { openAuth(); return }
  if (!content.value.trim()) { error.value = 'say something'; return }
  error.value = ''
  busy.value = true
  try {
    await feed.createPost({
      content:      content.value.trim(),
      type:         type.value,
      userId:       auth.user.$id,
      callsign:     auth.callsign,
      url:          url.value.trim() || null,
      ogTitle:      ogMeta.value?.ogTitle || null,
      ogDescription:ogMeta.value?.ogDescription || null,
      ogImageUrl:   ogMeta.value?.ogImageUrl || null,
    })
    content.value  = ''
    url.value      = ''
    ogMeta.value   = null
    type.value     = 'thought'
    expanded.value = false
  } catch (e) {
    error.value = e?.message || 'post failed'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="bg-[#111118] border border-[#2a2a35] mb-4">

    <!-- Collapsed trigger (when not expanded) -->
    <div
      v-if="!expanded"
      @click="expanded = true"
      class="px-4 py-3 flex items-center gap-3 cursor-text"
    >
      <span class="w-7 h-7 rounded-full bg-[#1e1e28] flex items-center justify-center text-[10px] text-[#6b6b80] shrink-0 font-mono">
        {{ auth.isLoggedIn ? auth.callsign?.slice(0,2) : '?' }}
      </span>
      <span class="text-[#3a3a48] text-sm font-mono">what's on your mind at 3am...</span>
    </div>

    <!-- Expanded composer -->
    <div v-else class="p-4 space-y-3 animate-fade-in">

      <!-- Type selector -->
      <div class="flex gap-1.5 flex-wrap">
        <button
          v-for="t in types"
          :key="t.key"
          @click="type = t.key"
          :class="[
            'px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors border',
            type === t.key
              ? 'border-transparent text-[#0a0a0f]'
              : 'border-[#2a2a35] text-[#6b6b80] hover:text-[#e8e8f0] bg-transparent',
          ]"
          :style="type === t.key ? `background:${t.color}` : ''"
        >{{ t.label }}</button>
      </div>

      <!-- Textarea -->
      <textarea
        v-model="content"
        :placeholder="
          type === 'rant'    ? 'let it out...' :
          type === 'help'    ? 'what are you stuck on?' :
          type === 'project' ? 'what did you ship?' :
                               'raw thought, no polish needed...'
        "
        rows="4"
        class="w-full bg-[#0a0a0f] border border-[#2a2a35] text-[#e8e8f0] text-sm font-mono px-3 py-2.5 placeholder:text-[#3a3a48] focus:outline-none focus:border-[#e8ff47] resize-none transition-colors leading-relaxed"
        autofocus
      />

      <!-- URL field for project -->
      <div v-if="type === 'project'">
        <input
          v-model="url"
          type="url"
          placeholder="https://your-project.dev (optional)"
          class="w-full bg-[#0a0a0f] border border-[#2a2a35] text-[#e8e8f0] text-[12px] font-mono px-3 py-2 placeholder:text-[#3a3a48] focus:outline-none focus:border-[#47d4ff] transition-colors"
        />

        <!-- OG Preview -->
        <div v-if="ogLoading" class="mt-2 text-[10px] text-[#6b6b80] font-mono">fetching preview...</div>
        <div
          v-else-if="ogMeta && (ogMeta.ogTitle || ogMeta.ogDescription)"
          class="mt-2 border border-[#2a2a35] border-l-2 border-l-[#47d4ff] p-3 space-y-1"
        >
          <p v-if="ogMeta.ogTitle" class="text-[12px] font-bold text-[#e8e8f0] font-mono truncate">{{ ogMeta.ogTitle }}</p>
          <p v-if="ogMeta.ogDescription" class="text-[10px] text-[#6b6b80] font-mono line-clamp-2">{{ ogMeta.ogDescription }}</p>
        </div>
      </div>

      <!-- Char count + error -->
      <div class="flex items-center justify-between">
        <p v-if="error" class="text-[10px] text-[#ff6b6b] font-mono">⚠ {{ error }}</p>
        <span v-else class="text-[10px] text-[#3a3a48] font-mono">{{ content.length }}/2000</span>
        <div class="flex gap-2">
          <button
            @click="expanded = false; content = ''; error = ''"
            class="text-[11px] text-[#6b6b80] hover:text-[#e8e8f0] font-mono transition-colors"
          >cancel</button>
          <button
            @click="submit"
            :disabled="busy || content.length > 2000"
            class="bg-[#e8ff47] text-[#0a0a0f] px-4 py-1.5 text-[11px] font-bold font-mono hover:bg-[#d4eb3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style="font-family: 'Syne', sans-serif;"
          >
            {{ busy ? '...' : auth.isLoggedIn ? 'post' : 'join to post' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const auth  = useAuthStore()
const emit  = defineEmits(['open-auth'])
</script>

<template>
  <header class="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-sm border-b border-[#1e1e28]">
    <div class="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">

      <!-- Wordmark -->
      <div class="flex items-center gap-2">
        <span class="text-[#e8ff47] text-xs font-mono leading-none">●</span>
        <span
          class="text-sm font-bold tracking-tight text-[#e8e8f0]"
          style="font-family: 'Syne', sans-serif; font-weight: 800;"
        >3AM Catcher</span>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <template v-if="auth.isLoggedIn">
          <span class="text-[10px] text-[#6b6b80] font-mono hidden sm:inline">{{ auth.callsign }}</span>
          <button
            @click="auth.signOut()"
            class="text-[11px] text-[#6b6b80] hover:text-[#e8e8f0] transition-colors font-mono"
          >sign out</button>
        </template>
        <template v-else>
          <button
            @click="emit('open-auth')"
            class="text-[11px] bg-[#e8ff47] text-[#0a0a0f] px-3 py-1.5 font-bold font-mono hover:bg-[#d4eb3a] transition-colors"
            style="font-family: 'Syne', sans-serif;"
          >join</button>
        </template>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const auth = useAuthStore()

const mode     = ref('join')   // 'join' | 'signin'
const email    = ref('')
const password = ref('')
const error    = ref('')
const busy     = ref(false)

const title = computed(() => mode.value === 'join' ? 'Get a callsign' : 'Sign in')

async function submit() {
  error.value = ''
  if (!email.value || !password.value) { error.value = 'fill in both fields'; return }
  busy.value = true
  try {
    if (mode.value === 'join') {
      await auth.join(email.value, password.value)
    } else {
      await auth.signIn(email.value, password.value)
    }
    emit('close')
  } catch (e) {
    error.value = e?.message || 'something went wrong'
  } finally {
    busy.value = false
  }
}

function switchMode() {
  mode.value  = mode.value === 'join' ? 'signin' : 'join'
  error.value = ''
}
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    @click.self="emit('close')"
  >
    <div class="bg-[#111118] border border-[#2a2a35] w-full max-w-sm p-6 animate-fade-in">

      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h2
            class="text-xl text-[#e8e8f0] leading-tight"
            style="font-family: 'Syne', sans-serif; font-weight: 800;"
          >{{ title }}</h2>
          <p class="text-[11px] text-[#6b6b80] mt-0.5 font-mono">
            <template v-if="mode === 'join'">your callsign is auto-generated</template>
            <template v-else>welcome back</template>
          </p>
        </div>
        <button
          @click="emit('close')"
          class="text-[#6b6b80] hover:text-[#e8e8f0] transition-colors text-lg leading-none mt-0.5"
        >✕</button>
      </div>

      <!-- Form -->
      <div class="space-y-3">
        <div>
          <label class="text-[10px] text-[#6b6b80] font-mono uppercase tracking-widest block mb-1">email</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full bg-[#0a0a0f] border border-[#2a2a35] text-[#e8e8f0] px-3 py-2.5 text-sm font-mono placeholder:text-[#3a3a48] focus:outline-none focus:border-[#e8ff47] transition-colors"
            @keydown.enter="submit"
          />
        </div>
        <div>
          <label class="text-[10px] text-[#6b6b80] font-mono uppercase tracking-widest block mb-1">password</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full bg-[#0a0a0f] border border-[#2a2a35] text-[#e8e8f0] px-3 py-2.5 text-sm font-mono placeholder:text-[#3a3a48] focus:outline-none focus:border-[#e8ff47] transition-colors"
            @keydown.enter="submit"
          />
        </div>

        <p v-if="error" class="text-[11px] text-[#ff6b6b] font-mono">⚠ {{ error }}</p>

        <button
          @click="submit"
          :disabled="busy"
          class="w-full bg-[#e8ff47] text-[#0a0a0f] py-2.5 text-sm font-bold font-mono hover:bg-[#d4eb3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
          style="font-family: 'Syne', sans-serif;"
        >
          <span v-if="busy">...</span>
          <span v-else>{{ mode === 'join' ? 'create account' : 'sign in' }}</span>
        </button>
      </div>

      <!-- Switch mode -->
      <p class="text-center text-[11px] text-[#6b6b80] font-mono mt-4">
        <template v-if="mode === 'join'">already have an account?</template>
        <template v-else>no account yet?</template>
        <button
          @click="switchMode"
          class="text-[#47d4ff] hover:text-[#6de0ff] ml-1 transition-colors underline"
        >{{ mode === 'join' ? 'sign in' : 'join' }}</button>
      </p>

    </div>
  </div>
</template>

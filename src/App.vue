<script setup>
import { onMounted, provide, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthModal from '@/components/AuthModal.vue'
import AppHeader from '@/components/AppHeader.vue'

const auth = useAuthStore()
const showAuth = ref(false)

// Allow any child to open auth modal
provide('openAuth', () => { showAuth.value = true })

onMounted(() => auth.init())
</script>

<template>
  <div class="min-h-dvh bg-[#0a0a0f] text-[#e8e8f0] font-mono">
    <AppHeader @open-auth="showAuth = true" />

    <router-view />

    <Teleport to="body">
      <AuthModal v-if="showAuth" @close="showAuth = false" />
    </Teleport>
  </div>
</template>

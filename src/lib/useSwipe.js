import { ref, computed } from 'vue'

export function useSwipeReply(threshold = 60, onReply) {
  const translateX = ref(0)
  const isSwiping = ref(false)
  let startX = 0

  const replyIconOpacity = computed(() => Math.min(translateX.value / threshold, 1))
  const reachedThreshold = computed(() => translateX.value >= threshold)

  function onPointerDown(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX
    isSwiping.value = true
  }

  function onPointerMove(e) {
    if (!isSwiping.value) return
    const currentX = e.touches ? e.touches[0].clientX : e.clientX
    const delta = currentX - startX
    // Only rightward swipe, with slight resistance past threshold
    translateX.value = Math.max(0, Math.min(delta, threshold + 20))
  }

  function onPointerUp() {
    if (!isSwiping.value) return
    if (reachedThreshold.value) onReply?.()
    translateX.value = 0
    isSwiping.value = false
  }

  return {
    translateX,
    isSwiping,
    replyIconOpacity,
    reachedThreshold,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
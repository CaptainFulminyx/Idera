import { ref, computed } from 'vue'

export function useSwipeReply(threshold = 60, onReply) {
  const translateX = ref(0)
  const isSwiping = ref(false)
  let startX = 0

  // The icon reaches full opacity exactly when the threshold is hit
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

    // Prevent moving backwards/leftwards
    if (delta <= 0) {
      translateX.value = 0
      return
    }

    if (delta <= threshold) {
      // 1. Smooth, perfectly responsive 1:1 movement before the trigger point
      translateX.value = delta
    } else {
      // 2. Exponentially increasing resistance past the threshold
      const excess = delta - threshold
      
      // Higher number = looser stretch. Lower number = tighter stretch.
      const resistanceFactor = 40 
      const stretching = resistanceFactor * Math.log(1 + excess / resistanceFactor)
      
      translateX.value = threshold + stretching
    }
  }

  function onPointerUp() {
    if (!isSwiping.value) return
    
    // Trigger the callback if they pulled far enough
    if (reachedThreshold.value) {
      onReply?.()
    }
    
    // Snap back to original position
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

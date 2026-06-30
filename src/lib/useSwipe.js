import { ref, computed } from 'vue'

export function useSwipeReply(threshold = 80, onReply) {
  const translateX = ref(0)
  const isSwiping = ref(false)
  const isAnimatingBack = ref(false)

  let startX = 0
  let startY = 0
  let direction = null // 'horizontal' | 'vertical' | null
  let wasAtThreshold = false

  const DIRECTION_LOCK_PX = 8
  const MAX_STRETCH = threshold * 1.5
  const resistanceFactor = 80

  const replyIconOpacity = computed(() => Math.min(translateX.value / threshold, 1))
  const reachedThreshold = computed(() => translateX.value >= threshold)

  function getPoint(e) {
    return e.touches ? e.touches[0] : e
  }

  function onPointerDown(e) {
    const point = getPoint(e)
    startX = point.clientX
    startY = point.clientY
    direction = null
    wasAtThreshold = false
    isAnimatingBack.value = false
    isSwiping.value = true
  }

  function onPointerMove(e) {
    if (!isSwiping.value) return

    const point = getPoint(e)
    const deltaX = point.clientX - startX
    const deltaY = point.clientY - startY

    // Decide gesture direction once, on first meaningful movement
    if (!direction) {
      if (Math.abs(deltaX) < DIRECTION_LOCK_PX && Math.abs(deltaY) < DIRECTION_LOCK_PX) {
        return
      }
      direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'

      if (direction === 'vertical') {
        // Let the browser handle native scrolling; bail out of swipe entirely
        isSwiping.value = false
        translateX.value = 0
        return
      }
    }

    if (direction !== 'horizontal') return

    // Now we're committed to a horizontal swipe — stop the page from scrolling
    if (e.cancelable) e.preventDefault()

    if (deltaX <= 0) {
      translateX.value = 0
    } else if (deltaX <= threshold) {
      // 1:1 movement before the trigger point
      translateX.value = deltaX
    } else {
      // Resistance past threshold, clamped to a max stretch
      const excess = deltaX - threshold
      const stretching = resistanceFactor * Math.log(1 + excess / resistanceFactor)
      translateX.value = Math.min(threshold + stretching, MAX_STRETCH)
    }

    // Fire haptic once, exactly at the moment threshold is crossed
    if (reachedThreshold.value && !wasAtThreshold && navigator.vibrate) {
      navigator.vibrate(10)
    }
    wasAtThreshold = reachedThreshold.value
  }

  function endSwipe(shouldTrigger) {
    if (!isSwiping.value) return

    if (shouldTrigger && reachedThreshold.value) {
      onReply?.()
    }

    isAnimatingBack.value = true
    translateX.value = 0
    isSwiping.value = false
    direction = null
    wasAtThreshold = false
  }

  function onPointerUp() {
    endSwipe(true)
  }

  function onPointerCancel() {
    // Interrupted gesture (OS dialog, notification, etc) — reset, don't trigger reply
    endSwipe(false)
  }

  return {
    translateX,
    isSwiping,
    isAnimatingBack,
    replyIconOpacity,
    reachedThreshold,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}
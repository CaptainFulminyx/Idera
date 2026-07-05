<script setup>
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useSwipeReply } from "@/lib/useSwipe";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["reply"]);

const {
  translateX,
  isSwiping,
  replyIconOpacity,
  reachedThreshold,
  onPointerDown,
  onPointerMove,
  onPointerUp,
} = useSwipeReply(60, () => emit("reply", props.post));

// Calculate a dynamic scale from 0.6 up to 1.3 based on the swipe progress
const replyIconScale = computed(() => {
  const baseScale = 0.6;
  const maxScale = 1.3;
  // Progress goes from 0 to 1 as it hits threshold
  const progress = Math.min(translateX.value / 60, 1);

  if (reachedThreshold.value) {
    return maxScale; // Lock at max scale or add a slight extra pop if threshold is hit
  }
  return baseScale + progress * (1.0 - baseScale);
});
</script>

<template>
  <div class="swipe-wrapper">
    <div
      class="reply-hint"
      :style="{
        opacity: replyIconOpacity,
        transform: `translateY(-50%) scale(${replyIconScale})`,
      }"
      :class="{ 'reply-hint--active': reachedThreshold }"
    >
      <Icon
        icon="material-symbols:redo-rounded"
        width="40px"
        height="40px"
        color="#f66"
      />
    </div>

    <div
      :class="[
        isSwiping ? 'is-swiping' : '',
        post.isMyPost ? 'myPost-item' : 'post-item',
        isSwiping ? 'no-transition' : '',
        isAnimatingBack ? 'snap-back' : '',
      ]"
      class="post-container swipe-content"
      style="touch-action: pan-y"
      @touchstart="onPointerDown"
      @touchmove="onPointerMove"
      @touchend="onPointerUp"
      @touchcancel="onPointerCancel"
      @mousedown="onPointerDown"
      @mousemove="onPointerMove"
      @mouseup="onPointerUp"
      @mouseleave="onPointerCancel"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <div>
        <div class="post-header">
          <div class="pfp"></div>
          <div class="meta">
            <span class="username">Anonymous User</span>
            <span class="timestamp">{{ post.timestamp }}</span>
          </div>
        </div>

        <div class="post-body">
          <!-- Quoted reply context -->
          <div v-if="post.replyTo" class="quoted-reply">
            <div class="quoted-reply__bar"></div>
            <div class="quoted-reply__content">
              <span class="quoted-reply__label">Reply to</span>
              <span class="quoted-reply__text">{{
                post.replyTo.content.slice(0, 40).concat("...")
              }}</span>
            </div>
          </div>

          <p class="post-text">{{ post.content }}</p>
        </div>

        <div class="post-actions">
          <button class="action-btn">
            <Icon icon="boxicons:like" width="20px" height="20px" />
          </button>
          <button class="action-btn">
            <Icon
              icon="material-symbols:share-outline-rounded"
              width="20px"
              height="20px"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Quoted reply block ── */
.quoted-reply {
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05); /* subtle lift from card bg */
  border-radius: 5px;
  overflow: hidden;
}

.quoted-reply__bar {
  width: 3px;
  min-width: 3px;
  border-radius: 2px;
  background: #f66;
  flex-shrink: 0;
}

.quoted-reply__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.quoted-reply__label {
  font-size: 11px;
  color: #f66;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.quoted-reply__text {
  font-size: 13px;
  color: #aaa; /* bumped from #888 — legible on dark bg */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Outer layout ── */
.swipe-wrapper {
  position: relative;
  width: 100%;
  overflow: visible;
}

/* ── Reply hint icon ── */
.reply-hint {
  position: absolute;
  left: 15px;
  top: 50%;
  pointer-events: none;
  z-index: 1;
  transition:
    opacity 0.1s ease-out,
    transform 0.1s ease-out;
}

.reply-hint--active {
  filter: drop-shadow(0 0 4px rgba(255, 102, 102, 0.4));
}

/* ── Post cards ── */
.post-container {
  position: relative;
  margin-bottom: 12px;
  z-index: 2;
}

.post-item,
.myPost-item {
  border-radius: 20px;
  background: #2c2f3f;
  font-family: sans-serif;
  overflow: hidden;
}

.post-item {
  border: 8px solid #f66;
  border-top-left-radius: 0;
  transition: transform 0.2s ease-out;
}
.post-item .post-header {
  background: #f66;
}
.post-item .pfp {
  border-color: #fff;
}
.post-item.no-transition {
  transition: none;
}

/* Consistent border weight with post-item */
.myPost-item {
  border: 8px solid #fff;
  border-top-right-radius: 0;
}
.myPost-item .post-header {
  background: #fff;
}
.myPost-item .pfp {
  border-color: #f66;
}

/* ── Header ── */
.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 10px;
}

.pfp {
  width: 40px;
  height: 40px;
  background-color: #2c2f3f;
  border-radius: 50%;
  border: 2px solid;
  flex-shrink: 0;
}

.meta {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: #1a1a2e; /* dark — readable on both red and white header */
}

.timestamp {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.45); /* dark-tinted — works on colored header */
}

/* ── Body ── */
.post-body {
  color: #fff;
  line-height: 1.5;
  white-space: pre-wrap;
  padding: 0 10px;
}

.post-text {
  margin: 0 0 4px;
}

/* ── Actions ── */
.post-actions {
  display: flex;
  gap: 16px;
  padding: 10px;
  margin-top: 4px; /* breathing room between body and action row */
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  transition: color 0.15s;
}

.action-btn:hover {
  color: #fff;
}

/* ── Swipe behavior ── */
.swipe-content {
  position: relative;
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  touch-action: pan-y;
  user-select: none;
}

.swipe-content.is-swiping {
  transition: none;
}
</style>

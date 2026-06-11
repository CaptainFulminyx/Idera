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
      ]"
      class="post-container swipe-content"
      :style="{ transform: `translateX(${translateX}px)` }"
      @touchstart.passive="onPointerDown"
      @touchmove.passive="onPointerMove"
      @touchend="onPointerUp"
      @mousedown="onPointerDown"
      @mousemove="onPointerMove"
      @mouseup="onPointerUp"
      @mouseleave="onPointerUp"
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
          <!-- Quoted reply context — shown when this post is a reply -->
          <div v-if="post.replyTo" class="quoted-reply">
            <div class="quoted-reply__bar"></div>
            <div class="quoted-reply__content">
              <span class="quoted-reply__label">Reply to</span>
              <span class="quoted-reply__text">{{ post.replyTo.content }}</span>
            </div>
          </div>

          <p>{{ post.content }}</p>
        </div>

        <div class="post-actions">
          <button class="action-btn">
            <Icon icon="boxicons:like" width="20px" height="20px" />
          </button>
          <button class="action-btn">
            <Icon icon="" width="25px" height="25px" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Quoted reply block inside a post */
.quoted-reply {
  display: flex;
  align-items: stretch;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px 10px;
  background: #1c1c1c;
  border-radius: 8px;
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
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Outer Layout Boundary ── */
.swipe-wrapper {
  position: relative;
  width: 100%;
  overflow: visible; /* Allows the post container to slide out smoothly */
}

/* ── Swipe-to-reply Icon Positioning ── */
.reply-hint {
  position: absolute;
  /* Placed to the left of the outer boundary, slightly indented */
  left: 15px;
  top: 50%;
  /* Y-axis alignment handled dynamically via :style along with scale */
  pointer-events: none;
  z-index: 1;
  /* Smooth transition for when values update or threshold pops */
  transition:
    opacity 0.1s ease-out,
    transform 0.1s ease-out;
}

/* Additional styling when threshold triggers */
.reply-hint--active {
  filter: drop-shadow(0 0 4px rgba(255, 102, 102, 0.4));
}

/* ── Post Content Cards ── */
.post-container {
  position: relative;
  margin-bottom: 12px;
  z-index: 2; /* Sits cleanly above the icon background layer */
}

.post-item,
.myPost-item {
  border-radius: 20px;
  background: #2c2f3f;
  font-family: sans-serif;
  overflow: hidden;
}

/* Default: red accent */
.post-item {
  border: 8px solid #f66;
  border-top-left-radius: 0px;
}
.post-item .post-header {
  background: #f66;
}

/* My post: white accent */
.myPost-item {
  border: 5px solid #fff;
  border-top-right-radius: 0;
}
.myPost-item .post-header {
  background: #fff;
}

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
  background-color: #fff;
  border-radius: 50%;
  border: 2px solid #f66;
}
.meta {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
  color: #fff;
}
.timestamp {
  font-size: 0.8rem;
  color: #333;
}
.post-body {
  color: rgb(255, 255, 255);
  line-height: 1.5;
  white-space: pre-wrap;
  padding-left: 10px;
  padding-right: 10px;
}
.post-actions {
  display: flex;
  gap: 16px;
  padding: 10px;
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
}
.action-btn:hover {
  color: #fff;
}

.swipe-content {
  position: relative;
  /* Snap back with an elastic feel */
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
  touch-action: pan-y; /* vertical scroll still works smoothly */
  user-select: none;
}

/* No transition while finger is actively dragging — 1:1 tracking */
.swipe-content.is-swiping {
  transition: none;
}
</style>

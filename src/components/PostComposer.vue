<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { Icon } from "@iconify/vue";

defineOptions({ name: "SmartInputBar" });

const props = defineProps({
  replyingTo: { type: Object, default: null },
});

const emit = defineEmits(["submit-post", "cancel-reply"]);
const text = ref("");
const textareaRef = ref(null);

const truncated = computed(() => {
  const c = props.replyingTo?.content ?? "";
  return c.length > 60 ? c.slice(0, 60) + "…" : c;
});

const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = "0px";
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
  const pt = parseFloat(getComputedStyle(textarea).paddingTop) || 0;
  const pb = parseFloat(getComputedStyle(textarea).paddingBottom) || 0;
  const maxHeight = lineHeight * 4 + pt + pb;
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

const onLeave = (el) => {
  el.style.maxHeight = el.scrollHeight + "px";
};

watch(text, () => nextTick(autoResize));

function postContentFunc() {
  if (!text.value.trim()) return;
  emit("submit-post", text.value);
  text.value = "";
  nextTick(autoResize);
}
</script>

<template>
  <!-- No more fixed positioning or bottom offset — lives in normal flow -->
  <div class="writeTextContainer">
    <div class="input-card">
      <Transition name="reply-preview" @leave="onLeave">
        <div v-if="replyingTo" class="reply-preview">
          <div class="reply-preview__bar"></div>
          <div class="reply-preview__content">
            <span class="reply-preview__label">Replying to</span>
            <span class="reply-preview__text">{{ truncated }}</span>
          </div>
          <button class="reply-preview__close" @click="$emit('cancel-reply')">
            <Icon
              icon="material-symbols:close-rounded"
              width="18px"
              height="18px"
            />
          </button>
        </div>
      </Transition>

      <div class="input-bar">
        <textarea
          ref="textareaRef"
          v-model="text"
          class="writeText"
          placeholder="Write something..."
          rows="1"
        ></textarea>
        <div class="icon-wrapper" @click="postContentFunc">
          <Icon
            icon="boxicons:send-filled"
            width="40px"
            height="40px"
            color="#f66"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  The container is NOT fixed. The parent page layout must be:

    html, body { height: 100%; margin: 0; }

    .page-layout {
      height: 100%;           or 100dvh
      display: flex;
      flex-direction: column;
    }

    .feed-scroll-area {
      flex: 1;
      overflow-y: auto;
    }

    <SmartInputBar /> sits AFTER the scroll area as the last child.

  The browser then pushes this bar up when the keyboard opens — no JS needed.
  On iOS Safari use height: 100dvh on .page-layout for correct visual viewport height.
*/

.writeTextContainer {
  width: 100%;
  flex-shrink: 0; /* Never squish — always full height in the flex column */
  padding: 12px 20px 16px;
  box-sizing: border-box;
  /* Safe area inset for iPhone home bar */
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.input-card {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #2c2f3f;
  border-radius: 15px;
  box-shadow: 0 0 0 4px #f66;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Reply preview ── */
.reply-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #1e2030;
  border-bottom: 1px solid #3a3d50;
  box-sizing: border-box;
  height: 54px;
}

.reply-preview__bar {
  width: 3px;
  min-width: 3px;
  height: 32px;
  border-radius: 2px;
  background: #f66;
  flex-shrink: 0;
}

.reply-preview__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.reply-preview__label {
  font-size: 11px;
  color: #f66;
  font-weight: 600;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.reply-preview__text {
  font-size: 13px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reply-preview__close {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: color 0.15s;
}

.reply-preview__close:hover {
  color: #aaa;
}

.reply-preview-enter-active,
.reply-preview-leave-active {
  transition:
    transform 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.15s ease,
    max-height 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  max-height: 54px;
  overflow: hidden;
}

.reply-preview-enter-from,
.reply-preview-leave-to {
  opacity: 0;
  max-height: 0 !important;
  transform: translateY(-10px);
}

/* ── Input row ── */
.input-bar {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  box-sizing: border-box;
  background-color: #2c2f3f;
}

.writeText {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #f0f3fa;
  font-family: inherit;
  font-size: 16px; /* Prevents iOS auto-zoom on focus */
  line-height: 1.5;
  padding: 6px 4px;
  margin: 0;
  box-sizing: border-box;
  word-break: break-word;
  white-space: pre-wrap;
  -webkit-overflow-scrolling: touch;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  margin-bottom: 2px;
}

@media (max-width: 640px) {
  .writeTextContainer {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>

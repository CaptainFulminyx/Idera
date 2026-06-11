<template>
  <div class="writeTextContainer" :style="{ bottom: `${keyboardOffset}px` }">
    <!-- Reply preview bar -->
    <Transition name="reply-preview">
      <div v-if="replyingTo" class="reply-preview">
        <div class="reply-preview__bar"></div>
        <div class="reply-preview__content">
          <span class="reply-preview__label">Replying to</span>
          <span class="reply-preview__text">{{ replyingTo.content }}</span>
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
        @input="autoResize"
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
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { Icon } from "@iconify/vue";

defineOptions({ name: "SmartInputBar" });

const props = defineProps({
  replyingTo: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit-post", "cancel-reply"]);
const text = ref("");
const textareaRef = ref(null);
const keyboardOffset = ref(0);

const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = "auto";
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
  const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop) || 0;
  const paddingBottom =
    parseFloat(getComputedStyle(textarea).paddingBottom) || 0;
  const maxHeight = lineHeight * 4 + paddingTop + paddingBottom;
  let newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${newHeight}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

const handleViewportChange = () => {
  if (!window.visualViewport) return;
  const offset = window.innerHeight - window.visualViewport.height;
  keyboardOffset.value = Math.max(0, offset);
};

watch(text, () => nextTick(autoResize));

onMounted(() => {
  autoResize();
  window.addEventListener("resize", autoResize);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", autoResize);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener("resize", handleViewportChange);
    window.visualViewport.removeEventListener("scroll", handleViewportChange);
  }
});

function postContentFunc() {
  if (!text.value.trim()) return;
  emit("submit-post", text.value);
  text.value = "";
}
</script>

<style scoped>
/* Reply preview strip */
.reply-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
}

.reply-preview__bar {
  width: 3px;
  min-width: 3px;
  height: 36px;
  border-radius: 2px;
  background: #f66;
  flex-shrink: 0;
}

.reply-preview__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* allows text-overflow to work */
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

/* Slide-in / slide-out transition */
.reply-preview-enter-active,
.reply-preview-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.reply-preview-enter-from,
.reply-preview-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.writeTextContainer {
  width: 100%;
  position: fixed;
  /* 'bottom' is now controlled dynamically via :style */
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px 24px 20px;
  box-sizing: border-box;
  /* Smooth out the transition slightly for moving devices */
  transition: bottom 0.1s ease-out;
  z-index: 1000;
}

.input-bar {
  width: 100%;
  max-width: 800px;
  background-color: #2c2f3f;
  border-radius: 15px;
  padding: 8px 12px;
  box-sizing: border-box;
  outline: 4px solid #f66;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.writeText {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #f0f3fa;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  padding: 8px 4px;
  margin: 0;
  box-sizing: border-box;
  word-break: break-word;
  white-space: pre-wrap;
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
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 20px;
  }
  .writeText {
    font-size: 0.95rem;
  }
}
</style>

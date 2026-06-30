<script setup>
import { ref, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";

defineOptions({ name: "ComposeSheet" });

const props = defineProps({
  modelValue: { type: Boolean, default: false }, // open/close
  replyingTo: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "submit-post"]);

const text = ref("");
const textareaRef = ref(null);

const close = () => {
  emit("update:modelValue", false);
};

const submit = () => {
  if (!text.value.trim()) return;
  emit("submit-post", text.value);
  text.value = "";
  close();
};

// Focus textarea when sheet opens, clear when it closes
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      nextTick(() => textareaRef.value?.focus());
    } else {
      text.value = "";
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="modelValue" class="sheet-overlay">
        <!-- Header -->
        <div class="sheet-header">
          <button class="header-btn" @click="close">Cancel</button>
          <button
            class="header-btn post-btn"
            :disabled="!text.trim()"
            @click="submit"
          >
            Post
          </button>
        </div>

        <!-- Reply context -->
        <div v-if="replyingTo" class="reply-context">
          <div class="reply-context__bar"></div>
          <div class="reply-context__body">
            <span class="reply-context__label">Replying to</span>
            <span class="reply-context__text">{{ replyingTo.content }}</span>
          </div>
        </div>

        <!-- Textarea -->
        <textarea
          ref="textareaRef"
          v-model="text"
          class="sheet-textarea"
          placeholder="What's on your mind?"
        ></textarea>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 800;
  background: #1e2030;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2c2f3f;
  flex-shrink: 0;
}

.header-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 16px;
  font-family: inherit;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.15s;
}

.header-btn:hover {
  color: #f0f3fa;
}

.post-btn {
  background: #f66;
  color: #fff;
  border-radius: 999px;
  padding: 8px 22px;
  font-weight: 600;
  font-size: 15px;
  transition: opacity 0.15s;
}

.post-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.post-btn:not(:disabled):hover {
  opacity: 0.85;
}

/* ── Reply context ── */
.reply-context {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #2c2f3f;
  flex-shrink: 0;
}

.reply-context__bar {
  width: 3px;
  min-width: 3px;
  height: 36px;
  border-radius: 2px;
  background: #f66;
  flex-shrink: 0;
  margin-top: 2px;
}

.reply-context__body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.reply-context__label {
  font-size: 11px;
  color: #f66;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.reply-context__text {
  font-size: 14px;
  color: #888;
  word-break: break-word;
}

/* ── Textarea ── */
.sheet-textarea {
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  color: #f0f3fa;
  font-family: inherit;
  font-size: 18px;
  line-height: 1.6;
  padding: 20px;
  box-sizing: border-box;
  /* Let the browser handle keyboard — textarea fills remaining space naturally */
}

/* ── Slide-up transition ── */
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>

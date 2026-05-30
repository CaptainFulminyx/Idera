<template>
  <div class="writeTextContainer">
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

defineOptions({
  name: "SmartInputBar",
});

// Reactive state
const text = ref("");
const textareaRef = ref(null); // This name must exactly match the template ref string

// Resize logic
const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  textarea.style.height = "auto";
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
  const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop) || 0;
  const paddingBottom =
    parseFloat(getComputedStyle(textarea).paddingBottom) || 0;

  // Caps growth at 4 lines
  const maxHeight = lineHeight * 4 + paddingTop + paddingBottom;

  let newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${newHeight}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

// Keep height in sync if text changes programmatically
watch(text, () => {
  nextTick(autoResize);
});

// Lifecycle hooks
onMounted(() => {
  autoResize();
  window.addEventListener("resize", autoResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", autoResize);
});

function postContentFunc() {
  alert("hi");
}
</script>

<style scoped>
.writeTextContainer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px 24px 20px;
  box-sizing: border-box;
}

.input-bar {
  width: 100%;
  max-width: 800px; /* Optional: keeps the bar from getting awkwardly wide on desktop */
  background-color: #2c2f3f;
  border-radius: 15px;
  padding: 8px 12px;
  box-sizing: border-box;
  outline: 4px solid #f66;
  display: flex;
  align-items: flex-end; /* Aligns the icon to the bottom as the textarea expands */
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
  /* Removed hardcoded overflow-y and max-height so JS logic can handle it */
  word-break: break-word;
  white-space: pre-wrap;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  /* Fine-tuning icon position to align cleanly with the text line */
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

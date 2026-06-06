<template>
  <div 
    class="writeTextContainer" 
    :style="{ bottom: `${keyboardOffset}px` }"
  >
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

const emit = defineEmits(["submit-post"]);
const text = ref("");
const textareaRef = ref(null);

// Tracks the keyboard height/offset
const keyboardOffset = ref(0);

const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  textarea.style.height = "auto";
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
  const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop) || 0;
  const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom) || 0;

  const maxHeight = lineHeight * 4 + paddingTop + paddingBottom;

  let newHeight = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${newHeight}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
};

// Handler to update the layout when the virtual viewport changes (i.e. keyboard pops up)
const handleViewportChange = () => {
  if (!window.visualViewport) return;

  // Calculate the hidden space at the bottom of the screen
  const offset = window.innerHeight - window.visualViewport.height;
  
  // Ensure we don't apply negative offsets
  keyboardOffset.value = Math.max(0, offset);
};

watch(text, () => {
  nextTick(autoResize);
});

onMounted(() => {
  autoResize();
  window.addEventListener("resize", autoResize);

  // Listen to the visual viewport resize and scroll events
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

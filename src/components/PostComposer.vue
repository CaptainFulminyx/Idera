<template>
  <div class="writeTextContainer">
    <div class="input-bar">
      <textarea
        ref="textarea"
        v-model="text"
        class="writeText"
        placeholder="Write something..."
        rows="1"
        @input="autoResize"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartInputBar',
  data() {
    return {
      text: ''
    };
  },
  mounted() {
    this.autoResize();
    window.addEventListener('resize', this.autoResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.autoResize);
  },
  methods: {
    autoResize() {
      const textarea = this.$refs.textarea;
      if (!textarea) return;
      
      textarea.style.height = 'auto';
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
      const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
      const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);
      const maxHeight = (lineHeight * 3) + paddingTop + paddingBottom;
      
      let newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = newHeight + 'px';
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }
};
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
  z-index: 1000;
}

.input-bar {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
}

.writeText {
  width: 100%;
  background-color: #2c2f3f;
  border-radius: 15px;
  padding: 14px 20px;
  font-size: 1rem;
  line-height: 1.5;
  color: #f0f3fa;
  border: none;
  outline: 4px solid #f66;
  font-family: inherit;
  resize: none;
  overflow-y: hidden;
  min-height: auto;
  max-height: 122px;
  transition: height 0.05s ease;
  word-break: break-word;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  .writeTextContainer {
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 20px;
  }
  .writeText {
    font-size: 0.95rem;
    padding: 12px 18px;
  }
}
</style>
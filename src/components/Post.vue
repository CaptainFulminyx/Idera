<script setup>
import { Icon } from "@iconify/vue";

// Accept the post object as a prop
defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="post-item">
    <div class="post-header">
      <div class="avatar"></div>
      <div class="meta">
        <span class="username">Anonymous User</span>
        <span class="timestamp">{{ post.timestamp }}</span>
      </div>
    </div>

    <div class="post-body">
      <p>{{ post.content }}</p>
    </div>

    <div class="post-actions">
      <button class="action-btn"><Icon icon="mdi:heart-outline" /> Like</button>
      <button class="action-btn">
        <Icon icon="mdi:comment-outline" /> Comment
      </button>
    </div>
  </div>
</template>

<style scoped>
.post-item {
  border: 5px solid #f66;
  border-radius: 20px;
  border-top-left-radius: 0;
  padding: 16px;
  margin-bottom: 12px;
  background: #2c2f3f;
  font-family: sans-serif;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.avatar {
  width: 40px;
  height: 40px;
  background-color: #f99;
  border-radius: 50%;
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
  color: rgb(175, 150, 150);
}
.post-body {
  color: rgb(255, 255, 255);
  line-height: 1.5;
  white-space: pre-wrap; /* Preserves line breaks from textarea */
}
.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  border-top: 1px solid #fff;
  padding-top: 8px;
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
  color: #3b82f6;
}
</style>

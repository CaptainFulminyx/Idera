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
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
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
  background-color: #cbd5e1;
  border-radius: 50%;
}
.meta {
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: bold;
  color: #1e293b;
}
.timestamp {
  font-size: 0.8rem;
  color: #64748b;
}
.post-body {
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap; /* Preserves line breaks from textarea */
}
.post-actions {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  border-top: 1px solid #f1f5f9;
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

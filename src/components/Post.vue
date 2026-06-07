<script setup>
import { Icon } from "@iconify/vue";

defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div :class="post.isMyPost ? 'myPost-item' : 'post-item'">
    <div class="post-header">
      <div class="pfp"></div>
      <div class="meta">
        <span class="username">Anonymous User</span>
        <span class="timestamp">{{ post.timestamp }}</span>
      </div>
    </div>

    <div class="post-body">
      <p>{{ post.content }}</p>
    </div>

    <div class="post-actions">
      <button class="action-btn">
        <Icon icon="boxicons:like" width="20px" height="20px" />
      </button>
      <button class="action-btn">
        <Icon icon="material-symbols:redo-rounded" width="25px" height="25px" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Shared base */
.post-item,
.myPost-item {
  border-radius: 20px;
  margin-bottom: 12px;
  background: #2c2f3f;
  font-family: sans-serif;
  overflow: hidden;
}

/* Default: red accent */
.post-item {
  border: 5px solid #f66;
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
  color: #3b82f6;
}
</style>

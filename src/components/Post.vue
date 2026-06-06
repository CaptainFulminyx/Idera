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
  <div
    class="post-item"
    :style="{
      borderColor: post?.isMyPost ? '#fff' : '#f66',
      borderTopLeftRadius: post?.isMyPost ? '20px' : '0px',
      borderTopRightRadius: post?.isMyPost ? '0px' : '20px',
    }"
  >
    <div
      class="post-header"
      :style="{
        background: post?.isMyPost ? '#fff' : '#f66',
      }"
    >
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
.post-item {
  border: 5px solid #f66;
  border-radius: 20px;

  margin-bottom: 12px;
  background: #2c2f3f;
  font-family: sans-serif;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  background: #f66;
  padding: 10px;
}
.pfp {
  width: 40px;
  height: 40px;
  background-color: #fff;
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
  color: #333;
}
.post-body {
  color: rgb(255, 255, 255);
  line-height: 1.5;
  white-space: pre-wrap; /* Preserves line breaks from textarea */
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

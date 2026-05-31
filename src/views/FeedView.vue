<script setup>
import { ref } from "vue";
import PostComposer from "$/PostComposer.vue";
import PostItem from "$/Post.vue"; // Imported the new item component
import DevPanel from "$/DevPanel.vue";

// State to store all posts
const posts = ref([
  {
    id: 1,
    content: "Welcome to the feed! Type something above to add a post.",
    timestamp: new Date().toLocaleTimeString(),
  },
]);

// Handle incoming event from PostComposer
const handleNewPost = (postText) => {
  const newPost = {
    id: Date.now(), // Simple unique ID
    content: postText,
    timestamp: new Date().toLocaleTimeString(),
  };

  // Unshift adds the new post to the top of the feed array
  posts.value.unshift(newPost);
};
</script>

<template>
  <div class="feed">
    <PostComposer @submit-post="handleNewPost" />
    <!--<DevPanel />-->

    <div class="feed-posts">
      <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<style scoped>
.feed {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.feed-posts {
  margin-top: 20px;
}
</style>

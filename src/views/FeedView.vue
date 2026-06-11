<script setup>
import { ref } from "vue";
import PostComposer from "$/PostComposer.vue";
import Post from "$/Post.vue"; // Imported the new item component
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
    isMyPost: true,
    timestamp: new Date().toLocaleTimeString(),
  };

  // Unshift adds the new post to the top of the feed array
  posts.value.unshift(newPost);
};

// In the parent's script setup
const replyingTo = ref(null);

function handleSubmit(content) {
  const newPost = {
    id: Date.now(),
    content,
    timestamp: "just now",
    isMyPost: true,
    replyTo: replyingTo.value ?? null, // attach the replied-to post
  };
  posts.value.unshift(newPost);
  replyingTo.value = null; // clear after posting
}
</script>

<template>
  <div class="feed">
    <!-- In your feed/view component -->
    <PostComposer
      :replying-to="replyingTo"
      @submit-post="handleSubmit"
      @cancel-reply="replyingTo = null"
    />

    <!-- When a Post emits "reply": -->

    <div class="feed-posts">
      <Post
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @reply="replyingTo = $event"
      />
    </div>
  </div>
</template>

<style scoped>
.feed {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  margin-bottom: 200px;
}
.feed-posts {
  margin-top: 20px;
}
</style>

<script setup>
import { ref } from "vue";
import Post from "$/Post.vue";
import DevPanel from "$/DevPanel.vue"; // Preserved if needed elsewhere
import ComposeFab from "$/ComposeFAB.vue";
import ComposeSheet from "$/PostComposer.vue";

// --- State to store all posts ---
const posts = ref([
  {
    id: 1,
    content: "Welcome to the feed! Type something above to add a post.",
    timestamp: new Date().toLocaleTimeString(),
  },
]);

// --- Sheet & Reply State ---
const sheetOpen = ref(false);
const replyingTo = ref(null);

// --- Methods ---
// Triggered when clicking the FAB for a new post
const openCompose = () => {
  replyingTo.value = null;
  sheetOpen.value = true;
};

// Triggered when a Post emits a "reply" event
const openReply = (post) => {
  replyingTo.value = post;
  sheetOpen.value = true;
};

// Handles the actual post creation logic
const handleSubmit = (content) => {
  const newPost = {
    id: Date.now(), // Simple unique ID
    content,
    timestamp: new Date().toLocaleTimeString(), // Unified timestamp approach
    isMyPost: true,
    replyTo: replyingTo.value ?? null, // Attach the replied-to post if it exists
  };

  const handleCancelReply = () => {
    replyingTo.value = null;
    sheetOpen.value = true;
  };

  // Add the new post to the top of the feed array
  posts.value.unshift(newPost);

  // Close the sheet (which automatically resets replyingTo via watchers/events)
  sheetOpen.value = false;
};
</script>

<template>
  <div class="page-layout">
    <div class="feed">
      <div class="feed-posts">
        <Post
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @reply="openReply"
        />
      </div>
    </div>

    <ComposeFab :open="sheetOpen" @click="openCompose" />

    <ComposeSheet
      v-model="sheetOpen"
      :replying-to="replyingTo"
      @submit-post="handleSubmit"
      @cancel-reply="handleCancelReply"
    />
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

.page-layout {
  height: 100dvh; /* dvh = dynamic viewport height, shrinks when keyboard opens */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.feed {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

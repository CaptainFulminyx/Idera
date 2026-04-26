<script setup>
import { onMounted } from 'vue'
import { useFeedStore } from '@/stores/feed'
import PostComposer from '@/components/PostComposer.vue'
import PostCard from '@/components/PostCard.vue'

const feed = useFeedStore()

onMounted(() => {
  if (feed.posts.length === 0) feed.fetchPosts()
})

function refresh() {
  feed.fetchPosts()
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-3 sm:px-4 pb-20 pt-4">

    <!-- Composer -->
    <PostComposer />

    <!-- Feed header -->
    <div class="flex items-center justify-between mb-3 px-0.5">
      <span class="text-[10px] text-[#3a3a48] font-mono uppercase tracking-widest">live feed</span>
      <button
        @click="refresh"
        :class="['text-[10px] font-mono transition-colors flex items-center gap-1', feed.loadingFeed ? 'text-[#3a3a48] cursor-not-allowed' : 'text-[#6b6b80] hover:text-[#e8e8f0]']"
        :disabled="feed.loadingFeed"
      >
        <svg
          class="w-3 h-3"
          :class="feed.loadingFeed ? 'animate-spin' : ''"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ feed.loadingFeed ? 'loading...' : 'refresh' }}
      </button>
    </div>

    <!-- Loading skeleton -->
    <template v-if="feed.loadingFeed && feed.posts.length === 0">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-[#111118] border border-[#1e1e28] p-4 mb-2 space-y-2 animate-pulse"
      >
        <div class="flex gap-3">
          <div class="w-7 h-7 rounded-full bg-[#1e1e28]" />
          <div class="flex-1 space-y-2 pt-0.5">
            <div class="h-2.5 bg-[#1e1e28] w-28 rounded" />
            <div class="h-2.5 bg-[#1e1e28] w-3/4 rounded" />
            <div class="h-2.5 bg-[#1e1e28] w-1/2 rounded" />
          </div>
        </div>
      </div>
    </template>

    <!-- Posts -->
    <template v-else-if="feed.posts.length > 0">
      <div class="space-y-2">
        <PostCard
          v-for="(post, i) in feed.posts"
          :key="post.$id"
          :post="post"
          class="animate-fade-in"
          :style="`animation-delay: ${Math.min(i * 0.04, 0.4)}s`"
        />
      </div>
    </template>

    <!-- Empty state -->
    <div v-else class="text-center py-20 space-y-2">
      <p class="text-2xl" style="font-family: 'Syne', sans-serif; font-weight: 800; color: #2a2a35">nothing yet.</p>
      <p class="text-[11px] text-[#3a3a48] font-mono">it's 3am. post something.</p>
    </div>

    <!-- Subtle bottom rule -->
    <div class="mt-8 border-t border-[#1e1e28] pt-4 text-center">
      <span class="text-[9px] text-[#2a2a35] font-mono tracking-widest">3AM CATCHER · no algorithm · no feed ranking · just raw posts</span>
    </div>

  </main>
</template>

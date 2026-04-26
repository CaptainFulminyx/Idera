import { defineStore } from 'pinia'
import { ref } from 'vue'
import { databases, ID, DB_ID, POSTS_ID, REPLIES_ID } from '@/lib/appwrite'
import { Query } from 'appwrite'

export const useFeedStore = defineStore('feed', () => {
  const posts       = ref([])
  const loadingFeed = ref(false)
  const replies     = ref({})      // postId -> array of reply docs
  const loadingReplies = ref({})   // postId -> bool

  // ─── Posts ───────────────────────────────────────────
  async function fetchPosts() {
    loadingFeed.value = true
    try {
      const res = await databases.listDocuments(DB_ID, POSTS_ID, [
        Query.orderDesc('$createdAt'),
        Query.limit(50),
      ])
      posts.value = res.documents
    } finally {
      loadingFeed.value = false
    }
  }

  async function createPost({ content, type, userId, callsign, url, ogTitle, ogDescription, ogImageUrl }) {
    const doc = await databases.createDocument(DB_ID, POSTS_ID, ID.unique(), {
      content,
      type,
      userId,
      callsign,
      score:          0,
      replyCount:     0,
      url:            url || null,
      ogTitle:        ogTitle || null,
      ogDescription:  ogDescription || null,
      ogImageUrl:     ogImageUrl || null,
    })
    posts.value.unshift(doc)
    return doc
  }

  // ─── Replies ─────────────────────────────────────────
  async function fetchReplies(postId) {
    loadingReplies.value[postId] = true
    try {
      const res = await databases.listDocuments(DB_ID, REPLIES_ID, [
        Query.equal('postId', postId),
        Query.orderAsc('$createdAt'),
        Query.limit(200),
      ])
      replies.value[postId] = res.documents
    } finally {
      loadingReplies.value[postId] = false
    }
  }

  async function createReply({ content, postId, userId, callsign }) {
    // 1. Create reply document
    const doc = await databases.createDocument(DB_ID, REPLIES_ID, ID.unique(), {
      content, postId, userId, callsign,
    })

    // 2. Append locally
    if (!replies.value[postId]) replies.value[postId] = []
    replies.value[postId].push(doc)

    // 3. Update parent post score + replyCount
    const postIdx = posts.value.findIndex(p => p.$id === postId)
    if (postIdx !== -1) {
      const post = posts.value[postIdx]
      const updated = await databases.updateDocument(DB_ID, POSTS_ID, postId, {
        score:      (post.score      || 0) + 8,
        replyCount: (post.replyCount || 0) + 1,
      })
      posts.value[postIdx] = updated
    }

    return doc
  }

  return {
    posts, loadingFeed, replies, loadingReplies,
    fetchPosts, createPost, fetchReplies, createReply,
  }
})

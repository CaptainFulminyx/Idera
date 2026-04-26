import { createRouter, createWebHistory } from 'vue-router'
import FeedView from '@/views/FeedView.vue'

const routes = [
  { path: '/', name: 'feed', component: FeedView },
  // Future routes (graveyard, leaderboard) can be added here without breaking anything
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

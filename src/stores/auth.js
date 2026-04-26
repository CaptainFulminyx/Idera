import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { account, databases, ID, DB_ID, PROFILES_ID } from '@/lib/appwrite'
import { generateCallsign } from '@/lib/callsign'

export const useAuthStore = defineStore('auth', () => {
  const user     = ref(null)
  const profile  = ref(null)
  const loading  = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const callsign   = computed(() => profile.value?.callsign ?? null)

  async function init() {
    loading.value = true
    try {
      const u = await account.get()
      user.value = u
      await loadProfile(u.$id)
    } catch {
      user.value    = null
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  async function loadProfile(userId) {
    try {
      const doc = await databases.getDocument(DB_ID, PROFILES_ID, userId)
      profile.value = doc
    } catch {
      profile.value = null
    }
  }

  async function join(email, password) {
    const cs = generateCallsign()
    const userId = ID.unique()

    // Create auth account
    await account.create(userId, email, password, cs)
    await account.createEmailPasswordSession(email, password)

    const u = await account.get()
    user.value = u

    // Create profile document — doc ID === userId for O(1) lookups
    const doc = await databases.createDocument(DB_ID, PROFILES_ID, u.$id, {
      userId:    u.$id,
      callsign:  cs,
      createdAt: new Date().toISOString(),
    })
    profile.value = doc
  }

  async function signIn(email, password) {
    await account.createEmailPasswordSession(email, password)
    const u = await account.get()
    user.value = u
    await loadProfile(u.$id)
  }

  async function signOut() {
    await account.deleteSession('current')
    user.value    = null
    profile.value = null
  }

  return { user, profile, loading, isLoggedIn, callsign, init, join, signIn, signOut }
})

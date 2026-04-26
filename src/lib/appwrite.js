import { Client, Account, Databases, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID')

export const account   = new Account(client)
export const databases = new Databases(client)
export { ID }

export const DB_ID       = import.meta.env.VITE_DB_ID       || 'main'
export const POSTS_ID    = import.meta.env.VITE_POSTS_ID    || 'posts'
export const REPLIES_ID  = import.meta.env.VITE_REPLIES_ID  || 'replies'
export const PROFILES_ID = import.meta.env.VITE_PROFILES_ID || 'profiles'

export default client

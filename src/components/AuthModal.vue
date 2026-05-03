<script setup>
import { ref } from 'vue';

const isLoading = ref(false);
const errorMessage = ref('');

const handleOAuthLogin = (provider) => {
  isLoading.value = true;
  errorMessage.value = '';
  
  // For demo purposes - replace with actual OAuth redirect
  setTimeout(() => {
    // Simulate OAuth flow
    console.log(`Redirecting to ${provider} OAuth...`);
    
    // In production, use actual OAuth endpoints
    const oauthUrls = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email profile',
      github: 'https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user:email'
    };
    
    // Uncomment to actually redirect
    // window.location.href = oauthUrls[provider];
    
    isLoading.value = false;
  }, 1000);
};
</script>

<template>
  <div class="min-h-screen bg-base flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-red-500 rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Sign in to continue to your account</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- OAuth Buttons -->
        <div class="space-y-3">
          <!-- Google Button -->
          <button 
            @click="handleOAuthLogin('google')" 
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></span>
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span class="text-gray-700 font-medium">Continue with Google</span>
          </button>

          <!-- GitHub Button -->
          <button 
            @click="handleOAuthLogin('github')" 
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026.8-.222 1.65-.333 2.5-.334.85.001 1.7.112 2.5.334 1.89-1.296 2.73-1.026 2.73-1.026.544 1.378.201 2.397.099 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
            <span class="font-medium">Continue with GitHub</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <!-- Email Login Option -->
        <button class="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium">
          Email & Password Login
        </button>

        <!-- Footer -->
        <div class="mt-6 text-center text-sm text-gray-600">
          By continuing, you agree to our 
          <a href="#" class="text-blue-600 hover:underline">Terms</a> and 
          <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue'
  import Auth from './components/AuthModal.vue';
  import NavBar from './components/NavBar.vue';
</script>
<template>
    <div class="drawer lg:drawer-open">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
      
  <div class="drawer-content">
  <NavBar />

    <router-view></router-view>
  </div>

  <div class="drawer-side is-drawer-close:overflow-visible">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex min-h-full flex-col items-start bg-[#f66] is-drawer-close:w-14 is-drawer-open:w-64">
      <!-- Sidebar content here -->
      <ul class="menu w-full grow">
        <!-- List item -->
        <li>
          <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
            <!-- Home icon -->
            
            <span class="is-drawer-close:hidden">Homepage</span>
          </button>
        </li>

        <!-- List item -->
        <li>
          <button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
            <!-- Settings icon -->
            
            <span class="is-drawer-close:hidden">Settings</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>


<template>
    <div class="drawer lg:drawer-open">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Navbar -->
    <nav class="navbar w-full bg-red-500">
      <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
        <!-- Sidebar toggle icon -->

      </label>
      <div class="px-4">Navbar Title</div>
    </nav>
    <!-- Page content here -->
    <Auth />
  </div>

  <div class="drawer-side is-drawer-close:overflow-visible">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <div class="flex min-h-full flex-col items-start bg-black is-drawer-close:w-14 is-drawer-open:w-64">
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
<script setup >
  import Auth from './AuthModal.vue';
</script>

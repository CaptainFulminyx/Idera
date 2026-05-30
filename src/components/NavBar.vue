<script setup>
import { Icon } from "@iconify/vue";
</script>
<template>
  <nav class="navbar w-full bg-[#f66]">
    <div class="title flex-1">Idera</div>
    <div class="flex-none">
      <label
        for="my-drawer-4"
        aria-label="open sidebar"
        class="btn btn-square btn-ghost"
      >
        <!-- Sidebar toggle icon -->
        <Icon icon="material-symbols:menu-rounded" width="40px" size="30px" />
      </label>
    </div>
  </nav>
</template>
<style scoped>
.title {
  font-size: 25px;
  padding-left: 20px;
}
</style>

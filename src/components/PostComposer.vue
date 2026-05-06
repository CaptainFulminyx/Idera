<template>
  <input class="writeText" placeholder="Write something..." />
</template>
<style>
  @import 'tailwindcss';
  .writeText{
    @apply bg-black w-full;
    
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    height: 150px;
    text-transform: 30;
    position: fixed;
    bottom:0;
    outline:none;
  }
</style>
  
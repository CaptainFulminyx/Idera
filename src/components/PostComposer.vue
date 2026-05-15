<template>
  <div class="writeTextContainer">
    
  <input class="writeText" placeholder="Write something..." />
  </div>
</template>
<style>
  @import 'tailwindcss';
.writeTextContainer{
  width: 100%;
  height: 120px;
  position: fixed;
  bottom:0;
  display:flex;
  align-items: center;
  justify-content: center;
}
  
  .writeText{
    @apply bg-red-500;
    border-radius:20px;
    height: 55px;
    width: 90%;
    padding:10px;
    text-transform: 30;
    opacity:0.6;
    outline:none;
    transition:opacity 0.3s ;
  }

  .writeText:hover, 
  .writeText:focus {
    opacity: 1;
  }
</style>
  
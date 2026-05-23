<template>
  <div class="writeTextContainer">
    
  <input class="writeText" placeholder="Write something..." />
  </div>
</template>
<style>
  @import 'tailwindcss';
.writeTextContainer{
  width:100%;
  height: 120px;
  position: fixed;
  bottom:0;
  display:flex;
  align-items: center;
  justify-content: center;
  padding-right: 5%;
}
  
  .writeText{
    width: clamp(24rem, 90%, 50rem);
    @apply bg-[#334];
    border-radius:20px;
    height: 55px;
    width: 90%;
    padding:10px;
    text-transform: 30;
align-self: center;
    outline:2px solid #fff;
  
  }

  
</style>
  
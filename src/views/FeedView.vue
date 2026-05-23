<script setup>
  import PostComposer from '$/PostComposer.vue'

  let devPost = [
    {title: "Helloo",
     body: "..."
    },
    {title: "Wotld",
     body: "..."
    },
    {title: "Helloo Idera",
     body: "..."
    },
  ]

</script>
<template class="feed">
  <div class="dev">
      <div v-for="item in devPost" class="dev-post">
        <h2>{{item.title}}</h2>
        <p> {{item.body}} </p>
  </div>
  </div>
  <PostComposer />
</template>
<style scoped>
  .dev{
    width:100%;
    height:200px;
    background: transparent;
  }
  </style>
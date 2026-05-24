<script setup>
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
<template>
  <div class="dev-section">
    
      <div v-for="item in devPost" class="dev-post">
        <h2>{{item.title}}</h2>
        <p> {{item.body}} </p>
  </div>
  </div>
</template>
<style>
    .dev-section{
    min-width:100%;
    height:auto;
    padding: 20px;
    background: transparent ;
    display: flex;
    align-items: center ;
    justify-content: space-evenly;
      overflow-x: scroll;
    }

  .dev-post{
    border: 4px solid #f66;
    min-width: 150px;
    max-width: 200px;
    padding: 10px;
    border-radius: 15px;
    margin-left: 15px;
    height: 100px;
  }
  </style>
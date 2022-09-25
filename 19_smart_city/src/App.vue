<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view />
</template>

<style lang="scss">
/*设置宽度,轨道颜色*/
::-webkit-scrollbar {
  width:5px;
  height: 8px;
  background: #0e0c0c; /*可以设置轨道颜色*/
  padding-right: 2px;
}

/*滚动条*/
::-webkit-scrollbar-thumb {
  background: rgba(34, 133, 247,0.8);
  border-radius: 10px;
}
</style>

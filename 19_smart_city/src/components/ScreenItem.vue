<template>
  <div class="box">
    <slot></slot>
    <div class="left-top-border"></div>
    <div class="right-top-border"></div>
    <div class="left-bottom-border"></div>
    <div class="right-bottom-border"></div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  position: relative;
  background: url("@/assets/material/bg_img03.png");
  background-repeat: repeat;
  .left-top-border,
  .right-top-border,
  .left-bottom-border,
  .right-bottom-border {
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
  }
  .left-top-border {
    left:0;
    top:0;
    border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  }
  .right-top-border {
    right: 0;
    top:0;
    border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  }
  .left-bottom-border {
    left:0;
    bottom: 0;
    border-left: 4px solid rgb(34, 133, 247);
    border-bottom: 4px solid rgb(34, 133, 247);
  }
  .right-bottom-border {
    right: 0;
    bottom: 0;
    border-right: 4px solid rgb(34, 133, 247);
    border-bottom: 4px solid rgb(34, 133, 247);
  }
}
</style>

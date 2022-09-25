<template>
  <div class="bigScreen">
    <div class="header">Smart City Management System</div>
    <div class="main">
      <div class="inner-container">
        <div class="left">
          <ScreenItem
            class="subitem"
            v-for="item in props.typeList"
            :key="item.id"
          >
            <div class="subTop">{{ item.name }}</div>
            <div class="subBottom">
              <img src="@/assets/material/bar.svg" class="imgStyle" />
              <div class="content">{{ item.number }} {{ item.unit }}</div>
            </div>
          </ScreenItem>
        </div>
        <div class="right">
          <ScreenItem class="right-item">
            <div class="right-inner">
              <h4>事件列表</h4>
              <div class="right-inner-bottom">
                <div
                  class="eventlist"
                  v-for="(item, i) in props.eventList"
                  :class="{ active: currentActive == i }"
                  @click="toggleEvent(i)"
                >
                  <div class="event-title">
                    <img :src="imgArray[item.name]" class="imgStyle" />
                    <div class="name">{{ item.name }}</div>
                    <div class="time">{{ item.time }}</div>
                  </div>
                  <div class="event-content">{{ item.type }}</div>
                </div>
              </div>
            </div>
          </ScreenItem>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ScreenItem from "./ScreenItem.vue";
import eventHub from "@/utils/eventHub";
import { ref } from "vue";
const props = defineProps(["typeList", "eventList"]);
const imgArray: any = {
  电力: require("@/assets/material/dianli.svg"),
  火警: require("@/assets/material/fire.svg"),
  治安: require("@/assets/material/jingcha.svg"),
};

const currentActive: any = ref(null);
eventHub.on("spriteClick", (data: any) => {
  currentActive.value = data.i;
});

const toggleEvent = (i: number) => {
  currentActive.value = i;
  eventHub.emit("eventToggle", i);
};
</script>
<style lang="scss" scoped>
.bigScreen {
  width: 100vw;
  height: 100vh;
  //   background-color: antiquewhite;
  position: fixed;
  //   让元素实体虚化,穿透元素
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  color: rgba(255, 255, 255, 0.933);
  .header {
    width: 100%;
    height: 10%;
    background: url("@/assets/material/title.png") no-repeat center;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    background-size: cover;
  }
  .main {
    width: 100%;
    height: 90%;
    // flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    .inner-container {
      width: 100%;
      height: calc(100% - 10px);
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        width: 19vw;
        height: 100%;
        background: url("@/assets/material/line_img.png") no-repeat;
      }
      .left {
        background-position: right center;
        .subitem {
          width: 85%;
          height: 18%;
          margin: 0.5rem auto;
          font-weight: bold;
          .subTop {
            width: 80%;
            height: 40%;
            margin: 0.5rem auto;

            display: flex;
            align-items: center;
          }
          .subBottom {
            width: 80%;
            height: 40%;
            margin: 0.5rem auto;
            position: relative;
            .imgStyle {
              width: 40px;
              height: 40px;
              position: absolute;
              left: 0;
              top: 1px;
            }

            .content {
              position: absolute;
              left: 40%;
              top: 10px;
            }
          }
        }
      }
      .right {
        background-position: left center;

        .right-item {
          width: 85%;
          height: 98%;
          margin: 0.5rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
          .right-inner {
            width: 90%;
            height: 100%;
            .right-inner-bottom {
              height: 85%;
              width: 100%;
              padding: 2px 0px;
              overflow: auto;
              pointer-events: auto;
              .eventlist {
                width: 97%;
                height: 14%;
                margin-bottom: 5px;
                pointer-events: auto;
                cursor: pointer;
                &.active {
                  color: rgb(236, 236, 45);
                }

                .event-title {
                  width: 100%;
                  height: 40%;
                  position: relative;
                  .imgStyle {
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    left: 0;
                  }
                  .name {
                    position: absolute;
                    left: 35px;
                    top: 2px;
                  }
                  .time {
                    position: absolute;
                    right: 2px;
                    top: 4px;
                    font-size: 13px;
                  }
                }
                .event-content {
                  width: 100%;
                  height: 60%;
                  font-size: 13px;
                  line-height: 24px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

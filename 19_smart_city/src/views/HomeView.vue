<template>
  <div class="home">
    <Scene :eventList="eventList" />
    <Screen :typeList="dataInfo" :eventList="eventList" />
  </div>
</template>

<script lang="ts" setup>
import Scene from "@/components/Scene.vue";
import Screen from "@/components/Screen.vue";
import gsap from "gsap";
import { getSmartCityInfo, getSmartCityList } from "@/api/api";
import { onMounted, reactive, ref } from "vue";

const dataInfo: any = reactive({
  iot: { number: 0 },
  event: { number: 0 },
  power: { number: 0 },
  test: { number: 0 },
});

onMounted(async () => {
  // console.log(dataInfo);

  changeInfo();
  getEventList();

  setInterval(()=>{
    changeInfo()
    getEventList()
  },20000)
});

const changeInfo = async () => {
  let res = await getSmartCityInfo();
 
  // dataInfo.iot = res.data.data.iot;
  // dataInfo.event = res.data.data.event;
  // dataInfo.power = res.data.data.power;
  // dataInfo.test = res.data.data.test;

  for (let key in dataInfo) {
    dataInfo[key].name = res.data.data[key].name;
    dataInfo[key].unit = res.data.data[key].unit;
    gsap.to(dataInfo[key], {
      number: res.data.data[key].number,
      duration: 1,
    });
  }

  // console.log(dataInfo);
};

const eventList = ref([]);
const getEventList = async () => {
  let result = await getSmartCityList();
  eventList.value = result.data.list;
  // console.log(result.data.list);
};
</script>

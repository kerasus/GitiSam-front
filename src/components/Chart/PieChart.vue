<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
// import VChart, { THEME_KEY } from 'vue-echarts';
import VChart from 'vue-echarts'
// import { ref, provide } from 'vue';
import { ref } from 'vue'

const props = defineProps<{
  title: string,
  data: {
    value: number,
    name: string,
  }[]
}>()

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ToolboxComponent,
  LegendComponent
])

// provide(THEME_KEY, 'dark');
const option1 = ref({
  title: {
    text: props.title,
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)'
    // formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left',
  //   data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines']
  // },
  series: [
    {
      name: props.title,
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: props.data
      //   [
      //   { value: 335, name: 'Direct' },
      //   { value: 310, name: 'Email' },
      //   { value: 234, name: 'Ad Networks' },
      //   { value: 135, name: 'Video Ads' },
      //   { value: 1548, name: 'Search Engines' }
      // ]
      ,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

</script>

<template>
  <q-card>
    <q-card-section>
      <v-chart
        class="chart"
        :option="option1"
        autoresize />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.chart {
  height: 200px;
}
</style>

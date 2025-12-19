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
const names = [
  'Orange',
  'Tomato',
  'Lemon',
  'Pasta'
]
const years = ['2001', '2002', '2003', '2004', '2005', '2006']

const option1 = ref({
  title: {
    text: 'Traffic Sources',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines']
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 1548, name: 'Search Engines' }
      ],
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

function generateSeriesList () {
  const seriesList: any[] = []
  const rankingMap = generateRankingData()
  rankingMap.forEach((data, name) => {
    const series = {
      name,
      symbolSize: 20,
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      endLabel: {
        show: true,
        formatter: '{a}',
        distance: 20
      },
      lineStyle: {
        width: 4
      },
      data
    }
    seriesList.push(series)
  })
  return seriesList
};
function generateRankingData () {
  const map = new Map()
  const defaultRanking = Array.from({ length: names.length }, (_, i) => i + 1)
  years.forEach(()=> {
    const shuffleArray = shuffle(defaultRanking)
    names.forEach((name, i) => {
      map.set(name, (map.get(name) || []).concat(shuffleArray[i]))
    })
  })
  return map
};
function shuffle (array: any[]) {
  let currentIndex = array.length
  let randomIndex = 0
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }
  return array
};

const option2 = ref({
  title: {
    text: 'Bump Chart (Ranking)'
  },
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: 30,
    right: 110,
    bottom: 30,
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    splitLine: {
      show: true
    },
    axisLabel: {
      margin: 30,
      fontSize: 16
    },
    boundaryGap: false,
    data: years
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      margin: 30,
      fontSize: 16,
      formatter: '#{value}'
    },
    inverse: true,
    interval: 1,
    min: 1,
    max: names.length
  },
  series: generateSeriesList()
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
  <q-card>
    <q-card-section>
      <v-chart
        class="chart"
        :option="option2"
        autoresize />
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">
.chart {
  height: 500px;
}
</style>

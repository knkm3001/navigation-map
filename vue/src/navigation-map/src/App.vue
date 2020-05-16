<template>
  <div id='app' >
    <chartModal v-if='chartModalFlg' v-on:close-modal='closeChartModal'></chartModal>
    <Map id='map' v-on:open-modal='openChartModal'></Map>
  </div>
</template>

<script>

import chartModal from './components/chartModal.vue'
import Map from './components/Map.vue'


export default {
  name: 'app',
  components:{
    Map,
    chartModal
  },
  data(){
    return {
      chartModalFlg: false
    }
  },
  methods:{
    openChartModal(){
      this.chartModalFlg = true
    },
    closeChartModal(){
      this.chartModalFlg = false
    }
  },
}
</script>

<style>

html, body, #Map {
    z-index: 0;
    height: 1200px;
    overflow: hidden;
}
body {
  margin:0
}


</style>
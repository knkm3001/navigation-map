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
body {
    padding: 0;
    margin: 0;
}
html, body, #Map {
    height: 100%;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:0;
}




</style>
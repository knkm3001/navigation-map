<template>
  <div id='app' >
    <Map id='map'></Map>
  </div>
</template>

<script>


import Map from './components/Map.vue'


export default {
  name: 'app',
  components:{
    Map
  },
  data(){
    return {
    }
  },
  methods:{

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
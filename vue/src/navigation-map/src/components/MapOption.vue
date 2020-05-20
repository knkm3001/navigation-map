<template>
  <div id='overlay' @click="$emit('multiHundler', 'changeMapOption')">
    
    <div id='content' v-on:click='stopEvent'>
      <p>{{this.layers}} {{this.basemap}}</p>
      <p class='title'>select map option</p>
      <p class='besemap'>select base map</p>
        <label>open street map
          <input type="radio" name="basemap" value='osm' v-model="basemap" checked="checked">
        </label>
        <label>open sea map
          <input type="radio" name="basemap" value='obm' v-model="basemap">
        </label>
        <label>GSI(国土地理院)
          <input type="radio" name="basemap" value='gsi' v-model="basemap">
        </label>
      <p class='layer'>select layer</p>
        <label>open sea map
          <input type="checkbox" name="layer" v-model="layers.osm" checked="checked">
        </label>
        <label>open railway map
          <input type="checkbox" name="layer" v-model="layers.orm">
        </label>
    </div>
  </div>
</template>

<script>

import { mapState } from "vuex"

export default {
  name: 'MapOption',
  components:{
  },
  data(){
    return{
      layers :Object.assign({},this.$store.state.map_data.layers),
      basemap:this.$store.state.map_data.basenap
    }
  },
  methods:{
    stopEvent(){
      event.stopPropagation()
    }
  },
  watch:{
    'layers.osm' : function(){
      this.$store.commit('changeLayer',this.layers)
    },
    'layers.orm' : function(){
      this.$store.commit('changeLayer',this.layers)
    },
    basemap : function(){
      this.$store.commit('changeBaseMap',this.basemap)
    }
  },
  computed : {
    ...mapState({
        map_data:state => state.map_data
    }),
  }
}


</script>

<style scoped>


#overlay{
  z-index:1;

  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(100, 100, 100, 0.3);

  display: flex;
  align-items: center;
  justify-content: center;
}

#content{
  border-color: #ffffff;
  border-width: 2px;
  z-index:2;
  width:50em;
  height:30em;
  padding: 1em 2em;
  background: rgba(255, 255, 255, 0.8);
}

.title{
    text-align: center;
}

</style>>
<template>
  <div id='overlay' @click="$emit('multiHundler', 'changeMapOption')">
    
    <div id='content' v-on:click='stopEvent'>
      <p class='title'>map option</p>
      <p class='besemap'>select base map</p>
        <div v-for="basemap_option in this.basemap_options" :key=basemap_option.key>
          <label >{{basemap_option.explanation}}
            <input type="radio" name="basemap" v-bind:value="basemap_option.name" v-model="basemap">
          </label>
        </div>
      <p class='layer'>select layer</p>
        <div v-for="layer_option in this.layer_options" :key=layer_option.name>
          <label >{{layer_option.explanation}}
            <input type="checkbox" name="layer" :value="layer_option.name" v-model=layers>
          </label>
        </div>
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
      basemap_options : [
                      {'key':0,'name':'osm','explanation':'Open Street Map'},
                      {'key':1,'name':'gsi','explanation':'GSI(国土地理院)'},
                      {'key':2,'name':'cartodb','explanation':'cartodb-basemaps'},
                      {'key':3,'name':'esriobm','explanation':'Esri Ocean Base Map'},
                      {'key':4,'name':'esritopo','explanation':'Esri World Topo Map'}
                      ],
      layer_options: [
                       {'key':0,'name':'osm','explanation':'Open Sea Map'},
                       {'key':1,'name':'orm','explanation':'Open Railway Map'},
                       {'key':2,'name':'tonerlabels','explanation':'Stamen toner-labels'},
                       {'key':3,'name':'tonerlines','explanation':'Stamen toner-lines'}
                      ],
      layers :Object.assign([],this.$store.state.map_data.layers),
      basemap:this.$store.state.map_data.basemap
    }
  },
  methods:{
    stopEvent(){
      event.stopPropagation()
    }
  },
  watch:{
    layers : {
      handler:function(){
        console.log(this.layers)
        this.$store.commit('changeLayer',this.layers)
      },
      deep:true
    },
    basemap : function(){
      console.log(this.basemap)
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
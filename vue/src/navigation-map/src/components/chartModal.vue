<template>
  <div id='overlay' v-on:click='closeModal'>
      <div id='content' v-on:click='stopEvent'>
        <p>chart table</p>
          <table class="table">
          <thead>
          <tr>
          <th>No</th>
          <th>Lat/Lng</th>
          <th>Bearing</th>
          <th>Dist.</th>
          <th>From</th>
          <th>To</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(v,index) in marker_data" :key="index">
          <td>{{index+1}}</td>
          <td>Lat: {{showLat(v)}}<br>Lng: {{showLng(v)}}</td>
          <td>{{v.bear}}</td>
          <td>{{v.dist}}</td>
          </tr>
          </tbody>
          </table>
        <p>Total Dist: {{getTotalDist}}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

export default{
  name: 'chartModal',
  date(){
    return{}
  },
  methods:{
    closeModal(){
      /*ここからモーダル閉める指示 */
      this.$emit('close-modal')
    },
    stopEvent(){
      event.stopPropagation()
    },
    showLat(v){
        let NorS = v.latlng.lat >0 ? ' N' : ' S';
       return ('00'+v.latlng.lat.toFixed(3)).slice(-7)+NorS
    },
    showLng(v){
        let EorW = v.latlng.lat >0 ? ' E' : ' W';
       return ('00'+v.latlng.lng.toFixed(3)).slice(-7)+EorW;
    }
  },
  computed : {
    ...mapState({
        marker_data: state => state.marker_data
    }),
    ...mapGetters([
      'getTotalDist'
    ])
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
  min-width:40%;
  height:50%;
  padding: 1em;
  background: rgba(255, 255, 255, 0.8);
}
</style>
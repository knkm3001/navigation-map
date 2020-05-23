<template>
  <div id='overlay' @click="$emit('multiHundler', 'changeRoutingModalState')">
    <div id='content' v-on:click='stopEvent'>
      <p class='Routing-title'>Routing table</p>
      <table class='table'>
        <thead>
        <tr>
        <th class='no'>No</th>
        <th class='latlng'>Lat/Lng</th>
        <th class='bearing'>Bearing</th>
        <th class='dist'>Dist.</th>
        <th class='from'>From</th>
        <th class='to'>To</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v,index) in marker_data" :key="index">
        <td class='no'>{{index+1}}</td>
        <td class='latlng'>Lat:&#009;{{showLat(v)}}<br>Lng:&#009;{{showLng(v)}}</td>
        <td class='bearing'>{{v.bear}}</td>
        <td class='dist'>{{v.dist}}</td>
        <td class='from'>{{addDist(v.dist)}}</td>
        <td class='to'>{{(getTotalDist-distsum).toFixed(2)}}</td>
        </tr>
        </tbody>
      </table>
      <p class='result'>Total Dist: {{getTotalDist}} nm</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

export default{
  name: 'RoutingModal',
  date(){
    return{
      distsum:0,
      showhumbergermenu:false
    }
  },
  methods:{
    stopEvent(){
      event.stopPropagation()
    },
    addDist(dist){
      if(dist !==  '-'){
        this.distsum += parseFloat(dist)
      }else{
        this.distsum = 0 //'-'となるのは1コ目だけ
      }
      return this.distsum.toFixed(2)
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
  max-width:80%;
  height:80%;
  padding: 1em 2em;
  background: rgba(255, 255, 255, 0.8);
}

.Routing-title{
  font-family: 'Noto Sans', sans-serif;
  font-size:1.8em;
  text-align: center;
}

table{
  font-family: 'Noto Sans', sans-serif;
  font-size: 1.1em;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

}

thead, tbody {
  display: block;
  width: 100%;
}
tbody {
  overflow-x: hidden;
  overflow-y: scroll;
  height:700px;
}

th.no, td.no{
  width:60px;
}

th.latlng, td.latlng{
  width:250px;
}

th.bearing, td.bearing,th.dist, td.dist{
  width:150px;
}


th.from, td.from, th.to, td.to{
 width:150px;
}

table th,table td{
  padding: 10px 0;
  text-align: center;
}

table thead>tr{
  background-color: rgba(170, 170, 170, 0.8)
}

table tbody>tr:nth-child(even){
  background-color: rgba(230, 230, 230, 0.952)
}
table tbody>tr:nth-child(odd){
  background-color: rgba(215, 215, 215, 0.952)
}

.result{
  font-family: 'Noto Sans', sans-serif;
  font-size: 1.3em;
  text-align: center;
}
</style>
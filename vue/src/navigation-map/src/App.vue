<template>
  <div id=app @contextmenu.prevent="$refs.ctxMenu.open">
    <context-menu id="context-menu" ref="ctxMenu">
      <li @click="clearAll()">clear all</li>
      <li @click="doSomething()">アラートイベント</li>
      <li class="disabled">disabled</li>
      <li>option 3</li>
    </context-menu>
  </div>
</template>

<script>
import  'leaflet/dist/leaflet.css'
import  L from 'leaflet'

import contextMenu from 'vue-context-menu'

export default {
  components:{
    contextMenu
  },
  data(){
    return {
      mapObj : null,
      circle:null,
      maker:null,
      pline:null,
      latlngs:[],
      markers:[]
    }
  },
  methods:{
    showMap(){
      /* マップのレンダリング */
      this.mapObj = L.map( 'app', { center: L.latLng( 35.5825, 139.852778 ), zoom: 12 } )

      let Base_Maps = {};
      Base_Maps["Open street this.this.mapObj"] = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '})
      Base_Maps["Ocean Basemap"]  = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}')

      let Layers = {};
      Layers["Sea Mark"] = L.tileLayer( 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png')

      L.control.layers(Base_Maps, Layers).addTo(this.mapObj);
      Base_Maps["Open street this.this.mapObj"].addTo(this.mapObj);
      Layers["Sea Mark"].addTo(this.mapObj)

      this.latlngs = [];
      this.pline = L.polyline(this.latlngs, { color: 'red', weight: 5, bubblingMouseEvents: false })
                    .addTo(this.mapObj)

      L.control.scale({
        imperial: true,
        metric: true
      }).addTo(this.mapObj);
    },
    setMaker(){
      /* クリックしたところにマーカーとラインを描画するように初期化する */
      this.mapObj.on('click',(e)=>{
          let mk = L.marker(e.latlng, { icon: L.divIcon( { className: 'red marker', iconSize: [ 16, 16 ] } ) })
                    .on('click', this.delMaker)
          this.mapObj.addLayer(mk);
          this.markers.push(mk._leaflet_id);
          this.setLine(e);
          console.log(JSON.stringify(this.markers,null,'\t'));
          }
        )
    },
    setLine(e){
       /* ラインを引く */
      this.latlngs.push(e.latlng);
      this.pline.addLatLng(e.latlng);
      console.log(JSON.stringify(this.latlngs,null,'\t'));
    },
    delMaker(e){
      /* マーカーとライン削除 */
      let index = this.latlngs.indexOf(e.latlng);
      console.log('index: '+index)
      this.latlngs.splice(index,1);
      this.markers.splice(index,1);
      console.log(JSON.stringify(this.markers,null,'\t'));
      console.log(JSON.stringify(this.latlngs,null,'\t'));
      console.log(e.target)
      this.mapObj.removeLayer(e.target);
      this.pline.setLatLngs(this.latlngs);
    },
    clearAll(){
      this.pline.setLatLngs([]);
      L.LayerGroup(this.markers).eachLayer((layer)=>{
        if(this.markers.indexOf(layer._leaflet_id)>=0){
          this.mapObj.removeLayer(layer);
        }
      })
    },
    doSomething(){
      alert('click');
    }
  },
  mounted() {
    this.showMap();
    this.setMaker();
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  }
body {
  margin: 0;
  }


.marker {
    text-align      : center;
    color           : white;
    font-size       : 16;
    border-radius   : 8px;
    box-shadow      : 8px 8px 8px rgba( 0, 0, 0, 0.4 )
}
.red {
    background      : red
}

ul.ctx-menu {
  padding: 5px;
}
ul.ctx-menu li {
  cursor: pointer;
  padding: 2px;
}
</style>
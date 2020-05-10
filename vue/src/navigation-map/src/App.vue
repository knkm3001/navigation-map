<template>
  <div id=app @contextmenu.prevent="$refs.ctxMenu.open">
    <context-menu id="context-menu" ref="ctxMenu">
      <li >mesure from this point </li>
      <li >show passage tables </li>
      <li @click="clearAll()">clear all</li>
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
      maker : null,
      pline : null,
      latlngs : [], // [{"lat": ***,"lng": *** },{"lat": *** ,"lng": *** },]
      markers : []  // L.marker(~~) で作られたオブジェクト
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
      this.plineObj = L.polyline(this.latlngs, { color: 'red', weight: 5, bubblingMouseEvents: false })
                    .addTo(this.mapObj)


    },
    showLatLngTable(){
      //mousemoveイベントを設定
      this.mapObj.on('mousemove', (e)=>{
        //地図上を移動した際にdiv中に緯度経度を表示
        let box = document.getElementById("latlondiv");
        let lng = this.parseLng(e.latlng.lng);
        let html = "lat:" + e.latlng.lat.toFixed(3) + "<br>" + "lng:" + lng;
        box.innerHTML = html;
        box.style.visibility = "visible";
      })


      //左上にdivコントロールを表示
      let latloninfo = L.control({ position: "bottomleft" });
      latloninfo.onAdd = function () {
        //divを作成
        this.elem = L.DomUtil.create('div', "infostyle");
        //後で使うためにidを設定
        this.elem.id = "latlondiv";
        //最初は非表示
        this.elem.style.visibility = "hidden";
        //div上のとmousemoveイベントがmapに連鎖しないように設定
        this.elem.onmousemove = function (e) { e.stopPropagation() };
        return this.elem;
      };
      latloninfo.addTo(this.mapObj);
    },
    setMaker(){
      /* クリックしたところにマーカーとラインを描画するように初期化する */
      this.mapObj.on('click',(e)=>{
          let marker = L.marker(e.latlng, { icon: L.divIcon( { className: 'red marker', iconSize: [ 16, 16 ] } ) })
                    .on('click', this.delMaker)
                    .bindPopup((e)=>{
                      let truelng = this.parseLng(e._latlng.lng);
                      console.log(truelng);
                      return 'lat: '+e._latlng.lat.toFixed(3)+'<br>long: '+truelng
                      })
                    .on('mouseover', function () {this.openPopup();});
          this.mapObj.addLayer(marker);
          this.markers.push(marker);
          this.setLine(e);
          }
        )
    },
    parseLng(row_lng){
      /* 経度を修正する */
      let isNegative = false;
      if(row_lng < 0){
        row_lng *= -1;
        isNegative = true;
      }
      if(Math.floor(row_lng/180)%2 == 0){
        return isNegative ? -1*(row_lng%180).toFixed(3):(row_lng%180).toFixed(3);
      }else{
        return isNegative ? (180-row_lng%180).toFixed(3):-1*(180-row_lng%180).toFixed(3);
      }
    },
    setLine(e){
       /* ラインを引く */
      this.latlngs.push(e.latlng);
      this.plineObj.addLatLng(e.latlng);
      console.log(JSON.stringify(this.latlngs,null,'\t'));
    },
    delMaker(e){
      /* マーカーとライン削除 */
      let index = this.latlngs.indexOf(e.latlng);
      console.log('index: '+index)
      this.latlngs.splice(index,1);
      this.markers.splice(index,1);
      console.log(JSON.stringify(this.latlngs,null,'\t'));
      this.mapObj.removeLayer(e.target);
      this.plineObj.setLatLngs(this.latlngs);
    },
    clearAll(){
      this.plineObj.setLatLngs([]);
      for(let v of this.markers){
          this.mapObj.removeLayer(v);
      }
      this.markers = []
      this.latlngs = []
    }
  },
  mounted() {
    this.showMap();
    this.setMaker();
    this.showLatLngTable();
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
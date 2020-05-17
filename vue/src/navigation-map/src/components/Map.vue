<template>
  <div class='container' @contextmenu.prevent="$refs.ctxMenu.open">
    <transition name='nav-menue'>
      <HumbergerMenu v-show='humbergerMenuFlg' v-on:multiHundler='multiHundler'></Humbergermenu>
    </transition>
    <ChartModal v-show='chartModalFlg' v-on:multiHundler='multiHundler'></ChartModal>
    <div id='Map'>
      <context-menu id="context-menu" ref="ctxMenu">
        <!--<li >mesure from here </li>-->
        <li @click="multiHundler('changeChartModalState')">show chart table </li>
        <li @click="multiHundler('clearAll')">clear all</li>
      </context-menu>
    </div>
  </div>
</template>

<script>

import  L from 'leaflet'
import { mapState } from "vuex"
import contextMenu from 'vue-context-menu'
import ChartModal from './ChartModal.vue'
import HumbergerMenu from './HumbergerMenu.vue'

export default {
  name: 'Map',
  components:{
    contextMenu,
    ChartModal,
    HumbergerMenu
  },
  data(){
    return {
      humbergerMenuFlg:false,
      chartModalFlg: false,
      mapObj : null,
      plineObj : null,
      markers : [], // L.marker(~~) で作られたマーカーオブジェクトが入ってる配列
      latlngs : [], // マーカーの緯度経度。これはいらないかもしれない
    }
  },
  methods:{
    multiHundler(selecter){
      /** 指示を受けて実行するのが主な機能 */
      switch(selecter){
        case 'changeChartModalState':
          if(this.humbergerMenuFlg) this.humbergerMenuFlg = !this.humbergerMenuFlg
          this.chartModalFlg = !this.chartModalFlg
          break;
        case 'clearAll':
          if(this.humbergerMenuFlg) this.humbergerMenuFlg = !this.humbergerMenuFlg
          this.clearAll()
          break
        case 'changeLayer':
          break
        case 'changeMenueState':
          this.humbergerMenuFlg = !this.humbergerMenuFlg
          break
      }
    },
    showMap(){
      /* マップの初期化、レンダリング */
      this.mapObj = L.map( 'Map', { center: L.latLng( 35.440, 139.824 ), zoom: 11,worldCopyJump: true} )

      let Base_Maps = {};
      Base_Maps["Open street this.this.mapObj"] = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '})
      Base_Maps["Ocean Basemap"]  = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}')

      let Layers = {};
      Layers["Sea Mark"] = L.tileLayer( 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png')

      //L.control.layers(Base_Maps, Layers).addTo(this.mapObj);
      Base_Maps["Open street this.this.mapObj"].addTo(this.mapObj);
      Layers["Sea Mark"].addTo(this.mapObj)

      this.latlngs = [];
      this.plineObj = L.polyline(this.latlngs, { color: 'red', weight: 5, bubblingMouseEvents: false, edit_with_drag: true }).addTo(this.mapObj)
    },
    showCordinateOfMouse(){
      /* マウスの座標を表示 */

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
    setHumbergerMenu(){
      //右上にdivコントロールを表示
      let latloninfo = L.control({ position: "topright" });
      latloninfo.onAdd = function () {
        //divを作成
        this.elem = L.DomUtil.create('button', "infostyle");
        this.elem.id = "humbergermenue";
        this.elem.addEventListener('click',e => { e.stopPropagation()});
        return this.elem;
      };
      latloninfo.addTo(this.mapObj);
      let box = document.getElementById("humbergermenue");
      box.addEventListener('click',() => { this.multiHundler('changeMenueState')});
      box.innerHTML = '三';
    },
    putMarker(v){
      /* マーカーを置くための関数 */

      let marker = L.marker(v.latlng, { icon: L.divIcon( { className: 'red marker', iconSize: [ 16, 16 ] } ) })
                .on('click', this.delMaker)
                .bindPopup((v)=>{ // ポップアップ設定
                  let truelng = this.parseLng(v._latlng.lng);
                  return 'lat: '+v._latlng.lat.toFixed(3)+'<br>long: '+truelng
                  })
                .on('mouseover', function () {this.openPopup();});
      this.mapObj.addLayer(marker);
      this.markers.push(marker);
      this.setMarkerLine(v); // マーカー間に線を引く
    },
    setMarkerLine(e){
       /* マーカー間のラインを引く */

      this.latlngs.push(e.latlng);
      this.plineObj.addLatLng(e.latlng);
    },
    putMarkesrsOflocalStorage(data){
      /* localstrage上のデータからマーカーをおく */

      for(let v of data){
        this.putMarker(v)
      }
    },
    initMakerOption(){
      /* クリックしたところにマーカーとラインを描画するように設定する */

      this.mapObj.on('click',(e)=>{
          this.putMarker(e)
          let some_marker_data = {latlng:{"lat": e.latlng.lat,"lng": e.latlng.lng}, "other":{}, "bear":"-","dist":"-" }
          this.$store.commit('pushMarkerData',{'some_marker_data':some_marker_data});
          this.save()
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
    delMaker(e){
      /* マーカーとライン削除 */
      let index = this.latlngs.indexOf(e.latlng);
      console.log('index: '+index)
      this.markers.splice(index,1);
      this.latlngs.splice(index,1);
      this.$store.commit('delMarkerData',{'index':index});
      this.mapObj.removeLayer(e.target);
      this.plineObj.setLatLngs(this.latlngs);
      this.save()
    },
    clearAll(){
      /* マップ上のすべてのラインを削除 */

      this.plineObj.setLatLngs([]);
      for(let v of this.markers){
          this.mapObj.removeLayer(v);
      }
      this.$store.commit('updateMarkerData',{'marker_data':[]});
      this.save()
      this.latlngs = []
    },
    save(){
      // LocalStoragにデータ保存
      // TODO: 現在いろんなとこに書いてるから自動化する
      this.$store.dispatch('doSave')
    }
  },
  computed : {
    ...mapState({
        marker_data: state => state.marker_data
    })
  },
  beforeCreate() {
    // LocalStorageからデータ読込
    this.$store.dispatch('doLoad')
  },
  mounted() {
    this.showMap();
    this.initMakerOption();
    this.showCordinateOfMouse();
    this.putMarkesrsOflocalStorage(this.marker_data)
    this.setHumbergerMenu();
  }
}
</script>

<style>
.btn-menu{
  z-index:5;
}

#latlondiv{
  font-family: 'Noto Sans', sans-serif;
  font-size: 1.1em;
  padding: 2px;
  background      : rgb(255, 255, 255,0.8);
  width: 80px;
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
ul.ctx-menu li:hover {
  background-color: rgb(219, 219, 219);
  transition: background-color 800ms;
}

/* メニュー表示アニメーション */
.nav-menue-enter,
.nav-menue-leave-to {
  opacity: 0;
}

.nav-menue-enter-active,
.nav-menue-leave-active {
  transition: opacity .5s;
}


.nav-menue-enter-active > #nav,
.nav-menue-leave-active > #nav {
  transition: all .5s;
}
.nav-menue-enter > #nav {
  transform: translateX(30%);
}
.nav-menue-leave-to > #nav {
  transform: translateX(30%);
}

</style>
<template>
  <div class='container' @contextmenu.prevent="$refs.ctxMenu.open">
    <transition name='nav-menue'>
      <HumbergerMenu v-show='humbergerMenuFlg' v-on:multiHundler='multiHundler'></Humbergermenu>
    </transition>
    <ChartModal v-show='chartModalFlg' v-on:multiHundler='multiHundler'></ChartModal>
    <MapOption v-show='mapOptionFlg' v-on:multiHundler='multiHundler'></MapOption>
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
import { mapState, mapGetters } from "vuex"
import contextMenu from 'vue-context-menu'
import ChartModal from './ChartModal.vue'
import HumbergerMenu from './HumbergerMenu.vue'
import MapOption from './MapOption.vue'

export default {
  name: 'Map',
  components:{
    contextMenu,
    ChartModal,
    HumbergerMenu,
    MapOption
  },
  data(){
    return {
      humbergerMenuFlg:false,
      chartModalFlg: false,
      mapOptionFlg: false,
      mapObj : null,
      plineObj : null,
      markers : [], // L.marker(~~) で作られたマーカーオブジェクトが入ってる配列
      latlngs : [], // マーカーの緯度経度。これはいらないかもしれない
      map_layers :{'basemap':null,'layer':[]} //現在適応しているレイヤーのオブジェクトが入ってる
    }
  },
  methods:{
    multiHundler(selecter){
      /*** 指示を受けて実行するのが主な機能 */
      switch(selecter){
        case 'changeChartModalState':
          if(this.humbergerMenuFlg) this.humbergerMenuFlg = !this.humbergerMenuFlg
          this.chartModalFlg = !this.chartModalFlg
          break;
        case 'clearAll':
          if(this.humbergerMenuFlg) this.humbergerMenuFlg = !this.humbergerMenuFlg
          this.clearAll()
          break
        case 'changeMapOption':
          if(this.humbergerMenuFlg) this.humbergerMenuFlg = !this.humbergerMenuFlg
          this.mapOptionFlg = !this.mapOptionFlg
          break
        case 'changeMenueState':
          this.humbergerMenuFlg = !this.humbergerMenuFlg
          break
      }
    },
    initObj(){
      /** マップオブジェクトとラインオブジェクトの生成 */
      this.mapObj = L.map( 'Map', { center: L.latLng( 35.440, 139.824 ), zoom: 11,worldCopyJump: true} )
      this.plineObj = L.polyline(this.latlngs, { color: 'red', weight: 5, bubblingMouseEvents: false, edit_with_drag: true }).addTo(this.mapObj)
    },
    showMap(){
      /** マップのレンダリング */

      //open street map
      const osm_map = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,'})
      //ocean base map
      const obm_map = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',{attribution: 'Map data'})
      // 国土地理院
      const gsi_map = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',{attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"})
      
      const Base_Maps = {osm:osm_map,obm:obm_map,gsi:gsi_map}
      
      /*
      const Layers = {
        seamark:L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png')
      };
      */

      // 現在のベースマップ削除
      if(this.map_layers.basemap){
        console.log(this.mapObj.hasLayer(this.map_layers.basemap));
        this.mapObj.removeLayer(this.map_layers.basemap);
      }
      // 現在のベースマップ更新
      let selected_key = this.map_data['basemap']
      Base_Maps[selected_key].addTo(this.mapObj);
      this.map_layers.basemap = Base_Maps[selected_key]


      // レイヤーを表示するかどうか
        /*
      for(let [layer_key,isShow] of Object.entries(this.map_data['layer'])){
        console.log([layer_key,isShow])
        console.log(Layers[layer_key])

        if(false){
          Layers[layer_key].addTo(this.mapObj)
          this.map_layers.push(Layers[layer_key])
        }
        */

    },
    showCordinateOfMouse(){
      /** マウスの座標を表示 */

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
      /**ハンバーガーメニュー設置 */

      //右上にdivコントロールを表示
      let latloninfo = L.control({ position: "topright" });
      latloninfo.onAdd = function () {
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
    putMarker(v,marker_id){
      /** マーカーを置くための関数 */
      
      let marker = L.marker(v.latlng, { icon: L.divIcon( { className: 'red marker', iconSize: [ 16, 16 ] } ), id:marker_id})
                .on('click', this.delMaker)
                .bindPopup((v)=>{ // ポップアップ設定
                  let truelng = this.parseLng(v._latlng.lng);
                  return 'lat: '+v._latlng.lat.toFixed(3)+'<br>long: '+truelng
                  })
                .on('mouseover', function () {this.openPopup();});
      this.mapObj.addLayer(marker);
      this.markers.push(marker);
      // マーカー間に線を引く
      this.latlngs.push(v.latlng);
      this.plineObj.addLatLng(v.latlng);
    },
    putMarkesrsOflocalStorage(){
      /** localstrage上のデータからマーカーをおく */
      const marker_data = this.marker_data
      for(let v of marker_data){
        this.putMarker(v,v.id)
      }
    },
    putMarkerAtClickPoint(){
      /** クリックしたところにマーカーをおく */

      this.mapObj.on('click',(e)=>{
          console.dir(e)
          const marker_id = Math.random().toString(32).substring(2)
          this.putMarker(e,marker_id)
          const some_marker_data = {id:marker_id,latlng:{"lat": e.latlng.lat,"lng": e.latlng.lng}, "other":{}, "bear":"-","dist":"-" }
          this.$store.commit('pushMarkerData',{'some_marker_data':some_marker_data});
          this.save()
          }
        )
    },
    parseLng(row_lng){
      /** 経度を修正する */

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
      /** マーカーとライン削除 */
      const latlngs_id = this.getMarkerIDs


      let index = latlngs_id.indexOf(e.target.options.id);
      console.log('index: '+index)
      this.markers.splice(index,1);
      this.latlngs.splice(index,1);
      this.$store.commit('delMarkerData',{'index':index});
      this.mapObj.removeLayer(e.target);
      this.plineObj.setLatLngs(this.latlngs);
      this.save()
    },
    clearAll(){
      /** マップ上のすべてのラインを削除 */

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
        marker_data: state => state.marker_data,
        map_data:state => state.map_data
    }),
    ...mapGetters([
      'getMarkerIDs'
    ])
  },
  beforeCreate() {
    // LocalStorageからデータ読込
    this.$store.dispatch('doLoad')
  },
  mounted() {
    this.initObj();
    this.showMap();
    this.putMarkerAtClickPoint();
    this.showCordinateOfMouse();
    this.putMarkesrsOflocalStorage()
    this.setHumbergerMenu();

    // storeのマップ情報が変わったら再レンダリング
    this.$store.subscribe((mutation) => {
      if (Array('changeBaseMap', 'changeLayer').indexOf(mutation.type) !== -1) {
        this.showMap();
      }
    })



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

/** メニュー表示アニメーション */
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

#humbergermenue{
  font-family: 'Noto Sans', sans-serif;
  font-size: 1.8em;
}

</style>
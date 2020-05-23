import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    map_data: {'basemap':'osm','layers':['osm']}, // マップ情報 これは初期値
    marker_data : [] // 各makerの緯度経度が入ってる。[{"latlng": {"lat": ****,"lng": ****},"other": {},"bear": "-","dist": "-"},{..}]
        },
  mutations: {
    save(state){
      /** localstrageに保存 */
      localStorage.setItem('store',JSON.stringify(state))
    },
    load(state){
      /** localstrageから取得 */
      if (localStorage.getItem('store')) {
          const store = JSON.parse(localStorage.getItem('store'))
          this.replaceState(Object.assign(state, store))
        }
    },
    updateMarkerData(state,payload){
      /** これを使うのはClearAllのとき */
      state.marker_data = payload.marker_data
    },
    pushMarkerData(state,payload){
      /** これを使うのはClearAllのとき */
      state.marker_data.push(payload.some_marker_data)
      if(state.marker_data.length > 1) {
        // state.marker_data.length-1はpushしたもののindex
        calcDistAndBear(state.marker_data,state.marker_data.length-1)
      }
      console.log(JSON.stringify(state.marker_data,null,'\t'));
    },
    delMarkerData(state,payload){
      /** マーカー削除及び距離と方位の再計算*/
      state.marker_data.splice(payload.index,1)
      
      if(state.marker_data.length >= 2) {
        if(payload.index == 0){
          // index:0を削除したときは、index:1のものを0番目にするのでそのための処理が必要
          state.marker_data[0].bear = '-'
          state.marker_data[0].dist = '-'
          calcDistAndBear(state.marker_data,1) // 0番目と1番目で比較
        }else{
          calcDistAndBear(state.marker_data,payload.index)
        }
      }
      console.log(JSON.stringify(state.marker_data,null,'\t'));
    },
    changeBaseMap(state,payload){
      /**  */
      console.log('basemap changed')
      state.map_data['basemap'] = payload;
      
    },
    changeLayer(state,payload){
      /**  */
      console.log('layer changed')
      state.map_data['layers'] = payload;
      
    }
  },
  getters:{
     getTotalDist(state){
        /** 総距離を計算 */
        let totaldist = 0
        state.marker_data.forEach((elm,i)=>{if(i>0){totaldist+=parseFloat(elm.dist)}})
        return totaldist.toFixed(2)
     },
     getMarkerIDs(state){
         /** idのみの配列を取得 */
        return state.marker_data.map(marker => marker.id)
     }
  },
  actions: {
    doSave({commit}) {
      commit('save')
    },
    doLoad({commit}) {
      commit('load')
    }
  }
})


export const calcDistAndBear = function(markers,index){
  /* 
    与えられたindexのマーカーにDistとBearingを与える
    indexとinxex-1のマーカーを比較して求める。
  */
  console.log(index)
  console.log(markers)
  let marker = markers[index]
  let ex_marker = markers[index-1] 
  console.dir(marker)
  let delta_lat = Math.abs(ex_marker.latlng.lat-marker.latlng.lat)
  let delta_lng = Math.abs(ex_marker.latlng.lng-marker.latlng.lng)
  let bearing = Math.atan(delta_lat/delta_lng)*180/Math.PI
  let dist = Math.abs(60*delta_lng/Math.cos(bearing))  // ここは中文緯度、漸近緯度、距刀剣 などちゃんと分ける
  if(marker.latlng.lat-ex_marker.latlng.lat>0 && marker.latlng.lng-ex_marker.latlng.lng>0){      //NE方向へ
    bearing = 90 - bearing
  }else if(marker.latlng.lat-ex_marker.latlng.lat>0 && marker.latlng.lng-ex_marker.latlng.lng<0){ //NW方向へ
    bearing = 270 + bearing
  }else if(marker.latlng.lat-ex_marker.latlng.lat<0 && marker.latlng.lng-ex_marker.latlng.lng<0){ //SW方向へ
    bearing = 270 - bearing
  }else if(marker.latlng.lat-ex_marker.latlng.lat<0 && marker.latlng.lng-ex_marker.latlng.lng>0){ // SE方向へ
    bearing = 90 + bearing
  }

  marker["bear"] = bearing.toFixed(2)
  marker["dist"] = dist.toFixed(2)
 }






import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  //plugins: [createPersistedState()],
  state: {
    map_data: {'basemap':'osm','layer':{'seamark':true}}, // マップ情報 これは初期値
    marker_data : [] // 各makerの緯度経度が入ってる。[{"latlng": {"lat": ****,"lng": ****},"other": {},"bear": "-","dist": "-"},{..}]
        },
  mutations: {
    save(state){
        localStorage.setItem('store',JSON.stringify(state))
    },
    load(state){
        if (localStorage.getItem('store')) {
            const store = JSON.parse(localStorage.getItem('store'))
            this.replaceState(Object.assign(state, store))
          }
    },
    updateMarkerData(state,payload){
      state.marker_data = payload.marker_data
    },
    pushMarkerData(state,payload){
      state.marker_data.push(payload.some_marker_data)
      if(state.marker_data.length > 1) {
        updateDistAndBear(state.marker_data,state.marker_data.length-1)
      }
      console.log(JSON.stringify(state.marker_data,null,'\t'));
    },
    delMarkerData(state,payload){
      state.marker_data.splice(payload.index,1)
      if(state.marker_data.length > 1 && state.marker_data.length != payload.index) {
        updateDistAndBear(state.marker_data,payload.index)
      }
      console.log(JSON.stringify(state.marker_data,null,'\t'));
    },
    changeBaseMap(state,payload){
      state.map_data['basemap'] = payload;
      console.log('basemap changed')
      //console.dir(state.map_data)
    },
    changeLayer(state,payload){
      state.map_data['layer'] = payload;
      console.log('layer changed')
      //console.dir(state.map_data)
    },
  },
  getters:{
     getTotalDist(state){
        let totaldist = 0
        state.marker_data.forEach((elm,i)=>{if(i>0){totaldist+=parseFloat(elm.dist)}})
        return totaldist.toFixed(2)
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


export const updateDistAndBear = function(markers,index){
  /* 
    与えられたindexのマーカーにDistとBearingを与える
    indexとinxex-1のマーカーを比較して求める。
  */
  console.log(index)
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






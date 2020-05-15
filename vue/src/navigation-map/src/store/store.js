import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  //plugins: [createPersistedState()],
  state: {
    marker_data : [] // 各makerの緯度経度が入ってる。添字番号はmarker_dataと一致 [{"lat": ***,"lng": *** },{"lat": *** ,"lng": *** },]
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
    },
    delMarkerData(state,payload){
        state.marker_data.splice(payload.index,1)
    },
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


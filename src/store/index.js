import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: "0ZgyPnMBptn91BSdo5JXU4jvYNYB7puUnQzkXKP81T9PY67NeKiuOgIn%2baQmDk8zPmd9yhslatMa%2b7OGZFsEaw%3d%3d",
    chargeDatas: [],

  },
  getters: {
    chargeData: state => {
      let datas = []
      state.chargeDatas.forEach(key => {
        datas.push({
          title: key.statNm,
          latlng: new kakao.maps.LatLng(Number(key.lat), Number(key.lng)),
        })
      });
      // for test
      datas = datas.slice(0, 100)
      return datas
    }
  },
  mutations: {
    setData(state, payload) {
      state.chargeDatas = payload
    }
  },
  actions: {
    loadDatas ({ commit, state }, payload) {
      axios.get(`/openapi/services/EvCharger/getChargerInfo?serviceKey=${state.key}`)
        .then(res => {
          // handle success
          console.log(res);
          commit('setData', res.data.items[0].item)
        })
        .catch(err => {
          // handle error
          console.log(err);
        })
        .then(() => {
          // always executed
        });
    }
  },
  modules: {
  }
})

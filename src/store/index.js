import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import firebase from 'firebase/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: "0ZgyPnMBptn91BSdo5JXU4jvYNYB7puUnQzkXKP81T9PY67NeKiuOgIn%2baQmDk8zPmd9yhslatMa%2b7OGZFsEaw%3d%3d",
    chargeDatas: [],
    checkLoginData: null
  },
  getters: {
    apiData: state => {
      let newDatas = {}
      let positionArr = []
      
      state.chargeDatas.forEach(key => {
        positionArr.push({
          statNm: key.statNm,
          statId: key.statId,
          chgerId: key.chgerId,
          chgerType: key.chgerType,
          addr: key.addr,
          lat: +key.lat,
          lng: +key.lng,
          useTime: key.useTime,
          busiId: key.busiId,
          busiNm: key.busiNm,
          busiCall: key.busiCall,
          stat: +key.stat,
          statUpdDt: key.statUpdDt,
          powerType: key.powerType,
          zcode: key.zcode,
          parkingFree: key.parkingFree,
          note: key.note
        })
      })

      newDatas.datas = positionArr

      return newDatas
    }
  },
  mutations: {
    setData(state, payload) {
      state.chargeDatas = payload
    },
    setLoginData(state, payload) {
      state.checkLoginData = payload
    }
  },
  actions: {
    loadDatas ({ commit, state }) {
      axios.get(
        process.env.NODE_ENV === 'production'
        ? `http://open.ev.or.kr:8080/openapi/services/EvCharger/getChargerInfo?serviceKey=${state.key}`
        : `/openapi/services/EvCharger/getChargerInfo?serviceKey=${state.key}`
      )
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
    },
    checkLogin({ commit }) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          commit('setLoginData', 1)
        } else {
          commit('setLoginData', 0)
        }
      });
    }
  },
  modules: {
  }
})

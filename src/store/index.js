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
    // chargeData: state => {
    //   let newDatas = []
      
    //   state.chargeDatas.forEach(key => {
    //     newDatas.push({
    //       title: key.statNm,
    //       latlng: new kakao.maps.LatLng(+key.lat, +key.lng),
    //       stat: +key.stat[0]
    //     })
    //   })
    //   // for test
    //   // newDatas = newDatas.slice(0, 100)
    //   return newDatas
    // },
    latlng: state => {
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
    },
    // chargeDataPre: state => {
    //   let tempDatas = []
    //   console.log(state.chargeDatas)
    //   tempDatas.push(state.chargeDatas[0]);
    //   for(var i = 1; i < state.chargeDatas.length; i++) {
    //     if(state.chargeDatas[i].statId === state.chargeDatas[i-1].statId) {
    //       i === 1 ? tempDatas = [] : ''
    //       tempDatas.push({
    //         statNm: state.chargeDatas[i].statNm,
    //         statId: state.chargeDatas[i].statId,
    //         chgerId: [state.chargeDatas[i-1].chgerId, state.chargeDatas[i].chgerId],
    //         chgerType: [state.chargeDatas[i-1].chgerType, state.chargeDatas[i].chgerType],
    //         addr: state.chargeDatas[i].addr,
    //         lat: state.chargeDatas[i].lat,
    //         lng: state.chargeDatas[i].lng,
    //         useTime: state.chargeDatas[i].useTime,
    //         busiId: state.chargeDatas[i].busiId,
    //         busiNm: state.chargeDatas[i].busiNm,
    //         busiCall: state.chargeDatas[i].busiCall,
    //         stat: [state.chargeDatas[i-1].stat, state.chargeDatas[i].stat],
    //         statUpdDt: [state.chargeDatas[i-1].statUpdDt, state.chargeDatas[i].statUpdDt],
    //         powerType: [state.chargeDatas[i-1].powerType, state.chargeDatas[i].powerType],
    //         zcode: state.chargeDatas[i].zcode,
    //         parkingFree: state.chargeDatas[i].parkingFree,
    //         note: state.chargeDatas[i].note,
    //       })
    //     }else {
    //       tempDatas.push(state.chargeDatas[i])
    //     }
    //   }
    //   return tempDatas
    // }
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

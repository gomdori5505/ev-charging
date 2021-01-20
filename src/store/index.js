import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import firebase from 'firebase/app'
import router from '../router';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    key: "0ZgyPnMBptn91BSdo5JXU4jvYNYB7puUnQzkXKP81T9PY67NeKiuOgIn%2baQmDk8zPmd9yhslatMa%2b7OGZFsEaw%3d%3d",
    chargeDatas: [],
    checkLoginData: null,
    uidData: null,
    snackBarStatus: false,
    snackBarText: null,
    checkFavoriteStatus: false,
    email: null,
    nickName: null,
    updateUserDataResult: false,
    favoriteDatas: null
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
      state.checkLoginData = payload.login
      state.uidData = payload.uid
    },
    setSnackBarOpen(state, payload) {
      state.snackBarStatus = true
      state.snackBarText = payload
    },
    setCheckFavorite(state, payload) {
      payload
        ? (state.checkFavoriteStatus = {
          status: payload.value,
          value: payload.value
        })
        : (state.checkFavoriteStatus = {
          status: false,
          value: null
        })
    },
    setGetUserData(state, payload) {
      state.email = payload.email,
      state.nickName = payload.nickName
    },
    setUpdateUserData(state, payload) {
      state.updateUserDataResult = payload
    },
    setFavoriteList(state, payload) {
      state.favoriteDatas = payload
    }
  },
  actions: {
    loadEvDatas({ commit, state }) {
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
          commit('setLoginData', {
            login: 1,
            uid: user.uid
          })
        } else {
          commit('setLoginData', {
            login: 0,
            uid: false
          })
        }
      })
    },
    snackBarOpen({ commit }, payload) {
      commit('setSnackBarOpen', payload)
    },
    checkFavorite({ commit }, payload) {
      firebase.database().ref('favorite').child(payload.userId).child(payload.statId).once('value').then((data) => {
        commit('setCheckFavorite', data.val()) // data.val() -> 존재하면 null이 아니다!! {value: true} or {value: false} or null
      })
    },
    proceedFavorite({ commit }, payload) {
      switch (payload.type) {
        case 'create':
          firebase.database().ref('favorite').child(payload.userId).child(payload.statId).set({
            value: payload.value
          })
          commit('setCheckFavorite', {value: payload.value})
          break;
      
        default:
          firebase.database().ref('favorite').child(payload.userId).child(payload.statId).update({
            value: payload.value
          })
          commit('setCheckFavorite', {value: payload.value})
          break;
      }
    },
    createUser({ commit }, payload) {
      firebase.database().ref('user').child(payload.userId).set({
        email: payload.email,
        nickName: payload.nickName
      })
      
    },
    getUserData({ commit }, payload) {
      firebase.database().ref('user').child(payload).once('value').then((data) => {
        commit('setGetUserData', data.val())
      })
    },
    updateUserData({ commit }, payload) {
      // email auth
      firebase.auth().currentUser.updateEmail(payload.email).then(() => { // auth 내 이메일 변경
        console.log('success to update the email on Auth')
        // email DB
        firebase.database().ref('user').child(firebase.auth().currentUser.uid).update({ // database user 내 이메일 변경
          email: payload.email
        }, error => {
          if(error) {
            console.log(error)
            commit('setUpdateUserData', false)
          } else {
            console.log('success to update the email on DB')
            // nickName
            firebase.database().ref('user').child(firebase.auth().currentUser.uid).update({ // database user 내 이메일 변경
              nickName: payload.nickName
            }, error => {
              if(error) {
                console.log(error)
                commit('setUpdateUserData', false)
              } else {
                console.log('success to update the nickName on DB')
                // password
                firebase.auth().currentUser.updatePassword(payload.password).then(() => {
                  console.log('success to update the password on Auth')
                  router.push({
                    name: 'mypage',
                    params: {
                      page: 'profile'
                    }
                  })
                  commit('setSnackBarOpen', '프로필 수정이 완료되었습니다.')
                }).catch(error => {
                  console.log(error)
                  commit('setUpdateUserData', false)
                })
              }
            })
          }
        })
      }).catch(error => {
        console.log(error)
        commit('setUpdateUserData', false)
      });
    },
    getFavoriteList({ commit }, payload) {
      let favoriteDatas = []
      firebase.database().ref('favorite').child(payload.uidData).once('value').then((data) => {
        for (const statId in data.val()) {
          if(data.val()[statId].value === true) {
            payload.apiData.forEach(e => {
              if(statId === e.statId) {
                favoriteDatas.push({
                  statId: e.statId,
                  statNm: e.statNm,
                  stat: e.stat,
                  addr: e.addr,
                  useTime: e.useTime
                })
              }
            });
          }
        }
        favoriteDatas = _.uniqBy(favoriteDatas, 'statId');
        commit('setFavoriteList', favoriteDatas)
      })

      
    }
  },
  modules: {
  }
})

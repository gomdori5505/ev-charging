<template>
  <div id="detailDialog" v-if="dialog">
    <v-dialog
      v-model="dialog"
      width="600px"
    >
      <v-card v-click-outside="closeDialog">
        <v-card-title justify="center">
          <span class="headline">
            <v-icon
              v-if='checkFavoriteStatus.status === true'
              color="yellow darken-1"
              size="30"
              @click="clickFavoriteStar()"
            >
              {{ favoriteStarMdi.full }}
            </v-icon>
            <v-icon
              v-else
              color="yellow darken-1"
              size="30"
              @click="clickFavoriteStar()"
            >
              {{ favoriteStarMdi.empty }}
            </v-icon>
            <span>{{ apiData.statNm }}</span>
          </span>
        </v-card-title>
        <v-card-text>
          사용가능시간 : {{ useTimeSet(apiData.useTime) }}
        </v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">
                  구분
                </th>
                <th class="text-center">
                  충전기 타입
                </th>
                <th class="text-center">
                  운전상태
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="apiData.countOfChger === 1"
              >
                <td class="text-xs-center">{{ apiData.powerType }}</td>
                <td class="text-xs-center">{{ charTypeSet(apiData.chgerType) }}</td>
                <td class="text-xs-center">{{ statSet(apiData.stat).status }}<br>({{ statSet(apiData.stat).reason }})</td>
              </tr>
              <tr
                v-else-if="apiData.countOfChger > 1"
                v-for="(item, i) in arrData"
                :key=i
              >
                <td class="text-xs-center">{{ item.powerType }}</td>
                <td class="text-xs-center">{{ charTypeSet(item.chgerType) }}</td>
                <td class="text-xs-center">{{ statSet(item.stat).status }}<br>({{ statSet(item.stat).reason }})</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-card-subtitle>
          상세정보
        </v-card-subtitle>
        <v-card-text>
          주소 : {{ apiData.addr }}<br>
          운영기관 : {{ apiData.busiNm }}<br>
          연락처 : {{ apiData.busiCall }}<br>
          주차비 : {{ parkingFreeSet(apiData.parkingFree) }}<br>
          참고사항 : {{ apiData.note }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="closeDialog"
          >
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { dataSetDes } from '@/mixins/dataSetDes'
import { mapState } from 'vuex'

export default {
  name: 'DetailDialog',
  data() {
    return {
      dialog: false,
      arrData: [],
      favoriteStarMdi: {
        full: 'mdi-star',
        empty: 'mdi-star-outline'
      }
    }
  },
  props: ['open', 'apiData'],
  watch: {
    open(newVal) {
      this.dialog = newVal

      // 열릴때만 실행되어야된다. 닫힐때는 실행되면 안됨...
      newVal && (
        this.$store.dispatch('checkFavorite', {
          userId: this.uidData,
          statId: this.apiData.statId
        })
      )
    },
    apiData(newVal) {
      if(newVal.countOfChger > 1) {
        this.arrData = []
        for(let i = 0; newVal.countOfChger > i; i++) {
          this.arrData.push({
            powerType: newVal.powerTypeArr[i],
            chgerType: newVal.chgerTypeArr[i],
            stat: newVal.statArr[i]
          })
        }
      }
    }
  },
  computed: {
    ...mapState([
      'checkLoginData',
      'uidData',
      'checkFavoriteStatus'
    ])
  },
  created() {
    this.$store.dispatch('checkLogin')
  },
  methods: {
    closeDialog: function() {
      this.$emit('close')
    },
    clickFavoriteStar() {
      if(this.checkLoginData === 1) {
        if(!this.checkFavoriteStatus.status && !this.checkFavoriteStatus.value) { // 즐찾 한적이 없다. create(value: true) 필요
          this.$store.dispatch('proceedFavorite', {
            type: 'create',
            userId: this.uidData,
            statId: this.apiData.statId,
            value: true
          })
        } else { //즐찾 한적이 있다. {value: true} or {value: false} 중 하나
          if(this.checkFavoriteStatus.status && this.checkFavoriteStatus.value) { // 즐찾 되어있다. value를 false 필요
            this.$store.dispatch('proceedFavorite', {
              type: 'update',
              userId: this.uidData,
              statId: this.apiData.statId,
              value: !this.checkFavoriteStatus.value
            })
          } else { // 즐찾 안되어있다. value를 true 필요
            this.$store.dispatch('proceedFavorite', {
              type: 'update',
              userId: this.uidData,
              statId: this.apiData.statId,
              value: true
            })
          }
        }
      } else {
        this.$store.dispatch('snackBarOpen', '로그인이 필요한 서비스입니다.')
      }
    }
  },
  mixins: [dataSetDes]
}
</script>
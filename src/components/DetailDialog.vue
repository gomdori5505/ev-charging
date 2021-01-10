<template>
  <div id="detailDialog" data-app v-if="apiData">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        width="600px"
      >
        <v-card v-click-outside="closeDialog">
          <v-card-title>
            <span class="headline">{{ apiData.statNm }}</span>
          </v-card-title>
          <v-card-text>
            사용가능시간 : {{ apiData.useTime }}
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
                <tr>
                  <td class="text-xs-center">{{ apiData.powerType }}</td>
                  <td class="text-xs-center">{{ charTypeSet(apiData.chgerType) }}</td>
                  <td class="text-xs-center">{{ statSet(apiData.stat).status }}<br>{{ statSet(apiData.stat).reason }}</td>
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
              color="green darken-1"
              text
              @click="closeDialog"
            >
              닫기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { dataSetDes } from '@/mixins/dataSetDes'

export default {
  name: 'DetailDialog',
  data() {
    return {
      dialog: false
    }
  },
  props: ['open', 'apiData'],
  watch: {
    open(newVal) {
      this.dialog = newVal
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  },
  mixins: [dataSetDes]
}
</script>
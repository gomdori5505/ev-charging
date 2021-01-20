<template>
  <v-card>
    <v-card-title>
      나의 즐겨찾기
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="검색"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-if="favoriteDatas"
      :headers="headers"
      :items="favoriteDatas"
      :search="search"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { dataSetDes } from '@/mixins/dataSetDes'
import { mapState, mapGetters } from 'vuex'

  export default {
    data () {
      return {
        dialog: false,
        dialogDelete: false,
        search: '',
        headers: [
          {
            text: '충전소명',
            align: 'start',
            sortable: false,
            value: 'statNm',
          },
          { text: '운전상태', value: 'stat' },
          { text: '주소', value: 'addr' },
          { text: '사용가능시간', value: 'useTime' },
          { text: '제외', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          statNm: '',
          stat: '',
          addr: '',
          useTime: '',
          actions: '',
        },
        defaultItem: {
          statNm: '',
          stat: '',
          addr: '',
          useTime: '',
          actions: '',
        }
      }
    },
    computed: {
      ...mapState([
        'uidData',
        'favoriteDatas'
      ]),
      ...mapGetters(['apiData'])
    },
    watch: {
      apiData(newVal) {
        this.$store.dispatch('checkLogin')
        this.$store.dispatch('getFavoriteList', {
          uidData: this.uidData,
          apiData: this.apiData.datas
        })
      },
      favoriteDatas(newVal) {
        newVal.forEach(e => {
          if(typeof e.stat === 'number') {
            e.stat = this.statSet(e.stat).status+'\n('+this.statSet(e.stat).reason+')'
          }
        });
      }
    },
    created() {
      this.$store.dispatch('loadEvDatas')
    },
    methods: {
      deleteItem (item) {
        this.favoriteDatas.splice(this.favoriteDatas.findIndex(fd => fd.statId === item.statId), 1)
        this.$store.dispatch('proceedFavorite', {
              type: 'update',
              userId: this.uidData,
              statId: item.statId,
              value: false
            })
      }
    },
    mixins: [dataSetDes]
  }
</script>
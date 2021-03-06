<template>
  <div id="home">
    <vue-daum-map
      :appKey="appKey"
      :center.sync="center"
      :level.sync="level"
      :mapTypeId="mapTypeId"
      :libraries="libraries"
      @load="onLoad"
      :style="mapStyle"/>
    <DetailDialog :open="dialog" :apiData="propsApiData" @close=closeDialog />
  </div>
</template>

<script>
import VueDaumMap from 'vue-daum-map'
import { mapGetters } from 'vuex'
import { dataSetDes } from '@/mixins/dataSetDes'
import DetailDialog from '../components/DetailDialog'

export default {
  name: "Home",
  components: {
    VueDaumMap,
    DetailDialog
  },
  data() {
    return {
      appKey: '004959fe9614a4fade802f0228b7171c', // 테스트용 appkey
      center: { lat: 37.571076, lng: 126.995880 }, // 지도의 중심 좌표
      level: 5, // 지도의 레벨(확대, 축소 정도),
      mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
      libraries: ['services', 'clusterer', 'drawing'], // 추가로 불러올 라이브러리
      map: null, // 지도 객체. 지도가 로드되면 할당됨.
      mapWidth: window.innerWidth,
      mapHeight: window.innerHeight,
      dialog: null,
      propsApiData: null
    };
  },
  computed: {
    mapStyle() {
      return `width:${this.mapWidth}px; height:${this.mapHeight-64}px;`
    }
    ,
    ...mapGetters(['apiData']),
  },
  watch: {
    apiData(newVal) {
      this.setMarkerClusterer(newVal, this.map)
    }
  },
  methods: {
    onLoad(map) {
      this.map = map
    },
    setMarkerClusterer(apiData, map, dialog) {
      let clusterer = new window.kakao.maps.MarkerClusterer({
        map: this.map,
        averageCenter: true,
        minLevel: 10,
      });
      
      let markers = apiData.datas.map(data => {
        let marker = new kakao.maps.Marker({
          position : new kakao.maps.LatLng(data.lat, data.lng),
          image: this.markerImage(data)
        });
        
        // marker priority
        data.stat !== 2
          && (
            data.stat === 3
              ? marker.setZIndex(-1)
              : marker.setZIndex(-2)
          )
          
        let content = '<div class="wrap" style="background-color: white; text-align: center; padding: 0 10px;">' + 
          '    <div>' + 
          '        <div>' + 
          `            ${data.statNm}` +
          '        </div>' + 
          '        <div>' + 
          '            <div>' + 
          `                <div>${this.charTypeSet(data.chgerType)}</div>` + 
          `                <div>${this.statSet(data.stat).status}</div>` + 
          '            </div>' + 
          '        </div>' + 
          '    </div>' +    
          '</div>';

        let customOverlay = new kakao.maps.CustomOverlay({
          content: content,
          position: new kakao.maps.LatLng(data.lat, data.lng),
          yAnchor: 1.7
        })

        kakao.maps.event.addListener(marker, 'mouseover', this.makeOverListener(map, customOverlay))
        kakao.maps.event.addListener(marker, 'mouseout', this.makeOutListener(customOverlay))
        kakao.maps.event.addListener(marker, 'click', () => {
          
          // dialog click outside 클릭 동시 중복 방지
          setTimeout(() => {
            this.dialog = true
          }, 10);
          
          this.sendDialog(data, apiData)
        })
        return marker
      });

      clusterer.addMarkers(markers)
    },
    markerImage(data) {
      let imageSrc = null
      data.stat === 2
          ? imageSrc = require("@/assets/img/charge_enable.png")
          : data.stat === 3
            ? imageSrc = require("@/assets/img/charge_charging.png")
            : imageSrc = require("@/assets/img/charge_unable.png")
      let imageSize = new kakao.maps.Size(24, 35)
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

      return markerImage
    },
    makeOverListener(map, customOverlay) {
      return function() {
        customOverlay.setMap(map);
      };
    },
    makeOutListener(customOverlay) {
      return function() {
        customOverlay.setMap(null);
      };
    },
    sendDialog(data, apiData) {
      let count = 0
      data.powerTypeArr = []
      data.chgerTypeArr = []
      data.statArr = []
      data.chgerIdArr = []
      
      apiData.datas.forEach(key => {
        if(data.statId === key.statId) {
          data.powerTypeArr.push(key.powerType)
          data.chgerTypeArr.push(key.chgerType)
          data.statArr.push(key.stat)
          data.chgerIdArr.push(key.chgerId)
          count++
        }
      });
      data.countOfChger = count

      // for dialog
      this.propsApiData = data
    },
    closeDialog() {
      this.dialog = false
    },
    handleResize() {
      this.mapWidth = window.innerWidth;
      this.mapHeight = window.innerHeight;
    }
  }
  ,
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.$store.dispatch('loadEvDatas')
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  mixins: [dataSetDes]
};
</script>
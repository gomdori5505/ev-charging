<template>
  <div id="home">
    <vue-daum-map
      :appKey="appKey"
      :center.sync="center"
      :level.sync="level"
      :mapTypeId="mapTypeId"
      :libraries="libraries"
      @load="onLoad"
      style="width:1000px; height:800px;"/>
    <DetailDialog :open="dialog" :apiData="propsApiData" @close=closeDialog />
  </div>
</template>

<script>
import VueDaumMap from 'vue-daum-map'
import { mapGetters } from 'vuex'
import { dataSetDes } from '@/mixins/dataSetDes'
import DetailDialog from '../components/DetailDialog'

export default {
  name: "App",
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
      dialog: null,
      propsApiData: null
    };
  },
  computed: {
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

        let content = '<div class="wrap" style="background-color: white; text-align: center; padding: 0 10px;">' + 
          '    <div class="info">' + 
          '        <div class="title">' + 
          `            ${data.statNm}` + 
          '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
          '        </div>' + 
          '        <div class="body">' + 
          '            <div class="desc">' + 
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
          this.dialog = false
          this.dialog = true
          // for dialog
          this.propsApiData = data
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
    closeDialog() {
      this.dialog = false
    }
  }
  ,
  created() {
    this.$store.dispatch('loadDatas')
  },
  mixins: [dataSetDes]
};
</script>
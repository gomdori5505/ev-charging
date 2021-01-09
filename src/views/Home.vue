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
  </div>
</template>

<script>
import VueDaumMap from 'vue-daum-map'
import { mapGetters } from 'vuex'

export default {
  name: "App",
  components: {
    VueDaumMap,
  },
  data() {
    return {
      appKey: '004959fe9614a4fade802f0228b7171c', // 테스트용 appkey
      center: { lat: 37.571076, lng: 126.995880 }, // 지도의 중심 좌표
      level: 5, // 지도의 레벨(확대, 축소 정도),
      mapTypeId: VueDaumMap.MapTypeId.NORMAL, // 맵 타입
      libraries: ['services', 'clusterer', 'drawing'], // 추가로 불러올 라이브러리
      map: null // 지도 객체. 지도가 로드되면 할당됨.
    };
  },
  computed: {
    ...mapGetters(['latlng']),
  },
  watch: {
    latlng(newVal) {
      this.setMarkerClusterer(newVal, this.map)
    }
  },
  methods: {
    onLoad(map) {
      this.map = map
    },
    setMarkerClusterer(latlng, map) {
      let clusterer = new window.kakao.maps.MarkerClusterer({
        map: this.map,
        averageCenter: true,
        minLevel: 10,
      });
      
      let markers = latlng.datas.map(data => {
        let marker = new kakao.maps.Marker({
          position : new kakao.maps.LatLng(data.lat, data.lng),
          image: this.markerImage(data)
        });

        let infowindow = new kakao.maps.InfoWindow({
          content: data.statNm
        })

        kakao.maps.event.addListener(marker, 'mouseover', this.makeOverListener(map, marker, infowindow))
        kakao.maps.event.addListener(marker, 'mouseout', this.makeOutListener(infowindow))

        return marker
      });

      clusterer.addMarkers(markers)
    },
    markerImage(data) {
      let imageSrc = null
      data.stat === 2
          ? imageSrc = require("@/assets/img/charge_enable.png")
          : data === 3
            ? imageSrc = require("@/assets/img/charge_charging.png")
            : imageSrc = require("@/assets/img/charge_unable.png")
      let imageSize = new kakao.maps.Size(24, 35)
      let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

      return markerImage
    },
    makeOverListener(map, marker, infowindow) {
      return function() {
        infowindow.open(map, marker);
      };
    },
    makeOutListener(infowindow) {
      return function() {
        infowindow.close();
      };
    }
  }
  ,
  created() {
    this.$store.dispatch('loadDatas')
  }
};
</script>
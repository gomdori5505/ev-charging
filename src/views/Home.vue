<template>
  <div id="home">
    <div id="map" style="width:1000px; height:800px;"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
let CustomMarker;

export default {
  name: "App",
  data() {
    return {
      
    };
  },
  computed: {
    ...mapGetters({
      chargeData: 'chargeData'
    }),
  },
  watch: {
    chargeData(newVal) {
      var mapContainer = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
      var mapOption = {
        //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(37.571076, 126.995880), //지도의 중심좌표.
        level: 5 //지도의 레벨(확대, 축소 정도)
      };

      var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
 
      // 마커를 표시할 위치와 title 객체 배열입니다 
      var positions = newVal;

      // 마커 이미지의 이미지 주소입니다
      var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
          
      for (var i = 0; i < positions.length; i ++) {
          
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 35);
        
        // 마커 이미지를 생성합니다    
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
        
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i].latlng, // 마커를 표시할 위치
          title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image : markerImage // 마커 이미지 
        });

        // 마커에 클릭 이벤트를 등록한다 (우클릭 : rightclick)
        kakao.maps.event.addListener(marker, 'click', function() {
          alert('마커를 클릭했습니다!');
        });

        // 마커에 표시할 인포윈도우를 생성합니다 
        var infowindow = new kakao.maps.InfoWindow({
          content: positions[i].title // 인포윈도우에 표시할 내용
        });

        // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
        // 이벤트 리스너로는 클로저를 만들어 등록합니다 
        // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
      }

      // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
      function makeOverListener(map, marker, infowindow) {
        return function() {
          infowindow.open(map, marker);
        };
      }

      // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
      function makeOutListener(infowindow) {
        return function() {
          infowindow.close();
        };
      }
    }
  },
  created() {
    this.$store.dispatch('loadDatas')
  }
};
</script>
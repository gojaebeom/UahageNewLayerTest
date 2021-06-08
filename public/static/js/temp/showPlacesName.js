"use strict"
const search = location.search.substring(1);
const data = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
let placeAddress = data["placeAddress"];
let placeName = data["placeName"];


//지도 초기값 설정
const mapContainer = document.getElementById('map');  
const mapOption = {
    center: new kakao.maps.LatLng(35.1449589, 126.9216603),  
    level:2
    };
//지도 생성
const map = new kakao.maps.Map(mapContainer, mapOption);  

var geocoder = new kakao.maps.services.Geocoder();
// 주소로 좌표를 검색합니다
geocoder.addressSearch(placeAddress, function(result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        var content =`<div style="padding: 1px 20px 1px 20px;  text-align: center;  border-radius:25px;  box-shadow:0px 3px 2px #888; background-color:#f06292;  background: #f06292     ;" >
                        <h1 class=test>${placeName}</h1>
                    </div>
        `;

        var customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: content,
            yAnchor: 1.0,
            xAnchor: 0.3,
        });
        map.setCenter(coords);
    }
});

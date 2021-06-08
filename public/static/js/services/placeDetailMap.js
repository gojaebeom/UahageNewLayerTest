"use strict";
import { getQuerystringInfo } from "../utils/qsParser.js";

// HTML 파일 내의 DOM을 모두 해석 했을 때 실행되는 이벤트 함수
document.addEventListener("DOMContentLoaded", async ( event ) => {
    //현재위치 파라미터로 받아오기
    const { placeAddress , placeName } = getQuerystringInfo();

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

            new kakao.maps.CustomOverlay({
                content: 
                `<div style="
                    padding: 1px 20px 1px 20px;  
                    text-align: center;  
                    border-radius:25px;  
                    box-shadow:0px 3px 2px #888; 
                    background-color:#f06292;  
                    background: #f06292;" 
                >
                    <h1 class=test>${placeName}</h1>
                </div>`,
                map: map,
                position: coords,
                yAnchor: 1.0,
                xAnchor: 0.3,
            });
            map.setCenter(coords);
        }
    });
});


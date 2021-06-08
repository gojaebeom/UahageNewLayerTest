"use strict"
import { kakaoMapInit, markerImgObj } from "../kakaoMap/kakao.js";
import { getQuerystringInfo } from "../utils/qsParser.js";

// HTML 파일 내의 DOM을 모두 해석 했을 때 실행되는 이벤트 함수
document.addEventListener("DOMContentLoaded", async ( event ) => {
    //현재위치 파라미터로 받아오기
    const { lat , lon } = getQuerystringInfo();
    
    //지도 초기값 설정
    const map = kakaoMapInit(lat, lon);

    //현재위치 마커 생성
    new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(lat, lon),
        image: new kakao.maps.MarkerImage(
            markerImgObj.userMarker, 
            markerImgObj.markerSize(34, 34), 
            markerImgObj.options
        ),
    });
});

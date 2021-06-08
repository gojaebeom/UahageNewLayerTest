"use strict";
// 마커 이미지 설정
export const markerImgObj = {
    userMarker: "https://uahage.s3.ap-northeast-2.amazonaws.com/map/path.gif",
    placeMarker: "https://uahage.s3.ap-northeast-2.amazonaws.com/map/maker.png",
    markerSize: (width, height) => new kakao.maps.Size(width, height),
    options: {
        offset: new kakao.maps.Point(13, 34)
    }
}

// 카카오 맵 생성 함수
export const kakaoMapInit = (lat, lon) => {
    //지도 초기값 설정
    const mapContainer = document.getElementById("map");
    console.log(mapContainer);
    const mapOption = {
        center: new kakao.maps.LatLng(lat, lon),
        level: 5
    };
    //지도 생성
    return new kakao.maps.Map(mapContainer, mapOption);
}

// 클러스터 생성
export const createClusterer = ( map ) => {
    return new kakao.maps.MarkerClusterer({
        map: map,  
        averageCenter: true,  
        minLevel: 5,  
        calculator: [10, 30, 50],
        disableClickZoom: true, 
        styles: [
            { 
                width: '50px',
                height: '50px',
                background: ' #ff6e7f',
                background: '-webkit-linear-gradient(to right,#ff6e7f, #f06292)',
                background: ' linear-gradient(to right, #ff6e7f, #f06292)',
                opacity: '0.7',
                borderRadius: '50%',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                lineHeight: '50px',
            },   
        ]   
    });
}
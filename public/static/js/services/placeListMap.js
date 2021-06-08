"use strict";
// import 문법을 사용하기 위해서는 사용되는 html 파일에서 
// script 태그의 타입으로 'module' 값을 명시해주어야 합니다.
import { getPlacesAPI } from "../apis/places.js";
import { createClusterer,  kakaoMapInit, markerImgObj } from "../kakaoMap/kakao.js";
import { getQuerystringInfo } from "../utils/qsParser.js";
import { calcDist } from "../utils/calcDist.js";
import { createLoadingContainer, removeLoadingContainer } from "../utils/loading.js";

// HTML 파일 내의 DOM을 모두 해석 했을 때 실행되는 이벤트 함수
document.addEventListener("DOMContentLoaded", async ( event ) => {
    // queryObj에는 장소에 관련된 정보들이 키:값 형태로 담겨있습니다. 
    // 현재 파일에서는 type, lat, lon만 쓸 것 이므로, 구조 분해 할당으로 필요한 값만 가져옵니다.
    // 나머지 값들은 getPlacesAPI 함수에서 데이터를 요청할 때 사용됩니다.
    const queryObj = getQuerystringInfo(); 
    const { type, lat, lon } = queryObj;

    // placeAPI 요청보다 맵을 먼저 생성시켜줍니다. 
    // 요청의 응답이 길어질수록 맵이 화면에 보이기까지 시간이 지연되기 때문입니다.
    const map = kakaoMapInit(lat, lon);

    // 맵이 완전이 로딩 될 때 까지 로딩컨텐츠 보여주기
    const loadingContainer = createLoadingContainer();

    // 장소 리스트 API를 요청하고 정상적으로 응답 받을 경우
    // res.data.data에 데이터를 받아옵니다.
    const res = await getPlacesAPI( queryObj );
    console.log(res); 
    const placeList = res.data.data;

    
    if( type.toUpperCase() === "FILTER" ) {
        new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lon),
            image: new kakao.maps.MarkerImage(
                markerImgObj.placeMarker, 
                markerImgObj.markerSize(23, 32), 
                markerImgObj.options
            ),
        });
    }else {
        new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lon),
            image: new kakao.maps.MarkerImage(
                markerImgObj.userMarker, 
                markerImgObj.markerSize(34, 34), 
                markerImgObj.options
            ),
        });
    }

    // 배열에 장소마커들을 모아두고 클러스터에게 전달해줍니다.
    // 클러스터 객체는 장소마커배열을 가지고 구역별로 데이터를 표시해줍니다.
    const clusterMakers = [];

    // 화면에 장소이름 오버레이가 표시되었는지 확인할 때 필요한 변수이며,
    // 띄울 오버레이를 이 변수에 할당하여 사용합니다.
    let clickedOverlay = null;

    // API 를 통해 가져온 장소리스트를 순회하며 맵에 장소마커들을 표시합니다.
    // 부가적으로 마커들을 클릭하여 오버레이를 띄우거나 사라지게 하는 
    // 이벤트들을 바인딩 시키는 로직도 존재합니다.
    placeList.map( item  => {
        const placeLat = item.lat;
        const placeLon = item.lon;

        const placeMarker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(placeLat, placeLon),
            image: new kakao.maps.MarkerImage(
                markerImgObj.placeMarker, 
                markerImgObj.markerSize(23, 32), 
                markerImgObj.options
            ),
        });
        
        // 마커를 클릭하면 표시할 장소명 오버레이 입니다.
        // 오버레이 또한 클릭 기능이 필요하기 때문에
        // 오버레이에서 내부 돔을 찾아 클릭 이벤트를 걸어줍니다.
        const placeTitleOverlay = new kakao.maps.CustomOverlay({
            content: 
            `<div class="custom-overlay"> 
                <a>
                    <span class="title">${ item.name }</span> 
                </a> 
            </div>`,
            position:new kakao.maps.LatLng(placeLat, placeLon),
            map: null,
            yAnchor: 2.2,
            xAnchor: 0.5,
            clickable: true,
        });
        const placeTitleOverlayDom = placeTitleOverlay.a.querySelector(".custom-overlay");
        placeTitleOverlayDom.addEventListener("click", ( event ) => {
            getPlaceDetailInfo( item );
        });

        // 각 장소마커들에게 클릭 이벤트를 걸어줍니다.
        // 조건으로 클릭된 오버레이가 존재할 경우 그 오버레이를 지우며
        // 기본적인 기능으로는 생성된 오버레이를 맵에 표시합니다.
        kakao.maps.event.addListener(placeMarker, "click", function() {
            if (clickedOverlay !== null) {
                clickedOverlay.setMap(null);
            }
            placeTitleOverlay.setMap(map);
            clickedOverlay = placeTitleOverlay;
        });

        // 맵을 클릭할 경우 발생하는 이벤트를 걸어줍니다.
        // 장소명을 나타내는 오버레이가 떠있을 경우 화면에서 지워줍니다.
        kakao.maps.event.addListener(map, "click", function(mouseEvent) {
            if (placeTitleOverlay !== null) {
                placeTitleOverlay.setMap(null);
            }
        });

        // 클러스터 마커에 정보를 저장합니다.
        clusterMakers.push(placeMarker);
    });

    // 화면에 모든 마커정보와 이벤트가 생성되었을 때 
    // 로딩 컨테이너를 제거시킵니다.
    removeLoadingContainer(loadingContainer);

    const cluster = createClusterer( map );
    cluster.addMarkers(clusterMakers);

    //클러스터 확대 
    kakao.maps.event.addListener(cluster, 'clusterclick', function(cluster) {
        const level = map.getLevel() - 1;
        map.setLevel(level, {
            anchor: cluster.getCenter()
        });
    });

    // 현재위치로 이동
    const nowPositionBtn = document.querySelector("#moveNowPositionBtn");
    nowPositionBtn.addEventListener('click', function( e ){
        let moveLatLon = new kakao.maps.LatLng(lat, lon);
        map.panTo(moveLatLon);
    });
});

// 플러터로 데이터를 전달하는 함수
function getPlaceDetailInfo(result) {
    console.log( result );
    //Print.postMessage(result);
}
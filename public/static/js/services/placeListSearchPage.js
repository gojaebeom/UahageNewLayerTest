"use strict";

import { getQuerystringInfo } from "../utils/qsParser";

const { keyword, lat, lon } = getQuerystringInfo();

function getResult(address) {
    var geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, function(result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
         //  result.La, result.Ma.
            console.log(result[0].x);
            location.href="/maps/show-place?type=filter&option=y&lat="+result[0].y+"&lon="+result[0].x+"&babyBed=&babyChair=&babyMenu=&babyTableware=&stroller=&diaperChange=&meetingRoom=&nursingRoom=&playRoom=&parking=&isBookmarke=";
         //   location.href="/maps/show-place?lat="+result[0].y+"&lon="+result[0].x+"&type=destination";
        }
    });
}

// 장소 검색 객체를 생성합니다
const ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
const infowindow = new kakao.maps.InfoWindow({
    zIndex: 1
});

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
    if (!keyword.replace(/^\\s+|\s+$/g, '')) {
        getResult('null');
        return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB, {
        location: new kakao.maps.LatLng(lat,lon)
    });
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        getResult('null');
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        getResult('null');
        return;
    }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
    let listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);
    for (let i = 0; i < places.length; i++) {
        let  itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
        fragment.appendChild(itemEl);
    }
    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
}
// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
    let address = "'" + places.address_name + "'";
    let el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
        '<div class="info" onclick="getResult(' + address + ')" >' +
        '   <h5 >' + places.place_name + '</h5>';
    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }
    itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';
    el.innerHTML = itemStr;
    el.className = 'item';
    return el;
}

function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}

searchPlaces();






const mapContainer = document.querySelector(".container");

export const createLoadingContainer = ( ) => {
    const loadingContainer = document.createElement("div");
    loadingContainer.setAttribute("class","loadingContainer");
    loadingContainer.innerHTML = `
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;">
        <img src="https://uahage.s3.ap-northeast-2.amazonaws.com/map/Plant.gif"/>
        <h5>장소 정보를 불러오는 중입니다..</h5>
    </div>`;
    
    mapContainer.appendChild(loadingContainer);
    return loadingContainer;
}

export const removeLoadingContainer = ( loadingContainer ) => {
    mapContainer.removeChild(loadingContainer);
}
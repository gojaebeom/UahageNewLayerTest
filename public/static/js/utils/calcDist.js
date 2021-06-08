// 거리계산 함수   
export const calcDist = (userLat, userLon, placeLat, placeLon) => {
    let ret = 0;
    const latA = 111;
    const lngB = 88.8;
    ret = Math.sqrt(
        Math.pow((Math.abs(userLat - placeLat) * latA), 2) +
        Math.pow((Math.abs(userLon - placeLon) * lngB), 2)
    ) * 1000; 
    return ret.toFixed(2);
}
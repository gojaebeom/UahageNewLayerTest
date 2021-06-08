"use strict";
const { queryBuilder } = require("../../../config/Database");

// 모든 장소 보기
exports.findAll = () => {
    const query = `
    select id, name, address, phone, examination_items , lat ,lon
    from p_hospitals;
    `;

    console.log(query);
    return queryBuilder( query )
    .then( data => ({ success: true, result : { total : data.rowCount, data : data.rows} }))
    .catch( error => ({ success: false, error : error }));
}

// 모든 장소 보기(10개 씩)
exports.findByOptions = (pageNumber,lat,lon) => {
    const query = `
    select id, name, address, phone, examination_items , lat ,lon
    from p_hospitals
    order by  ST_DistanceSphere(geom, ST_MakePoint(${lon},${lat}))
    limit 10 offset ${pageNumber};
    `;

    console.log(query);
    return queryBuilder( query )
    .then( data => ({ success: true, result : { total : data.rowCount, data : data.rows} }))
    .catch( error => ({ success: false, error : error }));
}

// 장소 상세보기
exports.findOne = ( placeId ) => {
    const query = `
    select id, name, address, phone, examination_items
    from p_hospitals
    where id = ${placeId};
    `;
    return queryBuilder( query )
    .then( data => ({ success: true, result : data.rows }))
    .catch( error => ({ success: false, error : error }));
}

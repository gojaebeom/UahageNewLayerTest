"use strict";
const repository = require("../../repository/place/ExperienceCenter.repo");

// 장소 리스트 보기
exports.findByOptions = async ( pageNumber, lat, lon ) => {
    if(!pageNumber){
       // console.log("전체보기");
        return await repository.findAll();
    } else{
        //console.log("10개씩 끊어서 보기");
        return await repository.findByOptions(pageNumber,lat,lon);
    }
}

// 장소 상세보기
exports.findOne = async ( placeId ) => 
    await repository.findOne( placeId );
"use strict";
const repository = require("../../repository/place/Hospital.repo");

// 장소 리스트 보기
exports.findByOptions = async (req, res) => {
    const {pageNumber, lat, lon} = req.query;
    let success , result , error;
    if(!pageNumber){
       // console.log("전체보기");
        const body = await repository.findAll();
        success = body.success;
        result = body.result;
        error = body.error;
    } else{
        //console.log("10개씩 끊어서 보기");
        const body = await repository.findByOptions(pageNumber,lat,lon);
        success = body.success;
        result = body.result;
        error = body.error;
    }
    success ? 
    res.status(200).json({ message : "status ok",  data : result }) : 
    res.status(500).json({ message : "server error", error : error }); 
}

// 장소 상세보기
exports.findOne = async (req, res) => {
    const placeId = req.params.id;
    const { success, result, error } = await repository.findOne( placeId );
    success ? 
    res.status(200).json({ message : "status ok",  data : result }) : 
    res.status(500).json({ message : "server error", error : error }); 
}
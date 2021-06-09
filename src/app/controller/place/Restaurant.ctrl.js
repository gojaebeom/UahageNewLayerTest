"use strict";
const service = require("../../service/place/Restaurant.service");

// 쿼리스트링 옵션에 따라 모두보기, 북마크된 게시물만 보기, 시설정보 필터에 따라 보기 
exports.findByOptions = async (req, res) => {
    const options = req.query;

    const { success, message, result, error } = await service.findByOptions( options );

    success ? 
    res.status(200).json({ message : message,  data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}

// 장소 상세보기
exports.findOne = async (req, res) => {
    const placeId = req.params.id;

    const { success, message, result, error } = await service.findOne( placeId );
    
    success ? 
    res.status(200).json({ message : message,  data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}


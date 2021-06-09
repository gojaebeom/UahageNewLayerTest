"use strict";
const service = require("../../service/place/ExperienceCenter.service");

// 장소 리스트 보기
exports.findByOptions = async (req, res) => {
    const {pageNumber, lat, lon} = req.query;
    const {success, message, result, error} = await service.findByOptions( pageNumber, lat, lon );
    
    success ? 
    res.status(200).json({ message : message,  data : result }): 
    res.status(500).json({ message : message, error : error }); 
}

// 장소 상세보기
exports.findOne = async (req, res) => {
    const placeId = req.params.id;
    const { success, message, result, error } = await service.findOne( placeId );

    success ? 
    res.status(200).json({ message : message, data : result }): 
    res.status(500).json({ message : message, error : error }); 
}
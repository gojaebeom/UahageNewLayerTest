"use strict";
const service = require("../../service/place/RestaurantReview.service");


//? 리뷰 리스트 보기
exports.findByOptions = async (req, res) => {
    const placeId = req.params.id;
    let type = req.query.type || null;
    const order = req.query.order || "DATE"; // date, top, low

    const { success, result, error } = await service.findByOptions( placeId, type, order ); 
    
    success ? 
    res.status(200).json({ message : "get reviews success",  data : result }) : 
    res.status(500).json({ message : "get reviews false", error : error }); 
}


//? 리뷰 상세보기
exports.findOne = async (req, res) =>{
    const reviewId = req.params.id;
    const repoObj = await service.findOne( reviewId );

    repoObj.success ? 
    res.status(200).json({ message : "get review detail success",  data : repoObj.result }) : 
    res.status(500).json({ message : "get review detail false", error : repoObj.error }); 
}


//? 리뷰 생성
exports.store = async (req, res) => {
    const body = req.body;
    const imgFiles =req.files;
    const { success, result, error } = await service.store( body, imgFiles);

    success ? 
    res.status(200).json({ message : "review store success",  data : result }) : 
    res.status(500).json({ message : "review store false", error : error }); 
}


//? 리뷰 수정하기
exports.update = async (req, res) =>{
    const reviewId = req.params.id;
    const body = req.body;
    const images = req.files;
    const { success, result, error } = await service.update( reviewId, body, images );

    success ? 
    res.status(200).json({ message : "update review success",  data : result }) :
    res.status(500).json({ message : "update review false", error : error }); 
}


//? 리뷰 삭제
exports.delete = async (req, res) => {
    const reviewId = req.params.id;
    const { success, result, error } = await service.delete( reviewId );

    success ? 
    res.status(200).json({ message: "review delete success",  data: result }) : 
    res.status(500).json({ message: "review delete false", error: error }); 
}



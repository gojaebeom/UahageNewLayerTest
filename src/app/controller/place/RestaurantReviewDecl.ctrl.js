"use strict";

//? 리뷰 신고
exports.store = async (req, res) =>{
    const body = req.body;
    const { success, message, result, error } = await service.store( body );
    
    success ? 
    res.status(200).json({ message : message, data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}
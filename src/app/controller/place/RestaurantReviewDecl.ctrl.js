"use strict";

//? 리뷰 신고
exports.store = async (req, res) =>{
    const body = req.body;
    const repoObj = await service.store( body );
    
    repoObj.success ? 
    res.status(200).json({ message : "review delete success",  data : repoObj.result }) : 
    res.status(500).json({ message : "review delete false", error : repoObj.error }); 
}
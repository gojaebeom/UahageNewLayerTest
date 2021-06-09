"use strict";
const service = require("../../service/place/RestaurantBookmark.service");

// 북마크 관계 생성, 또는 제거
exports.bookmarkToogle = async (req, res) => {
    const { userId, placeId } = req.body;
    const { success, message, result, error } = await service.bookmarkToggle( userId, placeId );

    success ? 
    res.status(200).json({ message : message,  data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}
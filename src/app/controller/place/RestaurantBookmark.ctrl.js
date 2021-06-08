"use strict";
const service = require("../../service/place/RestaurantBookmark.service");

// 북마크 관계 생성, 또는 제거
exports.bookmarkToogle = async (req, res) => {
    const { userId, placeId } = req.body;
    
    const { repoObject, isBookmarked } = await service.bookmarkToggle( userId, placeId );

    repoObject.success ? 
    res.status(200).json({ message : "status ok",  data : { isBookmarked : isBookmarked } }) : 
    res.status(500).json({ message : "server error", error : repoObject.error }); 
}
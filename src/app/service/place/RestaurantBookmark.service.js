"use strict";

const repository = require("../../repository/place/Restaurant.repo");

exports.bookmarkToggle = async ( userId, placeId ) => {

    let repoObject = await repository.validateBookmark( userId, placeId );

    const bookmarkId = repoObject.result.id;
    let isBookmarked = false;

    if( bookmarkId ){
        // 북마크 존재 -> 북마크 관계 제거
        repoObject = await repository.deleteBookmark( bookmarkId );
    }else {
        // 북마크 없음 -> 북마크 관계 생성`
        repoObject = await repository.storeBookmark( userId, placeId );
        isBookmarked = true;
    }
    
    return { repoObject, isBookmarked };
}
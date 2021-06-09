"use strict";

const repository = require("../../repository/place/Restaurant.repo");

exports.bookmarkToggle = async ( userId, placeId ) => {

    let repoObject = await repository.validateBookmark( userId, placeId );
    if( !repoObject.success ){
        return repoObject;
    }

    const bookmarkId = repoObject.result.id;

    if( bookmarkId ){
        // 북마크 존재 -> 북마크 관계 제거
        return await repository.deleteBookmark( bookmarkId );
    }else {
        // 북마크 없음 -> 북마크 관계 생성`
        return await repository.storeBookmark( userId, placeId );
    }

}
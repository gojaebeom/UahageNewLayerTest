"use strict";

const { awsS3Delete } = require("../../../config/AwsS3");
const repository = require("../../repository/place/Restaurant.repo");

exports.findByOptions = async ( placeId, type, order ) => {
    type = type !== null && type.toUpperCase();
    if( type === "IMG" ){
        return await repository.findReviewImages( placeId );
    }else {
        const option = order.toUpperCase();
        return await repository.findReviewsByOption( placeId, option );
    }
}

exports.findOne = async ( reviewId ) => await repository.findOneReview( reviewId );

exports.store = async ( body, images ) => {

    const tasteRating = Number(body.tasteRating);
    const costRating = Number(body.costRating);
    const serviceRating = Number(body.serviceRating);
    const totalRating = Math.floor(( tasteRating + costRating + serviceRating ) / 3);

    if(!images.length){
        console.log("이미지 없음, 리뷰만 저장");
        return await repository.storeReview({
            userId : body.userId,
            placeId : body.placeId,
            desc : body.desc,
            totalRating : totalRating,
            tasteRating : tasteRating,
            costRating : costRating,
            serviceRating :serviceRating
        });
    } else {
        console.log("이미지 있음, 리뷰, 이미지 저장");
        return await repository.storeReviewWithImages({
            images : images,
            userId : body.userId,
            placeId : body.placeId,
            desc : body.desc,
            totalRating : totalRating,
            tasteRating : tasteRating,
            costRating : costRating,
            serviceRating :serviceRating
        });
    }
}

exports.update = async ( reviewId, body, images ) => {
    const desc = body.desc;
    const tasteRating = Number(body.tasteRating);
    const costRating = Number(body.costRating);
    const serviceRating = Number(body.serviceRating);
    const totalRating = Math.floor(( tasteRating + costRating + serviceRating ) / 3);
    const deleteImgConcatText = body.deleteImgConcatText;

    let repoObj;
    if( deleteImgConcatText ) {
        console.log(deleteImgConcatText);
        const delImgList = deleteImgConcatText.split(",");

        delImgList.map( async (item) => {
            repoObj = await repository.deleteReviewImage( item );
            console.log(`${ item } 이미지 삭제 완료`);

            awsS3Delete( item );
        });
    }

    if(!images.length){

        console.log("이미지 없음, 리뷰만 수정");
        return await repository.updateReview( reviewId , {
            desc : desc,
            totalRating : totalRating,
            tasteRating : tasteRating,
            costRating : costRating,
            serviceRating :serviceRating
        });  

    } else {
        console.log("이미지 있음, 리뷰수정 및 이미지 생성");
        repoObj = await repository.updateReview( reviewId , {
            desc : desc,
            totalRating : totalRating,
            tasteRating : tasteRating,
            costRating : costRating,
            serviceRating :serviceRating
        }); 
        if( !repoObj.success ) return { success: false, message : "review update false", error : repoObj.error };

        repoObj = await repository.storeReviewImages( reviewId, images);
        if( !repoObj.success ) return { success: false, message : "review image create false", error : repoObj.error };
    }
}

exports.delete = async ( reviewId ) => {
    return await repository.delete( reviewId );
}
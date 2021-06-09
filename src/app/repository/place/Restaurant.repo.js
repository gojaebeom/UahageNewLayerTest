"use strict";
const { queryBuilder } = require("../../../config/Database");


//? 북마크 관계 확인 : 있다면 id 리턴
exports.validateBookmark = ( userId, placeId ) => {
    const query = `
    select id from p_restaurant_bookmarks
    where user_id = ${userId} and restaurant_id = ${placeId};
    `;
    return queryBuilder( query )
    .then( data => ({ success: true,  message: "Bookmark validate success", result : data.rowCount !== 0 ? data.rows[0] : 0 }))
    .catch( error => ({ success: false, message: "Bookmark validate error", error : error }));
}


//? 북마크 관계 생성
exports.storeBookmark = ( userId, placeId ) => {
    const query = `
    insert into p_restaurant_bookmarks(user_id , restaurant_id)
    values (${userId}, ${placeId});
    `;
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Bookmark store success", result : {isBookmarked: true} }))
    .catch( error => ({ success: false, message: "Bookmark store false", error : error }));
}


//? 북마크 관계 제거
exports.deleteBookmark = ( bookmarkId ) => {
    const query = `
    delete from p_restaurant_bookmarks
    where id = ${bookmarkId}
    `;
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Bookmark delete success", result : {isBookmarked: false} }))
    .catch( error => ({ success: false, message: "Bookmark delete false", error : error }));
}


//? 모든 장소 보기
exports.findAll =  ({
    lat, 
    lon, 
    userId, 
    babyBed,
    babyChair,
    babyMenu,
    babyTableware,
    stroller,
    diaperChange,
    meetingRoom,
    nursingRoom,
    playRoom,
    parking,
    isBookmarked,
    pageNumber,
}) => {
    console.log("모든장소보기");
    const query = `
    select
        pr.id,
        pr.name,
        pr.address,
        pr.phone,
        pr.lat,
        pr.lon,
        prf.baby_bed,
        prf.baby_chair,
        prf.baby_menu,
        prf.baby_tableware,
        prf.stroller,
        prf.diaper_change,
        prf.meeting_room,
        prf.nursing_room,
        prf.play_room,
        prf.parking
        ${ userId ? ', coalesce(prb.id, 0) as bookmark' : '' }
    from p_restaurants as pr
    left outer join p_restaurant_facilities prf
    on pr.id = prf.restaurant_id
    ${ userId ? 'left outer join (select * from p_restaurant_bookmarks prb where user_id='+userId+') prb on pr.id = prb.restaurant_id ': '' }
    where
        pr.created_at is not null
        ${ isBookmarked ? ' and prb.user_id = ' + userId : '' }
        ${ babyBed ? ' and prf.baby_bed = true' : '' }
        ${ babyChair ? ' and prf.baby_chair = true' : '' }
        ${ babyMenu ? ' and prf.baby_menu = true': '' }
        ${ babyTableware ? ' and prf.baby_tableware = true': '' }
        ${ stroller ? ' and prf.stroller = true': '' }
        ${ diaperChange ? ' and prf.diaper_change = true': '' }
        ${ meetingRoom ? ' and prf.meeting_room = true': '' }
        ${ nursingRoom ? ' and prf.nursing_room = true' : ''}
        ${ playRoom ? ' and prf.play_room = true': '' }
        ${ parking ? ' and prf.parking = true': ''};
    `;
    console.log(query);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Get Restaurant list success", result : { total : data.rowCount, data : data.rows} }))
    .catch( error => ({ success: false, message: "Get Restaurant list false", error : error }));
}


//? 모든 장소 보기(10개 씩)
//? 검색 조건에 따라
//? 북마크한 장소들 보기
//? 시설 정보 조건에 맞는 장소 보기
exports.findByOptions = ({
    lat, 
    lon, 
    userId, 
    babyBed,
    babyChair,
    babyMenu,
    babyTableware,
    stroller,
    diaperChange,
    meetingRoom,
    nursingRoom,
    playRoom,
    parking,
    isBookmarked,
    pageNumber,
}) => {
    const query = `
    select
        pr.id,
        pr.name,
        pr.address,
        pr.phone,
        pr.lat,
        pr.lon,
        prf.baby_bed,
        prf.baby_chair,
        prf.baby_menu,
        prf.baby_tableware,
        prf.stroller,
        prf.diaper_change,
        prf.meeting_room,
        prf.nursing_room,
        prf.play_room,
        prf.parking
        ${ userId ? ', coalesce(prb.id, 0) as bookmark' : '' }
    from p_restaurants as pr
    left outer join p_restaurant_facilities prf
    on pr.id = prf.restaurant_id
    ${ userId ? 'left outer join (select * from p_restaurant_bookmarks prb where user_id='+userId+') prb on pr.id = prb.restaurant_id ': '' }
    where
        pr.created_at is not null
        ${ isBookmarked ? ' and prb.user_id = ' + userId : '' }
        ${ babyBed ? ' and prf.baby_bed = true' : '' }
        ${ babyChair ? ' and prf.baby_chair = true' : '' }
        ${ babyMenu ? ' and prf.baby_menu = true': '' }
        ${ babyTableware ? ' and prf.baby_tableware = true': '' }
        ${ stroller ? ' and prf.stroller = true': '' }
        ${ diaperChange ? ' and prf.diaper_change = true': '' }
        ${ meetingRoom ? ' and prf.meeting_room = true': '' }
        ${ nursingRoom ? ' and prf.nursing_room = true' : ''}
        ${ playRoom ? ' and prf.play_room = true': '' }
        ${ parking ? ' and prf.parking = true': ''}
    order by  ST_DistanceSphere(geom, ST_MakePoint(${lon},${lat}))
    limit 10 offset ${pageNumber};
    `;

    console.log(query);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Get Restaurant list success", result : { total : data.rowCount, data : data.rows} }))
    .catch( error => ({ success: false, message: "Get Restaurant list false", error : error }));
}


//? 장소 상세보기
exports.findOne = ( placeId ) => {
    const query = `
    select
        pr.id,
        pr.name,
        pr.address,
        pr.phone,
        pr.lat,
        pr.lon,
        prf.baby_bed,
        prf.baby_chair,
        prf.baby_menu,
        prf.baby_tableware,
        prf.stroller,
        prf.diaper_change,
        prf.meeting_room,
        prf.nursing_room,
        prf.play_room,
        prf.parking
    from p_restaurants as pr
    left outer join p_restaurant_facilities prf
    on pr.id = prf.restaurant_id
    where
        pr.id = ${ placeId };
    `;
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Get Restaurant detail success", result : data.rows }))
    .catch( error => ({ success: false, message: "Get Restaurant detail false", error : error }));
}


//? 리뷰 리스트 보기
exports.findReviewsByOption = ( placeId, option ) => {
    const query = `
    select
        prr.id,
        u.id as user_id,
        u.nickname,
        ui.image_path as profile,
        prr.description,
        prr.total_rating,
        prr.taste_rating,
        prr.cost_rating,
        prr.service_rating,
        to_char( prr.created_at::timestamp, 'YYYY.MM.DD') as created_at,
        STRING_AGG(prri.image_path , ',' ) as image_path
    from p_restaurant_reviews as prr
    left join p_restaurant_review_images as prri
    on prr.id = prri.review_id
    left join users as u
    on prr.user_id = u.id
    left join user_images ui
    on u.id = ui.user_id
    where prr.restaurant_id = ${ placeId }
    group by prr.id, u.id, ui.id
    ${ option === "DATE" ? 'order by prr.created_at desc' : '' }
    ${ option === "TOP" ? 'order by prr.total_rating desc' : '' }
    ${ option === "LOW" ? 'order by prr.total_rating asc' : '' };
    `;
    console.log(`=== Query ===\n${query}\n=== End Query ===`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Get Restaurant Review list success", result : { total : data.rowCount, data : data.rows } }))
    .catch( error => ({ success: false, message: "Get Restaurant Review list false", error : error }));
}


//? 리뷰 상세 보기
exports.findOneReview = ( reviewId ) =>{
    const query = `
    select
        prr.id,
        prr.restaurant_id,
        prr.user_id,
        prr.description,
        prr.total_rating,
        prr.taste_rating,
        prr.cost_rating,
        prr.service_rating,
        to_char( prr.created_at::timestamp, 'YYYY.MM.DD') as created_at,
        STRING_AGG(prri.image_path , ',' )
    from p_restaurant_reviews as prr
    left join p_restaurant_review_images as prri
    on prr.id = prri.review_id
    where prr.id = ${reviewId}
    group by prr.id;
    `;
    console.log(`=== Query ===\n${query}\n=== End Query ===`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Get Restaurant Review detail success", result : data.rows[0]  }))
    .catch( error => ({ success: false, message: "Get Restaurant Review detail false", error : error }));
}


//? 사진 리뷰 모아보기
exports.findReviewImages = ( placeId ) => {
    const query = `
    select prr.id, prri.image_path
    from p_restaurant_reviews as prr
    left join p_restaurant_review_images as prri
    on prr.id = prri.review_id
    where prr.restaurant_id = ${ placeId }
    and prri.image_path is not null
    order by prr.created_at desc;
    `;
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Get Restaurant Review Image list success", result : { total : data.rowCount, data : data.rows } }))
    .catch( error => ({ success: false, message: "Get Restaurant Review Image list false", error : error }));
}


//? 리뷰 이미지 PK 구하기
exports.deleteReviewImage = ( imagePath ) => {
    const query = `
    delete from p_restaurant_review_images 
    where image_path = '${ imagePath }'`;

    return queryBuilder( query )
    .then( data => ({ success: true, message: "delete Restaurant Review Image success", result : { total : data.rowCount, data : data.rows } }))
    .catch( error => ({ success: false, message: "delete Restaurant Review Image false", error : error }));
}   


//? 리뷰 저장 (이미지가 있는 경우)
exports.storeReviewWithImages = ({
    images,
    userId,
    placeId,
    desc,
    totalRating,
    tasteRating,
    costRating,
    serviceRating
}) => {

    const query = `
    with reviews as (
        insert into p_restaurant_reviews(
            user_id,
            restaurant_id,
            description,
            total_rating,
            taste_rating,
            cost_rating,
            service_rating
        )
        values ( 
            ${userId}, 
            ${placeId}, 
            '${desc}', 
            ${totalRating}, 
            ${tasteRating}, 
            ${costRating}, 
            ${serviceRating}
        )
        returning id
    )
    insert into p_restaurant_review_images( review_id, image_path )
    values
    ${ images.map((item)=>{
            return "( (select id from reviews), '"+ item.location +"')"
    })};
    `; 
    console.log(` ======  query  ======\n${query}\n ====== end query ======`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "store Restaurant Review success", result : true }))
    .catch( error => ({ success: false, message: "store Restaurant Review false",  error : error }));
}


//? 리뷰 저장
exports.storeReview = ({
    userId, 
    placeId,
    desc,
    totalRating,
    tasteRating,
    costRating,
    serviceRating
}) => {

    const query = `
        insert into p_restaurant_reviews(
            user_id,
            restaurant_id,
            description,
            total_rating,
            taste_rating,
            cost_rating,
            service_rating
        )
        values ( 
            ${userId}, 
            ${placeId}, 
            '${desc}', 
            ${totalRating}, 
            ${tasteRating}, 
            ${costRating}, 
            ${serviceRating}
        );
    `; 
    console.log(` ======  query  ======\n${query}\n ====== end query ======`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "store Restaurant Review success",  result : true }))
    .catch( error => ({ success: false, message: "store Restaurant Review false",  error : error }));
}


//? 리뷰 이미지 저장
exports.storeReviewImages = (reviewId, images) => {
    const query = `
        insert into p_restaurant_review_images(
            review_id,
            image_path
        )
        values
        ${ images.map((item)=>{
                return "(" + reviewId + ", '"+ item.location +"')"
        })};
    `; 
    console.log(` ======  query  ======\n${query}\n ====== end query ======`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "store Restaurant Review Images success",  result : true }))
    .catch( error => ({ success: false, message: "store Restaurant Review Images false", error : error }));
}


//? 리뷰 수정
exports.updateReview = ( 
    reviewId, 
    {
        desc,
        totalRating,
        tasteRating,
        costRating,
        serviceRating
    }
) => {
    const query = `
    update p_restaurant_reviews
    set 
        description = '${desc}', 
        total_rating = ${totalRating},
        taste_rating = ${tasteRating},
        cost_rating = ${costRating}, 
        service_rating = ${serviceRating},
        updated_at = now()
        where id = ${reviewId}
    `; 
    console.log(` ======  query  ======\n${query}\n ====== end query ======`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "Update Restaurant Review success", result : true }))
    .catch( error => ({ success: false, message: "Update Restaurant Review false",  error : error }));
}


//? 리뷰 삭제 
exports.delete = ( reviewId ) => {
    const query = `
    delete from p_restaurant_reviews
    where id = ${ reviewId }
    `;
    console.log(`=== Query ===\n${query}\n=== End Query ===`);

    return queryBuilder( query )
    .then( data => ({ success: true, message: "delete Restaurant Review success",  result : true }))
    .catch( error => ({ success: false, message: "delete Restaurant Review false", error : error }));
}


//? 리뷰 신고
exports.storeReviewDeclarations = ( body ) => {
    const { categoryId, reviewId, userId, desc } = body;
    const query = `
    insert into p_restaurant_review_declarations(
        category_id, 
        review_id,
        user_id, 
        description
    )
    values( ${categoryId}, ${reviewId}, ${userId}, '${desc}');
    `;
    console.log(`=== Query ===\n${query}\n=== End Query ===`);
    return queryBuilder( query )
    .then( data => ({ success: true, message: "store Restaurant Review Declaration success", result : true }))
    .catch( error => ({ success: false, message: "store Restaurant Review Declaration false",  error : error }));
}
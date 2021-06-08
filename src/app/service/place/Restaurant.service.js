"use strict";

const repository = require("../../repository/place/Restaurant.repo");

exports.findByOptions = async ( options ) => {
    const {pageNumber} = options;

    if(!pageNumber){
        console.log("전체 보기");
        for(let option in options) {
            if(options[option] === "0"){
                options[option] = false;
            }
        }
        return await repository.findAll(options);
    } else{
        console.log("10개씩 끊어서 보기");
        return await repository.findByOptions(options);
    }
}

exports.findOne = async ( placeId ) => {
    return await repository.findOne( placeId );
}
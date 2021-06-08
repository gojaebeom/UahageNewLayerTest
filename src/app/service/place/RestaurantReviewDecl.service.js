const repository = require("../../repository/place/Restaurant.repo");

//? 리뷰 신고
exports.store = async ( body ) => await repository.storeReviewDeclarations( body );
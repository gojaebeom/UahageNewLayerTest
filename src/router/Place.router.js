"use strict";
/**@ImportControllers 🍅 */

const restaurantController = require("../app/controller/place/Restaurant.ctrl");
const restaurantBookmarkController = require("../app/controller/place/RestaurantBookmark.ctrl");
const restaurantReviewController = require("../app/controller/place/RestaurantReview.ctrl");
const restaurantReviewDeclController = require("../app/controller/place/RestaurantReviewDecl.ctrl");

const dayCareCenterController = require("../app//controller/place/DayCareCenter.ctrl");
const hospitalController = require("../app/controller/place/Hospital.ctrl");
const experienceCenterController = require("../app/controller/place/ExperienceCenter.ctrl");
const kidCafeController = require("../app/controller/place/KidCafe.ctrl");

/**@ImportMiddlewares 🍇 */
const { s3MultiFileMiddleware } = require("../middleware/S3.mdw");

const { Router } = require("express");
const { tokenMiddleware } = require("../middleware/Token.mdw");
const router = Router();



//? rstr
router.post(
    "/api/places/restaurants/bookmarks", 
    tokenMiddleware,
    restaurantBookmarkController.bookmarkToogle
);
router.get(
    "/api/places/restaurants", 
    tokenMiddleware,
    restaurantController.findByOptions
);
router.get(
    "/api/places/restaurants/:id", 
    tokenMiddleware,
    restaurantController.findOne
);

//? rstr review
router.get(
    "/api/places/restaurants/:id/reviews", 
    tokenMiddleware,
    restaurantReviewController.findByOptions
);
router.get(
    "/api/places/restaurants/reviews/:id", 
    tokenMiddleware,
    restaurantReviewController.findOne
);
router.post(
    "/api/places/restaurants/reviews",
    tokenMiddleware,
    s3MultiFileMiddleware,
    restaurantReviewController.store
);
router.put(
    "/api/places/restaurants/reviews/:id",
    tokenMiddleware,
    s3MultiFileMiddleware,
    restaurantReviewController.update
);
router.delete(
    "/api/places/restaurants/reviews/:id",
    tokenMiddleware,
    restaurantReviewController.delete
);
router.post(
    "/api/places/restaurants/reviews/decl",
    tokenMiddleware,
    restaurantReviewDeclController.store
);
// Place-dayCareCenter
router.get(
    "/api/places/day-care-centers", 
    tokenMiddleware,
    dayCareCenterController.findByOptions
);
router.get(
    "/api/places/day-care-centers/:id",
    tokenMiddleware,
    dayCareCenterController.findOne
);



// Place-hospital
router.get(
    "/api/places/hospitals", 
    tokenMiddleware,
    hospitalController.findByOptions
);
router.get(
    "/api/places/hospitals/:id", 
    tokenMiddleware,
    hospitalController.findOne
);



// Place-experienceCenter
router.get(
    "/api/places/experience-centers", 
    tokenMiddleware,
    experienceCenterController.findByOptions
);
router.get(
    "/api/places/experience-centers/:id", 
    tokenMiddleware,
    experienceCenterController.findOne
);



// Place-kidCafe
router.get(
    "/api/places/kid-cafes", 
    tokenMiddleware,
    kidCafeController.findByOptions
);
router.get(
    "/api/places/kid-cafes/:id", 
    tokenMiddleware,
    kidCafeController.findOne
);

module.exports = router;
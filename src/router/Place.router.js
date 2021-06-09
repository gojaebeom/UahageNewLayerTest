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
const { authMiddleware } = require("../middleware/Auth.mdw");
const router = Router();



//? rstr
router.post(
    "/api/places/restaurants/bookmarks", 
    authMiddleware,
    restaurantBookmarkController.bookmarkToogle
);
router.get(
    "/api/places/restaurants", 
    authMiddleware,
    restaurantController.findByOptions
);
router.get(
    "/api/places/restaurants/:id", 
    authMiddleware,
    restaurantController.findOne
);

//? rstr review
router.get(
    "/api/places/restaurants/:id/reviews", 
    authMiddleware,
    restaurantReviewController.findByOptions
);
router.get(
    "/api/places/restaurants/reviews/:id", 
    authMiddleware,
    restaurantReviewController.findOne
);
router.post(
    "/api/places/restaurants/reviews",
    authMiddleware,
    s3MultiFileMiddleware,
    restaurantReviewController.store
);
router.put(
    "/api/places/restaurants/reviews/:id",
    authMiddleware,
    s3MultiFileMiddleware,
    restaurantReviewController.update
);
router.delete(
    "/api/places/restaurants/reviews/:id",
    authMiddleware,
    restaurantReviewController.delete
);
router.post(
    "/api/places/restaurants/reviews/decl",
    authMiddleware,
    restaurantReviewDeclController.store
);
// Place-dayCareCenter
router.get(
    "/api/places/day-care-centers", 
    authMiddleware,
    dayCareCenterController.findByOptions
);
router.get(
    "/api/places/day-care-centers/:id",
    authMiddleware,
    dayCareCenterController.findOne
);



// Place-hospital
router.get(
    "/api/places/hospitals", 
    authMiddleware,
    hospitalController.findByOptions
);
router.get(
    "/api/places/hospitals/:id", 
    authMiddleware,
    hospitalController.findOne
);



// Place-experienceCenter
router.get(
    "/api/places/experience-centers", 
    authMiddleware,
    experienceCenterController.findByOptions
);
router.get(
    "/api/places/experience-centers/:id", 
    authMiddleware,
    experienceCenterController.findOne
);



// Place-kidCafe
router.get(
    "/api/places/kid-cafes", 
    authMiddleware,
    kidCafeController.findByOptions
);
router.get(
    "/api/places/kid-cafes/:id", 
    authMiddleware,
    kidCafeController.findOne
);

module.exports = router;
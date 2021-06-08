"use strict";
const { Router } = require("express");
const router = Router();

/**@Views 🎨*/
router.get("/", ( req, res ) => res.render("main"));
router.get("/maps", ( req, res ) => res.render("placeMainMap"));
router.get("/maps/show-place", ( req, res ) => res.render("placeListMap"));
router.get("/maps/show-place-name", ( req, res ) => res.render("placeDetailMap"));
router.get("/maps/show-list", ( req, res ) => res.render("placeListSearch"));

module.exports = router;

//http://localhost:8000/maps/show-place?type=allsearch&lat=35.0207316&lon=126.792788&placeName=restaurants
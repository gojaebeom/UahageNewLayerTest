"use strict";
//? Import Module
const express = require("express"); 
const morgan = require("morgan");
const cors = require("cors");
const database = require("./config/Database"); 
const cookieParser = require("cookie-parser");
const path = require("path");
const placeRouter = require("./router/Place.router");
const pageRouter = require("./router/Page.router");
const userRouter = require("./router/User.router");

require("./config/AwsS3");

//? Init Settings
database.connector();

const app = express();

const APP_MODE = process.env.APP_MODE || "DEV";
APP_MODE === "DEV" && app.use(morgan("dev"));

//? Middleware Connectings

//? ejs 타입의 템플릿 앤진 사용 및 view, static 경로 설정
app.set("views", path.resolve(__dirname, "../public/views"));
app.set("view engine" , "ejs");
app.use(express.static(path.resolve(__dirname, "../public/static")));


//? Set Cors 
app.use(cors({
    origin:"*"
}));

//? Use json : req 객체에서 json 타입의 body 받기
app.use(express.json());

//? Use form-urlencoded : req 객체에서 x-www-form-urlencoded 타입의 body 받기
app.use(express.urlencoded({
    limit: '150mb',
    extended: false,
}));

//? Use cookieParser : req , res 객체에서 .cookie 사용
app.use(cookieParser());

//? Set Router : router 연결
app.use(pageRouter);
app.use(placeRouter);
app.use(userRouter);

//? AppListening : 8000 포트에서 서버 실행
const PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on : ${PORT}`));
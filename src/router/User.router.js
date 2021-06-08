"use strict";

const userController = require("../apis/user/userController");
const { Router } = require("express");
const { kakaoLoginMiddleware } = require("../middlewares/kakaoLoginMiddleware");
const { naverLoginMiddleware } = require("../middlewares/naverLoginMiddleware");
const router = Router();

/**@APIs 🍬*/
// User Api
// 🍩 카카오 로그인 ( 결과적으로 jwt 토큰 반환 , 기존에 계정 없으면 회원가입진행 이후 반환 )
router.post(
    "/api/users/kakao-login", 
    kakaoLoginMiddleware, 
    userController.oAuthLogin
);
// 🍑 네이버 로그인 ( 결과적으로 jwt 토큰 반환 , 기존에 계정 없으면 회원가입진행 이후 반환 )
router.post(
    "/api/users/naver-login", 
    naverLoginMiddleware, 
    userController.oAuthLogin
);
// 회원 상세 정보
router.get(
    "/api/users/:id", 
    defaultAuthMiddlware, 
    userController.findOne
);
// 회원 닉네임 확인 ( 있으면 false, 없으면 true )
router.get(
    "/api/users/validate-nickname/:nickname", 
    defaultAuthMiddlware, 
    userController.validateByNickname
);
// 회원 이메일 확인
router.get(
    "/api/users/validate-email/:email", 
    defaultAuthMiddlware, 
    userController.validateByEmail
);
// 회원 수정 ( 첫 회원가입 이후 추가정보 입력에도 사용 )
router.put(
    "/api/users/:id", 
    userAuthMiddleware,
    s3Middleware, 
    userController.edit
);
// 회원 로그아웃
router.get(
    "/api/users/logout", 
    defaultAuthMiddlware, 
    userController.logout
);
// 회원 탈퇴
router.delete(
    "/api/users/:id", 
    userAuthMiddleware, 
    userController.delete
);
"use strict";
const service = require("../../service/user/User.service");

// 카카오, 네이버 소셜 로그인 ( 인증 미들웨어가 카카오, 네이버로 구분되어 각각 다른 Email 값을 반환)
exports.oAuthLogin = async ( req, res ) => {
    const email = req.email;
    const {success, message, result, error } = await service.oAuthLogin( email );

    success ? 
    res.status(200).json({ message : message,  data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}


// 회원 상세정보
exports.findOne = async (req, res) => {
    const userId = req.params.id;
    const { success, message, result, error } = await service.findOne( userId );

    success ? 
    res.status(200).json({ message : message, data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}


// 회원 정보 수정
exports.update = async (req, res) => {
    const userId = req.params.id;
    const body = req.body;
    const { success, message, result, error } = await service.update( userId, body ); 

    success ? 
    res.status(200).json({ message : message,  data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}


// 닉네임 중복채크
exports.validateByNickname = async (req, res) => { 
    const nickname = req.params.nickname;
    const { success, message, result, error } = await service.validateByNickname( nickname ); 
    
    success ? 
    res.status(200).json({ message : message, data : result }): 
    res.status(500).json({ message : message, error : error }); 
}


// 이메일 중복채크
exports.validateByEmail = async (req, res) => { 
    const email = req.params.email; 
    const { success, message, result, error } = await service.validateByEmail( email ); 
    success ? 
    res.status(200).json({ message : message, data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}


// 회원 로그아웃 ( 미완료 )
exports.logout = (req, res) => {
    // 소셜로그인 토큰 인증방식에 따라 구현
    // 1. 소셜 로그인마다 받는 토큰과 리프레시 토큰이 다른경우
    // DB에 저장된 리프레시 토큰을 지우고 토큰 만료시키기
    // 2. 세션 방식일 경우 세션을 삭제 시키기
    res.status(200).json({ message : "status ok",  data : true });
}


// 회원 탈퇴 
exports.delete = async (req, res) => {
    const userId = req.params.id;
    const { success, message, result, error } = await service.delete( userId );

    success ? 
    res.status(200).json({ message : message, data : result }) : 
    res.status(500).json({ message : message, error : error }); 
}

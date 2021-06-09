"use strict";
const repository = require("../../repository/user/User.repo");
const { createToken } = require("../../../util/jwt");


exports.oAuthLogin = async ( email ) => {
    //? 이메일로 저장된 유저 아이디 확인 : 있으면 유저 아이디 반환, 없으면 0 반환
    let repoObject = await repository.findIdByEmail( email );
    if( !repoObject.success ) return repoObject;

    //? 이메일이 저장되지 않은 유저는 회원 정보 저장
    if( repoObject.result === 0 ){
        // store!
        const { nickname, ageGroupType, babyGender ,babyBirthday } = req.body;
        repoObject = await repository.store( 
            email, 
            nickname, 
            ageGroupType, 
            babyGender, 
            babyBirthday 
        );
        if( !repoObject.success ) return repoObject;

        repoObject = await repository.findIdByEmail( email );
        if( !repoObject.success ) return repoObject;
    }

    //? 이후 토큰 발급
    const userId = repoObject.result.id;
    const jwtToken = createToken(userId);

    return { success: true, message: "User login success", result: { token: jwtToken } };
}


// 회원 상세정보
exports.findOne = async ( userId ) => await repository.findOne( userId );


exports.update = async ( userId, body ) => {
    const { nickname, ageGroupType, babyGender ,babyBirthday } = body;
    return await repository.edit( userId, nickname, ageGroupType, babyGender, babyBirthday );
}


// 닉네임 중복채크
exports.validateByNickname = async ( nickname ) => await repository.validateByNickname( nickname );


// 이메일 중복채크
exports.validateByEmail = async ( email ) => await repository.validateByEmail( email ); 


// 회원 탈퇴 
exports.delete = async ( userId ) =>  await repository.deleteStepOne( userId );

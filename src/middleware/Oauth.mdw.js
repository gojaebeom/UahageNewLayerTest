const { default: axios } = require("axios");

exports.naverLoginMiddleware = async (req, res, next) => {
    console.log("네이버 로그인 미들웨어 방문");
    try{
        const token = req.headers['authorization'];
        console.log(token);
        const userInfo = await axios.get("https://openapi.naver.com/v1/nid/me",{
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
            },
        })
        .then( res => res.data );
        console.log(userInfo);
        // NAVER.[이메일명]
        req.email = `NAVER.${userInfo.response.email}`;
        next();
    }catch( e ) {
        return res.status(403).json({ message:"naver access false" });
    }
}

exports.kakaoLoginMiddleware = async (req, res, next) => {
    try{
        const token = req.headers['authorization'];
        console.log(token);
        const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me",{
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
            },
        })
        .then( res => res.data );
        
        // KAKAO.[이메일명]
        req.email = `KAKAO.${userInfo.kakao_account.email}`;
        next();
    }catch( e ) {
        return res.status(403).json({ message:"kakao access false" });
    }
}
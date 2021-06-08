const axios = require("axios");

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
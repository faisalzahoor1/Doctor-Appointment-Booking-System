import jwt from 'jsonwebtoken'



const authLogin = async(req, res, next)=>{
    try {
        const {atoken} = req.headers
        
        if (!atoken) {
            return res.json({success:false, message:"Not an Authorized Login"})
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ) {
            return res.json({success:false, message:"Not an Authorized Login"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:message.error})
    }
}

export default authLogin
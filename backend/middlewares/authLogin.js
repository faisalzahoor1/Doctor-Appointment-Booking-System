import jwt from 'jsonwebtoken'



const authLogin = async(req, res, next)=>{
    try {
        const {atoken} = req.headers
        
        if (!atoken) {
            console.log("faisla")
            return res.json({success:false, message:"Not an Authorized Login"})
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        // console.log(token_decode+"hello faisal")

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ) {
            console.log("heloooo")
            return res.json({success:false, message:"Not an Authorized Login"})
        }
        // console.log("midleware")
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default authLogin
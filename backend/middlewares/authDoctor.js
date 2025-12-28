import jwt from 'jsonwebtoken'



const authDoctor = async(req, res, next)=>{
    try {
        const {dtoken} = req.headers
        
        if (!dtoken) {
            console.log("hi")
            return res.json({success:false, message:"Not an Authorized Login"})
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        // console.log(token_decode+"hello faisal")

        // if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ) {
        //     console.log("heloooo")
        //     return res.json({success:false, message:"Not an Authorized Login"})
        // }
        // console.log("midleware")
        req.docId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default authDoctor
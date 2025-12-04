import jwt from 'jsonwebtoken'



const usersLogin = async(req, res, next)=>{
    try {
        const {token} = req.headers
        
        if (!token) {
            return res.json({success:false, message:"Not an Authorized Login"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:message.error})
    }
}

export default usersLogin
const jwt = require('jsonwebtoken');

const auth = async(req,res,next)=>{
    try {
        const token = req.header('Authorization');
        if(!token) return  res.status(400).json("Invalid Credentials , token nahi aaya ");

        jwt.verify(token,process.env.ACCESS_TOKEN , (err,user)=>{
            if(err) return  res.status(400).json("Invalid Credentials , token aaya par error hai ");
            req.user = user;
            console.log(user);
            next();
        })

    } catch (error) {
          return  res.status(500).json(error.message);
    }
}

module.exports = auth;
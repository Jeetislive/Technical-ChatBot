import jwt from 'jsonwebtoken';

const createToken = (res,email,userRole) => {
    const token = jwt.sign({
        email: email,
        role: userRole
     }, process.env.JWT_SECRET, {
        expiresIn: '7d'
     });
     res.cookie("token", token, {
		httpOnly: false,
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
    return token;
 }

 export default {createToken};
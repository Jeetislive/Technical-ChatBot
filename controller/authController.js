import AppError from "../error/AppError.js";
import CreateToken  from "../JWTToken/generateToken.js";
import authRepo from "../repository/authRepo.js";

const addUser = async (req, res, next) => {
    const { name, password, email} = req.body;
    try {
        const userId = await authRepo.addUser(name, email, password);
        // await sendWelcomeEmail(email, name);
        res.status(201).json({ message: 'User added successfully.', userId });
    } catch (error) {
        // console.error(error);
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password ) {
            throw new AppError("email and Password are Required",404);
        }
        const loginUserDetails = await authRepo.loginUser(email, password);
        if (!loginUserDetails) {
            throw new AppError("Invalid email or password", 401);
        }
        // console.log(loginUserDetails.Role);
        
        const token = CreateToken.createToken(res,email, loginUserDetails.role);
        if (!token) {
            throw new AppError("Failed to generate token", 500);
        }
        res.status(200).json({ message: 'User logged in successfully.',loginUserDetails, token });
    } catch (error) {
        console.error(error);
        next(error);
        throw new AppError("Failed to login user", 500);
    }
}

export default {
    addUser,
    loginUser
}

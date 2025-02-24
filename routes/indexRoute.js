import express from 'express';
import authController from '../controller/authController.js';
// import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';
// import userController from '../controller/userController.js';
import chatController from '../controller/chatController.js';

const indexRoute = express.Router();

indexRoute.post('/register',authController.addUser); // register route
indexRoute.post('/login',authController.loginUser); // login route
indexRoute.post('/chat',chatController.chatBot); // Chat API Endpoint


export default indexRoute;
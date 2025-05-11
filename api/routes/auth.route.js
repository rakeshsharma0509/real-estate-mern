import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";


const router = express.Router();

// login register aur logout ke function controllers mein 
// likhe hai jo call hoge when /register pr post request aayegi 

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;

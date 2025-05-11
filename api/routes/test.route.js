import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ynha phele verify token chalega then should be logged in 
router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
// this for admin or not
router.get("/should-be-admin", shouldBeAdmin);

export default router;

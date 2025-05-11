import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber
} from "../controllers/user.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);// gets all user in database
// router.get("/search/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser); // update the user data based on id but before have to verify token 
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);//post save krne ke liye
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);// notification sync ke liye 

export default router;

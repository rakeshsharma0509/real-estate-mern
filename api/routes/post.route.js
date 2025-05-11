import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";


const router = express.Router();

router.get("/", getPosts); // multiple posts
router.get("/:id", getPost);// specific user post
router.post("/", verifyToken, addPost); // to post we have to be validated
router.put("/:id", verifyToken, updatePost); // to udpate
router.delete("/:id", verifyToken, deletePost); // to delete post

export default router;


// ye return router kiya hai app.js mein jnha par ye use ho rha hoga toh ye 
// ynha aayega then endpoint ke hissab se chalega 
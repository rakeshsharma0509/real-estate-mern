import express from "express";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);// chats 
router.get("/:id", verifyToken, getChat);// single chat using id
router.post("/", verifyToken, addChat); // create a new chat 
router.put("/read/:id", verifyToken, readChat);// read the chat 

export default router;

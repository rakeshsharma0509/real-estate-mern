import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import env from "dotenv";


const app = express();
env.config();

 // broswer cross origin allow krder isliye server ke header mein daalnea padega 
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json()); // ye allow krega ki req ke andar json aa ske jisko hum uss kre to do something like create user
app.use(cookieParser());


// common end point api hai uske baad manle post hai toh  hum usko post route pr bhej 
// denge jo post  route mein jaayega phir url mein jo endpoint hai aur konsa method hai uss 
// hissab se udhr handle ho jayega.


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});

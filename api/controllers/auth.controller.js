import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // HASH THE PASSWORD

    //10 means 10 salting round hoge salt khud generate hoga and then store rehta hash mein mein so
    // we can use it with password to match the hash again 
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // primsa client is created and imported
    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username, // jab key aur value ka naam same ho toh only value dedo
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid Credentials! Try again" });
  }
};



//body se username and passwrod lenge
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS
    // given the username to search 
    const user = await prisma.user.findUnique({
      where: { username },
    });
     //if user not exists
    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // If user exists then CHECK IF THE PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER

 
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week
// a token is created and the payload includes user details and time upto which token is valid it is stored in cookie and is secured
// client sent this token in http header and server validates the token by taking the user details and according to it proceeds.
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    //passwrod alg le liya and rest of info userInfo mein rkh li spread operator ka use krke 
    // aur ye info neeche bhej di client ko when login ho gya hai udhr vo update kr dega profile current user etc
    const { password: userPassword, ...userInfo } = user;

    res.cookie("token", token, {
        httpOnly: true, // client side js cant  access cookie
        // secure:true, // in production mode it will be on
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};


// for logout the token is cleared from cookies that's it.
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

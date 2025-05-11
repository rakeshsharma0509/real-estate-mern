import jwt from "jsonwebtoken";


// ismein hum verify krke ya toh error bhej rhe hai ya phir userID ko token se leke req mein sent kr rhe hai 
//  iss id ka use hum protected resources ke liye krenge
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    req.userId = payload.id;

    next();
  });
};

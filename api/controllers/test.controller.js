import jwt from "jsonwebtoken"; // library se import kr lenge to verify the token use a built-in method.

// verify hoke check kr lega ki user Authenticatd or not
export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId)
  res.status(200).json({ message: "You are Authenticated" });
};


// ye admin purpose ke liye hai ki jo id aayi hai vo 
export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  // if token doesnt exist then no cookie so send not authenticated.
  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    res.status(200).json({ message: "You are Authenticated" });
  });

  
};

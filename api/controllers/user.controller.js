import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";


// gets all users from database for debuging purpose
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};



// get user from url param not using but for debugging purpose
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};



// verify hone ke baad he aayge idhe otherwise phle he error aa jayega 
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // verify token ke badd req mein id aa jati hai 
  const { password, avatar, ...inputs } = req.body; // ynha par password aur avatar alag le liya baaki same rahega in input

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });  
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);// password ka hash bana diya  and usko updated mein daal diya
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    // updated password ka hash ko remove kr diya is object mein se wrna vo bhi client ke pass chle jaata
    // thats why ye kia hai.
    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};



export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};


// hum ynha save post kr rhe hai on clicking single page save option
// if saved toh phir unsave ho jayega otherwise save ho jayega 

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};




// user ke profile par posts dikhane ke liye 

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  // niche waale mein user ke saare posts liye hai to show him
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

// ismein hum saved post lenge aur vo post include waale post mein return krwayenge
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });
// saved par map chala ke post leke saved post waali list dikha denge 
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });// posts and saved post dono dikha denge 
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};



// kitne message unseen hai vo dekh rha hai ye 
export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

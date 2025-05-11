import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";


// ynha par posts select hoge aur return hoge loader ko then list waale page pr show hoge
export const getPosts = async (req, res) => {
  const query = req.query; // query parameters lenge request mein
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: {equals:query.city || undefined,mode:'insensitive'}, //undefined mtlb vo criteria nhi dia toh vo sbke liye search krega
        type: query.type=='any'|| query.type==''?undefined:query.type,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: { 
          gte: query.minPrice !== undefined && query.minPrice !== '' ? parseInt(query.minPrice) : undefined, 
          lte: query.maxPrice !== undefined && query.maxPrice !== '' ? parseInt(query.maxPrice) : undefined
        },
      },
    });
    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id }, // post ki id lenge uss se post ko get krenge
      include: {   // post ki detail i chahieye therefore include mein post detail is true
        postDetail: true,
        user: {  // user ki details bhi chahiye toh vo bhi true hai
          select: {
            username: true,  // user ka name chahiye 
            avatar: true,   // avatar chahiye post ke sath
          },
        },
      },
    });

    // ye neeche waala process sirrf check krne ke liye hai ki ye post user ne save kr rkhi hai ki nhi 
    // agr savedPost mein mil gyi toh true else false
    const token = req.cookies?.token; // token liya

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({  // post find krega with combination of postId and userId
            where: {
              userId_postId: {  
                postId: id,
                userId: payload.id,
              },
            },
          });
          res.status(200).json({ ...post, isSaved: saved ? true : false }); // if fouund true then it returns true else false.
        }
        else{
          res.status(200).json({ ...post, isSaved: false });
        }
      });
    }
   
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  // ynha jab hum create krnege toh khoob detail daalenge toh uske toh vo saari mila ke post ke liye bhi hogi aur post detail ke liye bhi hogi
  // toh  hum dono ko separate krke phir alag alag collection mein store karenge
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail, /// humne post detail bhi alg nikal li aur bhejte wqt he hum body ke andar alag alg objects banke jayenge. 
        },// ynha create prisma ke liye hai ki postDetail collection mein create kr new entry vo bata rha hai ki nayi post hai 
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    if(req.params.id===undefined || req.params.id===null)return req.status(500).json({message:"please enter id"})
    await prisma.post.update({
      where: { id: req.params.id },
      data: {
        ...req.body.postData
           }
    });
    res.status(200).json({message:'updated successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};


//only handles the post that doesnot have the post detail.

// export const deletePost = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not Authorized!" });
//     }

//     await prisma.post.delete({
//       where: { id },
//     });

//     res.status(200).json({ message: "Post deleted" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete post" });
//   }
// };



// if there exist a postdetail then it should be deleted first 
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId; // Assuming userId is extracted from a token

  try {
    // Check if the post belongs to the user
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        postDetail: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "You do not have permission to delete this post" });
    }

    // Delete the associated PostDetail if it exists
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: {
          postId: id,
        },
      });
    }
    await prisma.savedPost.deleteMany({
      where: { postId: id }
  });
    // Delete the Post
    const deletedPost = await prisma.post.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

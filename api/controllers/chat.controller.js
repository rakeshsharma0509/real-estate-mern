import prisma from "../lib/prisma.js";



// jab tu messages dekhega toh tujhe jisne bheja hai uska username and avatar dikhna chahiye 
// so uske liye he  hum phele receiver ki id lenge 
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  // saari chats phele to load krnege jo apni hai using below function.
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });


    // saari chats find krke har par loop laga ke unke sender ki info 
    // users ki name profile avatar dikhayenge 
    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver; // chat ke andar ek receiver property bhi banayi aur usko bhej diya uske andar 
    }

    res.status(200).json(chats);// ye saari chats loader ko bhej di
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};


//to find chat using the id 
export const getChat = async (req, res) => {
  const tokenUserId = req.userId; 

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id, // chat id is used to take the 
        userIDs: { // to ensure that is user can acces this chat or not 
          hasSome: [tokenUserId],// so in chats id we search if it is receiver or sender.
        },
      },
      include: { // it will include the messages in the ascendeing order last msg will be seen first
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // this method is used to update the last seen array bcs the chat is seen by the user 
    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId], // we will push the user id using tokens
        },
      },
    });
    res.status(200).json(chat); // we will return the chat.
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};


// it will take khudki user id and id of the receiver which we have to sent inside request.
// hum chat collection mein sender aur receiver dono ki id save krte hai.

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId], // userIDs: mein char di dono
      },
    });
    res.status(200).json(newChat); // new chat return krdi
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};



// when we read the chat wwe also update the last seen array
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],// ye set tha push kr diya hai
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

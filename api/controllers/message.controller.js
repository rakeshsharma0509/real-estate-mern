import prisma from "../lib/prisma.js";


//chat id 
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId; // ye url params le liya tha
  const text = req.body.text; // the chat text

  try {
    // this to check this chat belongs to us or not 
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // here we create the message insert text chatid and userId of sender in it
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // update the seen by array 
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text, // we will update the last message to the recent text we sent
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};

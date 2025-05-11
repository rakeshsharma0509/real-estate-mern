import { Server } from "socket.io";
import cors from 'cors';

// humara client iss origin so toh he server se connect ho paaye
// humare server ka naam hai io
const io = new Server({
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your client's origin
    methods: ["GET", "POST"], // Specify the methods allowed
  },
});

// ynha par humne online user means the user who are connected to our server using web socket connection 
let onlineUser = [];

//check krta hai user already connected hai ki nhi agr nhi toh phir push krta hai usse array mein.
const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};


// agr user band krde cut krde toh usse onliner users se hata denge
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// jaise he connection ho toh add kr dega online user mein user id aur uski socket id 
io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

// ynha par hum send message ke event ko listen krnege 
// receiver id leker aur data le kr 

  // socket.on("sendMessage", ({ receiverId, data }) => {
  //   const receiver = getUser(receiverId);
  //   io.to(receiver.socketId).emit("getMessage", data);
  // });


  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`Message sent to user ${receiverId} with socket ID ${receiver.socketId}`);
    } else {
      console.log(`Receiver with ID ${receiverId} not found`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// humara socket server will listen to this port number 
io.listen("4000");

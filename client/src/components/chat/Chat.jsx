import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";


// as props chat ko pass kr diya saari chats ka data 
function Chat({ chats }) {
  const [chat, setChat] = useState(null);// message update hone chahiye na ui mein uske liye hai 
  const { currentUser } = useContext(AuthContext); // agr humne seen kr liya hai toh alg color effect de uske liye user chahiye 
  const { socket } = useContext(SocketContext);// socket le liya 

  const messageEndRef = useRef(); // chat ko scroll na krna pade

  // chat open hone par hum notification store ka mein decrease action ka use krnege 
  const decrease = useNotificationStore((state) => state.decrease);

  // jasie he apne chat mein kuch change hoga toh ye chalega aur automatically scroll ho jayegi chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);


  //chat ko open krne ke liye
  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      //ye isliye kiya hai ki dekhne ke baad vo minus one par naa chala jaaye
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  // agr hum msg likh kr send pr click krteb hai uske liye likha hai
  //hum api request bhejnege aur chat id ka use krke message uss chat mei store krnege
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");
    // agr khali text hai toh kuch nhi kro 
    if (!text) return;
    try {
      // return mein vo message aayega store hone baad  res mein
      const res = await apiRequest.post("/messages/" + chat.id, { text });
      // setchat ka use krke prev message waise he aur naya message end mein append kr diya
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();// message bhejene ke baad field reset kro
      
      // ynha par sendMesage event emit kr rhe hai aur receiver ki id bhej rhe hai aur data bhej rhe hai 
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };



  useEffect(() => {
    // ye message aagya hai realtime mein toh readbhi hogya hai uske liye read function banaya hai 
    // ye apne database mein read wala controller chala dega jo uska seen wgra update kr dega 
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };
// check kr rha hai ki chat available hai mtln wahi chat open kr rkhi hai 
// jis pr message aaya hai toh naya message show krdo usko chat mein
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();// msg aate he read waala chal jaaye 
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            // hum ynha check kr rhe hai ki humne that is current user ne message dekha ki nhi uss hissab se effect
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            // chat par click krte he uske saath personal chat open ho jaaye
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" /> 
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf: message.userId !== currentUser.id? "flex-start": "flex-end",
                  textAlign: message.userId !== currentUser.id ? "left":"right",
                }}
                key={message.id}
              >
                {/* ynha format library ka use krke msg ka time bataya krne ke respect mein */}
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;

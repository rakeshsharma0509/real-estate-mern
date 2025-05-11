import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null); // socket ke andar apna connection socket hai

  // this will create connection to our server io whenever the provider wrapped child will 
  // mount. the connection will be created with the server.humara client ka address toh cors mein daal rkha hai already 
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);


  // agr current user hai aur connection bana liya hai toh user ki info bhej rha hai
  useEffect(() => {
  currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

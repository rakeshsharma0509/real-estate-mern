 import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();


//context provider mein child pass hoge aur vo saare child context ka use kr paayenge 
// jismein hum user ki info store rkhnege
export const AuthContextProvider = ({ children }) => {
  //ye check kr rha hai ki local storage mein koi user hai ki nhi agr hai toh
  //currentUser mei vo jaayega otherwise null rahega
  
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  //update user ek function banaya hai jo current user mein user bhr dega
  const updateUser = (data) => {
    setCurrentUser(data);
  };


  //jaise he humare current user mein koi change ho toh usse local storage mien update krdee as string
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);


  // ynha value pass kri hai childern ko 
  return (
    <AuthContext.Provider value={{ currentUser,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

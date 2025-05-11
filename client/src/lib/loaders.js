import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
// query parmaters leke hum search krenge ki konse konse post laane hai 
// defer ka use krke hum concurrent data fetching enable krte hai idhr humne await ka use bhi nhi kiya 
//  pending promise bhejte hai jo sidha component mein handle hota hai .
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};


// profile page par chat aur uske posts load krne ke liye loader.
export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};

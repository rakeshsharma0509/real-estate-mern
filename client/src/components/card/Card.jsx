import { Link } from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest";

function Card({ item }) {
  async function deletePost(){
    try {
      const res=await apiRequest.delete(`/posts/${item.id}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
            <div className="icon" onClick={()=>deletePost()}>
              <img src="/delete.png" alt="" />
            </div>
            <Link to={`/edit/${item.id}`} className="icon" >
              <img src="/edit.png" alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

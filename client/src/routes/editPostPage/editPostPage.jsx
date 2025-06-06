import { useState } from "react";
import "./editPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useLoaderData, useNavigate } from "react-router-dom";

function EditPostPage() {
    const post=useLoaderData();
    console.log(post);
  const [value, setValue] = useState(post.desc || ""); // text editor ke liye hook hai ye
  const [images, setImages] = useState(post.images || []);// ye images ka array liya hai 
  const [error, setError] = useState("");
  const [data,setData]=useState({
        title: post.title || "",
        price: post.price || 0,
        address: post.address || "",
        city: post.city || "",
        bedroom: post.bedroom ||    1,
        bathroom: post.bathroom || 1,
        type: post.type || "rent",
        property: post.property || "owner",
        latitude: post.latitude || "",
        longitude: post.longitude || "",
        images: images,
        desc: value,
        utilities: post.utilities || "",
        pet: post.pet || "not-allowed",
        income: post.income || "",
        size: post.size || 0,
        school: post.school || 0,
        bus: post.bus || 0,
        restaurant: post.restaurant || 0,
  })
  function handleChange(e){
    setData({...data,[e.target.name]:e.target.value});
  }
  const navigate = useNavigate()

  //form se data lenge then n
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    try {
      // post route par post request bheji jiss par phele token verify hoga then addpost chalega
      const res = await apiRequest.put(`/posts/${post.id}`, {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/"+post.id) // redirect to single page of the nwly created post app.jsx mein ye route handle ho rha hai
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input onChange={(e)=>handleChange(e)} value={data.title} id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input onChange={(e)=>handleChange(e)} value={data.price} id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input onChange={(e)=>handleChange(e)} value={data.address} id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input onChange={(e)=>handleChange(e)} value={data.city} id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input onChange={(e)=>handleChange(e)} value={data.bedroom} min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input onChange={(e)=>handleChange(e)} value={data.bathroom} min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input onChange={(e)=>handleChange(e)} value={data.latitude} id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input onChange={(e)=>handleChange(e)} value={data.longitude} id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select onChange={(e)=>handleChange(e)} value={data.type} name="type">
                <option value="rent">
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select onChange={(e)=>handleChange(e)} value={data.property} name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select onChange={(e)=>handleChange(e)} value={data.utilities} name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select onChange={(e)=>handleChange(e)} value={data.pet} name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
              onChange={(e)=>handleChange(e)}
                value={data.income}
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input onChange={(e)=>handleChange(e)} value={data.size} min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input onChange={(e)=>handleChange(e)} value={data.school} min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input onChange={(e)=>handleChange(e)}  value={data.bus} min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input onChange={(e)=>handleChange(e)} value={data.restaurant} min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Update</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      {/* ynha widget kiya hai to upload pictures in arryas  */}
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true, // allow multiple pics to get upload 
            cloudName: "dsrnynmmg",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages} // ye upload widget mein bhej diya wnha vo previous ko rkhta hai and nayi ko append kr deta hai.
        />
      </div>
    </div>
  );
}

export default EditPostPage;

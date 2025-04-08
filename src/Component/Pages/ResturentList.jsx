import React, { useEffect,useState } from "react";
import "../Style/RestaurentList.css";
import Navbar from "../Core/Navbar";
import { categoryProduct } from "../Services/Operations/ProductAPI";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

const ResturentList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // console.log("Actual",searchParams)
    const categoryId = searchParams.get("Id");
    console.log("category id : ", categoryId);
    const { loginData } = useSelector((state) => state.user);
    const [restaurant, setRestaurant] = useState([]);
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const formData = new FormData();
        formData.append("categoryId",categoryId);
        const result = await categoryProduct(formData);
        console.log("Restaurant : ", result);
        if(result.success === true){
          setRestaurant(result.data)
        }
      } catch (error) {
        console.error("Error fetching restaurantamsdhbaj:", error);
      }
    };
    loadProduct();
  }, []);

  const handleProductClick = (restaurantId) => {
    //console.log("Restaurant :--> ",restaurantId);
    navigate("/product-listing", {
      state: { categoryId, restaurantId },
    });
  };
  

  return (
    <div>
      <Navbar />
      <div className="restaurant-container" style={{ marginTop: "83px" }}>
        {restaurant.map((item) => (
          <div key={item.id} className="restaurant-card"  onClick={() => handleProductClick(item.restaurant.id)}>
            <img
              src={item.restaurant.image}
              alt={item.restaurant.name}
              className="restaurant-image"
              style={{cursor:"pointer"}}
            />
            <div className="restaurant-info">
              <h2>{item.restaurant.name}</h2>
              {/* <p className="restaurant-address">{restaurant.address}</p> */}
              <p className="restaurant-rating">⭐ {item.restaurant.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResturentList;

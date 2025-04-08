import React, { useState, useEffect } from "react";
import Navbar from "../Core/Navbar";
import { FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../Style/Product.css";
import { Link } from "react-router-dom";
import veg from "../../assets/1531813273.png";
import nonveg from "../../assets/1531813245.png";
import {
  fetchParticularProduct,
  fetchRestaurentProductDetails,
} from "../Services/Operations/ProductAPI";
import { useLocation } from "react-router-dom";
import {
  cart_data,
  getCart_data,
  cart_delete,
} from "../Services/Operations/ProductAPI";
import {
  addCart,
  addOrder,
  removeCart,
  removeOrder,
} from "../Redux/Cart-system";

const Product = () => {
  const location = useLocation();
  const { categoryId, restaurantId } = location.state || {};
 //const { categoryId } = location.state || {};
  // console.log("categoryId : ", categoryId);
  // console.log("restaurantId : ", restaurantId);

  const { orderState, totalItem } = useSelector((state) => state.cart);
  const { loginData } = useSelector((state) => state.user);
  console.log("loginData : ", loginData);
  const [response2, setResponse2] = useState([]);
  const [itemType, setItemType] = useState("");
  const [tableId, setTableId] = useState("1");
  // const [restaurantId, setrestaurantId] = useState("5");
  const [popular_qty, setPopular_qty] = useState([]);
  const [userId, setuserId] = useState("1");
//  const userId = useSelector((state) => state.user.userId);
  console.log("User ID:", userId);
  //console.log("orderState : ", orderState);
  const navigate=useNavigate();

  useEffect(() => {
    const loadProduct1 = async () => {
      //console.log(categoryId);
      if (categoryId) {
        try {
          const formData = new FormData();
          formData.append("categoryId", categoryId);
          formData.append("restaurantId", restaurantId);
          formData.append("table_id", tableId);
          formData.append("user_id", userId);
          console.log(formData);
          for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
          
          const data = await fetchRestaurentProductDetails(formData);
         // console.log("Saifuddin................", data);

          if (data) {
            console.log("product : ",data.data.products)
            setResponse2(data.data.products);
            console.log(".........................");
            // console.log(response1)
          } else {
            console.error("No products found for the given category ID");
          }
        } catch (err) {
          console.log("Error fetching product data");
        }
      }
    };

    loadProduct1();
  }, [categoryId]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const user_id = userId;
        const response = await getCart_data(user_id);
        console.log("Cart Data in popular section", response.data.data);
        setPopular_qty(response.data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartData();
  }, []);

  const fetchCartData1 = async () => {
    try {
      const user_id = userId;
      const response = await getCart_data(user_id);
      console.log("Cart Data in popular section", response.data.data);
      setPopular_qty(response.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const dispatch = useDispatch();

  const getItemQuantity = (product) => {
    console.log("quantity of order state : ",product)
    const cartItem = orderState.find(
      (cartItem) =>
        Number(cartItem.product_id) === Number(product.product_id) &&
        String(cartItem.restaurant_id) === String(restaurantId)
    )
    console.log("cartItem : ",cartItem)
    return cartItem ? cartItem.qty : 0;
  };

  const handleOrder = async (product, qty = 1) => {
    console.log("product : ", product);
    console.log("restaurantId : ", restaurantId);
    if(loginData){
    try {
      const token = loginData.access_token;
      const formData = new FormData();
      formData.append("restaurantId", restaurantId);
      formData.append("productId", product.product_id);
      formData.append("qty", qty);

      const response = await cart_data(formData, token);
      console.log("response : ", response);
      if (response.data.success) {
        dispatch(
          addOrder({
            restaurant_id: restaurantId,
            product_id: product.product_id,
            qty,
          })
        );
        dispatch(addCart(response.data.data));
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  }
  else {
    navigate('/login');
  }
  };

  const handleCountPositive = (product) => {
    const currentQty = getItemQuantity(product);
    handleOrder(product, currentQty + 1);
  };

  const handleCountNegative = (product) => {
    const currentQty = getItemQuantity(product);
    if (currentQty > 1) {
      handleOrder(product, currentQty - 1);
    } else {
      dispatch(
        removeOrder({
          restaurant_id: String(restaurantId),
          product_id: Number(product.product_id), 
        })
      );      
      dispatch(
        removeCart({
          restaurant_id: product.restaurant_id,
          product_id: product.product_id,
        })
      );
    }
  };

  const handleFetchNonVeg = () => {
    setItemType("Non-Veg");
  };
  const handleFetchVeg = () => {
    setItemType("Veg");
  };

  // const filteredItems =
  //   itemType === ""
  //     ? response2
  //     : response2.filter((item) => item.prod_type === itemType);

  return (
    <div className="Product-wrapper">
      <Navbar style={{ marginTop: "65px" }} />
      <div className="product-section">
        <div className="Product-container">
          <div className="menu-bar">
            <Link className="menu-bar-link" to="/">
              <p className="menu-angle-right">
                Home <FaAngleRight />
              </p>
            </Link>
            <p className="menu-text">Menu</p>
          </div>
          <div className="section2-all-container Product-all-container">
            {response2.map((item, index) => (
              <div
                key={index}
                className="section2-one-container product-one-container"
                style={{ gap: "0px", marginTop: "29px",justifyContent:"flex-start"}}
              >
                <img
                  src={item.product_image}
                  alt="..."
                  // width="220px"
                  // height="220px"
                  style={{ width: "100%", height: "170px",marginBottom:"0px"}}
                />
                <h5>{item.product_name}</h5>
                {/* <p><FaMapMarkerAlt /> {item.text2}</p> */}
                <span className="section2-span-rs">Price : ₹{item.price}</span>
                {!orderState.some(
                  (cartItem) =>
                    Number(cartItem.product_id) === Number(item.product_id) &&
                    String(cartItem.restaurant_id) === String(restaurantId)
                ) ? (
                  <button
                    className="section2-one-btn"
                    onClick={() => handleOrder(item)}
                  >
                    Order Now
                  </button>
                ) : (
                  <div className="section-btn">
                    <button
                      className="section-add-sub"
                      onClick={() => handleCountNegative(item)}
                    >
                      -
                    </button>
                    <span>{getItemQuantity(item)}</span>
                    <span>{item.qty}</span>
                    <button
                      className="section-add-sub"
                      onClick={() => handleCountPositive(item)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

import React, { useEffect, useState } from "react";
import "../Style/Restaurant.css";
import { useLocation, useNavigate } from "react-router";
import {
  cart_data,
  fetchRestaurentProductDetails,
  getCart_data,
} from "../Services/Operations/ProductAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  addOrder,
  removeCart,
  removeOrder,
} from "../Redux/Cart-system";
import Cookies from "js-cookie";
import Navbar from "../Core/Navbar";
import noProductImage from "../../assets/No Product1.png";


export const ResturentPoduct = () => {
  const { loginData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const restaurantId = searchParams.get("Id");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { orderState } = useSelector((state) => state.cart);
  const [popular_qty, setPopular_qty] = useState([]);

  const userId = localStorage.getItem("user_id");
  const tableId = localStorage.getItem("user_id");

  const dispatch = useDispatch();
  const navigate=useNavigate();

  const getItemQuantity = (product) => {
    const cartItem = orderState.find(
      (cart) =>
        cart.product_id === product.product_id &&
        cart.restaurant_id === restaurantId
    );
    return cartItem ? cartItem.qty : 0;
  };

  const handleOrder = async (product, qty = 1) => {
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
          restaurant_id: restaurantId,
          product_id: product.product_id,
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

  useEffect(() => {
    const loadProductData = async () => {
      if (restaurantId) {
        try {
          const formData = new FormData();
          formData.append("restaurantId", restaurantId);
          formData.append("user_id", userId);
          if (selectedCategoryId !== null) {
            formData.append("categoryId", selectedCategoryId);
          }
          const response = await fetchRestaurentProductDetails(formData);

          if (response && response.data) {
            console.log("Categories : ",response)
            setCategories(response.data.categories);
            setProducts(response.data.products);
            setRestaurantDetails({
              id: response.data.id,
              name: response.data.name,
              image: response.data.image,
              rating: response.data.rating,
            });
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching product data", err);
        }
      }
    };

    loadProductData();
  }, [restaurantId, selectedCategoryId]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId === 0 ? null : categoryId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="restaurant-container">
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          className="restaurant-header"
          style={{ marginTop: "65px", width: "100%" }}
        >
          <img
            src={restaurantDetails.image}
            alt={restaurantDetails.name}
            className="restaurant-image"
          />
          <div className="restaurant-info1">
            <h1>{restaurantDetails.name}</h1>
            <p className="rating">Rating: {restaurantDetails.rating}</p>
          </div>
        </div>

        <div className="categories" style={{ width: "100%" }}>
          <div className="category-list">
            {categories.length > 1 && categories.map((category) => (
              <div
                key={category.category_id}
                className={`category-item ${
                  selectedCategoryId === category.category_id ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.category_id)}
              >
                {category.icon && (
                  <img
                    src={category.icon}
                    alt={category.category_name}
                    className="category-icon"
                    style={{ cursor: "pointer" }}
                  />
                )}
                <span>{category.category_name}</span>
              </div>
            ))}
          </div>
        </div>

        {products.length > 0 ? (
        <div className="products" style={{ width: "100%" }}>
          <h2>Products</h2>
            <div className="product-list">
              {products.map((product) => (
                <div key={product.product_id} className="product-item">
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="product-image"
                    style={{ cursor: "pointer" }}
                  />
                  <div className="product-details">
                    <h3>{product.product_name}</h3>
                    <p>{product.description}</p>
                    <p className="price">Price : ₹{product.price}</p>
                    {!orderState.find(
                      (cartItem) =>
                        cartItem.product_id === product.product_id &&
                        cartItem.restaurant_id === restaurantId
                    ) ? (
                      <button
                        className="section2-one-btn"
                        onClick={() => handleOrder(product, 1)}
                      >
                        Order Now
                      </button>
                    ) : (
                      <div className="section-btn">
                        <button
                          className="section-add-sub"
                          onClick={() => handleCountNegative(product)}
                        >
                          -
                        </button>
                        <span>{getItemQuantity(product)}</span>
                        <button
                          className="section-add-sub"
                          onClick={() => handleCountPositive(product)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </div>
          ) : (
            <div className="no-products" style={{marginTop: "92px"}}>
              <img
                //src="Assets/img/gallery/No Product1.png"
                src={noProductImage}
                alt="No Products Found"
                className="no-products-image"
                style={{ width: "300px", margin: "0 auto", display: "block" }}
              />
            </div>
          )}
        </div>
      </div>
  );
};

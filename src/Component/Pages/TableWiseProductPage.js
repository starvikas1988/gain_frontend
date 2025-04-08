import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Services/api";
import "../Style/TableWiseProductPage.css";
import Navbar from "../Core/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import veg from "../../assets/1531813273.png";
import nonveg from "../../assets/1531813245.png";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  fetchParticularProduct,
  fetchRestaurentProductDetails,
} from "../Services/Operations/ProductAPI";

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

const TableWiseProductPage = () => {
  const { id: tableId } = useParams();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orderState, totalItem } = useSelector((state) => state.cart);
  const [restaurantId, setrestaurantId] = useState("1");
  const { loginData } = useSelector((state) => state.user);
  const [itemType, setItemType] = useState("");
  const navigate=useNavigate();
  // Fetch categories and default products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const res = await api.get(`table/${tableId}/categories`);
        console.log("Category API Response:", res.data);
        if (res.data) {
          const categoryList = res.data;
          setCategories(categoryList);

          if (categoryList.length > 0) {
            const firstCategory = categoryList[0];
            setSelectedCategoryId(firstCategory.id);
            fetchProducts(firstCategory.id);
          
            // Set restaurantId from the category
            if (firstCategory.restaurant_id) {
              setrestaurantId(firstCategory.restaurant_id);
            }
          }
          
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    if (tableId) {
      localStorage.setItem("tableId", tableId);
    }

    fetchCategoriesAndProducts();
  }, [tableId]);

  // Fetch products by category
  const fetchProducts = async (categoryId) => {
    setLoading(true);
    try {
      const res = await api.get(`categories/${categoryId}/products`);
      if (res.data) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle category switch
  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
    fetchProducts(catId);
  };

  const dispatch = useDispatch();

  const getItemQuantity = (product) => {
    console.log("quantity of order state : ",product)
    const cartItem = orderState.find(
      (cartItem) =>
        Number(cartItem.product_id) === Number(product.id) &&
        String(cartItem.restaurant_id) === String(restaurantId)
    )
    console.log("cartItem : ",cartItem)
    return cartItem ? cartItem.qty : 0;
  };

  
    const handleOrder = async (product, qty = 1) => {
      console.log("product : ", product);
      console.log("restaurantId : ", restaurantId);
      console.log("tableId : ", tableId);
      if(loginData){
      try {
        const token = loginData.access_token;
        const formData = new FormData();
        formData.append("restaurantId", restaurantId);
        formData.append("productId", product.id);
        formData.append("qty", qty);
        formData.append("tableId", tableId);
  
        const response = await cart_data(formData, token);
        console.log("response : ", response);
        if (response.data.success) {
          dispatch(
            addOrder({
              restaurant_id: restaurantId,
              product_id: product.id,
              qty,
              ...(tableId && { table_id: tableId }), // Include tableId if available
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
            product_id: Number(product.id), 
          })
        );      
        dispatch(
          removeCart({
            restaurant_id: product.restaurant_id,
            product_id: product.id,
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

  return (
   <>
   <Navbar />
        <div className="table-wise-product-page">
        <h2 style={{ marginBottom: "20px" }}>Choose From Our Menu</h2>
    
        {/* Category Listing */}
        {categories && categories.length > 0 ? (
        <div className="category-list">
            {categories.map((cat) => (
            <button
                key={cat.id}
                className={`category-btn ${cat.id === selectedCategoryId ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.id)}
            >
                {cat.name}
            </button>
            ))}
        </div>
        ) : (
        <p>Categories not loaded yet or empty</p>
        )}

    
        {/* Products */}

      <div className="product-list">
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          products.map((prod) => (
            <div key={prod.id} className="product-card">
              <img src={prod.image} alt={prod.name} />
              <h3>{prod.name}</h3>
              <p>₹{prod.price}</p>

              {!orderState.some(
                (cartItem) =>
                  Number(cartItem.product_id) === Number(prod.id) &&
                  String(cartItem.restaurant_id) === String(restaurantId)
              ) ? (
                <button
                  className="order-btn"
                  onClick={() => handleOrder(prod)}
                >
                  Order Now
                </button>
              ) : (
                <div className="quantity-controls">
                  <button
                    onClick={() => handleCountNegative(prod)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span>{getItemQuantity(prod)}</span>
                  <button
                    onClick={() => handleCountPositive(prod)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

        </div>
   </>
        
    
    
  );
  
};

export default TableWiseProductPage;
  
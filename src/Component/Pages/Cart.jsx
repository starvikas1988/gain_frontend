import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeOrder,
  add_total,
  addCart,
  addOrder,
  removeCart,
} from "../Redux/Cart-system";
import { useMemo } from "react";
import "../Style/Cart.css";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  cart_update,
  getCart_data,
  cart_delete,
  cart_data,
  Coupon_data,
  getorderCart,
} from "../Services/Operations/ProductAPI";
import Navbar from "../Core/Navbar";

const Cart = () => {
  const { orderState, totalItem } = useSelector((state) => state.cart);
  const { loginData } = useSelector((state) => state.user);
  const [cartData, setCartData] = useState([]);
  const { All_cart } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [couponData, setCouponData] = useState([]);
  const [couponMessage, setCouponMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const fetchCartData = async () => {
    try {
      console.log("userId : ", userId);
      const user_id = userId.user_id;
      const response = await getCart_data(user_id);
      console.log("get cart response : ", response);
      setCartData(response.data.data);
      dispatch(addCart(response.data.data));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  console.log("All cart : ",All_cart)

  const handleRemove = async (item) => {
    try {
      const token = loginData.access_token;
      const formData = new FormData();
      formData.append("cartId", item.id);
      const response = await cart_delete(formData, token);
      console.log("remove Cart : ", response);
      if (response.data.success === true) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        dispatch(
          removeCart({
            restaurant_id: item.restaurant_id,
            product_id: item.product_id,
          })
        );
        dispatch(
          removeOrder({
            restaurant_id: item.restaurant_id,
            product_id: item.product_id,
          })
        );
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setCartData([]);
    } else {
      fetchCartData();
    }
  }, []);

  const handleOrder = async (product, restaurant_id, qty = 1) => {
    try {
      const token = loginData.access_token;
      const formData = new FormData();
      formData.append("restaurantId", restaurant_id);
      formData.append("productId", product.product_id);
      formData.append("qty", qty);

      const response = await cart_data(formData, token);
      if (response.data.success) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        dispatch(
          addOrder({
            restaurant_id: restaurant_id,
            product_id: product.product_id,
            qty,
          })
        );
        dispatch(addCart(response.data.data));
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleCountPositive = (product) => {
    handleOrder(product, product.restaurant_id, product.qty + 1);
  };

  const handleCountNegative = (product) => {
    if (product.qty > 1) {
      handleOrder(product, product.restaurant_id, product.qty - 1);
    } else {
      // Remove item completely when qty is 1
      dispatch(
        removeOrder({
          restaurant_id: product.restaurant_id,
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

  // Calculate Total Price
  const total = useMemo(() => {
    return All_cart.reduce(
      (total, item) => total + item.product_price * item.qty,
      0
    );
  }, [All_cart]);

  // Apply Coupon
  const applyCoupon = async () => {
    try {
      const token = loginData.access_token;
      const formData = new FormData();
      formData.append("couponCode", couponCode);
      formData.append("totalAmount", total);

      const result = await Coupon_data(formData, token);
      if (result.success === true) {
        setCouponMessage(result.data[0].description);
        setDiscountAmount(result.data[0].discountAmount);
        toast.success("Coupon applied successfully");
      } else {
        setCouponMessage("Invalid coupon code.");
        setDiscountAmount(0);
        toast.error("Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartData();
    }
  }, [userId]);

  useEffect(() => {
    dispatch(add_total(total)); // Update total in Redux state
  }, [total, dispatch]);

  const payableAmount = discountAmount ? total - discountAmount : total;

  const handleCheckout = async () => {
    try {
      const transformedCart = All_cart.map((item) => ({
        restaurant_id: item.restaurant_id,
        product_id: item.product_id,
        quantity: item.qty,
        amount: item.product_price,
      }));
      const token = loginData.access_token;
      const formData = new FormData();
      formData.append("cart", JSON.stringify(transformedCart));
      formData.append("couponCode", couponCode);
      const result = await getorderCart(formData, token);
      console.log("getorderCart : ",result)
      if (result.success === true) {
        const totalAmount = total;
        const GST = result.data.totalGst;
        navigate("/checkout", {
          state: { payableAmount, totalAmount, discountAmount,GST},
        });
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  return (
    <div className="cart-wrapper">
      <Navbar />
      <div className="cart-container" style={{ marginTop: "107px" }}>
        {All_cart.length > 0 ? (
          <>
            <div className="cart-header">
              <h3>Your Cart</h3>
              <div className="cart-slider-list">
                {All_cart.map((item, id) => (
                  <div className="cart-item" key={id}>
                    <img
                      src={item.product.image}
                      alt={`${item.product.name}`}
                    />
                    <div className="cart-ruppes-button">
                    <p className="rupees">{item.product.name}</p>
                      <p className="rupees">Price : ₹{item.product.price}</p>
                      <div className="cart-button-in">
                        <button
                          className="section-add-sub"
                          onClick={() => handleCountNegative(item)}
                        >
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button
                          className="section-add-sub"
                          onClick={() => handleCountPositive(item)}
                        >
                          +
                        </button>
                      </div>
                      <p className="rupees">
                        Total : ₹{item.product_price * item.qty}
                      </p>
                    </div>
                    <div className="cart-remove-btn">
                      <button
                        className="big-btn"
                        onClick={() => handleRemove(item)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div
                className="login-form checkout-form price-checkout"
                style={{ width: "100%", maxWidth: "none" }}
              >
                <form className="form">
                  <div className="login-phone checkout-coupon">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      className="login-input"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="button" onClick={applyCoupon}>
                      Apply Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Total Price Section */}
            <div className="cart-total-price">
              <p className="ps">
                Total Price
                <span>{total}</span>
              </p>
              <p className="ps">
                Discount Amount :{" "}
                <span>{discountAmount ? -discountAmount : 0}</span>
              </p>
              <p className="cart-total-amount ps">
                Payable Amount {discountAmount ? "( 5% discount)" : ""} :{" "}
                <span>{payableAmount}</span>
              </p>

              <div className="cart-total-link">
                <button onClick={handleCheckout} className="cart-total-link">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Please add products to your cart.</p>
            <Link to="/">
              <button className="big-btn">Go to Products</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

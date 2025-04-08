import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../Style/Cart.css";
import "../Style/Checkout.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Footer from "../Core/Footer";
import Navbar from "../Core/Navbar";
import { Commet } from "react-loading-indicators";
import { getAddressAdd, orderValidate, PaymentAdd, PlaceOrder } from "../Services/Operations/ProductAPI";
import { toast } from "react-toastify";
import { deleteAllCart } from "../Redux/Cart-system";

const Checkout = () => {
  const { register, reset, handleSubmit, formState: { isSubmitSuccessful, errors } } = useForm();
  const tableId = localStorage.getItem("tableId");

  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { All_cart } = useSelector((state) => state.cart);
  const [order, setOrder] = useState(false);  // Controls the profile-active class
 
  const [selectedTab, setSelectedTab] = useState(tableId ? "Dine In" : "Delivery");

  const [time, setTime] = useState(""); // for time picker in "Dine In"
  const [pickupTime, setPickupTime] = useState(""); // for "Pickup" time option (Within 1hr, 2hr...)
  const [addressData, setAddressData] = useState([]);
  const location = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [orderId, setOrderId] = useState({});
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [isPickupModalOpen, setPickupModalOpen] = useState(false); 
  const navigate = useNavigate();
  const { payableAmount,totalAmount,discountAmount,GST} = location.state || {};
  console.log("payableAmount : ", payableAmount);

  useEffect(() => {
    if (location.state && location.state.couponCode) {
      setCouponCode(location.state.couponCode);
    }
  }, [location.state]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  if (isSubmitSuccessful) {
    reset({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      time: "",
    });
  }

  useEffect(() => {
    const userProfile = async () => {
      try {
        const token = loginData.access_token;
        const response1 = await getAddressAdd(token);
        setAddressData(response1.data);
        console.log("Address : ",response1.data)
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };
    userProfile();
  }, [loginData.access_token]);

  const total = useMemo(() => {
    return All_cart.reduce(
      (total, item) => total + item.product_price * item.qty,
      0
    );
  }, [All_cart]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Dine In":
        return (
          <div className="pickup-container">
            <label htmlFor="time">Select Time:</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="time-input"
            />
          </div>
        );
      case "Pickup":
        return (
          <div className="pickup-container">
            <p>Select Pickup Time:</p>
            <input 
              onClick={() => setPickupModalOpen(true)}
              placeholder="Select time"
              value={pickupTime}
               className="time-input1"
              readOnly 
            />
          </div>
        );
      case "Delivery":
        return (
          <div className="address-container">
            {addressData.map((item) => (
              <div
                className={`address-item ${selectedAddressId === item.id ? "selected" : ""}`}
                key={item.id}
                onClick={() => setSelectedAddressId(item.id)}
                style={{
                  backgroundColor: selectedAddressId === item.id ? "#e0f7fa" : "#ffffff",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <p><strong>{item.name}</strong></p>
                <p>{item.address},{item.city},{item.state},{item.country},{item.pincode}</p>
                <p>{item.mobile_no}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const handlePickupTimeSelect = (hours) => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + hours);
    const timeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPickupTime(timeString);
    setPickupModalOpen(false); 
  };

  const handlePay = async () => {
    setPaymentModalOpen(true); 
  };

  const loadRazorpayScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  };

  const handleOk = async () => {
    setLoading(true);
  
    if (selectedTab === "Delivery" && !selectedAddressId) {
      toast.error("Please select a delivery address.");
      setLoading(false);
      return;
    }
  
    if (selectedTab === "Pickup" && !pickupTime) {
      toast.error("Please select a pickup time.");
      setLoading(false);
      return;
    }
  
    if (selectedTab === "Dine In" && !time) {
      toast.error("Please select a dine-in time.");
      setLoading(false);
      return;
    }
  
    const token = loginData.access_token;
    const formData = new FormData();
    const filteredCartData = All_cart.map((item) => ({
      restaurant_id: item.restaurant_id,
      product_id: item.product_id,
      quantity: item.qty,
      amount: item.total_amount,
    }));
  
    formData.append("cart", JSON.stringify(filteredCartData));
    formData.append("couponCode", couponCode);
    formData.append("created_by", "APP");
  
    if (selectedTab === "Delivery" && selectedAddressId) {
      formData.append("orderType", "Delivery");
      formData.append("addressId", selectedAddressId);
    } else if (selectedTab === "Dine In") {
      formData.append("orderType", "Dine In");
      formData.append("addressId", "");
      formData.append("tableId", tableId);
    } else if (selectedTab === "Pickup" && pickupTime) {
      formData.append("orderType", "Pickup");
      formData.append("addressId", "");
    }
  
    try {
      const placeOrderResponse = await PlaceOrder(formData, token);
  
      if (placeOrderResponse.success === true) {
        setOrderId(placeOrderResponse.data);
        setOrder(true);
  
        const paymentResponse = await PaymentAdd(placeOrderResponse.data, token);
        if (paymentResponse.success === true) {
          setPaymentId(paymentResponse.data.paymentId);
          setPaymentModalOpen(false);
          setOrder(false);
  
          // Razorpay payment process
          try {
            const options = {
              key: "rzp_test_q8NNolcCI53Vdo",
              amount: total * 100,
              currency: "INR",
              name: "E-commerce Website",
              description: "Test Transaction",
              image: "https://example.com/your_logo",
              order_id: paymentResponse.data.paymentId,
              handler: async function (response) {
                try {
                  const validationResponse = await orderValidate(
                    {
                      paymentId: response.razorpay_payment_id,
                      orderId: placeOrderResponse.data.orderId,
                    },
                    token
                  );
  
                  if (validationResponse.success === true) {
                    dispatch(deleteAllCart());
                    toast.success("Order successfully completed");
                    navigate("/profile");
                  } else {
                    alert("Payment validation failed. Please contact support.");
                  }
                } catch (error) {
                  console.error("Error validating payment:", error);
                }
              },
              prefill: {
                name: "Saifuddin Mondal",
                email: "saifuddin@example.com",
                contact: "9564779055",
              },
              notes: {
                address: "Razorpay Corporate Office",
              },
              theme: {
                color: "#3399cc",
              },
            };
  
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            localStorage.removeItem("tableId");
          } catch (error) {
            alert("Error creating order. Please try again.");
            console.error(error);
          }
        }
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="profile-wrapper">
      {loading ? (
        <div className="Loading-section">
          <div className="commet-container">
            <Commet color="#32cd32" size="medium" text="" textColor="" />
            <p>Loading....</p>
          </div>
        </div>
      ) : (
        <div className={`profile-section ${order ? "profile-active" : ""}`}>
          <Navbar />
          <div className="profile-container checkout-container">
            <div className="profile-header checkout-wrapper" style={{ marginTop: "32px" }}>
              <h1>Customer Details</h1>
              <div className="tab-container">
                <button className={selectedTab === "Dine In" ? "tab active" : "tab"} onClick={() => handleTabChange("Dine In")}>
                  Dine In
                </button>
                <button className={selectedTab === "Pickup" ? "tab active" : "tab"} onClick={() => handleTabChange("Pickup")}>
                  Pickup
                </button>
                <button className={selectedTab === "Delivery" ? "tab active" : "tab"} onClick={() => handleTabChange("Delivery")}>
                  Delivery
                </button>
              </div>
              {renderTabContent()}
            </div>

            <div className="cart-header cart-item-header" style={{ marginTop: "32px" }}>
              <h3>Items</h3>
              <div className="cart-slider-list">
                {All_cart.map((item, id) => (
                  <div className="cart-item" key={id}>
                    <img src={item.product.image} alt={item.product.title} />
                    <div className="cart-ruppes-button checkout-btn-rupees">
                      <p className="rupees">Price : ₹{item.product.price}</p>
                      <p className="rupees">Qty : {item.qty}</p>
                    </div>
                    <div className="cart-remove-btn">
                      <p className="rupees">Total : ₹{item.product.price * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total-price cart-del">
                <p className="ps">Total Price : <span>{totalAmount}</span></p>
                <p className="ps">Discount Amount : <span>{ discountAmount ? - discountAmount : 0}</span></p>
                <p className="ps">GST Price : <span>{GST}</span></p>
                <p className="cart-total-amount ps">Payable Amount : <span>{payableAmount}</span></p>
              </div>
            </div>
          </div>
          <button
            style={{
              width: "75%",
              margin: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "32px",
              fontSize: "17px",
              backgroundColor: "orangered",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 0px",
            }}
            onClick={handlePay}
          >
            Proceed to Pay
          </button>
          <Footer />
        </div>
      )}

{isPaymentModalOpen && (
  <div className="payment-modal">
    <div className="payment-modal-content">
      <h2>Order Successful!</h2>
      <p>Your order is ready to be paid.</p>
      <button onClick={handleOk} className="pay-now-btn">
        Pay Now
      </button>
      <button
        onClick={() => {
          setPaymentModalOpen(false); // Close modal
          setOrder(false); // Reset order state
        }}
        className="close-btn"
      >
        Close
      </button>
    </div>
  </div>
)}


      {/* Pickup Time Modal */}
      {isPickupModalOpen && (
          <div className={`pickup-time-modal1 ${isPickupModalOpen ? 'open' : ''}`}>
          <div className="modal-content">
            <h2>Select Pickup Time</h2>
            <button onClick={() => handlePickupTimeSelect(1)}>Within 1 hour</button>
            <button onClick={() => handlePickupTimeSelect(2)}>Within 2 hours</button>
            <button onClick={() => handlePickupTimeSelect(3)}>Within 3 hours</button>
            <button onClick={() => handlePickupTimeSelect(4)}>Within 4 hours</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

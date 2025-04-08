import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "../Style/OrderDetails.css";
import Navbar from "../Core/Navbar";
import { particularOrder } from "../Services/Operations/ProductAPI";
import { useSelector } from "react-redux";

export const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [gstType, setGstType] = useState("");
  const location = useLocation();
  const { id } = location.state || {};
  const { loginData } = useSelector((state) => state.user);
  console.log("Id : ", id);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = loginData.access_token;
        const response = await particularOrder({ orderId: id }, token);
        console.log("Order Details : ", response.data[0]);
        setOrderDetails(response.data[0]);
        setGstType(response.data[0].gst_type);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchOrder();
  }, []);

  return (
    <div className="order-details-container">
      <Navbar />
      <div style={{maxWidth:"970px",width:"100%",margin:"auto"}}>
        <div className="header">
          <h2>Order Details</h2>
        </div>
        <div className="order-status">
          <h3>Order Status</h3>
          <p>{orderDetails.order_status}</p>
        </div>
        <div className="track-order">
          <h3>Track Order</h3>
          <div className="status-item">
            <div className="circle active">
              <span>✔</span>
            </div>
            <div>
              <p>Ordered</p>
              <p>
                <p>{formatDate(orderDetails.created_at)}</p>
              </p>
            </div>
          </div>
          <div className="status-item">
            <div className="circle active">
              <span>✔</span>
            </div>
            <div>
              <p>Shipped</p>
              <p>{formatDate(orderDetails.created_at)}</p>
            </div>
          </div>
          <div className="status-item">
            <div className="circle active">
              <span>✔</span>
            </div>
            <div>
              <p>Delivered</p>
              <p>
                <p>{formatDate(orderDetails.created_at)}</p>
              </p>
            </div>
          </div>
        </div>
        <div className="order-details">
          <h3>Order Details</h3>
          <div className="detail-item">
            <span>Order ID</span>
            <span>{orderDetails.id}</span>
          </div>
          <div className="detail-item">
            <span>Product Total</span>
            <span>₹{gstType === "Including" ? orderDetails.total_amount - orderDetails.total_tax : orderDetails.total_amount}</span>
          </div>
          <div className="detail-item">
            <span>Total GST</span>
            <span>₹{orderDetails.total_tax}</span>
          </div>
          <div className="detail-item">
            <span>Total Price</span>
            <span>₹{gstType === "Including" ? orderDetails.total_amount : orderDetails.total_amount + orderDetails.total_tax}</span>
          </div>
          <div className="detail-item">
            <span>Payment Mode</span>
            <span>Online</span>
          </div>
        </div>
        <div>
          <h3 style={{ marginTop: "12px" }}>Ordered Items</h3>
          <div className="ordered-items">
            {orderDetails.items &&
              orderDetails.items.map((item, index) => (
                <div className="ordered-item" key={index}>
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="ordered-item-details">
                    <h4>{item.product.name}</h4>
                    <p>Restaurant: {item.restaurant.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total: ₹{item.total_amount}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

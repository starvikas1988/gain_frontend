import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FiPlusCircle, FiEdit, FiTrash2 } from "react-icons/fi";
import "../Style/login.css";
import "../Style/Profile.css";
import "../Style/Checkout.css";
import Navbar from "../Core/Navbar";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { logout } from "../Redux/user_information";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { FaAngleRight } from "react-icons/fa6";
import {
  update_profile,
  get_profile,
  get_order_history,
  logoutProfile_data,
  getAddressAdd,
  orderList,
  deleteAddress,
  update_profile_image,
} from "../Services/Operations/ProductAPI";
import { toast } from "react-toastify";
import { setSignupData } from "../Redux/user_information";
import { logout_Cart } from "../Redux/Cart-system";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [logoutProfile, setLogout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(false);
  const [profile, setProfile] = useState(true);
  const [history, setHistory] = useState();
  const [order, setOrder] = useState(false);
  const { signupData } = useSelector((state) => state.user);
  const { loginData } = useSelector((state) => state.user);
  const [profileData, setProfileData] = useState({});
  const [addressData, setAddressData] = useState([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleProfile = () => {
    setProfile(true);
    setLogout(false);
    setOrder(false);
    setDeliveryAddress(false);
  };
  const handleDeliveryAddress = () => {
    setDeliveryAddress(true);
    setLogout(false);
    setOrder(false);
    setProfile(false);
  };
  const handleOrder = () => {
    setProfile(false);
    setLogout(false);
    setOrder(true);
    setDeliveryAddress(false);
  };
  const handleLogOut = () => {
    setProfile(false);
    setLogout(true);
    setOrder(false);
    localStorage.removeItem("user_id");
    setDeliveryAddress(false);
  };

  const handleLogOutfromLogin = async () => {
    try {
      console.log("token : ", loginData.access_token);
      const token = loginData.access_token;
      const response = await logoutProfile_data(token);
      console.log("Log out : ", response);
      if (response.success === true) {
        //   dispatch(setSignupData(response.data));
        dispatch(logout());
        dispatch(logout_Cart());
        toast.success("LogOut Successfully");
        navigate("/");
      }
    } catch (error) {
      console.error("Error get profile:", error);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      const token = loginData.access_token;
      const formData = new FormData();
      const formData1 = new FormData();
      formData.append("name", data.name);
      formData.append("mobile", data.mobile);
      formData.append("dob", data.dob);
      formData.append("gender", data.gender);
      formData.append("email", data.email);

      if (data.profile && data.profile[0]) {
        formData1.append("image", data.profile[0]);
      }

      const response = await update_profile(formData, token);
      const response1 = await update_profile_image(formData1, token);
      console.log("Update Data : ", response1);
      console.log("Update Profile : ", response);

      if (response.data.success === true && response1.success === true) {
        console.log("token : ", loginData.access_token);
        const token = loginData.access_token;
        const response = await get_profile(token);
        console.log("profile data in profile ", response);
        setProfileData(response.data);
        setProfileImage(response.data.profileimg);
        if (response.success === true) {
          console.log("don");
          dispatch(setSignupData(response.data));
          console.log("don1");
        }
        toast.success("Profile Updated Successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Profile update error");
      console.error("Error updating profile:", error);
    }
  };

  const onSubmit = (data) => {
    handleProfileUpdate(data);
  };

  useEffect(() => {
    const userProfile = async () => {
      try {
        console.log("token : ", loginData.access_token);
        const token = loginData.access_token;
        const response = await get_profile(token);
        const response1 = await getAddressAdd(token);
        const response2 = await orderList(token);
        console.log("order data : ", response2);
        setHistory(response2.data);
        console.log("Address data ", response1.data);
        setAddressData(response1.data);
        console.log("profile data in profile ", response.data);
        console.log(">>>>>>>>>>>don<<<<<<<<<<<<<<<<");
        setProfileData(response.data);
        setProfileImage(response.data.profileimg);
        if (response.success === true) {
          dispatch(setSignupData(response.data));
        }
      } catch (error) {
        console.error("Error get profile:", error);
      }
    };
    userProfile();
  }, [refreshKey]);

  const handleAddAddressClick = () => {
    navigate("/add-address", { state: { addressData: null } });
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addressData.find((item) => item.id === id);
    navigate("/add-address", { state: { addressData: addressToEdit } });
  };

  const handleDeleteAddress = async (id) => {
    const token = loginData.access_token;
    const formData = new FormData();
    formData.append("addressId", id);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    const result = await deleteAddress(formData, token);
    console.log(result);
    if (result.success === true) {
      toast.success("Address deleted successfully");
      setRefreshKey((prev) => prev + 1);
    }
  };

  // console.log("signup data : ", signupData)
  // console.log("profile_image : ",profileImage)

  return (
    <div className="profile-wrapper">
      <div className="profile-navbar">
        <Navbar />
      </div>
      <div className="profile-container">
        <div className="profile-name">
          <div className="profile-user">
            {!profileImage ? (
              <FaUserAlt className="profile-icon-user" />
            ) : (
              <img
                src={`https://caterer.gainenterprises.in//backend/${profileImage}`}
                alt="..."
                width="130"
                className="profile-icon-user"
                style={{
                  width: "161px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            )}
            <h2>Saifuddin Mondal</h2>
          </div>
          <div className="profile-btn">
            <button type="button" onClick={handleProfile}>
              My Profile
            </button>
            <button type="button" onClick={handleOrder}>
              Order History
            </button>
            <button type="button" onClick={handleDeliveryAddress}>
              Delevery Address
            </button>
            <button type="button" onClick={handleLogOut}>
              Log Out
            </button>
          </div>
        </div>
        <div className="login-form profile-login">
          {profile ? (
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="login-phone">
                <label htmlFor="name">Enter Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={signupData.name}
                  placeholder="Enter Your Number"
                  className="login-input"
                  {...register("name", { required: "name is required" })}
                />
                {errors.name && <p>{errors.name.message}</p>}
              </div>
              <div className="login-phone">
                <label htmlFor="email">Enter Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={signupData.email}
                  placeholder="Enter Your Email"
                  className="login-input"
                  {...register("email", { required: "email is required" })}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
              <div className="login-phone">
                <label htmlFor="mobile">Enter Your Phone Number</label>
                <input
                  type="number"
                  id="mobile"
                  name="mobile"
                  defaultValue={signupData.mobile}
                  placeholder="Enter The Phone Number"
                  className="login-input"
                  {...register("mobile", {
                    required: "phone number is required",
                  })}
                />
                {errors.mobile && <p>{errors.mobile.message}</p>}
              </div>
              <div className="login-phone">
                <label htmlFor="dob">Enter Your DOB</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  defaultValue={signupData.dob}
                  placeholder="Enter Your DOB"
                  className="login-input"
                  {...register("dob", { required: "DOB is required" })}
                />
                {errors.dob && <p>{errors.dob.message}</p>}
              </div>
              {/* <div className="login-phone">
                <label htmlFor="location">Enter Your Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  defaultValue={profileData.address}
                  placeholder="Enter Your Location"
                  className="login-input"
                  {...register("location")}
                />
                {errors.location && <p>{errors.location.message}</p>}
              </div> */}
              <div className="login-phone">
                <label htmlFor="gender">Select Your Gender</label>
                <div className="gender-options">
                  <label>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      defaultChecked={signupData.gender === "male"}
                      {...register("gender")}
                      style={{ margin: "0px 8px 0px 0px" }}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      defaultChecked={signupData.gender === "female"}
                      {...register("gender")}
                      style={{ margin: "0px 8px 0px 0px" }}
                    />
                    Female
                  </label>
                </div>
                {errors.gender && <p>{errors.gender.message}</p>}
              </div>

              <div className="login-phone">
                <label htmlFor="profile">Profile Picture</label>
                <input
                  type="file"
                  id="profile"
                  name="profile"
                  {...register("profile")}
                />
                {errors.profile && <p>{errors.profile.message}</p>}
              </div>
              <button type="submit" className="form-btn">
                Save
              </button>
            </form>
          ) : order ? (
            <div className="profile-header profile-header1 cart-header cart-item-header">
              <div className="cart-slider-list">
                {history.map((item, id) => (
                  <div
                    className="cart-item"
                    key={id}
                    onClick={() =>
                      navigate("/order-details", { state: { id: item.id } })
                    }
                  >
                    {/* <img src={itemimage} alt={`${item.title}`} /> */}
                    <div className="cart-ruppes-button checkout-btn-rupees">
                      <p className="rupees">Price : ₹{item.total_amount}</p>
                      {/* <p className="rupees">Qty : {item.qty}</p> */}
                      <p className="rupees">
                        Order Status : {item.order_status}
                      </p>
                      <p className="rupees">
                        Order Date :{" "}
                        <span className="order-data">{item.created_at}</span>
                      </p>
                    </div>
                    <FaAngleRight
                      style={{ fontSize: "28px", marginRight: "14px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : logoutProfile ? (
            <div className="logout-section">
              <h3>Do you want to log out?</h3>
              <button onClick={handleLogOutfromLogin}>Log Out</button>
            </div>
          ) : deliveryAddress ? (
            <div className="select-address-container">
              <h2 style={{ textAlign: "center" }}>Select Delivery Address</h2>
              <div className="add-address-btn" onClick={handleAddAddressClick}>
                <FiPlusCircle size={24} />
                <span>Add New Address</span>
              </div>
              <div className="address-list">
                {addressData.map((item) => (
                  <div className="address-item" key={item.id}>
                    <div>
                      <p>
                        <strong>{item.name}</strong>
                      </p>
                      <p>
                        {item.address}, {item.city}, {item.state},{" "}
                        {item.country}, {item.pincode}
                      </p>
                      <p>{item.mobile_no}</p>
                    </div>
                    <div className="address-actions">
                      <FiEdit
                        size={20}
                        className="edit-icon"
                        onClick={() => handleEditAddress(item.id)}
                        title="Edit Address"
                      />
                      <FiTrash2
                        size={20}
                        className="delete-icon"
                        onClick={() => handleDeleteAddress(item.id)}
                        title="Delete Address"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

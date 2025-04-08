import React from "react";
import "../Style/Profile.css";
import { useLocation, useNavigate } from "react-router";
import Navbar from "../Core/Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { newAddressAdd, updateAddress } from "../Services/Operations/ProductAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function AddAddress() {
  const location = useLocation();
  const { addressData } = location.state || {};
  const { loginData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (addressData) {
      setValue("name", addressData.name);
      setValue("mobile_no", addressData.mobile_no);
      setValue("address", addressData.address);
      setValue("city", addressData.city);
      setValue("state", addressData.state);
      setValue("country", addressData.country);
      setValue("pincode", addressData.pincode);
    }
  }, [addressData, setValue]);

  const onSubmit = async (data) => {
    const token = loginData.access_token;
    if (addressData) {
      console.log("Updating address...");
      const updatedData = {
        ...addressData,
        ...data,
        addressId: addressData.id,
      };
      delete updatedData.id;
      try {
        const result = await updateAddress(updatedData,token)
        console.log("update response : ",result);
        if (result.success === true) {
          toast.success("Address updated successfully!");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error("Failed to update address. Please try again.");
      }
    } else {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("mobile_no", data.mobile_no);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("country", data.country);
      formData.append("pincode", data.pincode);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const result = await newAddressAdd(data, token);
      console.log(result);
      if (result.success === true) {
        toast.success("Address is added");
        navigate("/profile");
      }
    }
  };

  return (
    <div className="add-address-container">
      <Navbar />
     <div style={{maxWidth:"970px",width:"100%",margin:"auto"}}>
     <h3 style={{ textAlign: "center", marginTop: "102px" }}>
        Add New Address
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{ gap: "23px" }}>
        <input
          type="text"
          placeholder="Full name"
          {...register("name", { required: "Full name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}
        <input
          type="text"
          placeholder="Phone Number"
          {...register("mobile_no", { required: "Phone number is required" })}
        />
        {errors.mobile_no && (
          <p className="error">{errors.mobile_no.message}</p>
        )}
        <input
          type="text"
          placeholder="Address"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address && <p className="error">{errors.address.message}</p>}
        <input
          type="text"
          placeholder="City"
          {...register("city", { required: "City is required" })}
        />
        {errors.city && <p className="error">{errors.city.message}</p>}
        <input
          type="text"
          placeholder="State/Province/Region"
          {...register("state", {
            required: "State/Province/Region is required",
          })}
        />
        {errors.state && <p className="error">{errors.state.message}</p>}
        <input
          type="text"
          placeholder="Country"
          {...register("country", { required: "Country is required" })}
        />
        {errors.country && <p className="error">{errors.country.message}</p>}
        <input
          type="text"
          placeholder="Zip Code (Postal Code)"
          {...register("pincode", { required: "Zip code is required" })}
        />
        {errors.pincode && <p className="error">{errors.pincode.message}</p>}
        <button type="submit">SAVE ADDRESS</button>
      </form>
     </div>
    </div>
  );
}

export default AddAddress;

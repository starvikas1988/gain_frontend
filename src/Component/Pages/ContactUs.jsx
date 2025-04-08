import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster
import '../Style/Contact.css';

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    setForm({ name: "", email: "", message: "" })
    toast.success("Message sent successfully!"); 
  };

  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-grid">
          <div>
            <div className="contact-info">
              <FaEnvelope className="icon email-icon" />
              <p>restaurant@gainenterprises.in</p>
            </div>
            <div className="contact-info">
              <FaPhone className="icon phone-icon" />
              <p>+91 87773 47811</p>
            </div>
            <div className="contact-info">
              <FaMapMarkerAlt className="icon location-icon" />
              <p>Kolkata, WB, India</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={handleChange}
              className="contact-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={handleChange}
              className="contact-input"
            />
            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              required
              value={form.message}
              onChange={handleChange}
              className="contact-textarea"
            ></textarea>
            <button
              type="submit"
              className="contact-button"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}

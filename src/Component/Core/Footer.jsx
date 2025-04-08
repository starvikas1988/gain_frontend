import React from 'react'
import { Link } from 'react-router-dom'
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import "../Style/footer.css"
// import { CgMail } from "react-icons/cg";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='footer-wrapper'>
            <div className='footer-container'>
                <div className='footer-list'>
                    <h4>COMPANY</h4>
                    <ul className='footer-unorder-list'>
                        <li><Link className='footer-one-list' to="#">About Us</Link></li>
                        <li><Link className='footer-one-list' to="#">Team</Link></li>
                        <li><Link className='footer-one-list' to="#">Careers</Link></li>
                        <li><Link className='footer-one-list' to="#">blog</Link></li>
                    </ul>
                </div>
                <div className='footer-list'>
                    <h4>CONTACT</h4>
                    <ul className='footer-unorder-list'>
                        <li><Link className='footer-one-list' to="#">Help & Support</Link></li>
                        <li><Link className='footer-one-list' to="#">Partner with us</Link></li>
                        <li><Link className='footer-one-list' to="#">Ride with us</Link></li>
                        <li><Link className='footer-one-list' to="#">Ride with us</Link></li>
                    </ul>
                </div>
                <div className='footer-list'>
                    <h4>LEGAL</h4>
                    <ul className='footer-unorder-list'>
                        <li><Link className='footer-one-list' to="#">Terms & Conditions</Link></li>
                        <li><Link className='footer-one-list' to="#">Refund & Cancellation</Link></li>
                        <li><Link className='footer-one-list' to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link className='footer-one-list' to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                <div className='footer-follow'>
                    <h5>FOLLOW US</h5>
                    <div className='footer-icon'>
                        <Link className='footer-one-list1' to="#"><FaTwitter /></Link>
                        <Link className='footer-one-list1' to="#"><FaInstagram /></Link>
                        <Link className='footer-one-list1' to="#"><FaFacebookF /></Link>
                    </div>
                </div>
            </div>
            <div className='footer-company'>
                <p>All rights Reserved © Gain , 2024</p>
                <p>Made with <FaHeart style={{ color: "yellow" }} /> by siance software pvt ltd</p>
            </div>

        </div>
    )
}

export default Footer
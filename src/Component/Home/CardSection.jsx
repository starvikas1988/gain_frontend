import React from 'react'
import '../Style/CardSection.css'
import { FaAngleRight } from "react-icons/fa6";

const CardSection = ({ data }) => {
    return (
        <div className='card-section-wrapper'>
            <div className={`card-section-container ${data.active ? "" : "card-section-active"}`}>
                <div className='card-text-all'>
                    <h4>{data.text1} <span className='card-span-color'>{data.text2}</span></h4>
                    <p>{data.text3}</p>
                    <button>{data.btn} <FaAngleRight /></button>
                </div>
                <div className={`card-image ${data.active ? "" : "card-image-active"}`}>
                    <img src={data.src} alt='...' />
                </div>
            </div>
        </div>
    )
}

export default CardSection

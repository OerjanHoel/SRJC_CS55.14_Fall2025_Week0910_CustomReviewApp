// This component shows auto shop metadata, and offers some actions to the user like uploading a new auto shop image, and adding a review.

import React from "react";
import renderStars from "@/src/components/Stars.jsx";

const AutoShopDetails = ({
  autoShop,
  userId,
  handleAutoShopImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="img__section">
      <img src={autoShop.photo} alt={autoShop.name} />

      <div className="actions">
        {userId && (
          <img
            alt="review"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleAutoShopImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{autoShop.name}</h2>

          <div className="autoshop__rating">
            <ul>{renderStars(autoShop.avgRating)}</ul>

            <span>({autoShop.numRatings})</span>
          </div>

          <p>
            {autoShop.category} | {autoShop.city}
          </p>
          <p>{"$".repeat(autoShop.price)}</p>
          {children}
        </div>
      </div>
    </section>
  );
};

export default AutoShopDetails;

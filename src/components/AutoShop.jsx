"use client";

// This component shows one individual auto shop
// It receives data from src/app/autoshop/[id]/page.jsx

import { React, useState, useEffect, Suspense } from "react"; // Import hooks from react node
import dynamic from "next/dynamic"; // Import of dynamic module
import { getAutoShopSnapshotById } from "@/src/lib/firebase/firestore.js"; // Import of function from firestore.js 
import { useUser } from "@/src/lib/getUser"; // User function in getUser.js
import AutoShopDetails from "@/src/components/AutoShopDetails.jsx"; // Import component from AutoShopDetails
import { updateAutoShopImage } from "@/src/lib/firebase/storage.js"; // Import of image update function 

// Import of review dialog component
const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

// Export of function 
export default function AutoShop({
  id,
  initialAutoShop,
  initialUserId,
  children,
}) {
  const [autoShopDetails, setAutoShopDetails] = useState(initialAutoShop);
  const [isOpen, setIsOpen] = useState(false);

  // Need to know user id to choose to show dialog or not
  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });
// Function to set new review value
  const onChange = (value, name) => {
    setReview({ ...review, [name]: value });
  };
  // Function for uploading image to review page
  async function handleAutoShopImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }
    // Waiting for upload to finish
    const imageURL = await updateAutoShopImage(id, image);
    setAutoShopDetails({ ...autoShopDetails, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };
  // Callback function when a change is made to auto shop collection
  useEffect(() => {
    return getAutoShopSnapshotById(id, (data) => {
      setAutoShopDetails(data);
    });
  }, [id]);
// Returns JSX code for showing auto shop details
  return (
    <>
      <AutoShopDetails
        autoShop={autoShopDetails}
        userId={userId}
        handleAutoShopImage={handleAutoShopImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </AutoShopDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <ReviewDialog
            isOpen={isOpen}
            handleClose={handleClose}
            review={review}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}

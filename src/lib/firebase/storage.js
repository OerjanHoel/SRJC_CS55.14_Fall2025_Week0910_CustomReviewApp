import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import of needed modules form firebase

import { storage } from "@/src/lib/firebase/clientApp"; // Import variables for db and storage

import { updateAutoShopImageReference } from "@/src/lib/firebase/firestore"; // Import function for updating auto shop image

// Function testing for auto shop id and image type
export async function updateAutoShopImage(autoShopId, image) {
  try {
    if (!autoShopId) {
      throw new Error("No auto shop ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }
    // async function uploading image
    const publicImageUrl = await uploadImage(autoShopId, image);
    await updateAutoShopImageReference(autoShopId, publicImageUrl);

    return publicImageUrl;
  } catch (error) {
    console.error("Error processing request:", error);
  }
}
// Function setting new image for auto shop and references the Database
async function uploadImage(autoShopId, image) {
  const filePath = `images/${autoShopId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}
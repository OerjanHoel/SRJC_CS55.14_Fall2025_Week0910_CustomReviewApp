import { generateFakeAutoShopsAndReviews } from "@/src/lib/fakeAutoShops.js"; // Imports ability to add more fake auto shops


import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore"; // Imports of neede modules from firestore

import { db } from "@/src/lib/firebase/clientApp"; // Import of db from firestore

// Function to update image and auto shop id
export async function updateAutoShopImageReference(
  autoShopId,
  publicImageUrl
) {
  const autoShopRef = doc(collection(db, "autoshops"), autoShopId);
  if (autoShopRef) {
    await updateDoc(autoShopRef, { photo: publicImageUrl });
  }
}

// Update for rating with timestamp
const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  const autoShop = await transaction.get(docRef);
  const data = autoShop.data();
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);
  const newAverage = newSumRating / newNumRatings;

  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
     //ADD NEW FIELD FOR USERID MAKING REVIEW TO USE AS SECURITY CHECK
     lastReviewUserId: review.userId,
  });

  transaction.set(newRatingDocument, {
    ...review,
    timestamp: Timestamp.fromDate(new Date()),
  });
};

// Function binding review to auto shop in database
export async function addReviewToAutoShop(db, autoShopId, review) {
  if (!autoShopId) {
    throw new Error("No auto shop ID has been provided.");
  }

  if (!review) {
    throw new Error("A valid review has not been provided.");
  }

  try {
    const docRef = doc(collection(db, "autoshops"), autoShopId);
    const newRatingDocument = doc(
      collection(db, `autoshops/${autoShopId}/ratings`)
    );

    await runTransaction(db, transaction =>
      updateWithRating(transaction, docRef, newRatingDocument, review)
    );
  } catch (error) {
    console.error(
      "There was an error adding the rating to the auto shop",
      error
    );
    throw error;
  }
}

// Function to filter auto shops
// Filter by category, city, price
function applyQueryFilters(q, { category, city, price, sort }) {
  if (category) {
    q = query(q, where("category", "==", category));
  }
  if (city) {
    q = query(q, where("city", "==", city));
  }
  if (price) {
    q = query(q, where("price", "==", price.length));
  }
  // Sort by average rating or number of rating
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q;
}

// Exports getAutoShops query
export async function getAutoShops(db = db, filters = {}) {
  let q = query(collection(db, "autoshops"));

  // Apply query filters 
  // maps the resulting data
  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Function that displays real time changes in the app
export function getAutoShopsSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "autoshops"));
  q = applyQueryFilters(q, filters);

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });
}

// Function to return data from Firebase DB
export async function getAutoShopById(db, autoShopId) {
  if (!autoShopId) {
    console.log("Error: Invalid ID received: ", autoShopId);
    return;
  }
  const docRef = doc(db, "autoshops", autoShopId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

export function getAutoShopSnapshotById(autoShopId, cb) {
  return;
}

// Function to show review for specific auto shop
export async function getReviewsByAutoShopId(db, autoShopId) {
  if (!autoShopId) {
    console.log("Error: Invalid autoShopId received: ", autoShopId);
    return;
  }

  const q = query(
    collection(db, "autoshops", autoShopId, "ratings"),
    orderBy("timestamp", "desc")
  );
  // Creates the JS array with reviews
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}
// Function to list auto shop query
export function getReviewsSnapshotByAutoShopId(autoShopId, cb) {
  if (!autoShopId) {
    console.log("Error: Invalid autoShopId received: ", autoShopId);
    return;
  }

  const q = query(
    collection(db, "autoshops", autoShopId, "ratings"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    cb(results);
  });
}
// Function to add more fake auto shops
export async function addFakeAutoShopsAndReviews() {
  const data = await generateFakeAutoShopsAndReviews();
  for (const { autoShopData, ratingsData } of data) {
    try {
      const docRef = await addDoc(
        collection(db, "autoshops"),
        autoShopData
      );

      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "autoshops", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      console.log("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}

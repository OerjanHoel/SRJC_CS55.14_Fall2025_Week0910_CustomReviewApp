import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeAutoShopsAndReviews() {
  const autoShopsToAdd = 5;
  const data = [];

  for (let i = 0; i < autoShopsToAdd; i++) {
    const autoShopTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this auto shop
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(autoShopTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomData.autoShopReviews[
            randomNumberBetween(0, randomData.autoShopReviews.length - 1)
          ].rating,
        text: randomData.autoShopReviews[
          randomNumberBetween(0, randomData.autoShopReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    const autoShopData = {
      category:
        randomData.autoShopCategories[
          randomNumberBetween(0, randomData.autoShopCategories.length - 1)
        ],
      name: randomData.autoShopNames[
        randomNumberBetween(0, randomData.autoShopNames.length - 1)
      ],
      avgRating,
      city: randomData.autoShopCities[
        randomNumberBetween(0, randomData.autoShopCities.length - 1)
      ],
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      price: randomNumberBetween(1, 4),
      // Randomly select from images 1-13 (can have duplicates)
      photo: `/images/${randomNumberBetween(1, 13)}.jpg`,
      timestamp: autoShopTimestamp,
    };

    data.push({
      autoShopData,
      ratingsData,
    });
  }
  return data;
}

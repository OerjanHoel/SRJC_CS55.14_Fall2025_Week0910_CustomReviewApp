"use client";

// This component handles the auto shop listings page
// It receives data from src/app/page.jsx, such as the initial auto shops and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getAutoShopsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const AutoShopItem = ({ autoShop }) => (
  <li key={autoShop.id}>
    <Link href={`/autoshop/${autoShop.id}`}>
      <ActiveAutoShop autoShop={autoShop} />
    </Link>
  </li>
);

const ActiveAutoShop = ({ autoShop }) => (
  <div>
    <ImageCover photo={autoShop.photo} name={autoShop.name} />
    <AutoShopDetails autoShop={autoShop} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo} alt={name} />
  </div>
);

const AutoShopDetails = ({ autoShop }) => (
  <div className="autoshop__details">
    <h2>{autoShop.name}</h2>
    <AutoShopRating autoShop={autoShop} />
    <AutoShopMetadata autoShop={autoShop} />
  </div>
);

const AutoShopRating = ({ autoShop }) => (
  <div className="autoshop__rating">
    <ul>{renderStars(autoShop.avgRating)}</ul>
    <span>({autoShop.numRatings})</span>
  </div>
);

const AutoShopMetadata = ({ autoShop }) => (
  <div className="autoshop__meta">
    <p>
      {autoShop.category} | {autoShop.city}
    </p>
    <p>{"$".repeat(autoShop.price)}</p>
  </div>
);

export default function AutoShopListings({
  initialAutoShops,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    city: searchParams.city || "",
    category: searchParams.category || "",
    price: searchParams.price || "",
    sort: searchParams.sort || "",
  };

  const [autoShops, setAutoShops] = useState(initialAutoShops);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getAutoShopsSnapshot((data) => {
      setAutoShops(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="autoshops">
        {autoShops.map((autoShop) => (
          <AutoShopItem key={autoShop.id} autoShop={autoShop} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}

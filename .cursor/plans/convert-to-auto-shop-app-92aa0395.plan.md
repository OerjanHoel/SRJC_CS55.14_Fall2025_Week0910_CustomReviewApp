<!-- 92aa0395-da2f-431a-bb25-f8137145487b 45dcaef1-c108-4d4a-861c-a73ace63c1c4 -->
# Convert Restaurant Review App to Auto Shop Review App

## Changes Overview

Transform all restaurant-related terminology, data, and UI elements to automotive shop equivalents:

- **Main entity**: "Restaurant" → "Auto Shop"
- **Categories**: Cuisine types → Service types (General Repair, Body Shop, Oil Change, etc.)
- **Price**: Keep $ to $$$$ scale but represent average repair cost
- **Sample data**: Generate auto shop names and automotive service reviews

## Implementation Steps

### 1. Update Core Data Models and Functions

**File: `src/lib/firebase/firestore.js`**

- Rename all `restaurant` references to `autoShop` or `shop` in function names and variables
- Update Firestore collection paths from `"restaurants"` to `"autoshops"`
- Update `"ratings"` subcollection context (remains same structure)
- Key functions to update: `getRestaurants` → `getAutoShops`, `addReviewToRestaurant` → `addReviewToAutoShop`, etc.

**File: `src/lib/fakeRestaurants.js`**

- Rename file to `fakeAutoShops.js`
- Update function name `generateFakeRestaurantsAndReviews` → `generateFakeAutoShopsAndReviews`
- Update variable names: `restaurantData` → `autoShopData`, `restaurantTimestamp` → `autoShopTimestamp`
- Reference new random data structure for auto shops

### 2. Create Auto Shop Sample Data

**File: `src/lib/randomData.js`**

- Replace `restaurantNames` with auto shop names (e.g., "Quick Fix Auto", "Precision Motors", "Budget Brake & Tire")
- Replace `restaurantCategories` with service types: ["General Repair", "Body Shop", "Performance Tuning", "Oil Change", "Tire Service", "Transmission Repair", "Brake Service", "Electrical", "Diagnostics", "Detailing"]
- Keep `restaurantCities` as is (cities remain relevant)
- Replace `restaurantReviews` with automotive service reviews (e.g., "Great service, fixed my brakes quickly!", "Honest mechanics, fair pricing")

### 3. Update React Components

**File: `src/components/Restaurant.jsx`**

- Rename to `AutoShop.jsx`
- Update state variable: `restaurantDetails` → `autoShopDetails`
- Update function: `handleRestaurantImage` → `handleAutoShopImage`
- Update props and component references

**File: `src/components/RestaurantDetails.jsx`**

- Rename to `AutoShopDetails.jsx`
- Update prop name `restaurant` → `autoShop`
- Update display to show: `{autoShop.name}`, `{autoShop.category} | {autoShop.city}`
- Keep rating and price display logic (price now represents average repair cost)

**File: `src/components/RestaurantListings.jsx`**

- Rename to `AutoShopListings.jsx`
- Update variable: `initialRestaurants` → `initialAutoShops`
- Update all references throughout component

**File: `src/components/Filters.jsx`**

- Update label from "Restaurants" to "Auto Shops"
- Replace category options with service types matching `randomData.js`
- Update text: "Sorted by {filters.sort || "Rating"}" context
- Keep city and price filters (price tooltip could say "Average Repair Cost")

### 4. Update Pages and Actions

**File: `src/app/page.js`**

- Import `getAutoShops` instead of `getRestaurants`
- Import `AutoShopListings` component
- Update variable: `restaurants` → `autoShops`
- Update prop: `initialRestaurants` → `initialAutoShops`

**File: `src/app/restaurant/[id]/page.jsx`**

- Rename directory from `restaurant` to `autoshop`
- Update imports and function calls to use auto shop terminology
- Update variable: `initialRestaurant` → `initialAutoShop`

**File: `src/app/actions.js`**

- Update action to call `addFakeAutoShopsAndReviews`

### 5. Update Storage and Helper Files

**File: `src/lib/firebase/storage.js`**

- Rename function `updateRestaurantImage` → `updateAutoShopImage`
- Update storage path references if needed

**File: `src/lib/getUser.js`**

- Review for any restaurant-specific references (likely none)

### 6. Update Comments and Documentation

- Update inline comments throughout codebase
- Update `readme.md` to reflect auto shop review app
- Change "Friendly Eats" references to appropriate auto shop app name
- Update comments referencing "Add sample restaurants" to "Add sample auto shops"

### 7. Database Collection Names

Update Firestore collection references:

- `"restaurants"` → `"autoshops"`
- `"restaurants/{id}/ratings"` → `"autoshops/{id}/ratings"`

### 8. UI Text and Labels

- Review Dialog: "Add review" context remains similar
- Header: Update any "restaurant" text
- Filters: Update summary text and labels
- All user-facing text referring to restaurants

## Files to Modify

Core files (must update):

- `src/lib/firebase/firestore.js`
- `src/lib/fakeRestaurants.js` (rename to `fakeAutoShops.js`)
- `src/lib/randomData.js`
- `src/lib/firebase/storage.js`
- `src/components/Restaurant.jsx` (rename to `AutoShop.jsx`)
- `src/components/RestaurantDetails.jsx` (rename to `AutoShopDetails.jsx`)
- `src/components/RestaurantListings.jsx` (rename to `AutoShopListings.jsx`)
- `src/components/Filters.jsx`
- `src/app/page.js`
- `src/app/restaurant/[id]/page.jsx` and `error.jsx` (move to `autoshop/[id]/`)
- `src/app/actions.js`
- `readme.md`

Files to review (may need updates):

- `src/components/Header.jsx`
- `src/components/ReviewDialog.jsx`
- `firestore.rules` (update collection names in security rules)
- `firestore.indexes.json` (update collection names in indexes)

### To-dos

- [ ] Update randomData.js with auto shop names, service categories, and automotive reviews
- [ ] Rename and update all Firestore functions in firestore.js for auto shop terminology
- [ ] Rename fakeRestaurants.js to fakeAutoShops.js and update all references
- [ ] Update storage.js image functions for auto shop context
- [ ] Rename Restaurant components to AutoShop equivalents and update imports
- [ ] Update Filters.jsx with service type categories and auto shop terminology
- [ ] Update page.js and rename restaurant route directory to autoshop
- [ ] Update actions.js to call auto shop functions
- [ ] Update firestore.rules and firestore.indexes.json collection names
- [ ] Update readme.md and inline comments throughout codebase
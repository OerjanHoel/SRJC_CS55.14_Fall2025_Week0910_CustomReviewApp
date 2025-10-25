import AutoShop from "@/src/components/AutoShop.jsx";
import { Suspense } from "react";
import { getAutoShopById } from "@/src/lib/firebase/firestore.js";
import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function Home(props) {
  // This is a server component, we can access URL
  // parameters via Next.js and download the data
  // we need for this page
  const params = await props.params;
  const { currentUser } = await getUser();
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const autoShop = await getAutoShopById(
    getFirestore(firebaseServerApp),
    params.id
  );

  return (
    <main className="main__autoshop">
      <AutoShop
        id={params.id}
        initialAutoShop={autoShop}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary autoShopId={params.id} />
        </Suspense>
      </AutoShop>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={autoShop.numRatings} />}
      >
        <ReviewsList autoShopId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}

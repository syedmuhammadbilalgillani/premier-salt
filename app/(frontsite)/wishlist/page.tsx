import Wishlist from "@/routes/Wishlist";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <Wishlist />
    </Suspense>
  );
};

export default page;

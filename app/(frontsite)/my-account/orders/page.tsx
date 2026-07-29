import MyAccountOrders from "@/routes/MyAccountOrders";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={null}>
      <MyAccountOrders />;
    </Suspense>
  );
};

export default page;

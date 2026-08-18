import type { Metadata } from "next";
import MyAccount from "@/routes/MyAccount";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "My Account",
  description: "Manage your account details.",
  path: "/my-account",
  noindex: true,
});

const page = () => {
  return <MyAccount />;
};

export default page;

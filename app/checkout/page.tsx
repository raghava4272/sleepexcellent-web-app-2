import { CheckoutClient } from "@/components/checkout/checkout-client";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";

export default async function CheckoutPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login?next=/checkout");

  return <CheckoutClient />;
}

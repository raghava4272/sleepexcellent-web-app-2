import { CartClient } from "@/components/cart/cart-client";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";

export default async function CartPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login?next=/cart");

  return <CartClient />;
}

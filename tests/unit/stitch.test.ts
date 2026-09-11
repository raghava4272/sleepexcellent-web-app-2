import { describe, expect, it } from "vitest";
import { approvedScreens, stitchProject } from "../../lib/stitch";

describe("approved Stitch design inventory", () => {
  it("keeps the approved project reference and every planned customer route", () => {
    expect(stitchProject.id).toBe("14164775762318971387");
    expect(approvedScreens).toHaveLength(8);
    expect(approvedScreens.map((screen) => screen.route)).toEqual(
      expect.arrayContaining([
        "/",
        "/shop and /shop/[category]",
        "/products/[slug]",
        "/build-your-mattress",
        "/cart",
        "/checkout",
        "/account/orders/[orderNumber]",
      ]),
    );
  });
});

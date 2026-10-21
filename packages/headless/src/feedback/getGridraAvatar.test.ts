import { expect, it } from "vitest";
import { getGridraAvatar } from "./getGridraAvatar";

it("names fallback content and hides decorative initials", () => {
  expect(getGridraAvatar({ alt: "Ada", fallback: "AL" })).toMatchObject({
    hasImage: false,
    fallbackText: "AL",
    rootProps: { role: "img", "aria-label": "Ada" },
    fallbackProps: { "aria-hidden": true },
  });
});

it("avoids duplicate names with an image or empty fallback", () => {
  const image = getGridraAvatar({ src: "avatar.png", alt: "Ada" });

  expect(image.rootProps.role).toBeUndefined();
  expect(image.imageProps.alt).toBe("Ada");
  expect(getGridraAvatar().rootProps.role).toBeUndefined();
});

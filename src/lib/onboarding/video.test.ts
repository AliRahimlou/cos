import { describe, expect, it } from "vitest";

import { getEmbeddedVideoSource } from "./video";

describe("getEmbeddedVideoSource", () => {
  it("maps youtu.be share links to youtube-nocookie embeds", () => {
    expect(getEmbeddedVideoSource("https://youtu.be/0OfzgYTEyeA")).toEqual({
      provider: "youtube",
      embedUrl: "https://www.youtube-nocookie.com/embed/0OfzgYTEyeA?rel=0",
      originalUrl: "https://youtu.be/0OfzgYTEyeA",
    });
  });

  it("preserves supported watch start offsets", () => {
    expect(
      getEmbeddedVideoSource("https://www.youtube.com/watch?v=0OfzgYTEyeA&t=1m30s"),
    ).toEqual({
      provider: "youtube",
      embedUrl:
        "https://www.youtube-nocookie.com/embed/0OfzgYTEyeA?rel=0&start=90",
      originalUrl: "https://www.youtube.com/watch?v=0OfzgYTEyeA&t=1m30s",
    });
  });

  it("supports native video files", () => {
    expect(getEmbeddedVideoSource("https://cdn.example.com/onboarding/welcome.mp4")).toEqual({
      provider: "file",
      src: "https://cdn.example.com/onboarding/welcome.mp4",
      originalUrl: "https://cdn.example.com/onboarding/welcome.mp4",
    });
  });

  it("returns null for non-video links", () => {
    expect(getEmbeddedVideoSource("https://ecorp.sos.ga.gov/BusinessSearch")).toBeNull();
  });
});

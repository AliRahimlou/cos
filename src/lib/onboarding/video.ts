export type EmbeddedVideoSource =
  | {
      provider: "youtube";
      embedUrl: string;
      originalUrl: string;
    }
  | {
      provider: "file";
      src: string;
      originalUrl: string;
    }
  | null;

function parseYouTubeStart(value: string | null) {
  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);

  if (!match) {
    return null;
  }

  const [, hours, minutes, seconds] = match;
  const total =
    Number(hours ?? 0) * 3600 +
    Number(minutes ?? 0) * 60 +
    Number(seconds ?? 0);

  return total > 0 ? total : null;
}

function getYouTubeVideoId(url: URL) {
  if (url.hostname === "youtu.be") {
    return url.pathname.slice(1) || null;
  }

  if (
    url.hostname === "www.youtube.com" ||
    url.hostname === "youtube.com" ||
    url.hostname === "m.youtube.com" ||
    url.hostname === "youtube-nocookie.com" ||
    url.hostname === "www.youtube-nocookie.com"
  ) {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }

    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/embed/")[1] ?? null;
    }

    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/shorts/")[1] ?? null;
    }
  }

  return null;
}

export function getEmbeddedVideoSource(rawUrl: string): EmbeddedVideoSource {
  try {
    const url = new URL(rawUrl);
    const videoId = getYouTubeVideoId(url);

    if (videoId) {
      const start =
        parseYouTubeStart(url.searchParams.get("t")) ??
        parseYouTubeStart(url.searchParams.get("start"));
      const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);

      embedUrl.searchParams.set("rel", "0");
      if (start !== null) {
        embedUrl.searchParams.set("start", String(start));
      }

      return {
        provider: "youtube",
        embedUrl: embedUrl.toString(),
        originalUrl: rawUrl,
      };
    }

    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      return {
        provider: "file",
        src: rawUrl,
        originalUrl: rawUrl,
      };
    }

    return null;
  } catch {
    return null;
  }
}

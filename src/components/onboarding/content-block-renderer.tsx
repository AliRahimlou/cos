import Image from "next/image";

import type { ContentBlock } from "@/lib/onboarding/types";
import { getEmbeddedVideoSource } from "@/lib/onboarding/video";

function renderTextWithLinks(text: string) {
  const segments = text.split(/(https?:\/\/[^\s]+)/g);

  return segments.map((segment, index) => {
    if (!segment) {
      return null;
    }

    if (/^https?:\/\//.test(segment)) {
      return (
        <a
          key={`${segment}-${index}`}
          href={segment}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          {segment}
        </a>
      );
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
}

function ContentImage({
  src,
  alt,
  caption,
  width,
  height,
}: Extract<ContentBlock, { type: "image" }>) {
  if (!src) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Visual referenced in the source deck.
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative bg-muted/40">
        <Image
          src={src}
          alt={alt}
          width={width ?? 1440}
          height={height ?? 900}
          className="h-auto w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
          {renderTextWithLinks(caption)}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ContentVideo({
  url,
  title,
  caption,
  poster,
}: Extract<ContentBlock, { type: "video" }>) {
  const source = getEmbeddedVideoSource(url);

  if (!source) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Video referenced in the source content.
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="aspect-video bg-muted/40">
        {source.provider === "youtube" ? (
          <iframe
            src={source.embedUrl}
            title={title}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            src={source.src}
            title={title}
            poster={poster}
            controls
            preload="metadata"
            className="h-full w-full"
          />
        )}
      </div>
      <figcaption className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
        <div className="font-medium text-foreground">{title}</div>
        {caption ? <div className="mt-1">{renderTextWithLinks(caption)}</div> : null}
      </figcaption>
    </figure>
  );
}

export function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "paragraph") {
          return (
            <p key={key} className="text-sm leading-7 text-muted-foreground sm:text-base">
              {renderTextWithLinks(block.text)}
            </p>
          );
        }

        if (block.type === "bullets") {
          return (
            <ul key={key} className="space-y-3 rounded-3xl border border-border bg-card px-5 py-5 text-sm text-muted-foreground">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 size-2 rounded-full bg-foreground/70" />
                  <span>{renderTextWithLinks(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "checklist") {
          return (
            <ul key={key} className="space-y-3 rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-5 py-5 text-sm text-foreground/80">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                    ✓
                  </span>
                  <span>{renderTextWithLinks(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "callout") {
          return (
            <div key={key} className="rounded-3xl border border-[var(--glass-border)] bg-foreground/5 px-5 py-5 text-sm text-foreground/80">
              {block.title ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {block.title}
                </p>
              ) : null}
              <p className="leading-7">{renderTextWithLinks(block.text)}</p>
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div key={key} className="overflow-x-auto rounded-3xl border border-border bg-card">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-muted/60 text-foreground">
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${rowIndex}-${row.join("-")}`} className="border-t border-border/80">
                      {row.map((cell, cellIndex) => (
                        <td key={`${cellIndex}-${cell}`} className="px-4 py-3 align-top text-muted-foreground">
                          {renderTextWithLinks(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "image") {
          return <ContentImage key={key} {...block} />;
        }

        if (block.type === "video") {
          return <ContentVideo key={key} {...block} />;
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={key}
              className="rounded-3xl border-l-4 border-foreground/80 bg-muted/50 px-5 py-5 text-base leading-7 text-foreground"
            >
              “{renderTextWithLinks(block.text)}”
            </blockquote>
          );
        }

        return null;
      })}
    </div>
  );
}

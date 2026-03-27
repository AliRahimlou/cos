import { Badge } from "@/components/ui/badge";

function collapseSlideNumbers(sourceSlides: number[]) {
  if (sourceSlides.length === 0) {
    return "";
  }

  const sorted = [...new Set(sourceSlides)].sort((left, right) => left - right);
  const ranges: string[] = [];
  let start = sorted[0]!;
  let end = sorted[0]!;

  for (let index = 1; index < sorted.length; index += 1) {
    const value = sorted[index]!;

    if (value === end + 1) {
      end = value;
      continue;
    }

    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    start = value;
    end = value;
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);

  return ranges.join(", ");
}

export function formatSlideReference(sourceSlides: number[]) {
  const label = collapseSlideNumbers(sourceSlides);

  if (!label) {
    return "Slides unavailable";
  }

  return sourceSlides.length === 1 ? `Slide ${label}` : `Slides ${label}`;
}

export function SourceSlideBadges({
  sourceSlides,
}: {
  sourceSlides: number[];
}) {
  return (
    <Badge variant="outline" className="rounded-full">
      {formatSlideReference(sourceSlides)}
    </Badge>
  );
}

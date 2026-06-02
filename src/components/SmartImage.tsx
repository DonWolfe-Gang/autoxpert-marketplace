import { useEffect, useState } from "react";

interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  sources: string[];
}

/**
 * Image with deterministic fallback chain. Walks `sources` left-to-right,
 * advancing whenever the current source fails to load. The final source
 * in the chain should be a guaranteed-render placeholder.
 */
export function SmartImage({ sources, alt = "", ...rest }: Props) {
  const [idx, setIdx] = useState(0);

  // Reset whenever the sources array identity changes (new listing).
  useEffect(() => setIdx(0), [sources]);

  const src = sources[Math.min(idx, sources.length - 1)];

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      onError={() => setIdx((i) => (i < sources.length - 1 ? i + 1 : i))}
    />
  );
}

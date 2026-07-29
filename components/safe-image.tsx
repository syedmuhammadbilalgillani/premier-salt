"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

export const IMAGE_PLACEHOLDER = "/static/placeholder.svg";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

export default function SafeImage({
  src,
  alt = "",
  ...props
}: SafeImageProps) {
  const resolvedSrc = src || IMAGE_PLACEHOLDER;
  const [imgSrc, setImgSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImgSrc(src || IMAGE_PLACEHOLDER);
  }, [src]);

  const isPlaceholder = imgSrc === IMAGE_PLACEHOLDER;

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      // The placeholder is an SVG; bypass the optimizer (which rejects SVG
      // with a 400 unless dangerouslyAllowSVG is set) so the fallback always renders.
      unoptimized={props.unoptimized ?? isPlaceholder}
      onError={() => {
        if (imgSrc !== IMAGE_PLACEHOLDER) {
          setImgSrc(IMAGE_PLACEHOLDER);
        }
      }}
    />
  );
}

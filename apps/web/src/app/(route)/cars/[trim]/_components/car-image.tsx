"use client";

import Image from "next/image";

function CarImage({
  className,
  fill,
  src,
  priority,
  alt,
  sizes,
}: {
  className?: string;
  fill?: boolean;
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      alt={alt}
      className={className}
      fill={fill}
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}

export default CarImage;

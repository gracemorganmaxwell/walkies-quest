type PixelIconProps = {
  src: string;
  alt: string;
  size?: number;
};

export function PixelIcon({ src, alt, size = 16 }: PixelIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="pixel-icon"
      draggable={false}
    />
  );
}

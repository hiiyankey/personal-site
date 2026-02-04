import type { ComponentProps } from "react";

type Props = ComponentProps<"video">;
export function Video({ src, ...rest }: Props) {
  return (
    <video aria-label="Video player" controls preload="none" {...rest}>
      <source src={src as string} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

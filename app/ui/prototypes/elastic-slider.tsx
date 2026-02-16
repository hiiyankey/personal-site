"use client";

import { SpeakerLoudIcon, SpeakerQuietIcon } from "@radix-ui/react-icons";
import { Range, Root, Track } from "@radix-ui/react-slider";
import { useDialKit } from "dialkit";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import React from "react";

export function ElasticSlider() {
  const [volume, setVolume] = React.useState(50);
  const [region, setRegion] = React.useState<"left" | "middle" | "right">(
    "middle"
  );
  const rootRef = React.useRef<React.ComponentRef<typeof Root>>(null);
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  const p = useDialKit("Slider", {
    blur: [24, 0, 100],
    // scale: 1.2,
    color: "#ff5500",
    visible: true,
  });

  useMotionValueEvent(clientX, "change", (latest) => {
    if (rootRef.current) {
      const bounds = rootRef.current?.getBoundingClientRect();

      let newValue: number;

      if (latest < bounds.left) {
        setRegion("left");
        newValue = bounds.left - latest;
      } else if (latest > bounds?.right) {
        setRegion("right");
        newValue = latest - bounds?.right;
      } else {
        setRegion("middle");
        newValue = 0;
      }
      overflow.jump(decay(newValue, 75));
    }
  });
  return (
    <div className="min-h-50 flex-center">
      <motion.form
        className="flex max-w-sm items-center gap-3"
        onHoverEnd={() => animate(scale, 1)}
        onHoverStart={() => animate(scale, 1.2)}
        style={{
          filter: `blur(${p.blur}px)`,
          // transform: `scale(${p.scale})`,
          color: p.color,
          opacity: p.visible ? 1 : 0,
          scale,
        }}
      >
        <motion.span
          animate={{
            scale: region === "left" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          className="block"
          style={{
            x: useTransform(() =>
              region === "left" ? -overflow.get() / scale.get() : 0
            ),
          }}
        >
          <SpeakerQuietIcon />
        </motion.span>
        <Root
          className="relative flex h-5 w-50 cursor-grab touch-none select-none items-center"
          defaultValue={[volume]}
          max={100}
          onLostPointerCapture={() => {
            animate(overflow, 0, { type: "spring", bounce: 0.5 });
            animate(overflow, 0, { type: "spring", bounce: 0.5 });
          }}
          onPointerMove={(e) => {
            if (e.buttons > 0) {
              clientX.set(e.clientX);
            }
          }}
          onValueChange={([v]) => setVolume(v)}
          ref={rootRef}
          step={1}
        >
          <motion.div
            className="flex h-1.5 grow"
            style={{
              scaleX: useTransform(() => {
                if (rootRef.current) {
                  const bounds = rootRef.current?.getBoundingClientRect();
                  return (bounds?.width + overflow.get()) / bounds?.width;
                }
              }),
              transformOrigin: region === "left" ? "right" : "left",
              height: useTransform(scale, [1, 1.2], [6, 12]),
              marginTop: useTransform(scale, [1, 1.2], [0, -3]),
              marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
              scaleY: useTransform(overflow, [0, 75], [1, 0.9]),
            }}
          >
            <Track className="relative h-full grow rounded-full bg-gray-3">
              <Range className="absolute h-full rounded-full bg-orange" />
            </Track>
          </motion.div>
          {/*<Thumb
            aria-label="Volume"
            className="block size-5 rounded-[10px] bg-white shadow-small hover:bg-white/90 focus:shadow-small focus:outline-none"
          />*/}
        </Root>
        <motion.span
          animate={{
            scale: region === "right" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          className="block"
          style={{
            x: useTransform(() =>
              region === "right" ? overflow.get() / scale.get() : 0
            ),
          }}
        >
          <SpeakerLoudIcon />
        </motion.span>
      </motion.form>
    </div>
  );
}

function decay(value: number, max: number) {
  if (max === 0) {
    return 0;
  }
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

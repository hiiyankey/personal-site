"use client";

import { motion } from "motion/react";
import { Container } from "@/ui/container";
import { useMediaQuery } from "./hooks/use-media-query";
import { Grid } from "./ui/grid/grid";

export default function Home() {
  const xs = useMediaQuery("(max-width: 400px)");
  const sm = useMediaQuery("(min-width: 401px) and (max-width: 600px)");
  const smd = useMediaQuery("(min-width: 601px) and (max-width: 768px)");
  const md = useMediaQuery("(min-width: 769px) and (max-width: 960px)");

  const grid = {
    xs: { columns: 20, rows: 24 },
    sm: { columns: 30, rows: 24 },
    smd: { columns: 38, rows: 24 },
    md: { columns: 48, rows: 24 },
    lg: { columns: 48, rows: 24 },
  }[
    // biome-ignore lint/style/noNestedTernary: shh!
    xs ? "xs" : sm ? "sm" : smd ? "smd" : md ? "md" : "lg"
  ];

  return (
    <div className="min-h-dvh w-screen">
      <header>
        {/** biome-ignore lint/a11y/noSvgWithoutTitle: shh! */}
        <svg height="24px" width="100%">
          <defs>
            <pattern
              height={4}
              id="pattern0"
              patternUnits="userSpaceOnUse"
              width={4}
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M1 -1L5 3"
                  stroke="var(--color-gray-6)"
                  strokeWidth={0.5}
                />
                <path
                  d="M-1 1L3 5"
                  stroke="var(--color-gray-6)"
                  strokeWidth={0.5}
                />
              </g>
            </pattern>
          </defs>
          <clipPath id="clip0">
            <rect fill="#fff" height={4} width={4} />
          </clipPath>
          <rect fill="url(#pattern0)" height="100%" width="100%" x="0" y="0" />
        </svg>
        <motion.nav
          className="translate-center-x fixed bottom-6 z-50 flex h-9 w-28 items-center rounded-full bg-gray-2 p-2 shadow-border-large"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
        >
          <div className="size-5 rounded-full bg-orange" />
          <div className="ml-auto flex items-center gap-1">
            <span className="size-6 flex-center select-none rounded-full bg-gray-3">
              +
            </span>
            <span className="size-6 flex-center select-none rounded-full bg-gray-3">
              -
            </span>
          </div>
        </motion.nav>
      </header>
      <main>
        <Container className="mb-16 pt-24">
          <h3 className="mb-6 text-24 leading-28">Hello</h3>
          <div className="flex flex-col space-y-4">
            <p className="text-18 leading-[auto]">
              My name is Emmanuel. I work as a Design Engineer at Vercel on our
              platform, design system, marketing pages, and Next.js Dev Tools.
              Previously, I was at The Browser Company designing and building
              the Arc browser. interactions, engineering, and design
            </p>
            <p className="text-18 leading-[auto]">
              I have written acclaimed design essays like Invisible Details of
              Interaction Design and shipped open source software like cmdk that
              is downloaded millions of times per week to power command menu
              interfaces for the most modern productivity apps on the web.
            </p>
          </div>
        </Container>
        <div
          className="bleed @container relative flex-center px-4 sm:px-8"
          style={{ "--max-width": "100vw" } as React.CSSProperties}
        >
          <Grid.System guideWidth={1}>
            <Grid columns={grid.columns} rows={grid.rows}>
              <Grid.Cross column={1} row={1} />
              <Grid.Cross column={-1} row={-1} />
              <Grid.Cross column={1} row={-1} />
              <Grid.Cross column={-1} row={1} />
            </Grid>
          </Grid.System>

          <div className="absolute inset-0">{/*...*/}</div>
        </div>
      </main>
      <footer className="h-16 flex-center">
        <span className="text-14 text-gray-11">300126_022132.250_UTC</span>
      </footer>
    </div>
  );
}

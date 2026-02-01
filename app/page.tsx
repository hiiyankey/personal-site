"use client";

import {
  ArrowTopRightIcon,
  CornerBottomRightIcon,
} from "@radix-ui/react-icons";
import {
  type MotionProps,
  motion,
  type PanInfo,
  type Transition,
} from "motion/react";
import Image from "next/image";
import {
  type CSSProperties,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import useResizeRef from "@/hooks/use-resize-ref";
import { collections } from "@/lib/constants";
import { clamp, randInt } from "@/lib/math";
import type { Card } from "@/lib/models";
import { computeGridArrangement, cx, useIsMobile } from "@/lib/utils";
import { useCardStore } from "@/store";
import { Container } from "@/ui/container";
import type { DraggableController } from "@/ui/draggable";
import Draggable from "@/ui/draggable";
import { Grid } from "@/ui/grid/grid";

interface DragContainerRef {
  e: HTMLElement;
  z: number;
  dragging: boolean;
}

const cardInitial = {
  opacity: 0,
  z: 1,
};

const cardDefaultDimensions = { width: 220, height: 160 };
const dragContainerPadding = { top: 70, right: 20 };

const fadeInProps: MotionProps = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: ({ i = 0 } = {}) => ({
      opacity: 0,
      filter: "blur(4px)",
      y: 10,
      transition: { delay: i * 0.05 },
    }),
    animate: ({ i = 0, scale = 1 } = {}) => ({
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale,
      transition: { delay: i * 0.05 },
    }),
    exit: ({ i = 0 } = {}) => ({
      opacity: 0,
      filter: "blur(4px)",
      y: -10,
      transition: { delay: i * 0.05 },
    }),
  },
};

const MemoizedDraggable = memo(Draggable);

const cardTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 80,
};
const cardDragTransition: Transition = {
  bounceStiffness: 100,
  bounceDamping: 10,
  power: 0.4,
};

const getAttribute = (
  e: { dataset: DOMStringMap } | null,
  attribute: string
) => {
  if (!e) {
    return null;
  }

  const value = e.dataset[attribute];

  return value || null;
};

const getIdAttribute = (e: { dataset: DOMStringMap } | null) =>
  getAttribute(e, "id");

//////////////////////////////

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
  //////////////////////////////////////////
  const store = useCardStore();
  const selectedCardId = useCardStore((s) => s.selectedCardId);
  const collectionKey = useCardStore((s) => s.collection);
  const setSelectedCardId = useCardStore((s) => s.setSelectedCardId);

  const collection = collections[collectionKey];
  const cards: Card[] = collection.cards;

  const isMobile = useIsMobile();
  const isMobileSmall = useMediaQuery("(max-width: 639px)");

  const draggableContainerRefs = useRef(new Map<string, DragContainerRef>());
  const draggableControllerRefs = useRef(
    new Map<string, DraggableController>()
  );

  const focusedCardIdRef = useRef<string | null>(null);
  const selectedCardIdRef = useRef<string | null>(null);
  const selectedCardContainerRef = useRef<HTMLElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsDragContainerRef = useRef<HTMLDivElement>(null);

  const { ref: containerRef, dimensions } = useResizeRef<HTMLDivElement>();

  const [cardDimensions, setCardDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const [resizingCardId, setResizingCardId] = useState<string | null>(null);
  const resizeStateRef = useRef<{
    cardId: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    sizeScale: number;
  } | null>(null);

  const getCardSize = useCallback(
    (card: Card) => {
      const base = {
        width: card.width ?? cardDefaultDimensions.width,
        height: card.height ?? cardDefaultDimensions.height,
      };
      const override = cardDimensions[card.id];
      return override ?? base;
    },
    [cardDimensions]
  );

  const sizeScale = isMobileSmall ? 0.6 : isMobile ? 0.8 : 1;

  const handleResizeMove = useCallback((e: PointerEvent) => {
    const state = resizeStateRef.current;
    if (!state) return;

    const deltaX = (e.clientX - state.startX) / state.sizeScale;
    const deltaY = (e.clientY - state.startY) / state.sizeScale;
    const newWidth = clamp(80, 500, state.startWidth + deltaX);
    const newHeight = clamp(60, 400, state.startHeight + deltaY);

    setCardDimensions((prev) => ({
      ...prev,
      [state.cardId]: { width: newWidth, height: newHeight },
    }));
  }, []);

  const handleResizeEnd = useCallback(() => {
    setResizingCardId(null);
    resizeStateRef.current = null;
    window.removeEventListener("pointermove", handleResizeMove);
    window.removeEventListener("pointerup", handleResizeEnd);
    window.removeEventListener("pointercancel", handleResizeEnd);
  }, [handleResizeMove]);

  const startResizeListeners = useCallback(() => {
    window.addEventListener("pointermove", handleResizeMove);
    window.addEventListener("pointerup", handleResizeEnd);
    window.addEventListener("pointercancel", handleResizeEnd);
  }, [handleResizeMove, handleResizeEnd]);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, cardId: string) => {
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;
      const { width, height } = getCardSize(card);
      setResizingCardId(cardId);
      resizeStateRef.current = {
        cardId,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: width,
        startHeight: height,
        sizeScale,
      };
      startResizeListeners();
    },
    [cards, getCardSize, sizeScale, startResizeListeners]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const getMaxZ = useCallback(() => {
    return (
      Math.max(
        ...Array.from(draggableContainerRefs.current.values()).map(({ z }) => z)
      ) + 1
    );
  }, [draggableContainerRefs]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const compactZIndices = useCallback(
    (activeId?: string) => {
      const entries = Array.from(draggableContainerRefs.current.entries());
      if (!entries.length) {
        return;
      }

      entries.sort(([, a], [, b]) => a.z - b.z);

      let nextZ = 1;
      for (const [id, target] of entries) {
        if (activeId && id === activeId) {
          continue;
        }
        target.z = nextZ;
        target.e?.style.setProperty("--z", String(nextZ));
        nextZ++;
      }

      if (activeId) {
        const active = draggableContainerRefs.current.get(activeId);
        if (active) {
          const topZ = entries.length + 1;
          active.z = topZ;
          active.e?.style.setProperty("--z", String(topZ));
        }
      }
    },
    [draggableContainerRefs]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const placeOnTop = useCallback(
    (id: string, forceZ?: number) => {
      const target = draggableContainerRefs.current.get(id);
      if (!target?.e) {
        return;
      }

      const newZ = forceZ ?? getMaxZ();

      target.e.style.setProperty("--z", newZ.toString());
      target.z = newZ;

      const maxZ = draggableContainerRefs.current.size + 1;

      if (newZ > maxZ) {
        compactZIndices(id);
      }

      return newZ;
    },
    [draggableContainerRefs, getMaxZ, compactZIndices]
  );

  const focusById = useCallback((id: string | null) => {
    if (!id) {
      return;
    }

    const el = draggableContainerRefs.current.get(id)?.e;
    if (!el) {
      return;
    }

    el.focus();
    focusedCardIdRef.current = id;
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const handleOrganize = useCallback(() => {
    const container = cardsDragContainerRef.current;
    if (!container) {
      return;
    }

    const childrenById = Object.fromEntries(
      cards.flatMap((card) => {
        const e = draggableContainerRefs.current.get(card.id)?.e;
        return e
          ? [
              [
                card.id,
                { width: e.clientWidth, height: e.clientHeight, id: card.id },
              ],
            ]
          : [];
      })
    );

    const paddingX = 12;
    const paddingY = 12;
    const gap = 12;

    const positions = computeGridArrangement({
      container,
      children: Object.values(childrenById),
      paddingX,
      paddingY,
      gap,
    });

    let i = 0;
    const maxZ = getMaxZ();

    for (const pos of positions.values()) {
      const draggable = draggableControllerRefs.current.get(pos.id);
      const container = draggableContainerRefs.current.get(pos.id);
      if (!(draggable && container)) {
        continue;
      }

      const { width, height } = childrenById[pos.id]!;
      const left = pos.x - width / 2;
      const top = pos.y - height / 2;

      placeOnTop(pos.id, maxZ + i);
      i++;

      draggable.controls.start({
        x: left,
        y: top + dragContainerPadding.top,
        rotate: pos.fit ? randInt(-5, 5) : randInt(-35, 35),
        transition: { type: "spring", stiffness: 500, damping: 80 },
      });
    }
  }, [
    draggableContainerRefs,
    draggableControllerRefs,
    cardsDragContainerRef,
    cards,
    getMaxZ,
    placeOnTop,
  ]);

  const handleDragStart = useCallback(
    (e: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
      const id = getIdAttribute(e.target as HTMLElement);
      if (id === null) {
        return;
      }

      const target = draggableContainerRefs.current.get(id);
      if (!target) {
        return;
      }

      const newMaxI = placeOnTop(id);

      draggableContainerRefs.current.set(id, {
        ...target,
        z: newMaxI || 1,
        dragging: true,
      });
    },
    [placeOnTop]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const handleDragEnd = useCallback(
    (e: MouseEvent | PointerEvent | TouchEvent, info: PanInfo) => {
      const id = getIdAttribute(e.target as HTMLElement);
      if (id === null) {
        return;
      }

      const target = draggableContainerRefs.current.get(id);
      if (!target) {
        return;
      }

      draggableContainerRefs.current.set(id, {
        ...target,
        dragging: false,
      });
    },
    [draggableContainerRefs]
  );

  const handleDragTransitionEnd = useCallback(() => {
    for (const [index, target] of draggableContainerRefs.current.entries()) {
      if (target.dragging) {
        draggableContainerRefs.current.set(index, {
          ...target,
          dragging: false,
        });
      }
    }
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const handleSpreadOut = useCallback(
    async ({ stagger = 5 }: { stagger?: number }) => {
      let i = 0;

      for (const card of cards) {
        const draggable = draggableControllerRefs.current.get(card.id);
        if (!draggable) {
          continue;
        }

        if (draggable.id === selectedCardIdRef.current) {
          continue;
        }

        await new Promise((resolve) => setTimeout(resolve, i * stagger));
        draggable.spreadOut({
          container: cardsDragContainerRef.current!,
          dist: 500,
          padding: 50,
        });

        i++;
      }
    },
    [draggableControllerRefs, cardsDragContainerRef, cards]
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    handleSpreadOut({ stagger: 5 });
  }, [collectionKey, containerRef, handleSpreadOut]);

  const handleSelectCard = useCallback(
    (id: string) => {
      const target = draggableContainerRefs.current.get(id);
      if (target?.dragging) {
        return;
      }

      const focusedId = selectedCardIdRef.current;
      if (focusedId && focusedId !== id) {
        draggableControllerRefs.current.get(focusedId!)?.unfocus();
      }

      placeOnTop(id);
      draggableControllerRefs.current
        .get(id)
        ?.center(containerRef.current!, 1);

      if (!target?.dragging) {
        setSelectedCardId(id);

        selectedCardIdRef.current = id;
        selectedCardContainerRef.current = target?.e ?? null;

        draggableContainerRefs.current.get(id)?.e?.focus();
      }
    },
    [
      draggableContainerRefs,
      draggableControllerRefs,
      containerRef,
      setSelectedCardId,
      placeOnTop,
    ]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const handleDeselectCard = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (!selectedCardIdRef.current) {
        return;
      }

      store.reset();

      const focused = selectedCardIdRef?.current;
      if (focused) {
        draggableControllerRefs.current.get(focused!)?.unfocus();
        selectedCardIdRef.current = null;

        placeOnTop(focused!);
      }
    },
    [store, draggableControllerRefs, placeOnTop]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const handleDragContainerRef = useCallback(
    (e: HTMLElement | null) => {
      const id = getIdAttribute(e);
      if (id === null) {
        return;
      }

      draggableContainerRefs.current.set(id, {
        z: 1,
        e: e!,
        dragging: false,
      });
    },
    [draggableContainerRefs]
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: shh!
  const handleDraggableControllerRef = useCallback(
    (e: DraggableController) => {
      if (!e) {
        return;
      }
      draggableControllerRefs.current.set(e.id!, e);
    },
    [draggableControllerRefs]
  );

  const handleCardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const id = getIdAttribute(e.currentTarget);
      if (id === null || id === selectedCardId) {
        return;
      }

      if (e.target !== e.currentTarget) {
        return;
      }

      e.stopPropagation();

      handleSelectCard(id);
    },
    [handleSelectCard, store, selectedCardId]
  );

  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleDeselectCard();
      }
    },
    [handleDeselectCard]
  );

  const handleListFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.target !== cardsContainerRef.current) {
        return;
      }

      const firstId = focusedCardIdRef.current ?? cards[0]?.id ?? null;
      focusById(firstId);

      if (cardsContainerRef.current) {
        cardsContainerRef.current.tabIndex = -1;
      }
    },
    [focusById, cards]
  );

  const handleListBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const related = e.relatedTarget;

    if (!cardsContainerRef.current) {
      return;
    }
    if (!(related && cardsContainerRef.current.contains(related))) {
      cardsContainerRef.current.tabIndex = 0;
    }
  }, []);

  return (
    <div className="min-h-dvh">
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
            <motion.button
              className="size-6 flex-center select-none rounded-full bg-gray-3"
              onClick={() => handleSpreadOut({ stagger: 5 })}
              type="button"
              whileTap={{ scale: 0.96 }}
            >
              +
            </motion.button>
            <motion.button
              className="size-6 flex-center select-none rounded-full bg-gray-3"
              onClick={handleOrganize}
              type="button"
              whileTap={{ scale: 0.96 }}
            >
              -
            </motion.button>
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
          style={{ "--max-width": "960px" } as React.CSSProperties}
        >
          <Grid.System guideWidth={1}>
            <Grid columns={grid.columns} rows={grid.rows}>
              <Grid.Cross column={1} row={1} />
              <Grid.Cross column={-1} row={-1} />
              <Grid.Cross column={1} row={-1} />
              <Grid.Cross column={-1} row={1} />
            </Grid>
          </Grid.System>

          <div className="absolute inset-0">
            {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: shh! */}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: shh! */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: shh! */}
            <div
              className={cx("relative row-2 flex h-full items-start sm:row-1")}
              onClick={handleContainerClick}
              ref={containerRef}
            >
              {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: shh! */}
              <div
                aria-label={`${collectionKey} cards List`}
                className="pointer-events-none absolute inset-0 transform-gpu focus-visible:outline-none"
                onBlur={handleListBlur}
                onFocus={handleListFocus}
                ref={cardsContainerRef}
                role="list"
                tabIndex={0}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  ref={cardsDragContainerRef}
                  role="presentation"
                  style={{
                    top: dragContainerPadding.top,
                    right: dragContainerPadding.right,
                    bottom: 0,
                    left: 0,
                  }}
                />

                {cards.map((card, index) => {
                  return (
                    <MemoizedDraggable
                      aria-current={
                        selectedCardId === card.id ? "true" : undefined
                      }
                      className={cx(
                        "focus-dashed group pointer-events-auto absolute z-(--z) flex flex-col items-center justify-center rounded-6 bg-gray-2/90 p-1 shadow-border-medium outline-offset-4 backdrop-blur-[12px] transition-[filter] duration-200 will-change-transform",
                        selectedCardId &&
                          selectedCardId !== card.id &&
                          "opacity-40 blur-lg pointer-events-none"
                      )}
                      data-id={card.id}
                      data-index={index}
                      data-slot="card-container"
                      dragConstraints={cardsDragContainerRef}
                      dragDisabled={Boolean(selectedCardId)}
                      draggableControllerRef={handleDraggableControllerRef}
                      dragTransition={cardDragTransition}
                      id={card.id}
                      index={index}
                      initial={cardInitial}
                      key={card.id}
                      onClick={handleCardClick}
                      onDragEnd={handleDragEnd}
                      onDragStart={handleDragStart}
                      onDragTransitionEnd={handleDragTransitionEnd}
                      ref={handleDragContainerRef}
                      role="listitem"
                      tabIndex={-1}
                      transition={cardTransition}
                    >
                      <div
                        className={cx(
                          "flex min-h-0 flex-col items-center justify-center transition-transform duration-200",
                          selectedCardId === card.id
                            ? "pointer-events-auto w-full flex-1"
                            : "pointer-events-none"
                        )}
                      >
                        <div className="flex h-0 w-full items-center justify-between overflow-hidden px-1 opacity-0 transition-[height,opacity] duration-200 group-hover:h-4.5 group-hover:opacity-100">
                          <h3 className="text-12 uppercase">{card.title}</h3>
                          <span className="ml-auto block">
                            <ArrowTopRightIcon />
                          </span>
                        </div>
                        <div
                          className={cx(
                            "overflow-clip rounded-4",
                            selectedCardId === card.id
                              ? "pointer-events-auto"
                              : "pointer-events-none"
                          )}
                        >
                          {card.src ? (
                            <Image
                              alt={card.title || ""}
                              className={cx(
                                "pointer-events-none h-auto w-[calc(var(--size-scale)*var(--width)*1px)] object-contain object-center drop-shadow transition-all duration-200"
                              )}
                              data-slot="card-image"
                              height={getCardSize(card).height}
                              loading="eager"
                              priority
                              src={card.src}
                              style={
                                {
                                  "--width": getCardSize(card).width,
                                  "--height": getCardSize(card).height,
                                  "--size-scale": isMobileSmall
                                    ? 0.6
                                    : // biome-ignore lint/style/noNestedTernary: shh!
                                      isMobile
                                      ? 0.8
                                      : 1,
                                } as CSSProperties
                              }
                              width={getCardSize(card).width}
                            />
                          ) : (
                            <div
                              className={cx(
                                "pointer-events-none h-auto w-[calc(var(--size-scale)*var(--width)*1px)] bg-gray-1 object-contain object-center drop-shadow transition-all duration-200"
                              )}
                              style={
                                {
                                  "--width": getCardSize(card).width,
                                  "--height": getCardSize(card).height,
                                  "--size-scale": isMobileSmall
                                    ? 0.6
                                    : // biome-ignore lint/style/noNestedTernary: shh!
                                      isMobile
                                      ? 0.8
                                      : 1,
                                  height: `${getCardSize(card).height}px`,
                                } as CSSProperties
                              }
                            />
                          )}
                          {resizingCardId === card.id && (
                            <span
                              aria-live="polite"
                              className="absolute right-1.5 bottom-1.5 rounded-4 bg-gray-3 px-1.5 py-0.5 font-mono text-10 text-gray-9"
                            >
                              {Math.round(getCardSize(card).width)} ×{" "}
                              {Math.round(getCardSize(card).height)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        aria-label={`Resize ${card.title ?? "card"}`}
                        className="pointer-events-auto absolute right-0 bottom-0 z-10 scale-50 cursor-nwse-resize opacity-0 transition-[transform,opacity] duration-200 group-hover:scale-100 group-hover:opacity-100"
                        onPointerDown={(e) => handleResizeStart(e, card.id)}
                        role="button"
                      >
                        <CornerBottomRightIcon />
                      </span>
                    </MemoizedDraggable>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex h-16 items-center justify-center gap-2">
        <span className="text-14 text-gray-11">300126_022132.250_UTC</span>
      </footer>
    </div>
  );
}

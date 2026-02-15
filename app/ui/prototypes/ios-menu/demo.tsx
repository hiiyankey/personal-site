"use client";

import {
  AlignCenterVerticallyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArchiveIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  CopyIcon,
  DotsHorizontalIcon,
  EnvelopeClosedIcon,
  Link2Icon,
  MinusIcon,
  Pencil2Icon,
  Share2Icon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { motion } from "motion/react";
import { useState } from "react";
import type { Anchor, Direction } from "./models";
import { Menu } from "./root";

export function Demo() {
  const [direction, setDirection] = useState<Direction>("top");
  const [anchor, setAnchor] = useState<Anchor>("start");

  const isHorizontal = direction === "left" || direction === "right";
  const handleDirectionChange = (newDirection: Direction) => {
    setDirection(newDirection);
    if (newDirection === "left" || newDirection === "right") {
      setAnchor("center");
    }
  };
  const [hasSubmenu, setHasSubmenu] = useState(true);
  const [useTriggerText, setUseTextTrigger] = useState(true);
  return (
    <div className="relative min-h-dvh flex-center">
      <Menu anchor={anchor} direction={direction}>
        <Menu.Container
          buttonRadius={useTriggerText ? 10 : undefined}
          buttonSize={useTriggerText ? { width: 60, height: 32 } : 40}
          menuRadius={12}
          menuWidth={160}
          style={{ backgroundColor: "var(--color-gray-2)" }}
        >
          <Menu.Trigger>
            {useTriggerText ? (
              <span className="text-14">Menu</span>
            ) : (
              <span>
                <DotsHorizontalIcon />
              </span>
            )}
          </Menu.Trigger>
          <Menu.Content className="p-1">
            <Menu.Item
              className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
              onSelect={() => {
                // ...
              }}
            >
              <span className="absolute left-0 w-6.5 flex-center">
                <Pencil2Icon />
              </span>{" "}
              Edit
            </Menu.Item>
            <Menu.Item
              className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
              onSelect={() => {
                // ...
              }}
            >
              <span className="absolute left-0 w-6.5 flex-center">
                <CopyIcon />
              </span>{" "}
              Copy
            </Menu.Item>
            {hasSubmenu ? (
              <Menu.SubMenu id="share">
                <Menu.SubMenuTrigger className="relative flex h-7 w-full items-center rounded-8 pr-1 pl-6.5 text-14 hover:bg-gray-a3 data-highlighted:bg-gray-a3">
                  {(isActive: boolean) => (
                    <>
                      <span className="absolute left-0 w-6.5 flex-center">
                        <Share2Icon />
                      </span>
                      Share
                      <span className="ml-auto">
                        <ChevronRightIcon
                          className="transition-transform duration-200"
                          style={{
                            transform: isActive
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </span>
                    </>
                  )}
                </Menu.SubMenuTrigger>
                <Menu.SubMenuContent className="-mt-1 rounded-12 bg-gray-2 p-1 shadow-border-medium">
                  <div className="mx-1 mb-1 border-gray-6 border-b" />
                  <Menu.Item
                    className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
                    onSelect={() => {
                      // ...
                    }}
                  >
                    <span className="absolute left-0 w-6.5 flex-center">
                      <TwitterLogoIcon />
                    </span>
                    Twitter
                  </Menu.Item>
                  <Menu.Item
                    className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
                    onSelect={() => {
                      // ...
                    }}
                  >
                    <span className="absolute left-0 w-6.5 flex-center">
                      <EnvelopeClosedIcon />
                    </span>
                    Email
                  </Menu.Item>
                  <Menu.Item
                    className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
                    onSelect={() => {
                      // ...
                    }}
                  >
                    <span className="absolute left-0 w-6.5 flex-center">
                      <Link2Icon />
                    </span>
                    Copy Link
                  </Menu.Item>
                </Menu.SubMenuContent>
              </Menu.SubMenu>
            ) : (
              <Menu.Item
                className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
                onSelect={() => {
                  // ...
                }}
              >
                <span className="absolute left-0 w-6.5 flex-center">
                  <Share2Icon />
                </span>
                Share
              </Menu.Item>
            )}

            <Menu.Item
              className="relative flex h-7 items-center rounded-8 pr-1 pl-6.5 text-14 data-highlighted:bg-gray-a3"
              onSelect={() => {
                // ...
              }}
            >
              <span className="absolute left-0 w-6.5 flex-center">
                <ArchiveIcon />
              </span>{" "}
              Archive
            </Menu.Item>
          </Menu.Content>
        </Menu.Container>
      </Menu>
      <div className="translate-center-x absolute bottom-16 flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap">
        <SegmentedControl
          id="direction"
          onChange={(v) => handleDirectionChange(v as Direction)}
          options={[
            {
              value: "top",
              icon: <ArrowUpIcon className="h-4 w-4" />,
              title: "Expand up",
            },
            {
              value: "bottom",
              icon: <ArrowDownIcon className="h-4 w-4" />,
              title: "Expand down",
            },
            {
              value: "left",
              icon: <ArrowLeftIcon className="h-4 w-4" />,
              title: "Expand left",
            },
            {
              value: "right",
              icon: <ArrowRightIcon className="h-4 w-4" />,
              title: "Expand right",
            },
          ]}
          value={direction}
        />
        <SegmentedControl
          id="anchor"
          onChange={(v) => setAnchor(v as Anchor)}
          options={[
            {
              value: "start",
              icon: <AlignLeftIcon className="h-4 w-4" />,
              title: "Align to start",
              disabled: isHorizontal,
            },
            {
              value: "center",
              icon: <AlignCenterVerticallyIcon className="h-4 w-4" />,
              title: "Align to center",
            },
            {
              value: "end",
              icon: <AlignRightIcon className="h-4 w-4" />,
              title: "Align to end",
              disabled: isHorizontal,
            },
          ]}
          value={anchor}
        />
        <SegmentedControl
          id="submenu"
          onChange={(v) => setHasSubmenu(v === "on")}
          options={[
            {
              value: "off",
              icon: <MinusIcon className="h-4 w-4" />,
              title: "No submenu",
            },
            {
              value: "on",
              icon: <ChevronRightIcon className="h-4 w-4" />,
              title: "With submenu",
            },
          ]}
          value={hasSubmenu ? "on" : "off"}
        />
        <SegmentedControl
          id="trigger"
          onChange={(v) => setUseTextTrigger(v === "text")}
          options={[
            {
              value: "icon",
              icon: <DotsHorizontalIcon className="h-4 w-4" />,
              title: "Icon trigger",
            },
            {
              value: "text",
              icon: (
                <span className="flex h-4 items-center font-medium text-12">
                  Aa
                </span>
              ),
              title: "Text trigger",
            },
          ]}
          value={useTriggerText ? "text" : "icon"}
        />
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: {
    value: T;
    icon: React.ReactNode;
    title?: string;
    disabled?: boolean;
  }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="relative flex rounded-full bg-gray-a2 p-1">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = option.disabled ?? false;
        return (
          <button
            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${isDisabled ? "cursor-not-allowed" : ""}`}
            data-tooltip={option.title}
            disabled={isDisabled}
            key={option.value}
            onClick={() => !isDisabled && onChange(option.value)}
            type="button"
          >
            {isSelected && (
              <motion.span
                className="absolute inset-0 rounded-full bg-gray-a4 shadow-small"
                layoutId={`pill-${id}`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                isDisabled
                  ? "text-gray-9"
                  : // biome-ignore lint/style/noNestedTernary: shh!
                    isSelected
                    ? "text-gray-12"
                    : "text-gray-11"
              }`}
            >
              {option.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}

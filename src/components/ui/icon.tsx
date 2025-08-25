import { createElement, ReactNode } from "react";

import { cn } from "@/lib/utils";
import Icons from "@/icons";

export type IconVariant = keyof typeof Icons;

interface IconProps {
  icon: IconVariant;
  className?: string;
}

export default function Icon({ icon, className }: IconProps): ReactNode {
  const renderIcon = Icons[icon];
  return createElement(renderIcon, {
    className: cn(className),
  });
}

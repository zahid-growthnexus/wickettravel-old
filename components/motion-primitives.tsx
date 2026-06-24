"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared scroll-reveal + stagger primitives for Wicket Travel.
 * All motion respects prefers-reduced-motion: when reduced, elements
 * render in their final state with no transform/opacity animation.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function fadeUp(distance = 24): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE },
    },
  };
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Single element that fades + rises into view once. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div className={className} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({
  children,
  className,
  amount = 0.2,
  ...rest
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

export function StaggerItem({
  children,
  className,
  distance = 24,
  ...rest
}: StaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} {...(rest as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} variants={fadeUp(distance)} {...rest}>
      {children}
    </motion.div>
  );
}

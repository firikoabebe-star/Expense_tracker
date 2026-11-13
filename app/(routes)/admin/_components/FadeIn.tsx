'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '/lib/utils'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Mount fade-in that collapses to a plain wrapper when motion is reduced. */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ThemedImage } from './themed-image'

export function AnimatedScreenshots() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 0])

  const x1 = useTransform(scrollYProgress, [0, 1], [-50, -150])
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 0])
  const x3 = useTransform(scrollYProgress, [0, 1], [50, 150])

  const rotate1 = useTransform(scrollYProgress, [0, 1], [15, 0])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [10, 0])
  const rotate3 = useTransform(scrollYProgress, [0, 1], [5, 0])

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-20 h-[80vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ x: x1, y: y1, rotateY: rotate1, scale, zIndex: 3 }}
        >
          <ThemedImage
            src={{
              light: '/screenshots/list-charts_light.png',
              dark: '/screenshots/list-charts_dark.png',
            }}
            alt="List and Charts"
            width={800}
            height={600}
            className="rounded-lg shadow-xl"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ x: x2, y: y2, rotateY: rotate2, scale, zIndex: 2 }}
        >
          <ThemedImage
            src={{
              light: '/screenshots/monthly_light.png',
              dark: '/screenshots/monthly_dark.png',
            }}
            alt="Monthly Overview"
            width={800}
            height={600}
            className="rounded-lg shadow-xl"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ x: x3, y: y3, rotateY: rotate3, scale, zIndex: 1 }}
        >
          <ThemedImage
            src={{
              light: '/screenshots/yearly_light.png',
              dark: '/screenshots/yearly_dark.png',
            }}
            alt="Yearly Overview"
            width={800}
            height={600}
            className="rounded-lg shadow-xl"
          />
        </motion.div>
      </div>
    </div>
  )
}

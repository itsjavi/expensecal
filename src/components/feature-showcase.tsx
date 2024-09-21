'use client'

import { cn } from '@/lib/utils'
import { ThemedImage } from './themed-image'

const features = [
  {
    title: 'Monthly and Yearly Overviews',
    description: 'Track your expenses with a detailed calendar view, helping you manage your budget effectively.',
    classes: 'border dark:border-none',
    image: {
      light: '/screenshots/calendars_light.png',
      dark: '/screenshots/calendars_dark.png',
    },
  },
  {
    title: 'List and Charts Overview',
    description: 'Get a quick glance at your expenses with an intuitive list view and insightful charts.',
    classes: '',
    image: {
      light: '/screenshots/list-charts_light.png',
      dark: '/screenshots/list-charts_dark.png',
    },
  },
]

export function FeatureShowcase() {
  return (
    <div className="mb-24 sm:mb-32">
      <div className="mx-auto max-w-3xl px-6">
        {features.map((feature, _index) => (
          <div key={feature.title} className="mb-16 last:mb-0">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{feature.title}</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">{feature.description}</p>
            <ThemedImage
              src={feature.image}
              alt={feature.title}
              width={800}
              height={400}
              className={cn(
                'rounded-xl shadow-xl w-full ring-1 ring-gray-400/10 dark:ring-gray-700/10',
                feature.classes,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

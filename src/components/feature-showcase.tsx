'use client'

import { ThemedImage } from './themed-image'

const features = [
  {
    title: 'List and Charts Overview',
    description: 'Get a quick glance at your subscriptions with an intuitive list view and insightful charts.',
    image: {
      light: '/screenshots/list-charts_light.png',
      dark: '/screenshots/list-charts_dark.png',
    },
  },
  {
    title: 'Monthly Expense Tracker',
    description:
      'Track your monthly expenses with a detailed calendar view, helping you manage your budget effectively.',
    image: {
      light: '/screenshots/monthly_light.png',
      dark: '/screenshots/monthly_dark.png',
    },
  },
  {
    title: 'Yearly Overview',
    description: 'Analyze your spending patterns over the year with our comprehensive yearly overview feature.',
    image: {
      light: '/screenshots/yearly_light.png',
      dark: '/screenshots/yearly_dark.png',
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
              height={600}
              className="rounded-xl shadow-xl w-full ring-1 ring-gray-400/10 dark:ring-gray-700/10"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

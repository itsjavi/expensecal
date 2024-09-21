import { FeatureShowcase } from '@/components/feature-showcase'
import { HomeHero } from '@/components/home-hero'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth()

  return (
    <div className="container mx-auto px-4 flex flex-col gap-12">
      <HomeHero isLoggedIn={!!session} />
      <FeatureShowcase />
    </div>
  )
}

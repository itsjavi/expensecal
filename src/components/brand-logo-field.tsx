'use client'

import { BrandLogoSearch } from '@/components/brand-logo-search'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type BrandLogoFieldProps = {
  currentLogoUrl?: string
  initialSearchValue?: string
  onSelect?: (logoUrl: string) => void
  onClear?: () => void
}

export function BrandLogoField({ currentLogoUrl, initialSearchValue, onSelect, onClear }: BrandLogoFieldProps) {
  const [logo, setLogo] = useState(currentLogoUrl)
  const [inputVisible, setInputVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const clearLogo = () => {
    setLogo(undefined)
    onClear?.()
  }

  const handleLogoSelect = (selectedLogo: string) => {
    setLogo(selectedLogo)
    setInputVisible(false)
    onSelect?.(selectedLogo)
  }

  const firstSearchWord = initialSearchValue?.split(' ')[0]

  return (
    <div>
      <Label htmlFor="logo-search">Logo</Label>
      {!logo &&
        (inputVisible ? (
          <BrandLogoSearch
            placeholder="Search for a logo"
            initialValue={firstSearchWord}
            initialExpanded={expanded}
            onSelect={({ query }) => query && handleLogoSelect(query.icon)}
          />
        ) : (
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setInputVisible(true)
                setExpanded(true)
              }}
            >
              Add Logo
            </Button>
          </div>
        ))}
      {logo && (
        <div className="mt-2 flex items-center">
          <Image src={logo} alt="Selected logo" width={32} height={32} className="h-8 w-8 mr-2 rounded-full" />
          <Button type="button" variant="ghost" size="sm" onClick={clearLogo}>
            <XIcon className="h-4 w-4" />
            Clear Logo
          </Button>
        </div>
      )}
    </div>
  )
}

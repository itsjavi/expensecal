'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SearchIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import { ScrollArea } from './ui/scroll-area'

type TQuery = {
  name: string
  domain: string
  icon: string
}

export type TAutocomplete = {
  value: string
  query?: TQuery
  queries: TQuery[]
}

interface IAutocomplete {
  onSelect?: ({ value, queries, query }: TAutocomplete) => void
  placeholder: string
  initialValue?: string
  initialExpanded?: boolean
}

const DEBOUNCE_TIME = 1000

export const BrandLogoSearch = ({ onSelect, placeholder, initialValue, initialExpanded }: IAutocomplete) => {
  const [value, setValue] = useState({ text: initialValue ?? '', active: false })
  const [queries, setQueries] = useState<TQuery[]>([])
  const [open, setOpen] = useState(initialExpanded ?? false)
  const [loading, setLoading] = useState(false)

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault()

  //   const text = queries?.[0]?.domain || value.text
  //   onSelect?.({ value: text, query: undefined, queries })
  //   setValue({ text, active: false })
  //   setQueries([])
  //   setOpen(false)
  // }

  const handleSelect = (query: TQuery) => {
    onSelect?.({ value: value.text, query, queries })
    setValue({ text: query.domain, active: false })
    setOpen(false)
  }

  const reset = () => {
    setQueries([])
    setValue({ text: '', active: false })
    setOpen(false)
  }

  const getQueries = useCallback(async (searchValue: string) => {
    if (searchValue !== '') {
      setLoading(true)
      try {
        const url = `https://api.brandfetch.io/v2/search/${searchValue}`

        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setQueries(Array.isArray(data) ? data : [])
        } else {
          setQueries([])
        }
      } catch (err) {
        console.log('Something went wrong, try again later.')
        setQueries([])
      } finally {
        setLoading(false)
      }
      return
    }

    setQueries([])
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (value.text !== '') {
        setLoading(true)
      }
      getQueries(value.text)
    }, DEBOUNCE_TIME)

    return () => clearTimeout(debounceTimer)
  }, [getQueries, value.text])

  const safeQueries = Array.isArray(queries) ? queries : []

  const commandItems: React.ReactNode[] = safeQueries.map((query, i) => (
    <CommandItem key={i} onSelect={() => handleSelect(query)}>
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 overflow-hidden rounded-md shadow">
          <Image
            src={query.icon}
            alt={query.name}
            width={32}
            height={32}
            className="h-full w-full object-cover rounded-full"
          />
        </div>
        <div>
          <p className="font-medium">{query.name || query.domain}</p>
          <p className="text-sm text-muted-foreground">{query.domain}</p>
        </div>
      </div>
    </CommandItem>
  ))

  return (
    <div className="relative pb-6 mb-4">
      <p className="absolute bottom-0 right-0 text-xs text-muted-foreground">
        Provided by{' '}
        <a href="https://brandfetch.com/" rel="noreferrer" target="_blank" className="hover:text-foreground">
          Brandfetch
        </a>
      </p>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value.text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValue({ text: e.target.value, active: true })
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          // onBlur={() => setOpen(false)}
          className="pl-10 pr-10"
        />
        {value.text !== '' && (
          <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-0" onClick={reset}>
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Command className={cn(open ? 'block' : 'hidden')}>
        <CommandList className="h-[120px] overflow-y-auto border border-muted rounded-md">
          {loading ? (
            <CommandEmpty>{value.text.length > 0 ? 'Searching...' : 'Loading...'}</CommandEmpty>
          ) : queries.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup>
              <ScrollArea>{commandItems}</ScrollArea>
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  )
}

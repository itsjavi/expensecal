import type { MetadataRoute } from 'next'
import type { NextResponse } from 'next/server'

export interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export type ConditionalPick<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
  }[keyof Base]
>

export type ConditionalUnpick<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? never : Key
  }[keyof Base]
>

export type PropsOf<T> = ConditionalUnpick<T, () => unknown>
export type MethodsOf<T> = ConditionalPick<T, () => unknown>

export type Simplify<T> = {
  [P in keyof T]: T[P]
}

export type Awaitable<T> = T | Promise<T>
export type NextMiddlewareResponse<T> = Awaitable<T> | Awaitable<NextResponse> | Awaitable<Response>
export type NextMiddleware = <T>(request: Request, next: () => T) => NextMiddlewareResponse<T>

export type PageProps<TParams = { slug: string }> = {
  params: TParams
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface WebManifest extends MetadataRoute.Manifest {
  // @see https://json.schemastore.org/web-manifest-combined.json
  // @see https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots
  screenshots: Array<{
    src: string
    type?: string
    sizes?: string
    // platform?: 'android' | 'macos' | 'windows' | 'ios' | 'ipados | 'chromeos' | 'chrome_web_store' | 'itunes' // etc.
    form_factor?: 'narrow' | 'wide'
    label?: string
  }>
  edge_side_panel?: {
    // ms-edge
    preferred_width: number
  }
}

export type NullableFormSchema<T> = {
  [K in keyof T]: FormDataEntryValue | string | null
}

export type FormState<TData extends Record<string, unknown> = Record<string, unknown>> =
  | {
    status: 'ok'
    data: TData
    errors?: never
  }
  | {
    status: 'error'
    data?: never
    errors: Record<string, string[] | undefined>
  }
  | undefined

export interface Cookie {
  name: string
  value: string
  attributes: {
    secure?: boolean
    path?: string
    sameSite?: 'lax' | 'strict' | 'none'
    httpOnly?: boolean
    maxAge?: number
    expires?: Date
    domain?: string
  }
}

export interface NextPageProps<TParams = { slug: string }> {
  params: TParams
  searchParams: { [key: string]: string | string[] | undefined }
}

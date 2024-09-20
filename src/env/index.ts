export type AppEnvName = 'development' | 'production' | 'preview'

function getEnvName(): AppEnvName {
  const value = process.env['APP_ENV'] ?? process.env['NEXT_PUBLIC_APP_ENV'] ?? 'development'

  if (value === 'dev') {
    return 'development'
  }

  if (value === 'prod') {
    return 'production'
  }

  if (!value) {
    throw new Error('Missing environment variable: APP_ENV')
  }

  return value as AppEnvName
}

export function isDevelopmentEnv() {
  return getEnvName() === 'development'
}

export function isProductionEnv() {
  return getEnvName() === 'production'
}

export function isPreviewEnv() {
  return getEnvName() === 'preview'
}

export function isServerSide() {
  return typeof window === 'undefined' && typeof document === 'undefined'
}

export function isClientSide() {
  return !isServerSide()
}

export function assertServerOnly() {
  if (isClientSide()) {
    throw new Error('This file should not be imported in the browser')
  }
}

export function assertClientOnly() {
  if (isServerSide()) {
    throw new Error('This file should not be imported on the server')
  }
}

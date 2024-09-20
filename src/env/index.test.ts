import {
  assertClientOnly,
  assertServerOnly,
  isClientSide,
  isDevelopmentEnv,
  isPreviewEnv,
  isProductionEnv,
  isServerSide,
} from '.'

describe('env utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('environment checks', () => {
    it('isDevelopmentEnv returns true in development environment and false otherwise', () => {
      process.env['APP_ENV'] = 'development'
      expect(isDevelopmentEnv()).toBe(true)

      process.env['APP_ENV'] = 'production'
      expect(isDevelopmentEnv()).toBe(false)

      process.env['APP_ENV'] = 'preview'
      expect(isDevelopmentEnv()).toBe(false)
    })

    it('isProductionEnv returns true in production environment and false otherwise', () => {
      process.env['APP_ENV'] = 'production'
      expect(isProductionEnv()).toBe(true)

      process.env['APP_ENV'] = 'development'
      expect(isProductionEnv()).toBe(false)

      process.env['APP_ENV'] = 'preview'
      expect(isProductionEnv()).toBe(false)
    })

    it('isPreviewEnv returns true in preview environment and false otherwise', () => {
      process.env['APP_ENV'] = 'preview'
      expect(isPreviewEnv()).toBe(true)

      process.env['APP_ENV'] = 'production'
      expect(isPreviewEnv()).toBe(false)

      process.env['APP_ENV'] = 'development'
      expect(isPreviewEnv()).toBe(false)
    })
  })

  describe('server/client checks when window is undefined', () => {
    it('isServerSide returns true when window is undefined', () => {
      expect(isServerSide()).toBe(true)
    })

    it('isClientSide returns false when window is undefined', () => {
      expect(isClientSide()).toBe(false)
    })
  })

  describe('server/client checks when window is defined', () => {
    beforeEach(() => {
      // biome-ignore lint/suspicious/noExplicitAny: needed for testing
      ;(globalThis as any).window = {}
      // biome-ignore lint/suspicious/noExplicitAny: needed for testing
      ;(globalThis as any).document = {}
    })

    afterAll(() => {
      // biome-ignore lint/suspicious/noExplicitAny: needed for testing
      ;(globalThis as any).window = undefined
      // biome-ignore lint/suspicious/noExplicitAny: needed for testing
      ;(globalThis as any).document = undefined
    })

    it('isServerSide returns false when window is defined', () => {
      expect(isServerSide()).toBe(false)
    })

    it('isClientSide returns true when window is defined', () => {
      expect(isClientSide()).toBe(true)
    })
  })

  describe('assertions', () => {
    it('assertServerOnly does not throw on server side', () => {
      expect(() => assertServerOnly()).not.toThrow()
    })

    it('assertClientOnly throws on server side', () => {
      expect(() => assertClientOnly()).toThrow('This file should not be imported on the server')
    })
  })
})

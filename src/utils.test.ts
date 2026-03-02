import { describe, it, expect } from 'vitest'
import { dateString, pick } from './utils'

describe('dateString', () => {
  it('returns ISO date string (YYYY-MM-DD)', () => {
    const date = new Date('2024-06-15T12:34:56Z')
    expect(dateString(date)).toBe('2024-06-15')
  })

  it('pads month and day with leading zeros', () => {
    const date = new Date('2024-01-05T00:00:00Z')
    expect(dateString(date)).toBe('2024-01-05')
  })
})

describe('pick', () => {
  it('picks specified keys from an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('ignores keys that do not exist in the object', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ['a', 'z'])).toEqual({ a: 1 })
  })

  it('returns an empty object when no keys match', () => {
    const obj = { a: 1 }
    expect(pick(obj, ['x', 'y'])).toEqual({})
  })
})

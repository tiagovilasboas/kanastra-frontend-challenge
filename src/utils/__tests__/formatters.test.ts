import { describe, expect, it } from 'vitest'

import { formatFollowers, getPopularityColor } from '../formatters'

describe('formatters', () => {
  describe('formatFollowers', () => {
    it('should format followers less than 1000', () => {
      expect(formatFollowers(500)).toBe('500')
      expect(formatFollowers(999)).toBe('999')
    })

    it('should format followers in thousands', () => {
      expect(formatFollowers(1500)).toBe('1.5K')
      expect(formatFollowers(50000)).toBe('50.0K')
      expect(formatFollowers(999999)).toBe('1000.0K')
    })

    it('should format followers in millions', () => {
      expect(formatFollowers(1000000)).toBe('1.0M')
      expect(formatFollowers(2500000)).toBe('2.5M')
      expect(formatFollowers(10000000)).toBe('10.0M')
    })
  })

  describe('getPopularityColor', () => {
    it('should return green for high popularity (80+)', () => {
      expect(getPopularityColor(80)).toBe('#1DB954')
      expect(getPopularityColor(95)).toBe('#1DB954')
      expect(getPopularityColor(100)).toBe('#1DB954')
    })

    it('should return yellow for medium popularity (60-79)', () => {
      expect(getPopularityColor(60)).toBe('#fbbf24')
      expect(getPopularityColor(70)).toBe('#fbbf24')
      expect(getPopularityColor(79)).toBe('#fbbf24')
    })

    it('should return orange for low popularity (40-59)', () => {
      expect(getPopularityColor(40)).toBe('#f59e0b')
      expect(getPopularityColor(50)).toBe('#f59e0b')
      expect(getPopularityColor(59)).toBe('#f59e0b')
    })

    it('should return red for very low popularity (<40)', () => {
      expect(getPopularityColor(0)).toBe('#ef4444')
      expect(getPopularityColor(20)).toBe('#ef4444')
      expect(getPopularityColor(39)).toBe('#ef4444')
    })
  })
})

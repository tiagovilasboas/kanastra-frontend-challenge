import { describe, expect, it } from 'vitest'

import { formatFollowers, getPopularityColor } from '../formatters'

describe('formatters', () => {
  describe('formatFollowers', () => {
    it('should format followers less than 1000', () => {
      expect(formatFollowers(500)).toBe('500')
      expect(formatFollowers(999)).toBe('999')
    })

    it('should format followers in thousands', () => {
      expect(formatFollowers(1000)).toBe('1.0K')
      expect(formatFollowers(1500)).toBe('1.5K')
      expect(formatFollowers(999999)).toBe('1000.0K')
    })

    it('should format followers in millions', () => {
      expect(formatFollowers(1000000)).toBe('1.0M')
      expect(formatFollowers(1500000)).toBe('1.5M')
      expect(formatFollowers(2500000)).toBe('2.5M')
    })
  })

  describe('getPopularityColor', () => {
    it('should return green for high popularity (80+)', () => {
      expect(getPopularityColor(80)).toBe('#1DB954')
      expect(getPopularityColor(90)).toBe('#1DB954')
      expect(getPopularityColor(100)).toBe('#1DB954')
    })

    it('should return gold for medium popularity (60-79)', () => {
      expect(getPopularityColor(60)).toBe('#FFD700')
      expect(getPopularityColor(70)).toBe('#FFD700')
      expect(getPopularityColor(79)).toBe('#FFD700')
    })

    it('should return orange for low popularity (40-59)', () => {
      expect(getPopularityColor(40)).toBe('#FFA500')
      expect(getPopularityColor(50)).toBe('#FFA500')
      expect(getPopularityColor(59)).toBe('#FFA500')
    })

    it('should return tomato for very low popularity (20-39)', () => {
      expect(getPopularityColor(20)).toBe('#FF6347')
      expect(getPopularityColor(30)).toBe('#FF6347')
      expect(getPopularityColor(39)).toBe('#FF6347')
    })

    it('should return gray for extremely low popularity (<20)', () => {
      expect(getPopularityColor(0)).toBe('#808080')
      expect(getPopularityColor(10)).toBe('#808080')
      expect(getPopularityColor(19)).toBe('#808080')
    })
  })
})

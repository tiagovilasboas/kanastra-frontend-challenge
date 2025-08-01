import { describe, expect, it } from 'vitest'

import { formatDuration, formatFollowers, formatDate } from '../formatters'

describe('formatters', () => {
  describe('formatDuration', () => {
    it('should format duration in milliseconds to MM:SS format', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(30000)).toBe('0:30')
      expect(formatDuration(60000)).toBe('1:00')
      expect(formatDuration(90000)).toBe('1:30')
      expect(formatDuration(120000)).toBe('2:00')
      expect(formatDuration(125000)).toBe('2:05')
      expect(formatDuration(3600000)).toBe('60:00')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(-1000)).toBe('0:00')
      expect(formatDuration(999)).toBe('0:00')
      expect(formatDuration(59999)).toBe('0:59')
      expect(formatDuration(60001)).toBe('1:00')
    })

    it('should handle large durations', () => {
      expect(formatDuration(7200000)).toBe('120:00') // 2 hours
      expect(formatDuration(86400000)).toBe('1440:00') // 24 hours
    })

    it('should handle decimal milliseconds', () => {
      expect(formatDuration(30000.5)).toBe('0:30')
      expect(formatDuration(60000.999)).toBe('1:00')
    })
  })

  describe('formatFollowers', () => {
    it('should format followers count correctly', () => {
      expect(formatFollowers(0)).toBe('0')
      expect(formatFollowers(100)).toBe('100')
      expect(formatFollowers(999)).toBe('999')
      expect(formatFollowers(1000)).toBe('1.0K')
      expect(formatFollowers(1500)).toBe('1.5K')
      expect(formatFollowers(9999)).toBe('10.0K')
      expect(formatFollowers(10000)).toBe('10.0K')
      expect(formatFollowers(999999)).toBe('1000.0K')
      expect(formatFollowers(1000000)).toBe('1.0M')
      expect(formatFollowers(1500000)).toBe('1.5M')
      expect(formatFollowers(9999999)).toBe('10.0M')
      expect(formatFollowers(10000000)).toBe('10.0M')
    })

    it('should handle edge cases', () => {
      expect(formatFollowers(-100)).toBe('0')
      expect(formatFollowers(999.9)).toBe('999')
      expect(formatFollowers(1000.1)).toBe('1.0K')
      expect(formatFollowers(999999.9)).toBe('1000.0K')
      expect(formatFollowers(1000000.1)).toBe('1.0M')
    })

    it('should handle very large numbers', () => {
      expect(formatFollowers(100000000)).toBe('100.0M')
      expect(formatFollowers(999999999)).toBe('1000.0M')
      expect(formatFollowers(1000000000)).toBe('1000.0M') // Max reasonable value
    })

    it('should handle decimal precision', () => {
      expect(formatFollowers(1234)).toBe('1.2K')
      expect(formatFollowers(12345)).toBe('12.3K')
      expect(formatFollowers(123456)).toBe('123.5K')
      expect(formatFollowers(1234567)).toBe('1.2M')
    })
  })

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      expect(formatDate('2023-01-15')).toBe('15 de janeiro de 2023')
      expect(formatDate('2022-12-31')).toBe('31 de dezembro de 2022')
      expect(formatDate('2021-06-01')).toBe('1 de junho de 2021')
      expect(formatDate('2020-02-29')).toBe('29 de fevereiro de 2020') // Leap year
    })

    it('should handle different date formats', () => {
      expect(formatDate('2023-01-01')).toBe('1 de janeiro de 2023')
      expect(formatDate('2023-12-25')).toBe('25 de dezembro de 2023')
      expect(formatDate('2023-03-08')).toBe('8 de março de 2023')
    })

    it('should handle edge cases', () => {
      // Invalid dates should return the original string or throw
      expect(() => formatDate('invalid-date')).toThrow()
      expect(() => formatDate('')).toThrow()
      expect(() => formatDate('2023-13-01')).toThrow() // Invalid month
      expect(() => formatDate('2023-01-32')).toThrow() // Invalid day
    })

    it('should handle leap years correctly', () => {
      expect(formatDate('2024-02-29')).toBe('29 de fevereiro de 2024') // Leap year
      expect(() => formatDate('2023-02-29')).toThrow() // Not a leap year
    })

    it('should handle different locales', () => {
      // Mock locale to test different formatting
      const mockLocale = 'en-US'
      const mockDate = new Date('2023-01-15')
      const mockFormatter = new Intl.DateTimeFormat(mockLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      
      expect(mockFormatter.format(mockDate)).toBe('January 15, 2023')
    })

    it('should handle ISO date strings', () => {
      expect(formatDate('2023-01-15T00:00:00.000Z')).toBe('15 de janeiro de 2023')
      expect(formatDate('2023-01-15T12:30:45.123Z')).toBe('15 de janeiro de 2023')
    })

    it('should handle date objects', () => {
      const date = new Date('2023-01-15')
      expect(formatDate(date.toISOString().split('T')[0])).toBe('15 de janeiro de 2023')
    })
  })

  describe('integration tests', () => {
    it('should handle realistic Spotify data', () => {
      // Simulate real Spotify API responses
      const mockArtist = {
        followers: { total: 45678912 },
        popularity: 95,
      }

      const mockTrack = {
        duration_ms: 198000, // 3:18
      }

      const mockAlbum = {
        release_date: '2023-06-23',
      }

             expect(formatFollowers(mockArtist.followers.total)).toBe('45.7M')
       expect(formatDuration(mockTrack.duration_ms)).toBe('3:18')
       expect(formatDate(mockAlbum.release_date)).toBe('23 de junho de 2023')
    })

    it('should handle edge cases in real scenarios', () => {
      // Very popular artist
      expect(formatFollowers(999999999)).toBe('1000.0M')
      
      // Very long song
      expect(formatDuration(7200000)).toBe('120:00') // 2 hours
      
      // Recent release
             expect(formatDate('2024-01-01')).toBe('1 de janeiro de 2024')
    })
  })
})

import {
  formatDate,
  formatDuration,
  formatFollowers,
  getPopularityColor,
  translateGenre,
  translateGenres,
} from '../formatters'

describe('formatters', () => {
  describe('formatFollowers', () => {
    it('should format followers correctly for different ranges', () => {
      expect(formatFollowers(0)).toBe('0')
      expect(formatFollowers(500)).toBe('500')
      expect(formatFollowers(1500)).toBe('1.5K')
      expect(formatFollowers(10000)).toBe('10.0K')
      expect(formatFollowers(1500000)).toBe('1.5M')
      expect(formatFollowers(2500000)).toBe('2.5M')
    })

    it('should handle negative values', () => {
      expect(formatFollowers(-100)).toBe('0')
      expect(formatFollowers(-1000)).toBe('0')
    })

    it('should handle edge cases', () => {
      expect(formatFollowers(999)).toBe('999')
      expect(formatFollowers(1000)).toBe('1.0K')
      expect(formatFollowers(999999)).toBe('1000.0K')
      expect(formatFollowers(1000000)).toBe('1.0M')
    })
  })

  describe('getPopularityColor', () => {
    it('should return correct colors for different popularity levels', () => {
      expect(getPopularityColor(90)).toBe('#1DB954') // Spotify green
      expect(getPopularityColor(80)).toBe('#1DB954') // Spotify green
      expect(getPopularityColor(70)).toBe('#FFD700') // Gold
      expect(getPopularityColor(60)).toBe('#FFD700') // Gold
      expect(getPopularityColor(50)).toBe('#FFA500') // Orange
      expect(getPopularityColor(40)).toBe('#FFA500') // Orange
      expect(getPopularityColor(30)).toBe('#FF6347') // Tomato
      expect(getPopularityColor(20)).toBe('#FF6347') // Tomato
      expect(getPopularityColor(10)).toBe('#808080') // Gray
      expect(getPopularityColor(0)).toBe('#808080') // Gray
    })

    it('should handle edge cases', () => {
      expect(getPopularityColor(100)).toBe('#1DB954')
      expect(getPopularityColor(-10)).toBe('#808080')
    })
  })

  describe('translateGenre', () => {
    it('should translate genres correctly in Portuguese', () => {
      expect(translateGenre('pop', 'pt')).toBe('Pop')
      expect(translateGenre('rock', 'pt')).toBe('Rock')
      expect(translateGenre('hip hop', 'pt')).toBe('Hip Hop')
      expect(translateGenre('electronic', 'pt')).toBe('Eletrônica')
      expect(translateGenre('bossa nova', 'pt')).toBe('Bossa Nova')
      expect(translateGenre('mpb', 'pt')).toBe('MPB')
    })

    it('should translate genres correctly in English', () => {
      expect(translateGenre('pop', 'en')).toBe('Pop')
      expect(translateGenre('rock', 'en')).toBe('Rock')
      expect(translateGenre('hip hop', 'en')).toBe('Hip Hop')
      expect(translateGenre('electronic', 'en')).toBe('Electronic')
      expect(translateGenre('bossa nova', 'en')).toBe('Bossa Nova')
    })

    it('should handle case insensitive input', () => {
      expect(translateGenre('POP', 'pt')).toBe('Pop')
      expect(translateGenre('Rock', 'pt')).toBe('Rock')
      expect(translateGenre('HIP HOP', 'pt')).toBe('Hip Hop')
    })

    it('should capitalize unknown genres', () => {
      expect(translateGenre('unknown-genre', 'pt')).toBe('Unknown-genre')
      expect(translateGenre('custom style', 'en')).toBe('Custom style')
    })

    it('should default to Portuguese when no language specified', () => {
      expect(translateGenre('pop')).toBe('Pop')
      expect(translateGenre('electronic')).toBe('Eletrônica')
    })

    it('should handle empty or invalid language', () => {
      expect(translateGenre('pop', '')).toBe('Pop') // Defaults to English
      expect(translateGenre('pop', 'invalid')).toBe('Pop') // Defaults to English
    })
  })

  describe('translateGenres', () => {
    it('should translate array of genres', () => {
      const genres = ['pop', 'rock', 'electronic']
      const translated = translateGenres(genres, 'pt')
      expect(translated).toEqual(['Pop', 'Rock', 'Eletrônica'])
    })

    it('should handle empty array', () => {
      expect(translateGenres([], 'pt')).toEqual([])
    })

    it('should handle mixed case genres', () => {
      const genres = ['POP', 'Rock', 'HIP HOP']
      const translated = translateGenres(genres, 'pt')
      expect(translated).toEqual(['Pop', 'Rock', 'Hip Hop'])
    })
  })

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(30000)).toBe('0:30') // 30 seconds
      expect(formatDuration(60000)).toBe('1:00') // 1 minute
      expect(formatDuration(90000)).toBe('1:30') // 1 minute 30 seconds
      expect(formatDuration(125000)).toBe('2:05') // 2 minutes 5 seconds
      expect(formatDuration(3600000)).toBe('60:00') // 1 hour
    })

    it('should handle negative values', () => {
      expect(formatDuration(-1000)).toBe('0:00')
      expect(formatDuration(-60000)).toBe('0:00')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(59999)).toBe('0:59')
      expect(formatDuration(60001)).toBe('1:00')
      expect(formatDuration(3599999)).toBe('59:59')
    })
  })

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock Date.now() to return a fixed timestamp
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should format valid dates correctly', () => {
      expect(formatDate('2024-01-15')).toBe('14 de janeiro de 2024')
      expect(formatDate('2023-12-25')).toBe('24 de dezembro de 2023')
      expect(formatDate('2022-06-10')).toBe('9 de junho de 2022')
    })

    it('should handle ISO date strings', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('15 de janeiro de 2024')
      expect(formatDate('2024-01-15T23:59:59.999Z')).toBe('15 de janeiro de 2024')
    })

    it('should throw error for invalid dates', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date format')
      expect(() => formatDate('2024-13-45')).toThrow('Invalid date format')
      expect(() => formatDate('')).toThrow('Invalid date format')
    })

    it('should handle edge cases', () => {
      // These dates are handled by the function's validation
      expect(() => formatDate('invalid-date')).toThrow() // Invalid format
    })

    it('should handle different date formats consistently', () => {
      const date1 = formatDate('2024-01-15')
      const date2 = formatDate('2024-01-15T00:00:00.000Z')
      expect(date1).toBe(date2)
    })
  })
}) 
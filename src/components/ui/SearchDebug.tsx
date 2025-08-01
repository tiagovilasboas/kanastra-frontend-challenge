import { useState } from 'react'

import { spotifyRepository } from '@/repositories'
import { logger } from '@/utils/logger'

export const SearchDebug: React.FC = () => {
  const [testQuery, setTestQuery] = useState('')
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testSearch = async () => {
    if (!testQuery.trim()) return

    setIsLoading(true)
    setResult('')

    try {
      logger.debug('Testing search with query:', testQuery)
      
      // First, try to get client token
      logger.debug('Getting client token...')
      const clientToken = await spotifyRepository.getClientToken()
      logger.debug('Client token obtained:', clientToken ? 'Yes' : 'No')
      
      // Then try public search
      logger.debug('Testing public search...')
      const response = await spotifyRepository.searchArtistsPublic(testQuery)
      
      setResult(`✅ Success! Found ${response.artists.items.length} artists`)
      logger.debug('Search test successful:', response.artists.items.length)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResult(`❌ Error: ${errorMessage}`)
      logger.error('Search test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#1a1a1a',
      color: '#fff',
      padding: '15px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px',
      minWidth: '250px'
    }}>
      <h4>🔍 Search Debug</h4>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={testQuery}
          onChange={(e) => setTestQuery(e.target.value)}
          placeholder="Test query..."
          style={{
            width: '100%',
            padding: '5px',
            marginBottom: '5px',
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '3px'
          }}
        />
        <button
          onClick={testSearch}
          disabled={isLoading || !testQuery.trim()}
          style={{
            width: '100%',
            padding: '5px',
            background: isLoading ? '#666' : '#1DB954',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test Search'}
        </button>
      </div>
      {result && (
        <div style={{
          marginTop: '10px',
          padding: '5px',
          background: '#333',
          borderRadius: '3px',
          wordBreak: 'break-word'
        }}>
          {result}
        </div>
      )}
    </div>
  )
} 
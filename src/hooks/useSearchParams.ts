import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Hook responsável por centralizar a leitura e manipulação dos parâmetros de busca
 * (q, market, includeExternal, etc.) vindos da URL.
 *
 * Mantém a View (páginas) livre de detalhes de implementação de `URLSearchParams`.
 */
export interface SearchQueryParams {
  /** Termo de busca digitado pelo usuário */
  q: string
  /** Código do mercado (ex: BR, US). Padrão BR. */
  market: string
  /** Flag para incluir conteúdo explícito. Se não existir assume false */
  includeExternal?: boolean
}

export interface UseSearchParamsResult {
  /** Parâmetros já normalizados e tipados */
  params: SearchQueryParams
  /**
   * Atualiza / adiciona um parâmetro na URL mantendo os demais intactos.
   * @param key Chave do parâmetro
   * @param value Novo valor
   */
  setParam: (key: string, value: string) => void
}

export function useSearchParamsQuery(): UseSearchParamsResult {
  const [searchParams, setSearchParams] = useSearchParams()

  const params: SearchQueryParams = {
    q: searchParams.get('q') ?? '',
    market: searchParams.get('market') ?? 'BR',
    includeExternal: searchParams.get('includeExternal') === 'true',
  }

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      setSearchParams(next)
    },
    [searchParams, setSearchParams],
  )

  return { params, setParam }
}

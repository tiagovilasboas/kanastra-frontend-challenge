export interface BaseRepository<T> {
  findById?(id: string): Promise<T | null>
  findAll?(): Promise<T[]>
  create?(data: Partial<T>): Promise<T>
  update?(id: string, data: Partial<T>): Promise<T>
  delete?(id: string): Promise<boolean>
}

export class RepositoryError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'RepositoryError'
  }
}

export interface RepositoryResponse<T> {
  data: T | null
  error?: string
  loading: boolean
}

export interface PaginationParams {
  limit?: number
  offset?: number
  page?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  hasNext: boolean
  hasPrevious: boolean
  currentPage: number
  totalPages: number
} 
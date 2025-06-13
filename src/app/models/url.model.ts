export type Urls = Url[]

export interface Url {
  id: string
  originalUrl: string
  shortUrl: string
  clicks: number
  isActive: boolean
  expirationDate: string
  createdAt: string
  updatedAt: string
  lastAccessedAt?: string
  isExpired?: boolean
  daysUntilExpiration?: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface UrlsResponse {
  urls: Url[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
}

export interface UrlAnalytics {
  shortUrl: string
  originalUrl: string
  totalClicks: number
  createdAt: string
  lastAccessedAt?: string
  isActive: boolean
  isExpired: boolean
  expirationDate: string
  daysUntilExpiration?: number
}

export interface SystemStats {
  totalUrls: number
  activeUrls: number
  expiredUrls: number
  totalClicks: number
  urlsCreatedToday: number
}

export interface CreateUrlRequest {
  originalUrl: string
  customShortUrl?: string
}

/**
 * Represents a shortened URL entity
 */
export interface ShortenedUrl {
  readonly id: string;
  readonly originalUrl: string;
  readonly shortUrl: string;
  readonly fullShortUrl?: string; // Complete short URL for display
  readonly clicks: number;
  readonly isActive: boolean;
  readonly expirationDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastAccessedAt?: Date;
  readonly isExpired?: boolean;
  readonly daysUntilExpiration?: number;
}

/**
 * Array type for multiple URL entities
 */
export type ShortenedUrlCollection = ShortenedUrl[];

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly timestamp: Date;
}

/**
 * Paginated response for URL collections
 */
export interface ShortenedUrlsResponse {
  readonly urls: ShortenedUrl[];
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalCount: number;
    readonly hasNextPage: boolean;
    readonly hasPrevPage: boolean;
    readonly limit: number;
  };
}

/**
 * Analytics data for a specific URL
 */
export interface ShortenedUrlAnalytics {
  readonly shortUrl: string;
  readonly originalUrl: string;
  readonly totalClicks: number;
  readonly createdAt: Date;
  readonly lastAccessedAt?: Date;
  readonly isActive: boolean;
  readonly isExpired: boolean;
  readonly expirationDate: Date;
  readonly daysUntilExpiration?: number;
}

/**
 * System-wide statistics
 */
export interface SystemStats {
  readonly totalUrls: number;
  readonly activeUrls: number;
  readonly expiredUrls: number;
  readonly totalClicks: number;
  readonly urlsCreatedToday: number;
}

/**
 * Request payload for creating a new shortened URL
 */
export interface CreateShortenedUrlRequest {
  readonly originalUrl: string;
  readonly customShortUrl?: string;
}

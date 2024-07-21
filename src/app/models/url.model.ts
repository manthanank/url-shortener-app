export type Urls = Url[]

export interface Url {
  _id: string
  originalUrl: string
  shortUrl: string
  clicks: number
  expirationDate: string
  createdAt: string
  __v: number
}

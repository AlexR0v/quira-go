import { HttpStatusCode } from 'axios'

export type TError = {
  error: boolean
  httpStatus: HttpStatusCode
  message: string
}
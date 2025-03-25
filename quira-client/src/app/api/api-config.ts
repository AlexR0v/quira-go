import axios, { AxiosError, AxiosResponse } from 'axios'

const BASE_URL = 'http://localhost:9000'
const ACCESS_TOKEN = localStorage.getItem('access_token')

export const axiosQuery = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
  },
})

axiosQuery.interceptors.response.use(
  (response: AxiosResponse) => response,
  async(error: AxiosError) => {
    if(error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/sign-in'
    }
  },
)


import { Loader }                           from '@/components/ui/loader.tsx'
import { Toaster }                          from '@/components/ui/toaster.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense }                         from 'react'
import { BrowserRouter }                    from 'react-router'
import { Router }                           from './router.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Router />
          <Toaster />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

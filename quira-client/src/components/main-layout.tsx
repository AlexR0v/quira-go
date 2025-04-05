import { useGetCurrentUser }             from '@/app/api/query-hooks/useUser.tsx'
import { Loader }                        from '@/components/ui/loader.tsx'
import { useEffect, useState }           from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

const MainLayout = () => {
  
  const [show, setShow] = useState(false)
  
  const location = useLocation()
  
  const { isLoading, isError } = useGetCurrentUser()
  
  useEffect(() => {
    if(isError) {
      setShow(false)
      return
    }
    
    if(!isError) {
      setShow(true)
    }
    
  }, [isError])
  
  if(isLoading) {
    return <Loader />
  }
  
  return show
    ? <Outlet />
    : <Navigate
      to='/sign-in'
      state={{ from: location }}
      replace
    />
}

export default MainLayout
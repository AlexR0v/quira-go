import { useGetCurrentUser }             from '@/app/api/query-hooks/useUser.tsx'
import { Loader }                        from '@/components/ui/loader.tsx'
import { useEffect, useState }           from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

const MainLayout = () => {
  
  const [show, setShow] = useState(false)
  
  const location = useLocation()
  
  const { data, isLoading, error } = useGetCurrentUser()
  console.log(error)
  const isLoginStorage = localStorage.getItem('access_token') ?? ''
  
  useEffect(() => {
    if(isLoginStorage) {
      setShow(true)
      return
    }
    
    if(!isLoginStorage) {
      setShow(false)
    }
    
  }, [isLoginStorage, data])
  
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
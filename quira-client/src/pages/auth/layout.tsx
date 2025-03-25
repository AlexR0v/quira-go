import logoText                             from '@/assets/logo-text.svg'
import { Button }                           from '@/components/ui/button.tsx'
import { Outlet, useLocation, useNavigate } from 'react-router'

const AuthLayout = () => {
  
  const location = useLocation()
  const navigate = useNavigate()
  
  const onGoAuth = () => {
    if(location.pathname === '/sign-in') {
      navigate('/sign-up')
    } else {
      navigate('/sign-in')
    }
  }
  
  return (
    <main className='bg-neutral-100 min-h-screen'>
      <div className='container mx-auto p-4 min-h-screen flex flex-col'>
        <nav className='flex items-center justify-between'>
          
          <img
            src={logoText}
            width={152}
            height={56}
            alt='logo'
          />
          <Button
            variant='secondary'
            onClick={onGoAuth}
          >
            {location.pathname === '/sign-in' ? 'Зарегистрироваться' : 'Войти'}
          </Button>
        </nav>
        <div className='flex flex-1 flex-col items-center justify-center pt-4 md:pt-14 h-full'>
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
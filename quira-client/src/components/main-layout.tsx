import { useGetCurrentUser } from '@/app/api/query-hooks/useUser.tsx'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { Sidebar } from "@/components/sidebar.tsx";
import { Navbar } from "@/components/navbar.tsx";
import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal.tsx";

const MainLayout = () => {
  
  const [show, setShow] = useState(true)
  
  const location = useLocation()
  
  const { isError } = useGetCurrentUser()
  
  useEffect(() => {
    if(isError) {
      setShow(false)
      return
    }
    
    if(!isError) {
      setShow(true)
    }
    
  }, [isError])
  
  return show
    ? (
          <div className="min-h-screen">
            <CreateWorkspaceModal/>
            <div className="flex w-full h-full">
              <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-auto">
                <Sidebar/>
              </div>
              <div className="lg:pl-[264px] w-full">
                <div className="mx-auto max-w-screen-2xl h-full">
                  <Navbar/>
                  <main className="h-full py-8 px-6 flex flex-col">
                    <Outlet/>
                  </main>
                </div>
              </div>
            </div>
          </div>
      )
    : <Navigate
      to='/sign-in'
      state={{ from: location }}
      replace
    />
}

export default MainLayout
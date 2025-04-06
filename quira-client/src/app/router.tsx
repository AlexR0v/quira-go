import {lazy} from 'react'
import {Route, Routes} from 'react-router'

const Home = lazy(() => import('../pages/dashboard/dashboard-page.tsx'))
const SignIn = lazy(() => import('@/pages/auth/sign-in/page.tsx'))
const SignUp = lazy(() => import('@/pages/auth/sign-up/page.tsx'))
const AuthLayout = lazy(() => import('@/pages/auth/layout.tsx'))
const MainLayout = lazy(() => import('@/components/main-layout.tsx'))
const Tasks = lazy(() => import('@/pages/tasks/tasks-page.tsx'))
const Settings = lazy(() => import('@/pages/settings/SettingsPage.tsx'))
const Members = lazy(() => import('@/pages/memebers/MembersPage.tsx'))

export const Router = () => {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route
                    index
                    element={<Home/>}
                />
                <Route
                    path='tasks'
                    element={<Tasks/>}
                />
                <Route
                    path='settings'
                    element={<Settings/>}
                />
                <Route
                    path='members'
                    element={<Members/>}
                />
            </Route>
            <Route element={<AuthLayout/>}>
                <Route
                    path='sign-in'
                    element={<SignIn/>}
                />
                <Route
                    path='sign-up'
                    element={<SignUp/>}
                />
            </Route>
        </Routes>
    )
}

import { lazy } from 'react'
import { Route, Routes } from 'react-router'

const Home = lazy(() => import('../pages/dashboard/dashboard-page.tsx'))
const SignIn = lazy(() => import('@/pages/auth/sign-in/page.tsx'))
const SignUp = lazy(() => import('@/pages/auth/sign-up/page.tsx'))
const AuthLayout = lazy(() => import('@/pages/auth/layout.tsx'))
const MainLayout = lazy(() => import('@/components/main-layout.tsx'))
const Tasks = lazy(() => import('@/pages/tasks/tasks-page.tsx'))
const Task = lazy(() => import('@/pages/tasks/task-page.tsx'))
const SettingsWorkspace = lazy(() => import('@/pages/settings/SettingsWorkspacePage.tsx'))
const SettingsProject = lazy(() => import('@/pages/settings/SettingsProjectPage.tsx'))
const Members = lazy(() => import('@/pages/memebers/MembersPage.tsx'))
const Workspace = lazy(() => import('@/pages/workspace/WorkspacePage.tsx'))
const WorkspaceCreate = lazy(() => import('@/pages/workspace/WorkspacePageCreate.tsx'))
const MemberJoinPage = lazy(() => import('@/pages/memebers/MemberJoinPage.tsx'))
const ProjectPage = lazy(() => import('@/pages/project/Project.tsx'))
export const Router = () => {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route
                    index
                    element={<Home/>}
                />
                <Route
                    path='workspaces/:id/tasks'
                    element={<Tasks/>}
                />
                <Route
                    path='workspaces/:id/projects/:projectId/tasks/:taskId'
                    element={<Task/>}
                />
                <Route
                    path='workspaces/:id'
                    element={<Workspace/>}
                />
                <Route
                    path='workspaces/:id/projects/:projectId'
                    element={<ProjectPage/>}
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
            <Route
                path='workspaces/create'
                element={<WorkspaceCreate/>}
            />
            <Route
                path='workspaces/:id/settings'
                element={<SettingsWorkspace/>}
            />
            <Route
                path='workspaces/:id/projects/:projectId/settings'
                element={<SettingsProject/>}
            />
            <Route
                path='workspaces/:id/join/:code'
                element={<MemberJoinPage/>}
            />
            <Route
                path='workspaces/:id/members'
                element={<Members/>}
            />
        </Routes>
    )
}

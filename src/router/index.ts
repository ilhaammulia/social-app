import { createBrowserRouter } from 'react-router'

import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/shared/ProtectedRoute'

import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import Home from '@/pages/Home'
import UserPage from '@/pages/User'

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                Component: ProtectedRoute,
                children: [
                    { index: true, Component: Home },
                    { path: "user/:username", Component: UserPage },
                ],
            },
            {
                path: "auth",
                children: [
                    { path: "login", Component: Login },
                    { path: "register", Component: Register },
                ],
            },
        ]
    }
]);

export default router
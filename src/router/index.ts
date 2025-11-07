import { createBrowserRouter } from 'react-router'
import React from 'react'

import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'

const router = createBrowserRouter([
    {
        path: "/auth/login",
        element: React.createElement(Login),
    },
    {
        path: "/auth/register",
        element: React.createElement(Register),
    },
]);

export default router
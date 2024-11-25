import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Reader from '@reader/reader';

const Dashboard = lazy(() => import('@dashboard/dashboard'));
const Home = lazy(() => import('@dashboard/views/Home'));
const Bookmarks = lazy(() => import('@dashboard/views/Bookmarks'));
const Settings = lazy(() => import('@dashboard/views/Settings'));

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard/home" />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'bookmarks', element: <Bookmarks /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/reader/:url',
    element: <Reader />,
  },
];

export default routes;

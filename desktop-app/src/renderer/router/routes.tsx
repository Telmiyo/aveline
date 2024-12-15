import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Reader from '@aveline/src/renderer/modules/reader';

const Dashboard = lazy(() => import('@dashboard/index'));
const Home = lazy(() => import('@dashboard/pages/home/home'));
const Bookmarks = lazy(() => import('@dashboard/pages/bookmarks/bookmarks'));
const Settings = lazy(() => import('@dashboard/pages/settings/settings'));

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

import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../modules/editor/editor';

const Dashboard = lazy(() => import('../modules/dashboard/dashboard'));
const Home = lazy(() => import('../modules/dashboard/views/Home'));
const Library = lazy(() => import('../modules/dashboard/views/Library'));
const Bookmarks = lazy(() => import('../modules/dashboard/views/Bookmarks'));
const Settings = lazy(() => import('../modules/dashboard/views/Settings'));

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
      { path: 'library', element: <Library /> },
      { path: 'bookmarks', element: <Bookmarks /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/editor',
    element: <Editor />,
  },
];

export default routes;

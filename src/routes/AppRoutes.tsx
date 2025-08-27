import { createBrowserRouter, RouterProvider } from 'react-router';
import { Routing } from '../core/data/routing.ts';
import Garage from '../pages/Garage';
import Winner from '../pages/Winner';
import Layout from '../components/layout/Layout';

const router = createBrowserRouter([
  {
    path: Routing.Garage,
    element: <Layout />,
    children: [
      { path: Routing.Garage, element: <Garage /> },
      { path: Routing.WINNERS, element: <Winner /> },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;

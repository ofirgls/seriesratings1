import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../src/Components/HomePage';
import Graph from '../src/Components/Graph'; 

const router = createBrowserRouter([
  {path:'/', element: <HomePage/>},
  {path:'/graph', element: <Graph/>}
]);


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;

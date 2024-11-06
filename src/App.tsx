import { createBrowserRouter,RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css'
import { MantineProvider } from "@mantine/core";

import './output.css'
import Screen from "./components/screen";

const path = [
  {
    path:'/',
    element:(
      <Screen/>
    ),
  },
]

const browserRouter = createBrowserRouter(path)

const App = () =>{
  return (
    <MantineProvider>
      <RouterProvider router={browserRouter}/>
        
    </MantineProvider>
  )
}

export default App
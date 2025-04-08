import AppRoutes from "./routes/AppRoutes"
import { HelmetProvider } from "react-helmet-async";
import {Toaster} from "sonner"

function App() {

  return (
    <HelmetProvider>
      <Toaster
        position="top-center"
        richColors
        expand={true} />
      <AppRoutes />
    </HelmetProvider>
  )
}

export default App

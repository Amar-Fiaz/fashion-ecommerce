import AppRoutes from "./routes/AppRoutes";
import { useMergeCartOnLogin } from "./features/cart/useMergeCartOnLogin";

function App() {
  useMergeCartOnLogin();
  return <AppRoutes />;
}

export default App;
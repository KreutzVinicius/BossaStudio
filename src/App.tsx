import './App.css';
import { AuthProvider } from './context/context';
import AppRoutes from './routes';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;

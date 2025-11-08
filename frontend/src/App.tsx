import './App.css'
import { Provider } from '@contexts/context'
import AppRoutes from './routes'

function App() {
    return (
        <div className="App">
            <Provider>
                <AppRoutes />
            </Provider>
        </div>
    )
}

export default App
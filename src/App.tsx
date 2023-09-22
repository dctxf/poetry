import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import { TradingSimulator } from './components/TradingSimulator';

// Create a client
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TradingSimulator></TradingSimulator>
    </QueryClientProvider>
  );
}

export default App;

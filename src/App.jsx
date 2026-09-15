import AppRouter from './router/AppRouter';
import SmoothScroll from './components/ui/SmoothScroll';
import CustomCursor from './components/ui/CustomCursor';

function App() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <AppRouter />
    </>
  );
}

export default App;
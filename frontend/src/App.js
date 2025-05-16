import './App.css';
import {BrowserRouter ,Route, Routes} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import EditorPage from './pages/EditorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
    <div>
      <Toaster
      position='top-right'
      toastOptions={{
        success:{
          theme:{
            primary: '#4aed88'
          },
        },
      }}>
      </Toaster>
    </div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/home" element={<Home/>}></Route>
      <Route 
      path="/editor/:roomId" 
      element={<EditorPage/>}>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

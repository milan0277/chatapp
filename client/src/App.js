import './App.css';
import Login from './components/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectiveRoute from './utils/ProtectiveRoute';
import AgentC from './components/AgentC';
import Crud from './pages/Crud';
import Admin from './components/Admin';
import Chat from './pages/Chat';
import SendFile from './pages/SendFile';
import StoreProvider from './context/StoreProvider';
import Df from './pages/Df'
import Userlist2 from './pages/Userlist2';
import FbPosts from './pages/FbPosts'
import "./pages/home.css"

function App() {
 
  return (
    <StoreProvider>
      <Routes>
        <Route element={<ProtectiveRoute />}>
          <Route path='/admin' element={<Admin/>} >
          <Route exact path='admin-userlist' element={<Crud/>} />
          <Route exact path='admin-sendfile' element={<SendFile/>} />
          <Route exact path='admin-chat' element={<Chat/>} />
          <Route exact path='admin-forms' element={<Df/>} />
          <Route exact path='admin-userlist2' element={<Userlist2/>} />
          <Route exact path='admin-fbposts' element={<FbPosts/>} />
          </Route>
          <Route path='/agent' element={<AgentC />}>
            <Route exact path='agent-chat' element={<Chat/>} />
          </Route>
        </Route>
        <Route exact path='/login' element={<Login />} />
        <Route path='*' element={<Navigate to='/login' />} />
     </Routes>
     {/* <Test/> */}
    </StoreProvider>
  );
}

export default App;

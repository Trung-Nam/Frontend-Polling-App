import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Auth/LoginForm';
import SignUpForm from './pages/Auth/SignUpForm';
import Home from './pages/Dashboard/Home';
import CreatePoll from './pages/Dashboard/CreatePoll';
import MyPolls from './pages/Dashboard/MyPolls';
import VotedPolls from './pages/Dashboard/VotedPolls';
import Bookmarks from './pages/Dashboard/Bookmarks';
import UserProvider from './context/UserContext';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<LoginForm />} />
          <Route path="/signup" exact element={<SignUpForm />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/create-poll" exact element={<CreatePoll />} />
          <Route path="/my-polls" exact element={<MyPolls />} />
          <Route path="/voted-polls" exact element={<VotedPolls />} />
          <Route path="/bookmarked-polls" exact element={<Bookmarks />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App;


// Define the Root component to handle the initial redirect
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // Redirect to dashboard if authenticated, otherwise redirect to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
}

import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobsCategories from "./pages/JobsCategories.jsx";
import JobsProvider from "./pages/JobsProvider";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserInfo from "./pages/UserInfo"
import AuthProvider, { useAuth } from "./contexts/AuthProvider"
import PrivateRoute from "./components/PrivateRoute";
import LangProvider from "./contexts/LangProvider";
import Profile from "./pages/Profile";
import AddJob from "./pages/AddJob";
import Setting from './pages/Settings';
import Bloga from './blogs/pages/Home'
import Blog from './blogs/pages/Blog'
import Edit from './blogs/pages/Edit'
import ResetMail from './pages/ResetMail'
import Contact from './pages/Contact'
import Download from './pages/Download'
import FastSearch from './pages/FastSearch'
//import Favorite from './pages/Favorite'

function App() {

  return (
    <LangProvider>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={ <JobsCategories />} />
          <Route path="/service/:id"  element = { <Jobs />} />
          <Route path="/users/:id" element = { <JobsProvider />} />
          <Route path="/user/:id" element = { <UserInfo />}/>
          <Route path="/profile" element = { <Profile/>} />
          <Route path="/addJob" element = { <AddJob/>} />
          <Route path="/setting" element = { <Setting/>} />
          <Route path="/help" element = { <Contact/>} />
          <Route path="/download" element = { <Download/>} />
          <Route path="/fastsearch" element = { <FastSearch/>} />

          { /* <Route path="/favorite" element = { <Favorite/>} /> */ }
          
          <Route path="/blog" element = { <Bloga/>} />
          <Route path="/blog/:id" element = { <Blog/>} />
          <Route path="/edit/:id" element = { <Edit/>} />
          <Route
            path="/signin"
            element={<PrivateRoute component={SignIn} />}
            />
          <Route
            path="/signup"
            element={<PrivateRoute component={SignUp} />}
            />
          <Route
            path="/resetPassword"
            element={<PrivateRoute component={ResetMail} />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </AuthProvider>
    </LangProvider>
  );
}
export default App;

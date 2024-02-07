import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import ForgotPass from "./pages/ForgotPass";
import Error from "./pages/Error";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/dashboard/MyProfile";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrolledCourses from "./components/core/dashboard/EnrolledCourses";
import Cart from "./components/core/dashboard/cart";

function App() {

  const {user} = useSelector((state)=>state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>

        <Route path="/" element={<Home/>} />

        <Route path="signup" element={<Signup />} />

        <Route path="login" element={<Login />} />

        <Route path="forgot-password" element={<ForgotPass/>}/>

        <Route path="update-password/:id" element={<UpdatePassword/>}/>   

        <Route path="verify-email" element={<VerifyEmail/>}/>

        <Route path="about" element={<About/>}/>

        <Route path="contact" element={<Contact/>}/>

        <Route element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>

          <Route path="dashboard/my-profile" element={<MyProfile/>}/>
          {/* <Route path="dashboard/settings" element={<Settings/>}/> */}

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
              <Route path="dashboard/cart" element={<Cart/>}/>
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
              {/* <Route path="dashboard/bookmarked-courses" element={<EnrolledCourses/>}/> */}
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
              {/* <Route path="dashboard/add-course" element={<AddCourse/>}/> */}
              </>
            )
          }

        </Route>

        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );  
}

export default App; 


//  checking github
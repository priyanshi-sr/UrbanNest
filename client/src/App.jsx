
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/Signin.jsx";
import SignUp from "./pages/SignUp.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateListing from "./pages/CreateListing.jsx";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/about" element={<About />} />
                    <Route  element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-listing" element={<CreateListing />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;

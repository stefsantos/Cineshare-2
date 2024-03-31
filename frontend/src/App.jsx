import React from 'react';
import Navbar from '../components/Navbar';
import Movie from '../components/Movie';
import MovieDetail from '../components/MovieDetail';
import ContentContainer from '../components/ContentContainer'; 
import PlaceholderContainer from '../components/PlaceholderContainer';
import { useState } from 'react';

import HomePage from "./pages/home_page";
import Friends from "./pages/friends_page";
import Watchlist from "./pages/watchlist_page";
import MyProfile from "./pages/myprofile_page";
import OtherProfile from "./pages/profile2_page";
import AdminPage from "./pages/admin_page";

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";


import Signin from "./pages/signin_page";
import CreateAcct from "./pages/createacct_page";




function App() {

  const [showNavbar, setShowNavbar] = useState(true);
 
  return (
    <>
      <Router>  
          {showNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<PlaceholderContainer><Signin setShowNavbar={setShowNavbar} /></PlaceholderContainer>} />
            <Route path="/home_page" element={<PlaceholderContainer><HomePage /></PlaceholderContainer>} />
            <Route path="/Movie" element={<ContentContainer><Movie /></ContentContainer>} />

            <Route path="/movie/:id" element={<ContentContainer><MovieDetail /></ContentContainer>} />
            
            <Route path="/friends_page" element={<PlaceholderContainer><Friends /></PlaceholderContainer>} />
            <Route path="/watchlist_page" element={<PlaceholderContainer><Watchlist /></PlaceholderContainer>} />
            <Route path="/myprofile_page" element={<PlaceholderContainer><MyProfile /></PlaceholderContainer>} />
            <Route path="/signin_page" element={<PlaceholderContainer><Signin setShowNavbar={setShowNavbar}/></PlaceholderContainer>} />   
            <Route path="/createacct_page" element={<PlaceholderContainer><CreateAcct setShowNavbar={setShowNavbar}/></PlaceholderContainer>} />
            <Route path="/profile2_page" element={<PlaceholderContainer><OtherProfile setShowNavbar={setShowNavbar}/></PlaceholderContainer>} />
            <Route path="/profile/:username" element={<OtherProfile />} />
            <Route path="/admin_page" element={<PlaceholderContainer><AdminPage /></PlaceholderContainer>} />
          </Routes>
      </Router>
    </>
  );
}

export default App;

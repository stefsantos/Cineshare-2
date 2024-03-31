import React, { useEffect, useState } from 'react';
import './friends_page.css';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUser } from '../../src/UserContext';
import SearchTab from '../../src/pages/searchTab';


function friends_page() {

  const { activeusername } = useUser();
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [isSearchTabVisible, setIsSearchTabVisible] = useState(false);

  const toggleSearchTab = () => {
    setIsSearchTabVisible(!isSearchTabVisible);
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    toggleSearchTab();
  };

  useEffect(() => {
    console.log(userFollowers); // This will log the updated value of userFollowers
  }, [userFollowers]); // Dependency on userFollowers

  useEffect(() => {
      const fetchUserFollowers = async () => {
          try {
              const response = await fetch(`/api/users/followers/${activeusername}`); 
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              console.log("User: ", activeusername);
              console.log("Received follower data:", data);
              setUserFollowers(data); 
          } catch (error) {
              console.error("Error fetching user profile:", error);
          }
      };

    const fetchUserFollowing = async () => {
        try {
            const response = await fetch(`/api/users/following/${activeusername}`); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("User: ", activeusername);
            console.log("Received following data:", data);
            setUserFollowing(data); 
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    fetchUserFollowers();
    fetchUserFollowing();
  }, [activeusername])

    return (
      <div className="page_container">
        <div className="friends_container">
            <div className="friends_header">
                Followers
                <button onClick={handleSearchClick} className="search-button">
                    <FaSearch/>
                </button>
            </div>

            {userFollowers.length === 0 ? (
              <div className="message-container">
                <div className="no-followers-message">
                  No Followers.
                </div>
              </div>
            ) : (
                  <div className="friendprofiles_container">
                    {userFollowers.map((follower) => (
                        <div key={follower.id} className="friend_profile">
                            <img
                                src={follower.profilepic ? `http://localhost:4000/${follower.profilepic}` : `images/defaultAvatar.jpg`}
                                alt="avatar"
                                className="friend_avatar"
                            />
                            <div className="friend_name" title={follower.username}>
                                {follower.username}
                            </div>
                            <Link to={`/profile/${follower.username}`} className="visit_button">Visit</Link>
                        </div>
                    ))}
                </div>
              )}
        </div>

        <div className="request_container">
          <div className="request_header">Following</div>
            <div className="friendrequest_container">
            {userFollowing.length === 0 ? (
            <div className="message-container">
                <div className="no-following-message">
                    No Following.
                </div>
            </div>
            ) : (
              userFollowing.map((following) => (
                  <div key={following.id} className="friend_request">
                      <img
                          src={following.profilepic ? `http://localhost:4000/${following.profilepic}` : `images/defaultAvatar.jpg`}
                          alt="avatar"
                          className="request_avatar"
                      />
                      <div className="request_text">
                          <div className="request_name">{following.username}</div>
                      </div>
                      <Link to={`/profile/${following.username}`} className="accept_button">Visit</Link>
                  </div>  
                ))
              )}
            </div>
        </div>
        {isSearchTabVisible && <SearchTab isVisible={isSearchTabVisible} onClose={toggleSearchTab} />}

      </div>
  );
}

export default friends_page;

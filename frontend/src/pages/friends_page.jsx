import React, { useEffect, useState } from 'react';
import './friends_page.css';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUser } from '../../src/UserContext';


function friends_page() {
  // Mock data for friend requests
  const friendRequestsData = [
    { id: 1, name: 'Mutahar Anas', avatar: 'images/muta.png', mutualContacts: 1 },
    { id: 2, name: 'Austin Gan', avatar: 'images/austin.jpg', mutualContacts: 1 },
    { id: 3, name: 'Philipp Matthew Suarez', avatar: 'images/philipp.jpg', mutualContacts: 1 },
    { id: 4, name: 'Javi del Rosario', avatar: 'images/javi.jpg', mutualContacts: 1 },
    { id: 5, name: 'Charles White', avatar: 'images/moist.png', mutualContacts: 1},
    { id: 6, name: 'Yco Santos', avatar: 'images/yco.png', mutualContacts: 1},
  ];

  const { activeusername } = useUser();
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [friendRequests, setFriendRequests] = useState(friendRequestsData);

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
                    <div className="textbox">
                        <FaSearch style={{ marginLeft: '10px', marginRight: '10px', height: '36px' }} />
                        <input type="text" placeholder="Search..." />
                    </div>
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
                                    src={follower.profilepic ? `images/${follower.profilepic}.jpg` : `images/defaultAvatar.jpg`}
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
                              src={following.profilepic ? `images/${following.profilepic}.jpg` : `images/defaultAvatar.jpg`}
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
    </div>
  );
}

export default friends_page;

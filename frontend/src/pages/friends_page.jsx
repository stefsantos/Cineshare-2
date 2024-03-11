import React, { useState } from 'react';
import './friends_page.css';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUser } from '../../src/UserContext';

// Mock data for friends
const friendsData = [
    { id: 1, name: 'Yco Santos', avatar: 'images/yco.png', profileLink: '/profile/Yco Santos' },
    { id: 2, name: 'Austin Gan', avatar: 'images/austin.jpg', profileLink: '/profile/Austin Gan' },
    { id: 3, name: 'Philipp Matthew Suarez', avatar: 'images/philipp.jpg', profileLink: '/profile/Philipp Matthew Suarez' },
    { id: 4, name: 'Javi del Rosario', avatar: 'images/javi.jpg', profileLink: '/profile/Javi del Rosario' },
    { id: 5, name: 'Charles White', avatar: 'images/moist.png', profileLink: '/profile/Charles White' },
    { id: 6, name: 'Mutahar Anas', avatar: 'images/muta.png', profileLink: '/profile/Mutahar Anas' },
];

// Mock data for friend requests
const friendRequestsData = [
    { id: 1, name: 'Mutahar Anas', avatar: 'images/muta.png', mutualContacts: 1 },
    { id: 2, name: 'Austin Gan', avatar: 'images/austin.jpg', mutualContacts: 1 },
    { id: 3, name: 'Philipp Matthew Suarez', avatar: 'images/philipp.jpg', mutualContacts: 1 },
    { id: 4, name: 'Javi del Rosario', avatar: 'images/javi.jpg', mutualContacts: 1 },
    { id: 5, name: 'Charles White', avatar: 'images/moist.png', mutualContacts: 1},
    { id: 6, name: 'Yco Santos', avatar: 'images/yco.png', mutualContacts: 1},
  ];


function friends_page() {
  const { activeusername } = useUser();
  const [friendRequests, setFriendRequests] = useState(friendRequestsData);

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

                <div className="friendprofiles_container">
{friendsData.map((friend) => (
    // check if the friend username is different from the current activeusernafme
    // if current user is Charles White, render Mutahar Anas (id: 6)
    (friend.name !== activeusername && friend.id <= 5 && activeusername !== 'Mutahar Anas' || (activeusername === 'Charles White' && friend.id == 6) || (activeusername == 'Mutahar Anas' && friend.name !== activeusername && friend.id >= 5)) && (
        <div key={friend.id} className="friend_profile">
            <img src={friend.avatar} alt="avatar" className="friend_avatar" />
            <div className="friend_name" title={friend.name}>
                {friend.name}
            </div>
            <Link to={friend.profileLink} className="visit_button">Visit</Link>
        </div>
    )
))}
                </div>
            </div>
      <div className="request_container">
        <div className="request_header">Following</div>
        <div className="friendrequest_container">
          {friendRequests.map((request) => (
            ((activeusername !== 'Charles White' && activeusername !== 'Mutahar Anas' && request.name === 'Mutahar Anas') || (activeusername === 'Mutahar Anas' && request.id >= 2 && request.id !== 5)) && (
              <div key={request.id} className="friend_request">
                <img src={request.avatar} alt="avatar" className="request_avatar" />
                <div className="request_text">
                  <div className="request_name">{request.name}</div>
                </div>
                <button
                  className="accept_button"
                >
                  Visit Profile
                </button>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default friends_page;

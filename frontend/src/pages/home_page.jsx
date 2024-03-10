import React from 'react';
import { useNavigate } from "react-router-dom";
import Post from './Post';
import './HomePage.css';
import { Link } from 'react-router-dom';



function HomePage() {
    
    const posts = [
        {   id: 1, 
            user: 'Philipp Matthew Suarez', 
            movie: 'Evangelion: 3.0+1.0 Thrice Upon a Time',
            movieId: 283566,
            content: 'Trying out the post feature!', 
            timestamp: '13 mins ago'
        },
        {   id: 2, 
            user: 'Javi del Rosario', 
            movie: 'Evangelion: 3.0+1.0 Thrice Upon a Time',
            movieId: 283566,
            content: 'Its so over', 
            timestamp: '20 mins ago',
            imageUrl: 'data:https://preview.redd.it/ever-wanted-shinjis-iconic-chair-pose-as-a-desktop-bg-well-v0-ji7og7e5mmfa1.png?auto=webp&s=1d7163e4e059d504b79bb8edcdda50d2043d4a0cimage/jpeg;base64,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'
        },
        { id: 3, 
            user: 'Yco Santos', 
            movie: 'Evangelion: 3.0+1.0 Thrice Upon a Time',
            movieId: 283566,
            content: 'WE ARE SO UP GRAH!', 
            imageUrl: 'https://i.redd.it/t5dmyn6ll49a1.jpg', 
            timestamp: '2024-01-02' 
        },
        { id: 4, 
            user: 'Charles White', 
            content: 'This is the greatest moon falling of All Time', 
            movie: 'Moonfall',
            movieId: 406759,
            imageUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1917988387301425979/46D7B0946719773C99D4F521A656CE14A395AFE1/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false', 
            timestamp: '2024-01-02' 
        },
        { id: 5, 
            user: 'Mutahar Anas', 
            content: 'This movie made me cry like no other.', 
            movie: 'The SpongeBob Movie: Sponge on the Run',
            movieId: 400160,
            imageUrl: 'https://wallpapers.com/images/hd/sad-spongebob-3eg7eq1ll0sflfo7.jpg', 
            timestamp: '2024-01-02' 
        }
    ];

    const [trendingMovies, setTrendingMovies] = React.useState([]);


    React.useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=3c4682174e03411b1f2ea9d887d0b8f3`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrendingMovies(data.results);
            } catch (error) {
                console.error("Error fetching trending movies:", error);
            }
        };
        
        fetchTrendingMovies();
    }, []);
    
    
    
    return (
        <>
            <div className='title'>
                <h1>CineShare</h1>
                <h2>Home</h2>
            </div>
            
            <div className='homepage'>
                <center>
                <div className='content'>
                    <div className='userposts'>
                        {posts.map(post => (
                            <Post key={post.id} post={post} userId={post.user} />
                        ))}
                    </div>
                    <div className='rightsidebar'>
                        <div className='sidetitle'>🔥Popular Movies</div>
                        <div className='sidebarcontent'>
                        {trendingMovies.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id}>
                            <img
                                key={movie.id}
                                className="home_movie-poster"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            </Link>
                        ))}
                        </div>
                    </div>
                    
                </div>
                </center>
            </div>
        </>
    );
}

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=3c4682174e03411b1f2ea9d887d0b8f3`);
                const detailsData = await detailsResponse.json();

                const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=3c4682174e03411b1f2ea9d887d0b8f3`);
                const creditsData = await creditsResponse.json();

                setMovieDetails({
                    ...detailsData,
                    director: creditsData.crew.find(person => person.job === 'Director')?.name
                });
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const renderStarRating = (score) => {
        const rating = Math.round(score / 20); // Convert to 5-star rating
        const fullStars = rating;
        const emptyStars = 5 - fullStars;

        return (
            <>
                {'★'.repeat(fullStars)}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    const handleBack = () => {
        navigate(-1); // Navigates back to the previous page
    };

    return (
        <div>
        {movieDetails && (
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
                <div>
                    <img 
                        src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`} 
                        alt={movieDetails.title} 
                        width='400px' 
                        height='500px' 
                    />
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <h1>{movieDetails.title} ({movieDetails.release_date?.split('-')[0]}) </h1>
                    
                    <p>{movieDetails.overview}</p>
                    {movieDetails.director && <p>Director: {movieDetails.director}</p>}
                    <p>User Score: {renderStarRating(movieDetails.vote_average * 10)}</p>
                    
                </div>
                
            </div>
        )}
        
        <button onClick={handleBack} style={{ marginTop: '10px', marginLeft: '20px', color: 'white'}}>Back</button>
        <button onClick={handleBack} style={{ marginTop: '10px', marginLeft: '20px', color: 'white'}}>Add to Watchlist</button>
    </div>
    );
}

export default MovieDetail;

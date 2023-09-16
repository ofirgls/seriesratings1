import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSearch } from '../store/searchSlice';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const TvShows = ['The Office', 'Rick and Morty', 'Dexter'];

  const [inputSearch, setInputSearch] = useState('');
  const [currentTvShowIndex, setCurrentTvShowIndex] = useState(0);
  const navigate = useNavigate();

  const handleSearch = () => {
    setInputSearch('');
    navigate('/graph');
  };

  const handleInputChange = (event) => {
    setInputSearch(event.target.value);
    dispatch(updateSearch(event.target.value));
  };

  const handleTvShowButtonClick = (tvShow) => {
    dispatch(updateSearch(tvShow));
    setInputSearch('');
    navigate('/graph');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTvShowIndex((prevIndex) => (prevIndex + 1) % TvShows.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      setCurrentTvShowIndex(0); // Reset the currentTvShowIndex when unmounting or when TvShows changes
    };
  }, [TvShows.length]);

  return (
    <div className="Container">
      <h1>TV Chart</h1>
      <div>
        <input
          type='text'
          placeholder='Search for a TV show'
          value={inputSearch}
          onChange={handleInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <p>
        Or try:
        {TvShows.map((tvShow, index) => (
          <button
            key={index}
            style={{ border: 'none', display: index === currentTvShowIndex ? 'inline-block' : 'none' }}
            onClick={() => handleTvShowButtonClick(tvShow)}
          >
            {tvShow}
          </button>
        ))}
      </p>
    </div>
  );
};

export default HomePage;

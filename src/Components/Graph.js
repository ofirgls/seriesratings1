import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSearch } from '../store/searchSlice';
import './Graph.css';

const Graph = () => {
    const [data, setData] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState('all'); 
    const [selectedGraphType, setSelectedGraphType] = useState('line'); 
    const inputSearch = useSelector((state) => state.search.inputSearch);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null); 

    const dispatch = useDispatch();

    const [inputSearchPage,setInputSearchPage] = useState('');

    const handleInputChange = (event) => {
        setInputSearchPage(event.target.value);
    };

    const handleInputChangeButton = () =>{
        dispatch(updateSearch(inputSearchPage));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://us-central1-tvchart2.cloudfunctions.net/getRatingData?seriesTitle=${inputSearch}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (inputSearch) {
            fetchData();
        }
    }, [inputSearch]);

    useEffect(() => {
        if (data && chartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            let seasonData = [];
            if (selectedSeason === 'all') {
                seasonData = data.seasons.flatMap((season) => season);
            } else if (data.seasons[selectedSeason - 1]) {
                seasonData = data.seasons[selectedSeason - 1];
            }

            const episodeNumbers = seasonData.map((_, index) => index + 1); 
            const ratings = seasonData.map((episode) => episode.rating);
            const episodeNames = seasonData.map((episode) => episode.name); 

            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, {
                type: selectedGraphType, 
                data: {
                    labels: episodeNumbers,
                    datasets: [
                        {
                            label: selectedSeason === 'all' ? 'All Seasons Ratings' : `Season ${selectedSeason} Ratings`,
                            data: ratings,
                            borderColor: 'black',
                            borderWidth: 2,
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Episode',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Rating',
                            },
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const episodeIndex = context.dataIndex;
                                    return `Episode ${episodeNumbers[episodeIndex]}, ${episodeNames[episodeIndex]}, Rating: ${ratings[episodeIndex]}`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [data, selectedSeason, selectedGraphType]);

    return (
        <div style = {{background:'rgb(177, 176, 153)'}}>
            {data ? (

                <div style = {{height: '100vh'}}>
                    <header style = {{background:'rgb(194, 193, 156)'}}>
                        <nav style={{ display: 'flex' }}>
                            <Link to="/" style={{ textDecoration: 'none', listStyle: 'none', marginRight: '20px', margin: '10px' }}>
                                TV Chart
                            </Link>
                            <div style={{ marginLeft: "400px" }}>
                                <select
                                    style={{ margin: '10px',
                                     position: 'relative',
                                      left: '155px',
                                      background:'rgb(177, 176, 153)'
                                     }}
                                    value={selectedSeason}
                                    onChange={(e) => setSelectedSeason(e.target.value)}
                                >
                                    <option value="all">All Seasons</option>
                                    {data.seasons.map((_, seasonIndex) => (
                                        <option key={seasonIndex} value={seasonIndex + 1}>
                                            Season {seasonIndex + 1}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    style={{ margin: '10px'
                                    , position: 'relative',
                                     left: '140px',
                                     background:'rgb(177, 176, 153)'
                                     }}
                                    value={selectedGraphType}
                                    onChange={(e) => setSelectedGraphType(e.target.value)}
                                >
                                    <option value="line">Line Chart</option>
                                    <option value="bar">Bar Chart</option>
                                </select>
                            </div>

                            <div>
                                <input
                                    style={{ margin: '10px', marginLeft: "150px",
                                    position:'relative',left:'8px',
                                    }}
                                    type='text'
                                    placeholder='Search for a TV show'
                                    value={inputSearchPage}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleInputChangeButton}>Search</button>
                            </div>


                        </nav>
                    </header>

                    <p style = {{position:'relative', left:'465px'}}>{data.title}: All Episodes</p>
                    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <canvas ref={chartRef} width={800} height={400}></canvas>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Graph;

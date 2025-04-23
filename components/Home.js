import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [movieList, setMovieList] = useState([])

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list
  useEffect(()=>{
    const list = []
    fetch('http://localhost:3000/movies')
    .then(response => response.json())
    .then(data => {
      // console.log(data.movies.results[0].title) //affiche le titre du 1er film
      // console.log(data.movies.results[0].vote_average)
      // console.log(data.movies.results[0].vote_count)
      // console.log(data.movies.results[0].poster_path)
      // console.log(data.movies.results[0].overview)

      for (let i=0;i<data.movies.length;i++){
        list.push({
          title: data.movies[i].title,
          poster: `https://image.tmdb.org/t/p/w500/${data.movies[i].poster_path}`, 
          voteAverage: data.movies[i].vote_average, 
          voteCount: data.movies[i].vote_count, 
          overview: `${data.movies[i].overview.substring(0,250)}...`
        })
      }
setMovieList(list)
    })
  },[])

  const movies = movieList.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;
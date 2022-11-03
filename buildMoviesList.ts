// const fs = require('fs');
import fs from 'fs';
// const getMovies = require('./lib/getMovies.ts');
import getMovies from './lib/getMovies';

// call getMovies and write to json
getMovies().then((movies) => {
  fs.writeFileSync('./dist/movies.json', JSON.stringify(movies));
});

// // call getMovies and write to json
// async function _buildMoviesList () {
//   const movies = await getMovies();
//   console.log(movies);
//       fs.writeFileSync('../movies.json', JSON.stringify(movies));
// }

// export {}
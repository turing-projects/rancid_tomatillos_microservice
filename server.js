const express = require('express');

const app = express();
app.use(express.json());

app.set('port', process.env.PORT || 3002);

app.locals.comments = {
       userID: {
           name: 'Cool User Name',
           commentedMovies: {
               movieID: [
                   "A comment about a movie!",
                   "Another comment about the same movie...",
                   "Third comment just to make sure?"
               ],
               anotherMovieID: [
                   "Testing things out",
                   "This movie was awesome!"
           ]
       }
   },
       userID2: {
           name: 'Second User',
           commentedMovies: {
               movieID: [
                   "This movie will only have two comments.",
                   "See, I told you!"
               ]
           }
       }
};

app.locals.favorites = [
   {
       id: 556678,
       poster_path: "https://image.tmdb.org/t/p/original//uHpHzbHLSsVmAuuGuQSpyVDZmDc.jpg",
       backdrop_path: "https://image.tmdb.org/t/p/original//5GbkL9DDRzq3A21nR7Gkv6cFGjq.jpg",
       title: "Emma.",
       average_rating: 7,
       release_date: "2020-02-13"
   },
   {
       id: 565310,
       poster_path: "https://image.tmdb.org/t/p/original//7ht2IMGynDSVQGvAXhAb83DLET8.jpg",
       backdrop_path: "https://image.tmdb.org/t/p/original//qfB3KR6AuRI3Sqz8jWAOpRaGC0H.jpg",
       title: "The Farewell",
       average_rating: 8,
       release_date: "2019-07-12"
   }];

app.listen(app.get('port'), () => {
   console.log(`App is running on port ${app.get('port')}`)
});

app.get('/' , (request, response) => {
   response.status(200).send(app.locals.comments)
});

app.get("/api/v1/comments/:id/:movieId", (request, response) => {

   let user = request.params.id;
   let movie = request.params.movieId;
   let dataset = app.locals.comments;

   if ( dataset[user] ) {

       if ( dataset[user].commentedMovies ) {
           return dataset[user].commentedMovies[movie] ?
               response.status(200).json(dataset[user].commentedMovies[movie]):
               response.status(404).send("Sorry, you don't have any comments for this movie.")

       } else {
           response.status(404).send("Sorry, you have not commented on any movies.")
       }
   } else {
       response.status(404).send("Sorry, we could not find any data.")
   }
});

app.get('/api/v1/favorites', (request, response) => {
   const dataset = app.locals.favorites;

   return dataset ? response.status(200).json(dataset) : response.status(404).send('Sorry, no favorite movies found.');
});

app.get("/api/v1/favorites/:id", (request, response) => {
   const { id } = request.params;
   const dataset = app.locals.favorites;

   const favorite = dataset.find(movie => movie.id === Number(id))

   if (!favorite) {
       return response.status(404).send("Sorry, we couldn't find that movie.");
   }

   response.status(200).json(favorite);
});

app.post('/api/v1/favorites', (request, response) => {
   const favorite = request.body;

   const requiredParams = ['id',
                           'poster_path',
                           'backdrop_path',
                           'title',
                           'average_rating',
                           'release_date'];

   for (let requiredParam of requiredParams) {
       if (!favorite[requiredParam]) {
           return response
               .status(422)
               .send({ error: `Expected format: { id: <number>, poster_path: <string>, backdrop_path: <string>, title: <string>, average_rating: <number>, release_date: <string, date yyyy-mm-dd> }. Missing ${requiredParam}.`})
       }
   }

   const { id, poster_path, backdrop_path, title, average_rating, release_date } = request.body;

   app.locals.favorites.push({ id, poster_path, backdrop_path, title, average_rating, release_date });
   response.status(201).json({ id, poster_path, backdrop_path, title, average_rating, release_date });
});

app.delete('/api/v1/favorites/:id', (request, response) => {
   const { id } = request.params;
   const match = app.locals.favorites.find(movie => movie.id === Number(id));

   if (!match) return response.status(404).json({message: `No favorite movie found with an id of ${id}.`})

   const filteredFavorites = app.locals.favorites.filter(movie => movie.id != id);

   app.locals.favorites = filteredFavorites;

   return response.sendStatus(204);
});

// in the process of creating a for..of loop for updating comments// i suppose it doesnt need it.

app.post("/api/v1/comments/:id/:movieId", (request, response) => {
   let user = request.params.id;
   let movie = request.params.movieId;
   let dataset = app.locals.comments;
   const { comment, name } = request.body;

   for (let requiredParameter of ['comment', 'name']) {
       response.status(422).send(`Missing ${requiredParameter}!`)
   }

   // if (!comment) {
   //     response.status(422).send("Missing comment!")
   // }

   // if (!name) {
   //     response.status(422).send("Missing namme!")
   // }
});

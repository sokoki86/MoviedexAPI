require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDEX = require('./moviedex.json')


const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log('validate bearer token middleware')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized Request' })
    }
    next()
})
const validGenres= [`Animation`, `Drama`, `Comedy`, `Romantic`, `Spy`, `Crime`, `Thriller`, `Adventure`, `Documentary`, `Horror`, `Action`, `Western`, `History`, `Biography`, `Musical`, `Fantasy`, `War`, `Grotesque`]
function handleGetGenres(req, res){
    res.json(validGenres)
}
app.get('/genre', handleGetGenres)

app.get('/movie', function handleGetMovie(req, res) {
     let results = MOVIEDEX.movie;

if(req.query.country) {
  results= results.filter(movie =>
    movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
}
if(req.query.avg_vote) {
    results= results.filter(movie =>
        Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
}
if(req.query.genre){
    results = results.filter(movie =>
        movie.genre.includes(req.query.genre)
        )
}
res.json(results)
})
const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
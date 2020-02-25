const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const cred = require('./config.json');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : cred.host,
    user : cred.user,
    password : cred.password,
    database : cred.database
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

//console.log(bcrypt.compareSync('banana', '$2a$10$kf9cIHVxM.3CHw2UbMG6XOz9MaOUUgkhmhcjlm3MFVkiPQHd/8GNq'));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.json(database.users)})
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(3000, () => {
	console.log('app is running on port 3000');
})

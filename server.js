const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const cred = require('./config.json');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
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

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid) {
			return db.select('*').from('users').where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			}).catch(err => res.status(400).json('Wrong credentials'))
			
		} else {
			res.status(400).json('Wrong credentials');
		}
	}).catch(err => res.status(400).json('Unable to get user'))
	
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.insert({
						email: loginEmail[0],
						name: name,
						joined: new Date()
					})
					.returning('*')
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
			.catch(err => {
				res.status(400).json('unable to register');
			})
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	db.select('*').from('users').where('id', id).then(user => {
		if(user.length)
		{
			res.json(user[0]);
		}
		else
		{
			res.status(400).json('Not found');
		}
		
	}).catch(err => {
		res.status(400).json('error getting user')
	})
	
})

app.put('/image', (req, res) => {
	const {id} = req.body;
	db('users')
		.where('id','=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			if(entries.length) {
				res.json(entries[0])
			} else {
				res.json('Not found')
			}
			
		}).catch(err => {
			res.status(400).json('unable to get entries');
		})
})

app.listen(3000, () => {
	console.log('app is running on port 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user(count)

*/
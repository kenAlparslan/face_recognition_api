const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

//console.log(bcrypt.compareSync('banana', '$2a$10$kf9cIHVxM.3CHw2UbMG6XOz9MaOUUgkhmhcjlm3MFVkiPQHd/8GNq'));

const app = express();
app.use(express.json());
app.use(cors());
const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally@gmail',
			password: 'milk',
			entries: 0,
			joined: new Date()
		}
	
	]
}

app.get('/', (req, res) => {
	res.json(database.users);
})

app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
		 req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status('404').json('error logging in');
	}
	
})

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	database.users.push( {
		id: '125',
		name: name,
		email: email,
		//password: hash,
		entries: 0,
		joined: new Date()
	})

	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if(!found) {
		res.status('404').json('not found');
	}
})

app.put('/image', (req, res) => {
	const {id} = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!found) {
		res.status('404').json('not found');
	}
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
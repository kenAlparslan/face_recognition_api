const handleSignin = (req, res, db, bcrypt) => {
	const {password, email} = req.body;
	if(!password|| !email) {
		return res.status(400).json('incorrect form submission');
	}

	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if(isValid) {
			return db.select('*').from('users').where('email', '=', email)
			.then(user => {
				res.json(user[0])
			}).catch(err => res.status(400).json('Wrong credentials'))
			
		} else {
			res.status(400).json('Wrong credentials');
		}
	}).catch(err => res.status(400).json('Unable to get user'))
	
}
module.exports = {
	handleSignin: handleSignin
}
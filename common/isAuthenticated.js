module.exports = (req, res, next) => {
	if(req.isAuthenticated() == true){
		return next();
	} else {
		res.redirect('/');
	}
}
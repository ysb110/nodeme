exports.check = (req, res, next) =>{
	if (req.session.user) {
		next();
	} else {
		res.status(401).json({
			error: {
				code: 'NODE_LOGGED_IN',
				message: '没有登录'
			}
		});
	}
};

exports.current = (req, res, next) => {

};

exports.sign = (req, res, next) => {

}
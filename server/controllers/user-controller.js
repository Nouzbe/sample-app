var nodemailer 	= require('nodemailer'),
	User 		= require('../models/user.js');

// mailer setup
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sample.app.mailer@gmail.com',
        pass: 'bamtechno'
    }
});

module.exports.forgotPassword = function(req, res) {
	var username = req.params.user;
	var user = new User();
	newOne = Math.random().toString(36).substring(6);
	var newHash = user.generateHash(newOne);
	
	User.update({'local.username': username},{'local.password': newHash}, function(err, numAffected) {
		if(err)
			res.send(err);
		if(numAffected.n == 1) {
			User.findOne({'local.username': username}, function (err, results){
				if(err)
					res.send(err);
				var mailOptions = {
				    from: 'sample.app.mailer@gmail.com',
				    to: results._doc.local.email,
				    subject: 'Your new sample-app credentials',
				    text: 'Hi ' + username + ',\n\nWe wanted to tell you that your password has been succesfully reset. You can now login with the following:\n' + newOne + '\n\nCheers !\n\nThe sample-app team.',
				};
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        console.log(error);
				    }else{
				        console.log('Message sent: ' + info.response);
				    }
				});
			});
		res.json({ message: 'ok' });
		} else {
			console.log('An error occured during ' + username + '\'s password reset.');
			res.json({message: 'ko'});
		}
		
	});
}
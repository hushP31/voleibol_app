/*
	En este archivo se crearán todas las funciones necesarias 
	para la consulta, creación, modificación y borrado de los
	usuarios en la base de datos.
*/


var User;
exports.setModel = function(model){
	User = model;
};

/**
  * @method index
  	
  * Description
	The function does a search for all users registered in the system. 
	If the search is successful, redirects to the home page where users 
	will be listed. On error, reports the error.
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.index = function(req, res){
		User.find({}, function(error, users){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				res.render('users/index', { users: users });
			}
		})
};


/**
  * @method create
  	
  * Description
		A new user is initialized to be stored later
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects to users/save
 */
exports.create = function(req, res){
		User.find({}, function(error, users){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				res.render('users/save', {
					users: users,
					put: false,
					action: '/users',
					user: new User({
							name: "",
							last_name: "",
							name_user: "",
							email: "", 
							password: "",
							role: ""
					})
				});
			}
		})
	};
	
/**
  * @method store
  	
  * Description
	Data entered into a form is retrieved and a new user is created
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.store = function(req, res){
		var pass = req.body.password;
		var md5 = require('js-md5');
		var Hashedpass = md5(pass);
		//console.log(Hashedpass + ' ' + pass + '\n');
		var user = new User({
						name: 	req.body.name,
						last_name: 	req.body.last_name,
						name_user: 	req.body.name_user,
						email: 		req.body.email, 
						password: 	Hashedpass,
						//role: 		'usuario_registrado'
					});
		user.save(function(error, document){
			if(error){
				res.send('Error while trying to save the user STORE.');
			}
			else{
				res.redirect('/users/create');
			}
		});
};


/**
  * @method show
  	
  * Descripción
	Search for all users using the id as a parameter 
	(not to repeat values) and then displays redirecting
	 users/show. 
	 In case of error in the search, you are notified.
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.show = function(req, res){
		User.findById(req.params.id, function(error, document){
					if(error){
						res.send('Error while trying to show the user.');
					}
					else{
						res.render('users/show', {user: document});
					}
		});
};


/**
  * @method edit
  	
  * Description
	It modifies a user identified by id

	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.edit = function(req, res){
		User.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to edit the user.');
			}
			else{
				//console.log(documento + ' AQUI EL DOCUMENTO');
				res.render('users/save', {
					put: true,
					action: '/users/' + req.params.id,
					user: document
				});
			}
		});
};

/**
  * @method update
  	
  * Description
	Find the current user by its id, and updates the data
	previously entered in the form.
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.update = function(req, res){
		User.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to update the user.');
			}
			else{
				var user = document;
				var pass = req.body.password;
				var md5 = require('js-md5');
				var Hashedpass = md5(pass);

				user.name = req.body.name,
				user.last_name = req.body.last_name,
				user.name_user = req.body.name_user,
				user.password = Hashedpass,
				user.role = req.body.role;

				user.save(function(error, document){
					if(error){
						res.send('Error while trying to save the user.');
					}
					else{
						res.redirect('/login');
					}
				});
			}
		});
};


/**
  * @method destroy
  	
  * Description
	Removes a registered user on the system
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.destroy = function(req, res){
		User.remove({_id: req.params.id}, function(error){
			if(error){
				res.send('Error while trying to destroy the user.');
			}
			else{
				res.redirect('/login');
			}
		});
};

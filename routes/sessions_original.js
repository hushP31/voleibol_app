

var User;
exports.setModel = function(model){
	User = model;
};

var Video;
exports.setModelVideo = function(model){
	Video = model;
};

var Championship;
exports.setModelChampionship = function(model){
	Championship = model;
};

var Team;
exports.setModelTeam = function(model){
	Team = model;
};


/**
  * @method get_login
  	
  * Description
	Redirects the browser to /login
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.get_login = function(req, res){
	//console.log("Estoy en exports.GET_login\n");
	var fs = require('fs');
	var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
			if(err){
				console.log(err);
			}
		});
	parameters = JSON.parse(parameters);
	var tittle = parameters.info_configuracion.app_tittle;
	var subtittle = parameters.info_configuracion.app_subtittle;

	res.render('sessions/login', { tittle, subtittle });
};


/**
  * @method post_login
  	
  * Description
	the function receives two parameters, the function 
	processes the parameters and if they are correct, session starts.
	
	@param req
		It contains the information of the forms
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.post_login = function(req, res){

	//Inicializan variables
	var datos_erroneos = false;
	var user_ = req.body.usuario;
	var pass_ = req.body.password;
	var mongoose = require('mongoose');
	var md5 = require('js-md5');
	var hashedpass = md5(pass_);

	var fs = require('fs');
	var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
			if(err){
				console.log(err);
			}
		});
	parameters = JSON.parse(parameters);
	var tittle = parameters.info_configuracion.app_tittle;
	
	User.findOne( { $and: [{name_user: { $eq: user_, $exists: true }}, {password: {$eq: hashedpass, $exists: true}}]}, function(error, document){
				if(document == null){
					var subtittle = parameters.info_configuracion.app_subtittle;
					res.render('sessions/login', { tittle, subtittle, error: true });
				}
				else{
					req.session.user = user_;
					req.session.password = hashedpass;

					Championship.find({}, function(err, allchamps){
						if(err)
							res.send("It has emerged an error in to find Championships");
						else{
							Video.find({}, function(error, videos){
								if(error){
									res.send('It has emerged an error in Videos');
								}
								else{
									var user_session = {user: req.session.user};
									var allvideos = [];
									var allteams = [];
									var i=0;
									while(videos.length > i){
										allvideos.push(videos[i]);
										i++;
									}
									
									//Insert name championship
									for(var k=0; k<allvideos.length; k++)
										for(var j=0; j<allchamps.length; j++)
											if(allchamps[j]._id == allvideos[k].championship){
												allvideos[k].namecham = allchamps[j].name;
												//console.log(allvideos[k].namecham);
											}

									//Insert name of teams
									Team.find({}, function(err, teams){
										if(err)
											res.send("It has emerged an error in Team");
										else{
											for(i=0; i<allvideos.length; i++){
												var eq1, eq2, mtch, name;
												mtch = allvideos[i].match;
												idCh = allvideos[i].championship;
												//console.log("Match:" + mtch + "\nId Championship: " + idCh);

												for(var j=0; j<allchamps.length; j++){
													if(allchamps[j]._id == idCh){
															eq1 = allchamps[j].listofmatchs[mtch].teams[0];
															eq2 = allchamps[j].listofmatchs[mtch].teams[1];
															//console.log(eq1 + " " + eq2);
														}
													}
												//Add team names to allvideos
												allvideos[i].equipoA = teams[eq1-1].name;
												allvideos[i].equipoB = teams[eq2-1].name;
											}
												res.render('website/index', { videos: allvideos, tittle, user_session });
										}
									});
								}
							});
						}
					});
				}
	});
};

exports.logout =  function(req,res){

		req.session.destroy(function(err) {
			if(err)
				console.log(err);
			else
				res.redirect('/login');
		});
};


/**
  * @method index
  	
  * Description
	function check for an open session. 
	If the session is open shows the main page,
	else redirected to Login

	@param req
		It contains the information of the forms
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.index = function(req, res){
	
	if(req.session.user){
		var user_session = {user: req.session.user}
		var fs = require('fs');
		var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
			if(err){
				console.log(err);
			}
		});

		var fs = require('fs');
		var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
				if(err){
					console.log(err);
				}
			});
		parameters = JSON.parse(parameters);
		var tittle = parameters.info_configuracion.app_tittle;

		Championship.find({}, function(err, allchamps){
				if(err)
					res.send("It has emerged an error in to find Championships");
				else{
					Video.find({}, function(error, videos){
						if(error){
							res.send('It has emerged an error in Videos');
						}
						else{
							var allvideos = [];
							var allteams = [];
							var i=0;
							while(videos.length > i){
								allvideos.push(videos[i]);
								i++;
							}

							//console.log(allvideos[0].file);
							
							//Insert name championship
							for(var k=0; k<allvideos.length; k++)
								for(var j=0; j<allchamps.length; j++)
									if(allchamps[j]._id == allvideos[k].championship){
										allvideos[k].namecham = allchamps[j].name;
										//console.log(allvideos[k].namecham);
									}

							//Insert name of teams
							Team.find({}, function(err, teams){
								if(err)
									res.send("It has emerged an error in Team");
								else{
									for(i=0; i<allvideos.length; i++){
										var eq1, eq2, mtch, name;
										mtch = allvideos[i].match;
										idCh = allvideos[i].championship;
										//console.log("Match:" + mtch + "\nId Championship: " + idCh);

										for(var j=0; j<allchamps.length; j++){
											if(allchamps[j]._id == idCh){
													eq1 = allchamps[j].listofmatchs[mtch].teams[0];
													eq2 = allchamps[j].listofmatchs[mtch].teams[1];
													//console.log(eq1 + " " + eq2);
												}
											}
										//Add team names to allvideos
										allvideos[i].equipoA = teams[eq1-1].name;
										allvideos[i].equipoB = teams[eq2-1].name;
									}
										res.render('website/index', { videos: allvideos, tittle, user_session });
								}
							});
					}
				});
			}
		});

	}else{
		res.redirect('/login');
	}
};

/**
  * @method salir
  	
  * Descripción
	Function destroy the current session and redirect to Login
	
	@param req
		It contains the information of the forms
	@param res
		It contains the current direction

	@return res
		it redirects
 */
exports.exit = function(req, res){
	req.session.user = null;
	req.session.password = null;
	res.redirect('/login');
};
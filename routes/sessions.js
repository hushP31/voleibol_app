

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
	var tittle_ = parameters.info_configuracion.app_tittle;
	var subtittle_ = parameters.info_configuracion.app_subtittle;

	res.render('sessions/login', { tittle:tittle_, subtittle:subtittle_ });
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
	var tittle_ = parameters.info_configuracion.app_tittle;

	var misvideos = [];
	var misequipos = [];
	var miscampeonatos = [];

	User.findOne( { $and: [{name_user: { $eq: user_, $exists: true }}, {password: {$eq: hashedpass, $exists: true}}]}, function(error, document){
				if(document == null){
					var subtittle_ = parameters.info_configuracion.app_subtittle;
					res.render('sessions/login', { tittle:tittle_, subtittle:subtittle_, error: true });
				}
				else{
					req.session.user = user_;
					req.session.password = hashedpass;
					
					//To find all videos
					Video.find({}, function(err1, vds){
						if(err1)
							throw err1;
						else{
							Championship.find({}, function(err2, chmpnshp){
								if(err2)
									throw err2;
								else{
									Team.find({}, function(err3, tms){
										if(err3)
											throw err3;
										else{
											var videos = [];
											var idvideo = "";
											var name_champ = "";
											var nameA = "";
											var nameB = "";
											var path_frontal = "";
											var duration = "";
											var idchampVideo = "";
											
											for(var i=0; i<vds.length; i++){
												idvideo = vds[i]._id;
												idchampVideo = vds[i].championship;
												path_frontal = vds[i].name_frontal;
												duration = vds[i].duration;

												for(var j=0; j<chmpnshp.length; j++){
													if(vds[i].championship == chmpnshp[j]._id){
														//console.log("if 1 ");
														name_champ = chmpnshp[j].name;
														var kk = chmpnshp[j].listofmatchs.length;
														//console.log(chmpnshp[j].listofmatchs.length);

														for(var k=0; k<kk; k++){
															//console.log("for 3 - idvideo: " + chmpnshp[j].listofmatchs[k].video);
															var id_video1 = chmpnshp[j].listofmatchs[k].video;
															if(id_video1 == idvideo){
																//console.log("if 2 ");
																for(var n=0; n<tms.length; n++){
																	//console.log("tms_id - " + tms[n]._id);
																	if(chmpnshp[j].listofmatchs[k].teams[0] == tms[n]._id){
																		//console.log("if 3 ");
																		nameA = tms[n].name;	
																		//console.log("nuevo nameA");													
																	}
																	if(chmpnshp[j].listofmatchs[k].teams[1] == tms[n]._id){
																		//console.log("if 4 ");
																		nameB = tms[n].name;
																		//console.log("nuevo nameB");
																	}
																}
															}
														}
													}
												}
												videos.push({	
													idvideo:idvideo, 
													path_frontal:path_frontal, 
													duration:duration, 
													name_champ:name_champ, 
													nameA:nameA,
													nameB:nameB,
													championship: idchampVideo
												});
											}
											/*
											for(var i=0; i<videos.length; i++){
												console.log(videos[i].idvideo);
												console.log(videos[i].name_champ);
												console.log(videos[i].nameA);
												console.log(videos[i].nameB);
												console.log(videos[i].path_frontal);
												console.log(videos[i].duration);
											}
											*/
											res.render('website/index', { videos: videos });
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
	req.session.destroy(function(err){
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
		var user_session_ = {user: req.session.user}
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
		var tittle_ = parameters.info_configuracion.app_tittle;

		Video.find({}, function(err1, vds){
			if(err1)
				throw err1;
			else{
				Championship.find({}, function(err2, chmpnshp){
					if(err2)
						throw err2;
					else{
						Team.find({}, function(err3, tms){
							if(err3)
								throw err3;
							else{
								var videos = [];
								var idvideo = "";
								var name_champ = "";
								var nameA = "";
								var nameB = "";
								var path_frontal = "";
								var duration = "";
								var idchampVideo = "";
								
								for(var i=0; i<vds.length; i++){
									idvideo = vds[i]._id;
									idchampVideo = vds[i].championship;
									path_frontal = vds[i].name_frontal;
									duration = vds[i].duration;

									for(var j=0; j<chmpnshp.length; j++){
										if(vds[i].championship == chmpnshp[j]._id){
											console.log("if 1 ");
											name_champ = chmpnshp[j].name;
											var kk = chmpnshp[j].listofmatchs.length;
											console.log(chmpnshp[j].listofmatchs.length);

											for(var k=0; k<kk; k++){
												console.log("for 3 - idvideo: " + chmpnshp[j].listofmatchs[k].video);
												var id_video1 = chmpnshp[j].listofmatchs[k].video;
												if(id_video1 == idvideo){
													console.log("if 2 ");
													for(var n=0; n<tms.length; n++){
														console.log("tms_id - " + tms[n]._id);
														if(chmpnshp[j].listofmatchs[k].teams[0] == tms[n]._id){
															console.log("if 3 ");
															nameA = tms[n].name;	
															//console.log("nuevo nameA");													
														}
														if(chmpnshp[j].listofmatchs[k].teams[1] == tms[n]._id){
															console.log("if 4 ");
															nameB = tms[n].name;
															//console.log("nuevo nameB");
														}
													}
												}
											}
										}
									}
									videos.push({	
													idvideo:idvideo, 
													path_frontal:path_frontal, 
													duration:duration, 
													name_champ:name_champ, 
													nameA:nameA,
													nameB:nameB,
													championship: idchampVideo
												});
								}
								/*
								for(var i=0; i<videos.length; i++){
									console.log(videos[i].idvideo);
									console.log(videos[i].name_champ);
									console.log(videos[i].nameA);
									console.log(videos[i].nameB);
									console.log(videos[i].path_frontal);
									console.log(videos[i].duration);
								}
								*/
								res.render('website/index', { videos: videos });
							}
						});
					}
				});
			}
		});
	}
	else
		res.redirect('/login');
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
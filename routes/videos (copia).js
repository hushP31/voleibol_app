


var Video;
exports.setModel = function(model){
	Video = model;
};

var Championship;
exports.setModelCham = function(model){
	Championship = model;
};

var Team;
exports.setModelTeam = function(model){
	Team = model;
};

var Tag;
exports.setModelTag = function(model){
	Tag = model;
}
var Template;
exports.setModelTemplate= function(model){
	Template = model;
}

var Critery;
exports.setModelCritery = function(model){
	Critery = model;
}

var Descriptor;
exports.setModelDescriptor = function(model){
	Descriptor = model;
}

var Category;
exports.setModelCategory = function(model){
	Category = model;
}

/**
  * @method index
  	
  * Description
	It shows a list of the latest videos embedded in the system	

	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
 */

exports.index = function(req, res){
	if(req.session.user){
		Video.find({}, function(error, videos){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				Video.find({}, function(error, videos){
					if(error){
						res.send('It has emerged an error');
					}
					else{
						console.log('videos ' + videos);
						res.render('website/api/index', { videos: videos });
					}
				});
			}
		})
	}
	else{
		res.redirect('../../login');
	}
};


/**
  * @method create
  	
  * Description
  	It creates a new video initialitation (NOT COMPLETE)
		
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
		
 */

var match_id_aux = -1;

exports.create = function(req, res){
	if(req.session.user){
		var url = req.url;
		var str = url.split("/");
		//console.log("El req.body.id es: " + str[3] + "\n");

		if(match_id_aux == -1)
			match_id_aux = str[4];

		
		//console.log('El championship es:' + req.params.id)
		Championship.findById(req.params.id, function(error, championship){
				if(error){
					res.send('Error 2. Championships not found')
				}
				else{
					res.render('website/videos/save', {
						put: false,
						championship: championship,
						match: req.params.id_match,
						action: '/api/showvideos',
						video: new Video({
								name: "",
								listoftags: "",
								file: "",
								name_file: "",
								championship: "", 
								match: "",
								duration: "",
								analysis: "",
								grid: ""
						})
					});
				}
				//console.log('El id_match es:' + req.params.id_match)
			});
	}
	else{
		res.redirect('/../login');
	}
};

/**
  * @method store
  	
  * Description
	data are stored a new video and returns to index (NOT COMPLETE)

	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects

 */

exports.store = function(req, res){
	if(req.session.user){
		
		var formidable 	= require('formidable');
		var fs 			= require('fs');

		var form = new formidable.IncomingForm();
		console.log("About to parse...");
		form.maxFileSize = 1024*1024*1024;

		form.parse(req, function (err, fields, files) {
			if (err) throw err;

			console.log("Parsing done.");
		    console.log("listoftags: " + fields);
		    console.log(files);

			console.log(__dirname);

			var tags = fields.listoftags;
			console.log("listoftags: " + fields.listoftags);
			tags = tags.split(/[ ,]+/).join(',');
			var tags_array = tags.split(",");

			var json = JSON.stringify(tags_array)
			var json_tags = JSON.parse(json);
			console.log("\ntags: " + json_tags);

			var name_ = fields.idchampionship +'_M_'+ fields.idmatch;
			console.log("\nName: " + name_);

			var oldpath_f = files.video_frontal.path;
			var oldpath_l = files.video_lateral.path;

			//console.log("\noldpaths" + oldpath_f + ", " + oldpath_l);

			var ext = "mp4";
			var name_frontal_public = name_ + '_FRONTAL';
			var name_lateral_public = name_ + '_LATERAL';

			var newpath_f = './public/media/' + name_frontal_public + "." + ext;
			var newpath_l = './public/media/' + name_lateral_public + "." + ext;
			
			//console.log("\nnewpaths" + newpath_f + ", " + newpath_l)

			/************************************************************************************/
			/* METADATOS */

			var getDimensions = require('get-video-dimensions');

			getDimensions(newpath_f).then(function (dimensions) {
			  console.log("DIMENSIONES:" +  dimensions.width + " X " + dimensions.height);
			});

			/****************************************************************************************/


			fs.rename(oldpath_f, newpath_f, function (errF) {
				if (errF) throw errF;
				//console.log("frontal update");
			
				fs.rename(oldpath_l, newpath_l, function (errL) {
					if (errL) throw errL;
					//console.log("lateral update");
					var p = {x:0, y:0};
					var puntos_ = {
						p0: p,
						p1: p,
						p2: p,
						p3: p						
					};
					var grid_ = {
						color_h: "",
						color_v: "",
						size_H: "",
						size_L: "",
						frontal: puntos_,
						lateral: puntos_,
						FdesviacionX: 0,
						FdesviacionY: 0,
						LdesviacionX: 0,
						LdesviacionY: 0,
						divisionesH: 0,
						divisionesV: 0
					};
					var video = new Video({
						name: name_,
						name_frontal: name_frontal_public,
						name_lateral: name_lateral_public,
						listoftags: json_tags,
						file: files.video_frontal.name,
						name_file: name_,
						championship: fields.idchampionship, 
						match: fields.idmatch,
						duration: 123,
						analysis: "",
						grid: grid_
					});

					video.save(function(error, document){
						if(error){
							res.send('Error while trying to save the video ERROR.');
						}
						else{
							console.log(video);

							console.log("ID del nuevo video almacenado: " + document._id);

							//Actualizar Championship.listofmatchs.video
							Championship.findById(fields.idchampionship, function (err, result0){
								if (err) 
									throw err;
								else{
									var games = [];
									games = result0;
									
									console.log(result0);
									console.log(games);
									//ObjectID(0000000..00) --> 000000..000
									var strID = "";
									strID = strID + document._id;
									console.log("str: " + strID);

									games.listofmatchs[fields.idmatch].video = strID 

									Championship.update( { '_id' : fields.idchampionship }, { $set: { 'listofmatchs': games.listofmatchs } }, function (err1, result1) {
										if (err1) 
											throw err1;
										else{
											res.redirect('/api/showchampionship/'+ fields.idchampionship);
											match_id_aux = -1;
										}
									});
								}
							});
						}
					});

				});

			});	

		});
	}
	else{
		res.redirect('/../login');
	}
};

/*
exports.store = function(req, res){
	if(req.session.user){
		var sampleFile;

		if(!req.files){
			res.send('No files were uploaded');
		}
		var extension = "mp4";

		sampleFile = req.files.file_video;

		var name_video =  req.body.name_video;
		var nameFile = 'public/media/'+ req.body.idchampionship +'M'+ req.body.idmatch + sampleFile.name;
		var nameFile2 = nameFile.replace(/(^\s*)|(\s*$)/g,""); 

		sampleFile.mv(nameFile2, function(error){
			if(error){
				res.status(500).send(error);
			}
		});

		console.log("El video dura: " + sampleFile.duration + " segundos;")

		var tags = req.body.listoftags;
		var tags_array = tags.split(", ");
		
		var name_file1 = req.body.idchampionship +'M'+ req.body.idmatch + sampleFile.name;
		var name_file2 = name_file1.split(".");
		console.log(name_file2[0]);

		var json = JSON.stringify(tags_array)
		var json_tags = JSON.parse(json);

		var video = new Video({
						name: req.body.name_video,
						listoftags: json_tags,
						file: nameFile2,
						name_file: name_file2[0],
						championship: req.body.idchampionship, 
						match: req.body.idmatch,
						duration: 123,
						grid: "",
						analysis: ""
					});

		
		video.save(function(error, document){
			if(error){
				res.send('Error while trying to save the video ERROR.');
			}
			else{
				res.redirect('/api/showchampionship/'+ req.body.idchampionship);
				match_id_aux = -1;
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};
*/

/**
  * @method show
  	
  * Descripción
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
		
 */
exports.show = function(req, res){
	if(req.session.user){
		Video.findById(req.params.id, function(error, video){
					if(error){
						res.send('Error while trying to show the video.');
					}
					else{
						Championship.findById(video.championship, function(err2, champ){
							if(err2){
								res.send('Error while trying to find the championship');
							}
							else{
								var name_champ = champ.name;
								var teams_match = champ.listofmatchs[video.match].teams;
								console.log("Nombre campeonato: " + name_champ);
								console.log("Equipos ID: " + teams_match[0] + ", " + teams_match[1]);

								//Find name teams:
								var teamA, teamB;
								Team.findById(teams_match[0], function(err3, team1){
									if(err2){
										res.send('Error while trying to find the team1');
									}
									else{
										teamA = team1;
										Team.findById( teams_match[1], function(err3, team2){
											if(err2){
												res.send('Error while trying to find the team2');
											}
											else{
												teamB = team2;
												Template.find({}, function(err4, templates1){
													if(err4){
														res.send('Error while trying to find the templates');
													}
													else
														res.render('website/videos/show', {video: video, name_championship: name_champ, teamA: teamA, teamB: teamB, templates: templates1});
												});
											}
										});									
									}
								});
							}
						});
					}
		});
	}
	else{
		res.redirect('/../login');
	}
};

exports.showmatch = function(req, res){};
	

/**
  * @method edit
  	
  * Description
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
		
 */
exports.edit = function(req, res){
	if(req.session.user){
		Video.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to edit the video.');
			}
			else{
				//console.log(documento + ' AQUI EL DOCUMENTO');
				res.render('videos/save', {
					put: true,
					action: '/videos/' + req.params.id,
					video: document
				});
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};

/**
  * @method update
  	
  * Description
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
		
 */
exports.update = function(req, res){
	if(req.session.user){
		Video.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to update the video.');
			}
			else{
				var video = document;
				var pass = req.body.password;
				var md5 = require('js-md5');
				var Hashedpass = md5(pass);

				video.name = req.body.name,
				video.last_name = req.body.last_name,
				video.name_user = req.body.name_user,
				video.password = Hashedpass,
				video.role = req.body.role;

				video.save(function(error, document){
					if(error){
						res.send('Error while trying to save the video.');
					}
					else{
						res.redirect('/login');
					}
				});
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};


/**
  * @method destroy
  	
  * Description
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects
		
 */
exports.destroy = function(req, res){
	if(req.session.user){
		Video.remove({_id: req.params.id}, function(error){
			if(error){
				res.send('Error while trying to destroy the video.');
			}
			else{
				res.redirect('/login');
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};




/**
  * @method addgrid
  	
  * Description
	
	@param req
		
	@param res
		

	@return res
		it redirects
		
 */
exports.addgrid = function(req, res){
	if(req.session.user){

		Video.findById(req.body.id, function(err, video) {
			if (err){
				throw err;
			}
			else {
				//Se actualiza grid siempre
				var szL, szF, dX_F, dY_F, dX_L, dY_L;
				var puntosL, puntosF;

				var puntos_ = {
						p0: req.body.puntos[0],
						p1: req.body.puntos[1],
						p2: req.body.puntos[2],
						p3: req.body.puntos[3]						
					};


				if(req.body.plano == "lateral"){
					szL = req.body.sz;
					szF = video.grid.size_H;
					
					puntosL = puntos_;
					puntosF = video.grid.frontal;
					
					dX_L = req.body.desvX;
					dY_L = req.body.desvY;
					dX_F = video.grid.FdesviacionX;
					dY_F = video.grid.FdesviacionY;
				}
				else{
					szL = video.grid.size_L;
					szF = req.body.sz;
					
					puntosL = video.grid.lateral;
					puntosF = puntos_;

					dX_F = req.body.desvX;
					dY_F = req.body.desvY;
					dX_L = video.grid.LdesviacionX;
					dY_L = video.grid.LdesviacionY;
				}

				var grid_ = {
					color_h: req.body.clrH,
					color_v: req.body.clrV,
					size_H: szF,
					size_L: szL,
					frontal: puntosF,
					lateral: puntosL,
					FdesviacionX: dX_F,
					FdesviacionY: dY_F,
					LdesviacionX: dX_L,
					LdesviacionY: dY_L,
					divisionesH: req.body.dvH,
					divisionesV: req.body.dvV
				};

				console.log(grid_)

				Video.update( { '_id' : video._id }, { $set: { 'grid': grid_ } }, function (err1, result1) {
					if (err1) {
						res.json({status: "error"});
						console.log(err1);
						throw err1;
					}
					else{
						console.log("result: " + result1);
						res.json({status: "success"});
					}
				});

			}
		});
	}
	else{
		res.redirect('/../login');
	}
};


/**
  * @method drawgrid
  	
  * Description
	
	@param req
		
	@param res
		

	@return res
		it redirects
		
 */

exports.drawgrid = function(req, res){
	if(req.session.user){

		var id_video = req.body.idvideo;
		
		Video.findById(id_video, function(err, v) {
			if (!v)
				res.json({status: 'false', error_idvideo: 'true'});
			else {
				res.json({grid: v.grid, error: 'false'});	
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};



/**
  * @method addanalysis
  	
  * Description
	
	@param req
		
	@param res
		

	@return res
		it redirects
		
 */
exports.addanalysis = function(req, res){
	if(req.session.user){

		var id_video = req.body.idvideo;
		
		var title = req.body.title;
		var analysis = req.body.cuerpo;

		var total_analysis = [];

		total_analysis.push(title);
		total_analysis.push(analysis);
		console.log("Titulo: \n" + title);
		console.log("\nCuerpo: " + total_analysis);

		Video.findById(id_video, function(err, v) {
			if (!v)
				res.json({status: 'false', error_idvideo: 'true'});
			else {
				// do your updates here
				v.analysis = total_analysis;
				v.save(function(err) {
					if (err)
						res.json({status: 'false', error_update: 'true'});
					else{
						res.json({status:'true', error: 'false'});
					}
				});
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};



/**
  * @method showanalysis
  	
  * Description
	
	@param req
		
	@param res
		

	@return res
		it redirects
		
 */
exports.showanalysis = function(req, res){
	if(req.session.user){
		var alltags = 0;
		var analysis;

		console.log("El id del video es: " + req.body.idvideo);
		//Find all tags
		Tag.find({}, function(err, tags){
			if(err){
				alltags = err;
			}
			else{
				alltags = tags;
				//console.log('Tags: ' + alltags[0].name + ', ' + alltags[1].name);

				//Find analysis video
				Video.findById(req.body.idvideo, function(err, video){
					if(err){
						analysis = err;
					}
					else{
						analysis = video.analysis;
						
						res.json({analysis: video.analysis,  alltags: alltags});
					}
				});
			}
		});
	}
	else{
		res.redirect('/../login');
	}
}


exports.gettemplates = function(req, res){
	if(req.session.user){
	
		Template.find({}, function(err, templates){
			if(err){
			}
			else{
				res.json({ templates: templates });
			}
		});
	}
	else{
		res.redirect('/../login');
	}
}


exports.gettemplate = function(req, res){
	if(req.session.user){
		var t1 = req.body.t;
		var list_criteries_t1 = [];
		console.log("Template = " + t1);

		Template.findOne({name: t1}, function(err, template){
			if(err){
			}
			else{
				res.json({template: template});
			}
		});
	}
	else{
		res.redirect('/../login');
	}
}


exports.edit = function(req, res){
	if(req.session.user){
		Video.findById(req.params.id, function(error, video){
					if(error){
						res.send('Error while trying to show the video.');
					}
					else{
						Championship.findById(video.championship, function(err2, champ){
							if(err2){
								res.send('Error while trying to find the championship');
							}
							else{
								var name_champ = champ.name;
								var teams_match = champ.listofmatchs[video.match].teams;
								console.log("Nombre campeonato: " + name_champ);
								console.log("Equipos: " + teams_match[0] + ", " + teams_match[1]);

								//Find name teams:
								Team.find({}, function(err3, team1){
									if(err2){
										res.send('Error while trying to find the championship');
									}
									else{
										var teamA, teamB;
										for(var i=0; i<team1.length; i++){
											if(team1[i].id == teams_match[0])
												teamA = team1[i];
											if(team1[i].id == teams_match[1])
												teamB = team1[i];
										}

										Template.find({}, function(err4, templates1){
											if(err4){

											}
											else{
												res.render('website/videos/edit', {video: video, name_championship: name_champ, teamA: teamA, teamB: teamB, templates: templates1});
											}
										});									
									}
								});
							}
						});
					}
		});
	}
	else{
		res.redirect('/../login');
	}
};

var track_active = true;

exports.trackingExit = function(req, res){
	if(req.session.user){
		track_active = false;
	}
	else{
		res.redirect('/../login');
	}


}

exports.tracking = function(req, res){
	if(req.session.user){
		const cv = require('opencv4nodejs');
		const $ = require('jquery');
		var n_frame = 0;
		var dell = 1/30;
		var time_act, time_anterior = -1;
		var velocidad = -1;
		var balon_3D, balon_3D_anterior = {x:-1, y:-1, z:-1};

		track_active = true;
		var video_time = req.body.video_time;
		
		var coordenadas4D = [], coordenadas4DD = [], frontal_detectados = [], lateral_detectados = [];

		//var heightttt = $("#svgContainer1").attr("height");
		//console.log(heightttt)
		var punto4D = {
			coordenada: 0,
			tiempo: 0
		}	
		var punto4DD = {
			x: 0,
			y: 0,
			z: 0,
			tiempo: 0
		}	


		if(req.body.trck){
			//const { grabFrames, drawRectAroundBlobs } = require('./utils.js');
			var cfrontal = req.body.pF;
			var clateral = req.body.pL;

			var dimensionFrontal = req.body.dimF;
			var dimL = req.body.dimL;
			var campoF = [], campoL = [];
			var ball_frontal, ball_lateral, area_frontal, area_lateral;
			var area_cont_f = []; area_cont_l = [];
			var avg_areaF = 0, avg_areaL = 0;

			let desvF = req.body.desvF;
			let desvL = req.body.desvL;

			desvF.x = parseInt(desvF.x);
			desvF.y = parseInt(desvF.y*2);
			desvL.x = parseInt(desvL.x);
			desvL.y = parseInt(desvL.y*2);


			for(var i=0; i<4; i++){
				campoF.push({x:parseInt(cfrontal[i].x-desvF.x), y:parseInt(cfrontal[i].y-desvF.y+11)});
				campoL.push({x:parseInt(clateral[i].x-desvL.x), y:parseInt(clateral[i].y-desvL.y+11)});
			}

			//console.log(dimensionFrontal.height + ", " + dimL.width);

			var pathFrontal = req.body.pathF;
			var pathLateral = req.body.pathL;

			pathFrontal = pathFrontal.substring(6, pathFrontal.length);
			pathFrontal = "public/" + pathFrontal;
			pathLateral = pathLateral.substring(6, pathLateral.length);
			pathLateral = "public/" + pathLateral;

			//console.log("pathFrontal: " + pathFrontal);
			const delay = 100;

			//Information Windows
			const rows = 700; 	// height
			const cols = 850; 	// width
			const m_9 = 225;	// distancia que mide la altura del campo. La anchura es 2*m_9
			const p_a = {x:100, y:75};

			const capF = new cv.VideoCapture(pathFrontal);
			const capL = new cv.VideoCapture(pathLateral);
			let done = false;
			
			desvF.y-=10;
			desvL.y-=10;
			var tracking_exit = true;
			var tracking_balon = true;
	
	  		while(((capF.get(cv.CAP_PROP_POS_FRAMES) < capF.get(cv.CAP_PROP_FRAME_COUNT)-1) || 
    							(capL.get(cv.CAP_PROP_POS_FRAMES) < capL.get(cv.CAP_PROP_FRAME_COUNT)-1)) && tracking_exit && track_active)
	  		{
		  		n_frame++;
		  		time_act = capF.get(cv.CAP_PROP_POS_FRAMES) / (30);
    			time_act = time_act.toFixed(2);

				let frameF11 = capF.read();
				let frameF22 = capF.read();
				var valor;
				let frameL11 = capL.read();
				let frameL22 = capL.read();
				// loop back to start on end of stream reached
				if (frameF22.empty) {
					capF.reset();
					let frameF11 = capF.read();
					let frameF22 = capF.read();
				}
				if (frameL22.empty) {
					capL.reset();
					let frameL11 = capF.read();
					let frameL22 = capF.read();
				}

				let fieldMat = new cv.Mat(rows, cols, cv.CV_8UC1, 255);
				//Draw gamefield in last one mat.
				DrawGameField(fieldMat, p_a, m_9);

				thresholdedF = toThreshold(frameF11, frameF22, dimensionFrontal, "frontal");
				thresholdedL = toThreshold(frameL11, frameL22, dimensionFrontal, "lateral");
				
				const frmF = frameF22.resize(parseInt(dimensionFrontal.height-125), parseInt(dimensionFrontal.width));
				const frmL = frameL22.resize(parseInt(dimensionFrontal.height-125), parseInt(dimensionFrontal.width));
				
				/************************************	<TRACKING>   *************************************/
				if(tracking_balon){

					var solF = ball_frontal = searchBall(thresholdedF,frmF, "F", campoF, dimensionFrontal, ball_frontal, area_frontal, avg_areaF);
	     			var solL = ball_lateral = searchBall(thresholdedL,frmL, "L", campoL, dimensionFrontal, ball_lateral, area_lateral, avg_areaL);
					
					if(solF[0].x != -1){
		     			ball_frontal = solF[0];
		     			area_frontal = solF[1];
		     			area_cont_f.push(area_frontal);

		     			ball_lateral = solL[0];
		     			area_lateral = solL[1];
		     			area_cont_l.push(area_lateral);

		     			avg_areaF=0;
		     			for(var i=0; i<area_cont_f.length; i++)
		     				avg_areaF+=area_cont_f[i];
						avg_areaL=0;
		     			for(var i=0; i<area_cont_l.length; i++)
		     				avg_areaL+=area_cont_l[i];

	     				balon_3D = balon3D(frmF, frmL, campoF, campoL, ball_frontal, ball_lateral, frontal_detectados, lateral_detectados);
	     				
						punto4DD = {
							x: balon_3D.x,
							y: balon_3D.y,
							z: balon_3D.z,
							tiempo: time_act
						}	

						coordenadas4DD.push(punto4DD);

	     				DrawBallInGameField(fieldMat, p_a, m_9, coordenadas4DD, 5);
	     			}	
     			}
     			
     			cv.imshow('Frontal', frmF);
				cv.imshow('Lateral', frmL);

				cv.imshow('Show Information', fieldMat);

				/************************************	</TRACKING>    *************************************/
				
				for(var i=0; i<4; i++){
					thresholdedF.drawLine(new cv.Point2(campoF[i].x, campoF[i].y), new cv.Point2(campoF[(i+1)%4].x, campoF[(i+1)%4].y), cv.Vec( 255, 0, 0 ),1);
					thresholdedL.drawLine(new cv.Point2(campoL[i].x, campoL[i].y), new cv.Point2(campoL[(i+1)%4].x, campoL[(i+1)%4].y), cv.Vec( 255, 0, 0 ),1);
				}
				cv.imshow("thresholdedF", thresholdedF);
				cv.imshow("thresholdedL", thresholdedL);

				/****************************************/
				let key = cv.waitKey(delay);
				done = key !== -1 && key !== 255;

				if(key == 84)
					tracking_balon = !tracking_balon;

				if(key == 32){
					key = -1;
					console.log('Key pressed, pause.');
					var exiting = false;
					while((key != 32) && (!exiting)){
						key = cv.waitKey(delay);
						if(key == 27)
							exiting = true;
						if(key == 84)
							tracking_balon = !tracking_balon;
					}
					if(key == 27){
						console.log('Key pressed, EXIT.');
						cv.destroyAllWindows();
						//clearInterval(intvl);
						tracking_exit = false;
						track_active = false;
						res.json({dato_random: "Salida"})
					}
				}
				else{
					if(key == 27){
						console.log('Key pressed, EXIT.');
						cv.destroyAllWindows();
						//clearInterval(intvl);
						tracking_exit = false;
						track_active = false;
						res.json({dato_random: "Salida"})
					}
				}
				
				if(!req.body.trck){
					cv.destroyAllWindows();
					//clearInterval(intvl);
					tracking_exit = false;
					track_active = false;
					res.json({dato_random: "Salida"});
				}
				/****************************************/

				console.log("Segundos: " + time_act + "seg");
			}
		}
		else{
			cv.destroyAllWindows();
		}
	}
	else{
		res.redirect('/../login');
	}
};


const path = require('path');

const cv = require('opencv4nodejs');

exports.cv = cv;

const dataPath = path.resolve(__dirname, '../data');
exports.dataPath = dataPath;
exports.getDataFilePath = fileName => path.resolve(dataPath, fileName);

function grabFrames(videoFile, delay, onFrame){
	const cap = new cv.VideoCapture(videoFile);
	let done = false;

  	const intvl = setInterval(() => {
		let frame = cap.read();
		// loop back to start on end of stream reached
		if (frame.empty) {
			cap.reset();
			frame = cap.read();
		}
		onFrame(frame);

		const key = cv.waitKey(delay);
		done = key !== -1 && key !== 255;
		if (done) {
			clearInterval(intvl);
			console.log('Key pressed, exiting.');
		}
	}, 0);

};




function drawRectAroundBlobs(binaryImg, dstImg, minPxSize, fixedRectWidth){
  const {
    centroids,
    stats
  } = binaryImg.connectedComponentsWithStats();

  // pretend label 0 is background
  for (let label = 1; label < centroids.rows; label += 1) {
    const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
    const [x2, y2] = [
      x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
      y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
    ];
    const size = stats.at(label, cv.CC_STAT_AREA);
    const blue = new cv.Vec(255, 0, 0);
    if (minPxSize < size) {
      dstImg.drawRectangle(
        new cv.Point(x1, y1),
        new cv.Point(x2, y2),
        { color: blue, thickness: 2 }
      );
    }
  }
};

function drawRect(image, rect, color, opts){
  image.drawRectangle(
    rect,
    color,
    opts,
    cv.LINE_8
  )
}
/*
exports.drawRect = drawRect;

exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);

exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);

exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);
*/

function toThreshold(frame1, frame2, windowDimension, camara){
	//Redimensionar los frames.
	const frameF1 = frame1.cvtColor(cv.COLOR_BGR2GRAY).resize(parseInt(windowDimension.height)-125, parseInt(windowDimension.width));
	const frameF2 = frame2.cvtColor(cv.COLOR_BGR2GRAY).resize(parseInt(windowDimension.height)-125, parseInt(windowDimension.width));
	var SENSIVILIDAD = 40;

	if(camara == "lateral")
		SENSIVILIDAD = 10;

	//Calculo de diferencia de imágenes para captar movimiento
	const differenceImageF = frameF2.absdiff(frameF1);

	const iterations = 2;

	const eroded = differenceImageF.erode(
		cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3))
	);
	const dilated = eroded.dilate(
		cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(5, 5))
	);
	const dilated2 = dilated.dilate(
		cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(5, 5))
	);
	const eroded2 = dilated2.erode(
		cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3))
	);
	const blurred = eroded2.blur(new cv.Size(5, 5));
	const thresholdedF = blurred.threshold(SENSIVILIDAD, 255, cv.THRESH_BINARY);
	

	return thresholdedF;	
}


function searchBall(thresholdImage, frame, camara, puntos_terreno, windowDimension, punto_anterior, area_anterior, avg_area){
    
    var solucion = {x: -1, y:-1};
    var area = 0;
    var solucion_total = [];

    const contours = thresholdImage.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));
	

	var contour_aux = [];
	for(var i=0; i<contours.length; i++){
		contour_aux = [];
		contour_aux.push(contours[i]);
		//console.log(contours[i].area);
		var r = Math.floor((Math.random()*1000)%256), g = Math.floor((Math.random()*1000)%256), b = Math.floor((Math.random()*1000)%256);
		var color = new cv.Vec3(r, g, b);

		//frame.drawContours(contour_aux, color, cv.FILLED, 100, new cv.Point2(0, 0), 4, 2, 0);
	}


	if(contours.length > 0){
		var bound = contours[contours.length-1].boundingRect();
		var r = Math.floor((Math.random()*1000)%256), g = Math.floor((Math.random()*1000)%256), b = Math.floor((Math.random()*1000)%256);
		var color = new cv.Vec3(r, g, b);
		frame.drawCircle(new cv.Point2(bound.x,bound.y), 10, color, 1);
		var ball_aux = {x: bound.x, y: bound.y}

		area = contours[contours.length-1].area;
		solucion.x = bound.x;
		solucion.y = bound.y;


		/*****************************************************************
		Si el punto anterior está por encima de la red	
			Distancia de punto actual con el anterior.
				Si es posible, 
						se escoge
				SiNO es posible, 
					se crea un punto posible con la ayuda de 
					los 3 puntos anteirores creando la parabola.

		*******************************************************************/

		//...
		//...
	}

	solucion_total.push(solucion);
	solucion_total.push(area);

	return solucion_total;
}


function balon3D(frameF, frameL, campoF, campoL, ball_frontal, ball_lateral){

	//Calcular ABC y puntos de fuga
	var fugaF = PuntosDeFuga(campoF);
	var fugaL = PuntosDeFuga(campoL);
	var abcF = ABC(campoF);
	var abcL = ABC(campoL);

	var segmento_BC_f = RectaDosPuntos(abcF[1], abcF[2]);
	var segmento_BC_l = RectaDosPuntos(abcL[1], abcL[2]);

	//Crear lineas exteriores del campo
	var limite_F = [], limite_L = [];

	for(var i=0; i<4; i++){
		limite_F.push(RectaDosPuntos(campoF[i], campoF[(i+1)%4]));
		limite_L.push(RectaDosPuntos(campoL[i], campoL[(i+1)%4]));
	}

	//Trazar recta perpendicular al campo desde la posicion del balon (En cada campo)
	var p1={x:ball_frontal.x+5, y:0}, 
		p2={x:ball_lateral.x+5, y:0};

	var perp_F = RectaDosPuntos(p1, ball_frontal);
	var perp_L = RectaDosPuntos(p2, ball_lateral);
	

	//Punto de corte con la bases mayor del campo
	var pF_corte_M = PuntoDeCorte(perp_F, limite_F[3]);
	var pL_corte_M = PuntoDeCorte(perp_L, limite_L[3]);
	//Punto de corte con la base menor del campo
	var pF_corte_m = PuntoDeCorte(perp_F, limite_F[1]);
	var pL_corte_m = PuntoDeCorte(perp_L, limite_L[1]);
	
	//	Dibujo la recta
	for(var i=0; i<4; i++){
		frameF.drawLine(new cv.Point2(campoF[i].x, campoF[i].y), new cv.Point2(campoF[(i+1)%4].x, campoF[(i+1)%4].y), cv.Vec( 100, 200, 30 ),1);
		frameL.drawLine(new cv.Point2(campoL[i].x, campoL[i].y), new cv.Point2(campoL[(i+1)%4].x, campoL[(i+1)%4].y), cv.Vec( 100, 200, 30 ),1);
	}

	frameF.drawLine(new cv.Point2(pF_corte_M.x, pF_corte_M.y), new cv.Point2(ball_frontal.x, ball_frontal.y), cv.Vec( 255, 222, 0 ),1);
	frameL.drawLine(new cv.Point2(pL_corte_M.x, pL_corte_M.y), new cv.Point2(ball_lateral.x, ball_lateral.y), cv.Vec( 255, 222, 0 ),1);

	frameF.drawLine(new cv.Point2(pF_corte_m.x, pF_corte_m.y), new cv.Point2(ball_frontal.x, ball_frontal.y), cv.Vec( 255, 222, 0 ),1);
	frameL.drawLine(new cv.Point2(pL_corte_m.x, pL_corte_m.y), new cv.Point2(ball_lateral.x, ball_lateral.y), cv.Vec( 255, 222, 0 ),1);

	/******	BASE MAYOR ******/

	//Recta desde el punto de fuga[0] (principal) hasta punto de corte en la bases mayor.
	var corte_fugaF_M = RectaDosPuntos(fugaF[0], pF_corte_M);
	var corte_fugaL_M = RectaDosPuntos(fugaL[0], pL_corte_M);

	//Punto de corte de recta anterior con su segmento_BC
	var p_distancia_f_M = PuntoDeCorte(segmento_BC_f, corte_fugaF_M);
	var p_distancia_l_M = PuntoDeCorte(segmento_BC_l, corte_fugaL_M);

	var distancia_bc_f = DistanciaPuntos(abcF[1], abcF[2]);
	var distancia_bc_l = DistanciaPuntos(abcL[1], abcL[2]);

	var p_abcF_2_M = DistanciaPuntos(p_distancia_f_M, abcF[2]);
	var p_abcL_2_M = DistanciaPuntos(p_distancia_l_M, abcL[2]);

	var distancia_ponderada_frontal_M =  (9.0*p_abcF_2_M)/distancia_bc_f; //9
	var distancia_ponderada_lateral_M =  (18.0*p_abcL_2_M)/distancia_bc_l; //9

	distancia_ponderada_frontal_M = Math.round(distancia_ponderada_frontal_M * 100) / 100.0;
	distancia_ponderada_lateral_M = Math.round(distancia_ponderada_lateral_M * 100) / 100.0;

	if(p_distancia_f_M.x > abcF[2].x) 
		distancia_ponderada_frontal_M*=(-1.0);
	if(p_distancia_l_M.x > abcL[2].x) 
		distancia_ponderada_lateral_M*=(-1.0);

	/******	BASE MENOR ******/

	//Recta desde el punto de fuga[0] (principal) hasta punto de corte en la bases mayor.
	var corte_fugaF_m = RectaDosPuntos(fugaF[0], pF_corte_m);
	var corte_fugaL_m = RectaDosPuntos(fugaL[0], pL_corte_m);

	//Punto de corte de recta anterior con su segmento_BC
	var p_distancia_f_m = PuntoDeCorte(segmento_BC_f, corte_fugaF_m);
	var p_distancia_l_m = PuntoDeCorte(segmento_BC_l, corte_fugaL_m);
	/*
	var distancia_bc_f = DistanciaPuntos(abcF[1], abcF[2]);
	var distancia_bc_l = DistanciaPuntos(abcL[1], abcL[2]);
	*/
	var p_abcF_2_m = DistanciaPuntos(p_distancia_f_m, abcF[2]);
	var p_abcL_2_m = DistanciaPuntos(p_distancia_l_m, abcL[2]);

	var distancia_ponderada_frontal_m =  (9.0*p_abcF_2_m)/distancia_bc_f; //9
	var distancia_ponderada_lateral_m =  (18.0*p_abcL_2_m)/distancia_bc_l; //9

	distancia_ponderada_frontal_m = Math.round(distancia_ponderada_frontal_m * 100) / 100.0;
	distancia_ponderada_lateral_m = Math.round(distancia_ponderada_lateral_m * 100) / 100.0;

	if(p_distancia_f_m.x > abcF[2].x) 
		distancia_ponderada_frontal_m*=(-1.0);
	if(p_distancia_l_m.x > abcL[2].x) 
		distancia_ponderada_lateral_m*=(-1.0);

	
	/******************************************************************************************************/
	var d0 = distancia_ponderada_lateral_m;		// distancia_ponderada_frontal_m --> base_izquierda_l
 	var d1 = distancia_ponderada_frontal_m;		// distancia_ponderada_frontal_M --> base_derecha_l
	var d2 = distancia_ponderada_lateral_M;		// distancia_ponderada_lateral_m --> lateral_izquierdo_f
	var d3 = distancia_ponderada_frontal_M;		// distancia_ponderada_lateral_M --> lateral_derecho_f

	/********************************************************************************************************
					  FRONTAL 							  LATERAL
		
						d1 									d0
					------------						-----------
			  d0   /____________\ d2	  <==>		   /	 |		\
   				  /				 \				  d3  /		 |		 \ d1
   				 /________________\					 /_______|________\
						d3									d2
			
	/*********************************************************************************************************/

	//					FRONTAL (d0, d2)
	//	segmento de referencia de medidas
	var p_c_aux = {x: abcF[2].x+1, y:  abcF[2].y - 18};

	var p_referencia0 = {x: abcF[2].x, y: abcF[2].y - d0}; 
	var p_referencia2 = {x: abcF[2].x, y: abcF[2].y - d2}; 

	var recta_paralela_18 = RectaDosPuntos(p_c_aux, abcF[1]);
	var p_bc0 = PuntoDeCorte(ParalelaPunto(recta_paralela_18, p_referencia0), RectaDosPuntos(abcF[1], abcF[2]));
	var p_bc2 = PuntoDeCorte(ParalelaPunto(recta_paralela_18, p_referencia2), RectaDosPuntos(abcF[1], abcF[2]));

	//Punto de corte de la base mayor con la recta que pasa por p_bc0 y fugaF[0]. Idem con p_bc2
	var corte_BASE_0 = PuntoDeCorte(limite_F[3], RectaDosPuntos(fugaF[0], p_bc0));
	var corte_BASE_2 = PuntoDeCorte(limite_F[1], RectaDosPuntos(fugaF[0], p_bc2));
	
	//Punto de corte en el lateral izquierdo (fugasF[0]-corte_BASES_0) y lateral derecho (fugasF[2]-corte_BASES_2)
	var corte_LATERAL_0 = PuntoDeCorte(limite_F[0], RectaDosPuntos(fugaF[1], corte_BASE_0));
	var corte_LATERAL_2 = PuntoDeCorte(limite_F[2], RectaDosPuntos(fugaF[1], corte_BASE_2));

	frameF.drawLine(new cv.Point2(corte_LATERAL_0.x, corte_LATERAL_0.y), new cv.Point2(corte_LATERAL_2.x, corte_LATERAL_2.y), cv.Vec( 255, 222, 0 ),1);

	//Punto de corte con la perpendicular del balon en el campo Frontal.
	var corte_balon_frontal = PuntoDeCorte(RectaDosPuntos(corte_LATERAL_0, corte_LATERAL_2), perp_F);
	var corte_balon_bc_F = PuntoDeCorte(RectaDosPuntos(corte_balon_frontal, fugaF[0]), RectaDosPuntos(abcF[1], abcF[2]));
	var corte_ponderado_18 = PuntoDeCorte(ParalelaPunto(recta_paralela_18, corte_balon_bc_F), RectaDosPuntos(abcF[2], p_c_aux));

	var distancia_bc_frontal_ponderada = DistanciaPuntos(corte_ponderado_18, abcF[2]);

	if(corte_balon_bc_F.x > abcF[2].x)
		distancia_bc_frontal_ponderada *=(-1);

	var distancia_bc_frontal_real = (distancia_bc_frontal_ponderada*9)/18;

	distancia_bc_frontal_real = Math.round(distancia_bc_frontal_real * 100) / 100.0;
	
	//		LATERAL (d1, d3);
	p_c_aux = {x: abcL[2].x+1, y:  abcL[2].y - 9};

	var p_referencia1 = {x: abcL[2].x, y: abcL[2].y - d3}; 
	var p_referencia3 = {x: abcL[2].x, y: abcL[2].y - d1};

	var recta_paralela_9 = RectaDosPuntos(p_c_aux, abcL[1]);
	var p_bc1 = PuntoDeCorte(ParalelaPunto(recta_paralela_9, p_referencia1), RectaDosPuntos(abcL[1], abcL[2]));
	var p_bc3 = PuntoDeCorte(ParalelaPunto(recta_paralela_9, p_referencia3), RectaDosPuntos(abcL[1], abcL[2]));

	//Punto de corte de la base mayor con la recta que pasa por p_bc1 y fugaL[0]. Idem con p_bc3
	var corte_BASE_1 = PuntoDeCorte(limite_L[1], RectaDosPuntos(fugaL[0], p_bc1));
	var corte_BASE_3 = PuntoDeCorte(limite_L[3], RectaDosPuntos(fugaL[0], p_bc3));

	//Punto de corte en el lateral izquierdo (fugasF[0]-corte_BASES_0) y lateral derecho (fugasF[2]-corte_BASES_2)
	var corte_LATERAL_1 = PuntoDeCorte(limite_L[0], RectaDosPuntos(fugaL[2], corte_BASE_1));
	var corte_LATERAL_3 = PuntoDeCorte(limite_L[2], RectaDosPuntos(fugaL[2], corte_BASE_3));

	frameL.drawLine(new cv.Point2(corte_LATERAL_1.x, corte_LATERAL_1.y), new cv.Point2(corte_LATERAL_3.x, corte_LATERAL_3.y), cv.Vec( 255, 222, 0 ),1);

	//Punto de corte con la perpendicular del balon en el campo lateral.
	var corte_balon_lateral = PuntoDeCorte(RectaDosPuntos(corte_LATERAL_1, corte_LATERAL_3), perp_L);
	var corte_balon_bc_L = PuntoDeCorte(RectaDosPuntos(corte_balon_lateral, fugaL[0]), RectaDosPuntos(abcL[1], abcL[2]));
	var corte_ponderado_9 = PuntoDeCorte(ParalelaPunto(recta_paralela_9, corte_balon_bc_L), RectaDosPuntos(abcL[2], p_c_aux));

	var distancia_bc_lateral_ponderada = DistanciaPuntos(corte_ponderado_9, abcL[2]);

	if(corte_balon_bc_L.x > abcL[2].x)
		distancia_bc_lateral_ponderada*=(-1);

	var distancia_bc_lateral_real = (distancia_bc_lateral_ponderada*18)/9;

	distancia_bc_lateral_real = Math.round(distancia_bc_lateral_real * 100) / 100.0;

	corte_balon_lateral.x = Math.round(corte_balon_lateral.x);
	corte_balon_lateral.y = Math.round(corte_balon_lateral.y);
	corte_balon_frontal.x = Math.round(corte_balon_frontal.x);
	corte_balon_frontal.y = Math.round(corte_balon_frontal.y);


	/******************************************************************************
									ALTURA DEL BALON.

	//	Calculo la altura en el plano frontal, luego en el 
	//	plano lateral y hago la media para minimizar el error.
	********************************************************************************/

	var paralela_baseMayor_p = ParalelaPunto(limite_F[3], corte_balon_frontal);
	var p1 = PuntoDeCorte(limite_F[0], paralela_baseMayor_p);
	var p2 = PuntoDeCorte(limite_F[2], paralela_baseMayor_p);
	var dist_p12 = DistanciaPuntos(p1, p2);
	var dist_high_low_f = DistanciaPuntos(corte_balon_frontal, ball_frontal);

	var dist_ponderada_1 = (dist_high_low_f*9)/dist_p12;

	var paralela_basemenor_p = ParalelaPunto(limite_F[1], corte_balon_frontal);
	p1 = PuntoDeCorte(limite_F[0], paralela_basemenor_p);
	p2 = PuntoDeCorte(limite_F[2], paralela_basemenor_p);
	dist_p12 = DistanciaPuntos(p1, p2);
	
	var dist_ponderada_2 = (dist_high_low_f*9)/dist_p12;

	var paralela_baseMayor_p = ParalelaPunto(limite_L[3], corte_balon_lateral);
	p1 = PuntoDeCorte(limite_L[0], paralela_baseMayor_p);
	p2 = PuntoDeCorte(limite_L[2], paralela_baseMayor_p);
	dist_p12 = DistanciaPuntos(p1, p2);
	var dist_high_low_l = DistanciaPuntos(corte_balon_lateral, ball_lateral);

	var dist_ponderada_3 = (dist_high_low_l*18)/dist_p12;

	var paralela_basemenor_p = ParalelaPunto(limite_L[1], corte_balon_lateral);
	p1 = PuntoDeCorte(limite_L[0], paralela_basemenor_p);
	p2 = PuntoDeCorte(limite_L[2], paralela_basemenor_p);
	dist_p12 = DistanciaPuntos(p1, p2);
	dist_high_low_l = DistanciaPuntos(corte_balon_lateral, ball_lateral);

	var dist_ponderada_4 = (dist_high_low_l*18)/dist_p12;
	var media_alturas = (dist_ponderada_1+dist_ponderada_2+dist_ponderada_3+dist_ponderada_4)/4;
	var media = Math.round(media_alturas*100)/100;

	/******************************************************************************/

	var solucion_xyz = {x: distancia_bc_frontal_real, y: distancia_bc_lateral_real, z: media};

	return solucion_xyz;
}



function PuntosDeFuga(puntos_campo){

    var rectas_campo = [];
    var fugas = [];
    var diagonal1, diagonal2;
    var auxiliar_fugas;


    for(var i=0; i<4; i++)
        rectas_campo.push(RectaDosPuntos(puntos_campo[i], puntos_campo[(i+1)%4]));

    diagonal2 = RectaDosPuntos(puntos_campo[0], puntos_campo[2]);
    diagonal1 = RectaDosPuntos(puntos_campo[1], puntos_campo[3]);

    fugas.push(PuntoDeCorte(rectas_campo[0], rectas_campo[2]));
    
    var p1, p2;
    p1 = {
    	x:0.0,
    	y: 0.0
    }
    p2 = {
    	x:4.0,
    	y: 0.0
    }

    /*
    Triangulo formado por puntos_campo[0], fugas[0], puntos_campo[3]
    */
    var rr = PerpendicularPunto(rectas_campo[3], fugas[0]);
    var aa = PerpendicularPunto(rr, fugas[0]);

    auxiliar_fugas = ParalelaPunto(aa, fugas[0]);

    fugas.push(PuntoDeCorte(auxiliar_fugas, diagonal1));
    fugas.push(PuntoDeCorte(auxiliar_fugas, diagonal2));

    fugas.push(PuntoDeCorte(diagonal1, diagonal2));
    
    //Recta perpendicular a rectas_campo[3] que pasa por fugas[0]
    var perpendicular_aux = PerpendicularPunto(rectas_campo[3], fugas[0]);
    fugas.push(PuntoDeCorte(rectas_campo[3], perpendicular_aux));

    return fugas;
}

function ABC(puntos_campo){

    var rectas_campo = [];
    var fugas = [];
    var abc = []; //SOLUCION
    var diagonal1, diagonal2;
    var auxiliar_fugas;
    var r, t;
    var a, b, c;
    var error = 1, margen;
    var ab, ac;
    var contador = 0;    
    var err = false;
    var err_aux = false;

    for(var i=0; i<4; i++)
        rectas_campo.push(RectaDosPuntos(puntos_campo[i%4], puntos_campo[(i+1)%4]));

    fugas = PuntosDeFuga(puntos_campo);

    //Recta que contiene a A.
    r = RectaDosPuntos(fugas[0], fugas[3]);
    
    a = {
    	x: 0,
    	y: fugas[0].y - 50
    }
    a.x = (a.y - r.k)/r.m;

    //b, c, t

    t = ParalelaPunto(rectas_campo[1], a);
    b = PuntoDeCorte(rectas_campo[2], t);
    c = PuntoDeCorte(rectas_campo[0], t);

    ab = DistanciaPuntos(a,b);
    ac = DistanciaPuntos(a,c);

    error = Math.abs(ab - ac);
    margen = 0.1;

    while(error > 0.00001){
        if(ab > ac){
            b.y+=margen;
            err = false;
        }
        else{
            b.y-=margen;
            err = true;
        }

        b.x = (b.y - rectas_campo[2].k)/rectas_campo[2].m;
        t = RectaDosPuntos(a, b);
        c = PuntoDeCorte(t, rectas_campo[0]);

        ab = DistanciaPuntos(a,b);
        ac = DistanciaPuntos(a,c);

        error = Math.abs(ab - ac);
        
        if(error > 10)
            margen = Math.abs(error/4.0);
        else{
            if(contador < 10)
                margen = 0.01;
            else
                margen = margen/2.0;
        }

        if(err_aux != err){
            contador ++;
            err_aux = err;
        }

    }

    abc.push(a);
    abc.push(b);
    abc.push(c);

    return abc;
}



function ParalelaPunto(r, p){
    var nueva_recta;
    var k1 = -1*(r.m*p.x) + p.y;

    nueva_recta = ({m: r.m, k: k1});
    return nueva_recta;
}

function PuntoDeCorte(r, s){
    var puntoCorte;
    var x_, y_;
     
    x_ = ((r.k - s.k)/(s.m - r.m));
    y_ = x_*r.m + r.k;
    puntoCorte = {x: x_, y: y_};

    return puntoCorte;
}

function RectaDosPuntos(p1, p2){
    var nueva_recta;
    var m_, k_;

    m_ = (p2.y - p1.y) / (p2.x-p1.x);
    k_ =  -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y;
    nueva_recta = {m: m_, k:k_};

    return nueva_recta;
}


function DistanciaPuntos(p1, p2){
    var d = Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));

    return d;
}


function PerpendicularPunto(r, p){
	var nueva_recta = {
		m: (-1.0)/(1.0*r.m),
		k: 0
	}
    nueva_recta.k = -1.0*nueva_recta.m*p.x + p.y;
    
    return nueva_recta;
}


function PuntoDistanciaRecta(p, r, distancia, direccion){

    //direccion = 1 --> punto a la izquierda de p
    //direccion = 0 --> punto a la derecha de p

    var solucion = {x:-1, y:-1};

    var A, B, C, x1, x2, raiz;
    var xaux;

    A = 1+(r.m*r.m);
    B = (-2*p.x) + (2*r.m*r.k) - (2*p.y*r.m);
    C = (p.x*p.x) + (r.k*r.k) + (p.y*p.y) - (2*p.y*r.k) - (distancia*distancia);

    raiz = Math.sqrt(B*B - 4*A*C);

    x1 = (-1*B + raiz)/(2*A);
    x2 = (-1*B + raiz)/(2*A);

    if((x2 < x1)){
        xaux = x1;
        x1 = x2;
        x2 = xaux;
    }
    
    if(direccion%2 == 0)
        solucion.x = x2;
    else
        solucion.x = x1;

    solucion.y = solucion.x*r.m + r.k;

    return solucion;
}


function DistanciaPuntos3D(a, b){

    var ax = a, az=a, bx=b, bz=b;
    var dist_x, dist_z, solucion;

    ax.x = a.x;
    ax.y = a.y;
    az.x = a.z;
    az.y = a.y;

    bx.x = b.x;
    bx.y = b.y;
    bz.x = b.z;
    bz.y = b.y;

    dist_x = DistanciaPuntos(ax, bx);
    dist_z = DistanciaPuntos(az, bz);

    solucion = Math.sqrt(dist_z*dist_z + dist_x*dist_x);

    return solucion;

}


function Velocidad2Puntos(a, b){

    var distancia = DistanciaPuntos3D(a, b);
    var dif_tiempo = a.tiempo - b.tiempo;
    var velocidad = distancia/dif_tiempo;

    var v = Math.round(velocidad*100)/100; 
    
    return v;
}


function ShowFieldPoint(mat, p3D){

}

function DrawGameField(mat, p, long_9){
	var p0 = p;
	var p1 = {x: p0.x+2*long_9, y:p0.y};
	var p2 = {x: p0.x+2*long_9, y:p0.y+long_9};
	var p3 = {x: p0.x, y:p0.y+long_9};
	var un_metro = long_9/9;

	//Limites exteriores
	mat.drawLine(new cv.Point2(p0.x, p0.y), new cv.Point2(p1.x, p1.y), cv.Vec( 100, 200, 30 ),2);
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 100, 200, 30 ),2);
	mat.drawLine(new cv.Point2(p2.x, p2.y), new cv.Point2(p3.x, p3.y), cv.Vec( 100, 200, 30 ),2);
	mat.drawLine(new cv.Point2(p3.x, p3.y), new cv.Point2(p0.x, p0.y), cv.Vec( 100, 200, 30 ),2);

	//Recta de medio campo
	p1 = {x: p0.x+long_9, y:p0.y};
	p2 = {x: p0.x+long_9, y:p0.y+long_9};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 100, 200, 30 ),1);

	//Linea de 3 metros
	//Campo izquierda
	p1 = {x: p0.x+2*(long_9/3), y:p0.y};
	p2 = {x: p0.x+2*(long_9/3), y:p0.y+long_9};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 100, 200, 30 ),1);

	//Campo derecha
	p1 = {x: p0.x+4*(long_9/3), y:p0.y};
	p2 = {x: p0.x+4*(long_9/3), y:p0.y+long_9};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 100, 200, 30 ),1);

	//Lineas exteriores de remate (1)
	p1 = {x: p.x+6*un_metro, y:p.y};
	p2 = {x: p.x+6*un_metro, y:p.y-un_metro*1.75};
	p3 = {x: p.x, y:p.y-un_metro*1.75};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	mat.drawLine(new cv.Point2(p3.x, p3.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);

	p1 = {x: p.x+12*un_metro ,y: p.y};
	p2 = {x: p.x+12*un_metro, y:p.y-un_metro*1.75};
	p3 = {x: p.x+long_9*2, y:p.y-un_metro*1.75};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	mat.drawLine(new cv.Point2(p3.x, p3.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);

	p1 = {x: p.x+6*un_metro, y: p.y+long_9};
	p2 = {x: p.x+6*un_metro, y: p.y+long_9+1.75*un_metro};
	p3 = {x: p.x, y: p.y+long_9+1.75*un_metro};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	mat.drawLine(new cv.Point2(p3.x, p3.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);

	p1 = {x: p.x+12*un_metro, y: p.y+long_9};
	p2 = {x: p.x+12*un_metro, y: p.y+long_9+1.75*un_metro};
	p3 = {x: p.x+18*un_metro, y: p.y+long_9+1.75*un_metro};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	mat.drawLine(new cv.Point2(p3.x, p3.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);


	p1 = {x: p.x+18*un_metro + 6*un_metro, y: p.y};
	p2 = {x: p.x+18*un_metro + 6*un_metro, y: p.y+long_9};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);

	//La linea medirá 8 metros de altura proporcional

	p1 = {x: p.x+18*un_metro-15 + 6*un_metro, y: p.y+long_9};
	p2 = {x: p.x+18*un_metro + 6*un_metro, y: p.y+long_9};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	mat.putText("0m", new cv.Point2(p2.x + 10,p2.y), 1, 1);


	//Altura de red 2.24 metros (femenino)
	var altura_red = (long_9/8)*2.24;

	p1 = {x: p.x+18*un_metro-15 + 6*un_metro, y: p.y+long_9-altura_red};
	p2 = {x: p.x+18*un_metro + 6*un_metro, y: p.y+long_9-altura_red};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	p2 = {x: p.x+18*un_metro + 6*un_metro, y: p.y+long_9-altura_red+15};
	mat.putText("2.24m", new cv.Point2(p2.x + 10, p2.y), 1, 1);

	//Altura de red 2.43 metros (masculino)
	altura_red = (long_9/8)*2.43;

	p1 = {x: p.x+18*un_metro-15 + 6*un_metro, y: p.y+long_9-altura_red};
	p2 = {x: p.x+18*un_metro + 6*un_metro, y: p.y+long_9-altura_red};
	mat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 200, 200, 30 ),1);
	mat.putText("2.43m", new cv.Point2(p2.x + 10, p2.y), 1, 1);


}


function DrawBallInGameField(fieldMat, p0_0, m_9, coordenadas4D, indice){

		var i_loop = indice;
		var punto = {x:0, y:0};
		var last = coordenadas4D.length-1;
		var altura = 0;
		var TAB = "     ";
		var cx, cy, cz;
		var altura_red = 0;
		var p1 = {x:0, y:0};
		var p2 = {x:0, y:0};
		var info = "";

		if(indice > coordenadas4D.length)
			i_loop = coordenadas4D.length;

		for(var i=0; i<i_loop; i++){
			punto = {
						x: coordenadas4D[last-i].y,
						y: coordenadas4D[last-i].x 
					}
			punto.x = (m_9/9)*punto.x;
			punto.y = (2*m_9/18)*punto.y;

			punto.x+=p0_0.x;
			punto.y+=p0_0.y;

			var color = new cv.Vec3(50*(i+1), 50*(i+1), 50*(i+1));
			altura = coordenadas4D[last-i].z * 2.5;

			fieldMat.drawCircle(new cv.Point2(punto.x,punto.y), altura, color, -1);

			cx = coordenadas4D[last-i].x;
			cy = coordenadas4D[last-i].y
			cz = coordenadas4D[last-i].z;

			if(cx < 0)
				cx = Math.round(cx * 10) / 10.0;
			if(cy < 0)
				cy = Math.round(cy * 10) / 10.0;
			if(cz < 0)
				cz = Math.round(cz * 10) / 10.0;

			info = i + TAB + cx + TAB + cy  + TAB + cz + TAB;
			fieldMat.putText(info, new cv.Point2(p0_0.x,p0_0.y + 300 + i*15), 1, 1);

		}

		//Pintar altura del balón en una recta vertical
		//a la derecha del campo
		//Altura del balón
		cz = coordenadas4D[last].z;
		altura_red = (m_9/8)*cz;
		un_metro = m_9/9;

		info = ""+cz+"m";
		if(cz < 8){
			p1 = {x: p0_0.x+18*un_metro-65 + 6*un_metro, y: p0_0.y+m_9-altura_red};
			p2 = {x: p0_0.x+18*un_metro + 6*un_metro, y: p0_0.y+m_9-altura_red};
			fieldMat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 50, 50, 50 ),1);
			fieldMat.putText(info, new cv.Point2(p2.x - 60,p2.y-3), 1, 1);
		}
		else{
			p1 = {x: p0_0.x+18*un_metro + 6*un_metro, y: p0_0.y-5};
			p2 = {x: p0_0.x+18*un_metro + 6*un_metro, y: p0_0.y-30};
			fieldMat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 50, 50, 50 ),1);
			p1 = {x: p0_0.x+18*un_metro + 6*un_metro -5, y: p0_0.y-10};
			fieldMat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 50, 50, 50 ),1);
			p1 = {x: p0_0.x+18*un_metro + 6*un_metro +5, y: p0_0.y-10};
			fieldMat.drawLine(new cv.Point2(p1.x, p1.y), new cv.Point2(p2.x, p2.y), cv.Vec( 50, 50, 50 ),1);
			fieldMat.putText(info, new cv.Point2(p2.x + 30,p2.y), 1, 1);
		}
}
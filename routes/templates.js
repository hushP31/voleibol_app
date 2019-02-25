
var Critery;
var Template;
var Descriptor;

exports.setModelCritery = function(model){
	Critery = model;
};

exports.setModelTemplate = function(model){
	Template = model;
};

exports.setModelDescriptor = function(model){
	Descriptor = model;
}

exports.setModelVideo = function(model){
	Video = model;
};

exports.setModelChampionship = function(model){
	Championship = model;
};


exports.index = function(req, res){
	if(req.session.user){
		Template.find({}, function(error, templates){
			if(error){
				res.send('It has emerged an error in to find templates');
			}
			else{
				Critery.find({}, function(err, criteries){
					if(err)
						res.send("It has emerged an error in to find criteries");
					else{
						Descriptor.find({}, function(errs, descriptors){
							if(errs)
								res.send("It has emerged an error in to find descriptors");
							else{
								var str_criteries = "";
								var str_descriptors = "";
								var templates_complete = [];
								for(var i=0; i<templates.length; i++){
									str_descriptors = "";
									str_criteries = "";

									for(var j=0; j<templates[i].list_criteries.length; j++)
										str_criteries+= " " + templates[i].list_criteries[j].name;

									for(var j=0; j<templates[i].list_descriptors.length; j++)
										str_descriptors+= " " + templates[i].list_descriptors[j].name;
									
									templates_complete.push({t: templates[i], str_c: str_criteries, str_d: str_descriptors});
								}


								var c = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
								res.render('website/templates/index', { templates: templates, allcriteries: criteries, alldescriptors: descriptors, characters: c , templates_complete: templates_complete});
							}
						})
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
  * @method addnewtemplate
  	
  * Description
	Add a new tag in Database. Name is unique.

	@param req
		It contains the information of the current session, the
		information to add in database (name tag)
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */

exports.addnewtemplate = function(req, res){
	if(req.session.user){
		var name_ = req.body.name;
		var description_ = req.body.description;
		var criterios_ = req.body.criteries;
		var descriptors_ = req.body.descriptors;
		var letras = [];
		var t_criterios = [];
		var t_descriptores = [];

		for(var i=0; i<criterios_.length; i++){
			letras.push(criterios_[i].letra);
		}

		for(var i=0; i<criterios_.length; i++){
			Critery.findById(criterios_[i].id, function(err, criterioi){
				if(err){
					console.log(err);
				}
				else{
					t_criterios.push(criterioi);
				}
			});
		}


		for(var j=0; j<descriptors_.length; j++){
			Descriptor.findById(descriptors_[j].id, function(err, descriptorj){
				if(err) console.log(err);
				else{
					t_descriptores.push(descriptorj);
				}
			});
		}

		var template = new Template({
								name: name_,
								description: description_,
								list_criteries: t_criterios,
								list_keyaccess: letras,
								list_descriptors: t_descriptores
							});
		
		Template.findOne({ name: req.body.name }, function(error, document1){
				if(document1 != null){
					console.log("Existe plantilla")
					res.json({status: 'false', error_name: 'true'});
				}
				else{
					template.save(function(error, document){
						if(error){
							console.log(error);
							res.json({status: 'false', error: 'true'});
						}
						else{
							console.log("Template almacenado con exito " + document.name);
							res.json({ status: 'true', id: document._id });
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
  * @method updatetemplate
  	
  * Description
	Find the current tag by its id, and updates the data
	previously entered in the form. The name must be unique
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */

exports.updatetemplate = function(req, res){

};

/**
  * @method deletetemplate
  	
  * Description
	Removes a tag on the system
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
*/

exports.deletetemplate = function(req, res){
	if(req.session.user){
		var id = req.body.id;
		//console.log("id es: " + idaux);
		//video.analysis[i].name
		//Buscar si algún vidoe lo está usando
		Template.findById(id, function(err, myTemp){
			if(err){
				throw err;
				res.json({status: 'false', err: err});
			}
			else{
				var nameT = myTemp.name;
				console.log(nameT);
				Video.find({}, function(err1, myvideos){
					if(err1){
						throw err1;
						res.json({status: 'false', err: err1});
					}
					else{
						var info_partido = {champ: "", match: ""};
						var info_videos = [];
						console.log("Myvideos:");
						console.log(myvideos);
						for(var i=0; i<myvideos.length; i++)
							for(var j=0; j<myvideos[i].analysis.length; j++)
								if(myvideos[i].analysis[j].name == nameT && myvideos[i].analysis[j].name){
									var info_partido = {champ: myvideos[i].championship, match:  myvideos[i].match};
									info_videos.push(info_partido);
								}

						if(info_videos.length != 0){
							Championship.find({}, function(err2, mychamps){
								if(err2){
									throw err2;
									res.json({status: 'false', err: err2});
								}
								else{
									var champs = [];
									var info_error = "\n";
									for(var i=0; i<mychamps.length; i++){
										for(var j=0; j<info_videos.length; j++)
											if(mychamps[i]._id == info_videos[j].champ){
												info_error += mychamps[i].name + ", " + info_videos[j].match + "\n";
											}
									}
									res.json({status: 'false', existe: info_error});
								}
							})
						}
						else{
							Template.remove({_id: id}, function(error){
								if(error){
									res.json({status: 'false', err: error});
								}
								else{
									res.json({ status: 'true' });
								}
							});
						}
					}
				})
			}
		})
	}
	else{
		res.redirect('/../login');
	}
};

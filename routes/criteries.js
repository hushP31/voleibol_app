
var Critery;
var Category;
var Descriptor;
var Template;
exports.setModelCritery = function(model){
	Critery = model;
};

exports.setModelCategory = function(model){
	Category = model;
};

exports.setModelDescriptor = function(model){
	Descriptor = model;
};

exports.setModelTemplate = function(model){
	Template = model;
};

/**
  * @method index
  	
  * Description
	shows all tags registered in the system

	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */

exports.index = function(req, res){
	if(req.session.user){
		Critery.find({}, function(error, criteries){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				res.render('website/criteries/index', { criteries: criteries, action: '/api/showcritery/addnewcritery'});
				//console.log("estoy en index tag");
			}
		})
	}
	else{
		res.redirect('/../login');
	}
};


exports.addnewcritery = function(req, res){
	if(req.session.user){
		var description_ = req.body.crtrydescription;
		var pre_time_ = req.body.pre_time;
		var post_time_ = req.body.post_time;
		var categories_ = [];
		var type_ = req.body.type;
		var id_time = req.body.id_critery_time;
		var name_aux = "-"
		var tiempo_ = new Critery({
						name: name_aux,
						description: "description",
						pre_time: "pre_time_",
						post_time: "post_time_",
						categories: "categories_",
						type: "type_",
						type_time: false,
						time_critery: "tiempo_"
					});

		Descriptor.findOne({ name: req.body.name }, function(err1, descriptor1){
			if(descriptor1 != null){
				res.json({status: 'false', error_name: 'true'});
			}
			else{
				var critery = new Critery({
						name: req.body.name,
						description: description_,
						pre_time: pre_time_,
						post_time: post_time_,
						categories: categories_,
						type: type_,
						type_time: false,
						time_critery: tiempo_
					});
		
				Critery.findOne({ name: req.body.name }, function(error, document1){
					if(document1 != null){
						res.json({status: 'false', error_name: 'true'});
					}
					else{
						if(id_time != -1){
							Critery.findById(id_time, function(err, tiempo){
								if(err)
									throw err;
								else{
									critery = new Critery({
													name: req.body.name,
													description: description_,
													pre_time: pre_time_,
													post_time: post_time_,
													categories: categories_,
													type: type_,
													type_time: true,
													time_critery: tiempo
												});
									critery.save(function(error, document){
										if(error){
											res.json({status: 'false', error: 'true'});
										}
										else{
											console.log("Almacenado con exito" + document._id);
											res.json({ status: 'true', id: document._id });
										}
									});	
								}
							});	
						}
						else{
							critery.save(function(error, document){
								if(error){
									res.json({status: 'false', error: 'true'});
								}
								else{
									console.log("Almacenado con exito" + document._id);
									res.json({ status: 'true', id: document._id });
								}
							});	
						}
						
					}			
				});

			}
		});

			
	}
	else{
		res.redirect('/../login');
	}
};


exports.show = function(req, res){
	if(req.session.user){
		Critery.findById(req.params.id, function(error, document1){
					if(error){
						res.send('Error while trying to show the critery.');
					}
					else{
						var categories_ = document1.categories;
						res.render('website/criteries/show', { critery: document1, categories: categories_ });
					}
		});
	}		
	else{
		res.redirect('/../login');
	}		
};


exports.updatecriteries = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var name = req.body.name;
		var pre = req.body.pre;
		var post = req.body.post;
		var description = req.body.ctgrydescription;
		var id = req.body.idcritery;
			
		Critery.findById(id, function(err, criterio){
			if(err)
				throw err;
			else{
				if(criterio.name == name){
					Critery.update( { '_id' : id }, { $set: { 'name': name, 'description': description, 'pre_time': pre, 'post_time': post } }, function (err, result) {
						if (err) throw err;
						
						console.log(result);
						res.json({status:'true', name: name });
					});
				}
				else{
					Critery.findOne({ name: name }, function(error, document1){
						if(document1 == null){
							Critery.update( { '_id' : id }, { $set: { 'name': name, 'description': description, 'pre_time': pre, 'post_time': post } }, function (err, result) {
									if (err) throw err;
									
									console.log(result);
									res.json({status:'true', name: name });
							});
						}
						else{
							res.json({status:'true', error_name: 'true'});
						}
					});
				}
			}
		});
	}		
	else{
		res.redirect('/../login');
	}		
};


exports.deletecriteries = function(req, res){
	if(req.session.user){
		var id = req.body.id;
		var nameCritery = req.body.namec;
		//console.log("id es: " + idaux);

		Template.find({}, function(err1, mytemps){
			if(err1){
				throw err1;
				res.json({status: 'false', error: err1});
			}
			else{
				var names_templates = [];
				var namesT = "\n";
				for(var i=0; i<mytemps.length; i++){
					for(var j=0; j<mytemps[i].list_criteries.length; j++)
						if(mytemps[i].list_criteries[j].name == nameCritery){
							names_templates.push(mytemps[i].name);
							namesT += mytemps[i].name + "\n";
						}
				}

				if(names_templates.length != 0){
					res.json({status: 'false', existe: namesT});
				}
				else{
					Critery.remove({_id: id}, function(error){
						if(error){
							res.json({status: 'false'});
						}
						else{
							Critery.find({}, function(error, criteries){
								if(error){
									res.send('It has emerged an error');
								}
								else{
									res.render('website/criteries/index', { criteries: criteries });
									//console.log("estoy en index tag");
								}
							});
						}
					});
				}
			}
		})
	}
	else{
		res.redirect('/../login');
	}
};
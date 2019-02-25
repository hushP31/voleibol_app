
var Descriptor;
var Category;
var Critery;
var Template;
exports.setModelDescriptor = function(model){
	Descriptor = model;
};

exports.setModelCritery = function(model){
	Critery = model;
};

exports.setModelCategory = function(model){
	Category = model;
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
		Descriptor.find({}, function(error, descriptors){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				var indice = -1;
				var key = [];
				var no_key = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
				
				for(var i=0; i<descriptors.length; i++){
					key.push(descriptors[i].keyaccess);
					for(var j=0; j<no_key.length; j++)
						if(key[i] == no_key[j]) indice = j;
					if(indice != -1)
						no_key.splice(indice, 1);
					indice = -1;
				}
				console.log(key + ", no key: " + no_key);

				res.render('website/descriptors/index', { descriptors: descriptors, keys: no_key, action: '/api/showdescriptors/addnewdescriptors'});
				//console.log("estoy en index tag");
			}
		})
	}
	else{
		res.redirect('/../login');
	}
};


exports.addnewdescriptor = function(req, res){
	if(req.session.user){
		var description_ = req.body.dscrptrdescription;
		var key = req.body.keyaccess;
		var categories_ = [];

		Critery.findOne({ name: req.body.name }, function(err1, critery){
			if(critery != null){
				res.json({status: 'false', error_name: 'true'});
			}
			else{
				var descriptor = new Descriptor({
						name: req.body.name,
						description: description_,
						keyaccess: key,
						categories: categories_
					});
		
				Descriptor.findOne({ name: req.body.name }, function(error, document1){
						if(document1 != null){
							res.json({status: 'false', error_name: 'true'});
						}
						else{
							descriptor.save(function(error, document){
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
		});
	}
	else{
		res.redirect('/../login');
	}
};


exports.show = function(req, res){
	if(req.session.user){
		Descriptor.findById(req.params.id, function(error, document1){
					if(error){
						res.send('Error while trying to show the descriptor.');
					}
					else{
						var categories_ = document1.categories;
						res.render('website/descriptors/show', { descriptor: document1, categories: categories_ });
					}
		});
	}		
	else{
		res.redirect('/../login');
	}		
};


exports.updatedescriptor = function(req, res){
	if(req.session.user){
		//Buscar descriptor
		var name = req.body.name;
		var description = req.body.descripdescription;
		var id = req.body.iddescriptor;
		
		//Busco por ID
		//	Es el mismo nombre? --> SI, actualizo la descirpcion
		// 						--> No, compruebo que el nombre no se repita y actualizo todo

		Descriptor.findById(id, function(err, descriptor1){
			if(err) 
				throw err
			else{
				if(name == descriptor1.name){
					Descriptor.update( { '_id' : id }, { $set: { 'name': name, 'description': description} }, function (err, result) {
						if (err) 
							throw err;
						else{
							console.log("actualizacion correcta " + result);
							res.json({status:'true', name: name });
						}
					});
				}
				else{
					Descriptor.findOne({ name: name }, function(error, descriptor2){
						if(descriptor2 == null){
							Descriptor.update( { '_id' : id }, { $set: { 'name': name, 'description': description } }, function (err, result) {
									if (err) 
										throw err;
									else{
										console.log(result);
										res.json({status:'true', name: name });
									}
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


exports.deletedescriptor = function(req, res){
	if(req.session.user){
		var id = req.body.id;
		var nameDescriptor = req.body.named
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
					for(var j=0; j<mytemps[i].list_descriptors.length; j++)
						if(mytemps[i].list_descriptors[j].name == nameDescriptor){
							names_templates.push(mytemps[i].name);
							namesT += mytemps[i].name + "\n";
						}
				}

				if(names_templates.length != 0){
					res.json({status: 'false', existe: namesT});
				}
				else{
					Descriptor.remove({_id: id}, function(error){
						if(error){
							res.json({status: 'false'});
						}
						else{
							Descriptor.find({}, function(error, descriptors){
								if(error){
									res.send('It has emerged an error');
								}
								else{
									res.render('website/descriptors/index', { descriptors: descriptors });
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
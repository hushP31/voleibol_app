
var Tag;
exports.setModelTag = function(model){
	Tag = model;
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
		Tag.find({}, function(error, tags){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				var c = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
				var types_tags = ["number", "text", "team", "par"];
				res.render('website/tags/index', { tags: tags, action: '/api/showtags/addnewtag', caracteres: c, typesTags: types_tags});
				//console.log("estoy en index tag");
			}
		})
	}
	else{
		res.redirect('/../login');
	}
};


/**
  * @method addnewtag
  	
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

exports.addnewtag = function(req, res){
	if(req.session.user){
		var shorcut_ = "MAY + " + req.body.shortcut; 
		var description_ = req.body.tagdescription;
		var typetag_ = req.body.tagtype;

		var tag = new Tag({
						name: req.body.name,
						shortcut: shorcut_,
						description: description_,
						typeTag: typetag_
					});
		//var error_name;
		var name_aux = req.body.name;
		console.log("El nombre es: " + req.body.name + " " + description_ + " " + typetag_);

		Tag.findOne({ name: req.body.name }, function(error, document1){
				if(document1 != null){
					res.json({status: 'false', error_name: 'true'});
				}
				else{
					Tag.findOne({ shortcut: shorcut_ }, function(error, document2){
						if(document2 != null){
							res.json({status: 'false', error_cut: 'true'});
						}
						else{
							tag.save(function(error, document){
								if(error){
									res.json({status: 'false', error: 'true'});
								}
								else{
									res.json({status: 'true', id: document._id});
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




/**
  * @method update
  	
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

exports.updatetag = function(req, res){
	if(req.session.user){
		//First: find for name. If not exists, then update name
		//console.log("El nuevo nombre es: " + req.body.name);
		var shorcut_ = "MAYUS + " + req.body.shortcut; 

		Tag.findOne({name: req.body.name}, function(error, tag){
			if(!tag){ 
				//Si no existe el nombre en el sistema. Busco el documento a actualizar
				Tag.findById(req.body.id, function(error2, tag_update){
					if(error2){
						res.json({status:'false', error: 'true', msg: "id no existe"});
					}
					else{
						Tag.findOne({ shortcut: shorcut_ }, function(error, document1){
							if(document1 != null){
								res.json({status: 'false', error_cut: 'true'});
							}
							else{
								tag_update.name = req.body.name;
								tag_update.shortcut = shorcut_;
								tag_update.save(function(error3){
									if(error3) {
										res.json({status:'false', error: 'true', msg: "Error al actualizar"});
									}
									else{
										res.json({status:'true', error: 'false', name: tag_update.name, id: tag_update._id});
									}
								});
							}
						});	
					}
				});
			}
			else{
				res.json({status:'false', error_name: 'true', msg: "Nombre existe"});
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
	Removes a tag on the system
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
*/
exports.deletetag = function(req, res){
	if(req.session.user){
		var idaux = req.body.id;
		//console.log("id es: " + idaux);
		Tag.remove({_id: req.body.id}, function(error){
			if(error){
				res.json({status: 'false'});
			}
			else{
				res.json({status: 'true', id: idaux});
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};

var Critery;
var Category;
var Descriptor

exports.setModelCritery = function(model){
	Critery = model;
};

exports.setModelCategory = function(model){
	Category = model;
};

exports.setModelDescriptor = function(model){
	Descriptor = model;
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

exports.addnewcategory = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var namecategory = req.body.namecategory;
		var descrptioncategory = req.body.ctgrydescription;
		var id_critery = req.body.idcritery;
		var n_ctgrs = 3;
		var c = [];
		
		Critery.findOne({ _id: id_critery }, function(error, document1){
			n_ctgrs = document1.categories.length + 1;
			c = document1.categories;
			//console.log("c[0].name = " + c[0].name + n_ctgrs);
			
			var category_new = new Category({
							name: namecategory,
							keyaccess: n_ctgrs,
							description: descrptioncategory
						});
			c.push(category_new);
			
			Critery.update( { '_id' : id_critery }, { $set: { 'categories': c } }, function (err, result) {
					if (err) throw err;
					
					console.log(result);
					res.json({status:'true', error: 'false', name: namecategory, keyaccess: n_ctgrs, description: descrptioncategory, id: id_critery });
			});
		});

	}		
	else{
		res.redirect('/../login');
	}		
};


exports.addnewcategoryDescriptor = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var namecategory = req.body.namecategory;
		var descrptioncategory = req.body.ctgrydescription;
		var id_descriptor = req.body.iddescriptor;
		var n_ctgrs;
		var c = [];
		console.log("Update categeories");
		Descriptor.findOne({ _id: id_descriptor }, function(error, document1){
			n_ctgrs = document1.categories.length + 1;
			c = document1.categories;
			//console.log("c[0].name = " + c[0].name + n_ctgrs);
			
			var category_new = new Category({
							name: namecategory,
							keyaccess: n_ctgrs,
							description: descrptioncategory
						});
			c.push(category_new);
			
			Descriptor.update( { '_id' : id_descriptor }, { $set: { 'categories': c } }, function (err, result) {
					if (err) throw err;
					
					console.log(result);
					res.json({status:'true', error: 'false', name: namecategory, keyaccess: n_ctgrs, description: descrptioncategory, id: id_descriptor });
			});
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

exports.deletecategoryDescriptor = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var namecategory = req.body.namecategory;
		var id_descriptor = req.body.iddescriptor;
		var keyaccess = req.body.keyaccess;
		
		console.log("Delete category descriptor");

		Descriptor.findOne({ _id: id_descriptor }, function(error, document1){
			c = document1.categories;
			
			//Se busca y elimina el elemento usando el keyaccess
			c.splice((keyaccess-1),1);

			//Se reordena los keyacces de todos los elementos
			for(var i=0; i<c.length; i++)
				c[i].keyaccess = (i+1);
			
			Descriptor.update( { '_id' : id_descriptor }, { $set: { 'categories': c } }, function (err, result) {
					if (err) throw err;
					
					console.log(result);
					res.json({status:'true', error: 'false'});
			});
		});
	}		
	else{
		res.redirect('/../login');
	}	

};

exports.updatecategoryDescriptor = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var namecategory = req.body.name;
		var descrptioncategory = req.body.descripdescription;
		var id_descriptor = req.body.iddescriptor;
		var key = req.body.key;

		var c = [];
		console.log("Update categeories");

		Descriptor.findOne({ _id: id_descriptor }, function(error, document1){
			c = document1.categories;
			//console.log("c[0].name = " + c[0].name + n_ctgrs);
			
			var indice = key-1;
			
			c[indice].name = namecategory;
			c[indice].description = descrptioncategory;
			
			Descriptor.update( { '_id' : id_descriptor }, { $set: { 'categories': c } }, function (err, result) {
					if (err) throw err;
					
					console.log(result);
					res.json({status:'true', error: 'false', name: namecategory, description: descrptioncategory, id: id_descriptor });
			});
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
exports.updatecategory = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var namecategory = req.body.name;
		var descrptioncategory = req.body.criterydescription;
		var id_critery = req.body.idcritery;
		var key = req.body.key;

		var c = [];
		console.log("Update categeories");

		Critery.findOne({ _id: id_critery }, function(error, document1){
			c = document1.categories;
			//console.log("c[0].name = " + c[0].name + n_ctgrs);
			
			var indice = key-1;
			
			c[indice].name = namecategory;
			c[indice].description = descrptioncategory;
			
			Critery.update( { '_id' : id_critery }, { $set: { 'categories': c } }, function (err, result) {
					if (err) throw err;
					
					console.log(result);
					res.json({status:'true', error: 'false', name: namecategory, description: descrptioncategory, id: id_critery });
			});
		});
	}		
	else{
		res.redirect('/../login');
	}	
};


exports.deletecategory = function(req, res){
	if(req.session.user){
		//Buscar criterio
		var namecategory = req.body.namecategory;
		var id_critery = req.body.idcritery;
		var keyaccess = req.body.keyaccess;
		
		console.log("Delete category descriptor");

		Critery.findOne({ _id: id_critery }, function(error, document1){
			c = document1.categories;
			
			//Se busca y elimina el elemento usando el keyaccess
			c.splice((keyaccess-1),1);

			//Se reordena los keyacces de todos los elementos
			for(var i=0; i<c.length; i++)
				c[i].keyaccess = (i+1);
			
			Critery.update( { '_id' : id_critery }, { $set: { 'categories': c } }, function (err, result) {
					if (err) throw err;
					
					console.log(result);
					res.json({status:'true', error: 'false'});
			});
		});
	}		
	else{
		res.redirect('/../login');
	}	
};
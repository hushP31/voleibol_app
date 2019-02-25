
var Team;
exports.setModel = function(model){
	Team = model;
};


var Championship;
exports.setModelChampionship = function(model){
	Championship = model;
};


/**
  * @method index
  	
  * Description
	shows all teams registered in the system

	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */
exports.index = function(req, res){
	if(req.session.user){
		Team.find({}, function(error, teams){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				res.render('website/teams/index', { teams: teams });
		 	}
		 });
	}
	else{
		res.redirect('/../login');
	}
};


/**
  * @method addnewteam
  	
  * Description
	This function adds a new team in the database. 
	The information to add will be name team, id team (current 
	mundial ranking) and sortname team (a three characters 
	abbreviation of name team)

	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error

*/
exports.addnewteam = function(req, res){
	if(req.session.user){
		var team = new Team({
						name: req.body.name,
						id: req.body.id,
						sortname: req.body.sortname 			
					});
		//var error_name;
		var name_aux = req.body.name;
		//console.log("El nombre es: " + req.body.name + " " + req.body.id + " " + req.body.sortname);

		Team.findOne({ name: req.body.name }, function(error, document1){
				if(document1 != null){
					res.json({status: 'false', error_name: 'true'});
				}
				else{
					//Actualizar nombre
					team.save(function(error, document){
						if(error){
							res.json({status: 'false', error: 'true'});
						}
						else{
							res.json({status: 'true', id: document._id, name: document.name, sort: document.sortname, rank: document.id });
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
	Find the current team by its id, and updates the data
	previously entered in the form.
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 exports.update = function(req, res){
		Team.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to update the team.');
			}
			else{
				var team = document;
				
				team.name = req.body.name,
				
				team.save(function(error, document){
					if(error){
						res.send('Error while trying to save the team.');
					}
					else{
						res.redirect('/api/showteams');
					}
				});
			}
		});
};
*/


/**
  * @method destroy
  	
  * Description
	Removes a team on the system
	
	@param req
		It contains the information of the current session
	@param res
		It contains the current direction

	@return res
		it redirects or reported error
 */

exports.deleteteam = function(req, res){
	if(req.session.user){
		var idaux = req.body.id;
		//console.log("id es: " + idaux);		
		//Comprobar si se encuentra en algún campeonato. Si no, eliminar. Si si, avisar y no hacer nada.
		Championship.find({}, function(err, result){
			if(err)
				throw err;
			else{
				//Buscar idteam en todos los equipos de los campeonatos
				var esta = false;
				console.log(idaux);
				var nameChamp;
				for(var i=0; i<result.length; i++)
					for(var j=0; (j<result[i].listofteams.length) && !esta; j++)
						if(result[i].listofteams[j] == idaux){
							esta = true;
							nameChamp = result[i].name;
						}

				if(!esta){
					Team.remove({_id: req.body.id}, function(error){
						if(error){
							res.json({status: false});
						}
						else{
							res.json({status: true, id: idaux});
						}
					});
				}
				else{
					res.json({status: false, id: idaux, championship: nameChamp});
				}
			}
		});
	}
	else{
		res.redirect('/../login');
	}
};
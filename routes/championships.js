

var Championship;
exports.setModelCham = function(model){
	Championship = model;
};

var Team;
exports.setModelTeam = function(model){
	Team = model;
};


var Video;
exports.setModelVideo = function(model){
	Video = model;
}

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

exports.index = function(req, res){

	if(req.session.user){
		Championship.find({}, function(error, championships){
			if(error){
				res.send('It has emerged an error');
			}
			else{
				res.render('website/championships/index', { championships: championships });
			}
		})
	}
	else{
		res.redirect('/../login');
	}
};


/**
  * @method create
  	
  * Description
		
	@param req
		
	@param res
		
	@return res
		
 */
exports.create = function(req, res){
	if(req.session.user){

		Team.find({}, function(error, teams){
			if(error){
				res.send('Error. Teams not found')
			}
			else{
				res.render('website/championships/save', {
					teams: teams,
					put: false,
					action: '/api/showchampionships',
					championship: new Championship({
							name: "",
							numberofteams: "",
							numberofmatchs: "",
							listofteams: "", 
							listofmatchs:"",
					})
				});
			}
		})
		}
	else{
		res.redirect('/../login');
	}
};

/**
  * @method store
  	
  * Description
		It is responsible for storing a new championship
	@param req
		
	@param res
		
	@return res
 */
exports.store = function(req, res){
	if(req.session.user){
		
		var listteams = new Array;
		listteams = req.body.total_teams;
		
		var nteams = listteams.length; //number of teams

		//Parings create:
		var parteams = new Array;
		var par_one = req.body.par_one;
		var par_two = req.body.par_two;
		var date_championship = req.body.date_championship;
		console.log("FECHA:" + date_championship);
		
		par_one.splice(0,1);
		par_two.splice(0,1);

		var n_matchs = par_one.length;

		for(i=0; i<par_one.length; i++){
			local = par_one[i];
			visit = par_two[i];

			var matchi = [local, visit];

			var item = {
				id : i,
				teams: matchi, //pair of teams
				video: ""
			} 
			
			var itemjs = JSON.stringify(item);
			var json_item = JSON.parse(itemjs);
			parteams.push(json_item);
		}
		var parteams_json = JSON.stringify(parteams);
		var totalparings = JSON.parse(parteams_json);

		var championship = new Championship({
						name: req.body.name,
						numberofteams: nteams,
						numberofmatchs: n_matchs,
						listofteams: listteams, 
						listofmatchs: totalparings,
						date: date_championship					
					});
		
		championship.save(function(error, document){
			if(error){
				console.log(error);
				res.send('Error while trying to save the championship.');
			}
			else{
				res.redirect('/api/showchampionships');
			}
		});
	}	
	else{
		res.redirect('/../login');
	}
};


/**
  * @method show
  	
  * Descripction
		It is responsible for search and display all the championships system
	@param req
		
	@param res

	@return res
		
 */
exports.show = function(req, res){
	if(req.session.user){
		Championship.findById(req.params.id, function(error1, championship1){
			if(error1)
				res.send('Error while trying to show the championship.');
			else{
				var teams0 = [];
				//console.log("Lista de equipos: " + championship1.listofteams[1]);

				Team.find({}, function(error2, teamF1){
					if(error2){
						res.send('Error while trying to show the championship (Team Query).');
					}
					else{

						for(var i=0; i<championship1.listofteams.length; i++)
							for(var j=0; j<teamF1.length; j++)
								if(championship1.listofteams[i] == teamF1[j]._id)
									teams0.push(teamF1[j]);
						
						//console.log("Mis equipos: " + teams0 + "\n\n");

						Video.find({"championship": req.params.id}, function(error3, videos1){
							if(error3)
								res.send('Error while trying to show the championship (Video Query).');
							else{
								//Games
								var pairs_teams = [];
								var pair = ({
									A: "",
									B: ""
								});
								var nA, nB;
								for(var i=0; i<championship1.listofmatchs.length; i++){
									for(var j=0; j<teams0.length; j++){
										if(championship1.listofmatchs[i].teams[0] == teams0[j]._id)
											nA = teams0[j].name;
										if(championship1.listofmatchs[i].teams[1] == teams0[j]._id)
											nB = teams0[j].name;
									}
									var pair = ({
											"A": nA,
											"B": nB
										});
									pairs_teams.push(pair);
								}
								res.render('website/championships/show', {championship: championship1, allteams: teams0, videos: videos1, games: pairs_teams});
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
  * @method edit
  	
  * Description
	
	@param req
		
	@param res
		

	@return res
		
 */
exports.edit = function(req, res){
	if(req.session.user){
		Championship.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to edit the championship.');
			}
			else{
				//console.log(documento + ' AQUI EL DOCUMENTO');
				res.render('website/championships/save', {
					put: true,
					action: '/api/showchampionship/' + req.params.id,
					championship: document
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
		
	@param res
		
	@return res
		
 */
exports.update = function(req, res){
	if(req.session.user){
		Championship.findById(req.params.id, function(error, document){
			if(error){
				res.send('Error while trying to update the championship.');
			}
			else{
				var championship = document;
				
				championship.name = req.body.name,
				
				championship.save(function(error, document){
					if(error){
						res.send('Error while trying to save the championship.');
					}
					else{
						res.redirect('/api/showchampionships');
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
		
	@param res
		
	@return res
		
 */
exports.destroy = function(req, res){
	if(req.session.user){
		console.log("Destruir campeonato");

		Championship.findById({_id: req.body.id}, function(err, champ){
			if(err)
				throw err;
			else{
				var n_teams = champ.listofteams.length;

				if(n_teams != 0){
					res.json({status: 'false', n_teams: n_teams});
				}
				else{
					Championship.remove({_id: req.body.id}, function(error){
						if(error){
							res.send('Error while trying to destroy the championship.');
						}
						else{
							res.json({status: 'true', n_teams: n_teams});
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

exports.addnewteamC = function(req, res){
	if(req.session.user){

		var idChampionship = req.body.idCh;

		var nameT = req.body.newteamN;
		var valT = req.body.newteamV;
		var sortT = req.body.newteamS;

		console.log(nameT +", "+ valT +", "+ sortT);

		Championship.findById(idChampionship, function(err, mycham){
			if(err) 
				res.json({status: 'false'});
			else{
				var totalteams = mycham.listofteams;
				var nteams = mycham.numberofteams;

				Team.find({"id": valT}, function(err, myteam){
					if(err){
						res.json({status: 'false'});
					}
					else{

						console.log("Nuevo team: " + myteam[0]._id + myteam[0].name);
						var auxid = ""+myteam[0]._id+"";
						var longg = auxid.length-1;
						//var aauxid = auxid.substring(longg, 9);
						console.log("\n\n" + auxid + "\n\n");
						//Buscar, si no está, annadir
						var esta = false;
						for(var k=0; k<totalteams.length; k++)
							if(totalteams[k] == auxid)
								esta = true;

						if(!esta)
							totalteams.push(auxid);

						nteams = totalteams.length;

						Championship.update( { '_id' : idChampionship }, { $set: { 'listofteams': totalteams, 'numberofteams': nteams } }, function (err, result0) {
							if (err) 
								throw err;
							else{
								console.log("actualizacion correcta " + result0);
								res.json({ status:'true', idteam: auxid, add: esta});
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
}

exports.deleteteamC = function(req, res){
	if(req.session.user){
		var idte = req.body.idteam;
		var idChampionship = req.body.idChampionship;

		Championship.findById(idChampionship, function(err1, champ){
			if(err1){
				throw err1;
			}
			else{
				var actual_teams = [];
				actual_teams = champ.listofteams;

				for(var i=0; i<actual_teams.length; i++)
					if(actual_teams[i] == idte){
						actual_teams.splice(i, 1);
						console.log("elimina");
						i--;
					}
				
				Championship.update( { '_id' : idChampionship }, { $set: { 'listofteams': actual_teams, 'numberofteams': actual_teams.length } }, function (err, result0) {
					if (err) 
						throw err;
					else{
						//console.log("actualizacion correcta");
						console.log(actual_teams);
						res.json({ status:'true' });
					}
				});
			}
		});

	}
	else
		res.redirect('/../login');
}


exports.getrestteams = function(req, res){
	if(req.session.user){
		Team.find({}, function(error, allteams){
			if(error){
				res.json('Error while trying to find teams.');
			}
			else{
				var actual_teams = [];

				for(var i=0; i<req.body.teams.length; i++){
					actual_teams.push(req.body.teams[i].toString());
				}
				var eqs = allteams;
				actual_teams.push('NUEVO');
				actual_teams.splice(actual_teams.length-1, 1);

				console.log(actual_teams);
				if(actual_teams.length < allteams.length){	
					
					//Eliminar de eqs los equipos que hay en actual_teams.
					/**********************/
					console.log("Actual: " + actual_teams);
					console.log("All teams: " + allteams);

					for(var i=0; i<allteams.length; i++)
						for(var j=0; j<actual_teams.length; j++)
							if(allteams[i].name == actual_teams[j]){
								allteams.splice(i, 1);
								i--;
								j=actual_teams.length;
							}

					console.log("\n\n" + allteams);
					/**********************/

					var eqname = [];
					var eqsort = [];
					var eqid = [];
					for(var i=0; i<allteams.length; i++){
						eqname.push(allteams[i].name);
						eqsort.push(allteams[i].sortname);
						eqid.push(allteams[i].id);
					}
					//console.log(eqname);
					//console.log(eqsort);
					
					res.json({ status:'true', teams:eqname, sort:eqsort, idteams: eqid, nteams: eqname.length});
				}
				else{
					res.json({ status:'true', nteams: 0 });
				}
			}
		});
	}
	else{
		res.redirect('/../login');
	}
}

exports.addnewgame = function(req, res){
	if(req.session.user){
		var teamA = req.body.nameA;
		var teamB = req.body.nameB;
		var idChampionship = req.body.idChamp;

		console.log(teamA + ", " + teamB);

		Team.find({"name":teamA}, function(err, eqA){
			if(err) 
				throw err;
			else{
				console.log(eqA[0]._id);
				Team.find({"name": teamB}, function(err2, eqB){
					if(err2)
						throw err2;
					else{
						console.log(eqB[0]._id);

						Championship.findById(idChampionship, function(err3, champ){
							if(err3)
								throw err3;
							else{
								var oldteams = champ.listofmatchs;
								var idA = '';
								var idB = '';
								idA += eqA[0]._id;
								idB += eqB[0]._id;

								var matchi = [idA, idB];

								var item = {
									id : oldteams.length,
									teams: matchi, //pair of teams
									video: ""
								} 

								oldteams.push(item);

								Championship.update( { '_id' : idChampionship }, { $set: { 'listofmatchs': oldteams, 'numberofmatchs': oldteams.length } }, function (err4, result0) {
									if (err4) 
										throw err4;
									else{
										console.log("actualizacion correcta " + result0);
										console.log(oldteams);

										res.json({ status:'true', idgame: item.id });
									}
								});
							}
						})
					}
				})
			}	
		})
	}
	else{
		res.redirect('/../login');
	}
	
};


exports.deletegame = function(req, res){
	if(req.session.user){
		var idChampionship = req.body.idCh;
		var index_game = req.body.indexMatch;
		var video_match = false;

		//console.log("id es: " + idaux);
		Championship.findById(idChampionship, function(error1, championship1){
			if(error1){
				res.json({status: 'false', error: 'true'});
			}
			else{

				//Busco videos del campeonato actual
				Video.find({"championship" : idChampionship}, function(error1, mivideo){
					if(error1){
						res.json({status: 'false', error: 'true'});
					}
					else{
						for(var j=0; j<mivideo.length; j++){
							if(mivideo[j].match == index_game)
								video_match = true;
						}
						if(!video_match){
							var games = championship1.listofmatchs;
							console.log(games);
							games.splice(index_game, 1);

							for(var i=index_game; i<games.length; i++){
								games[i].id --;
							}
							
							//A todos los videos del campeonato actual > index_game, restar uno.
							Video.update({"championship" : idChampionship, "match": {$gt: index_game} }, {$inc: {'match' : -1}}, function(error, result1){
								if(error){
									res.send('It has emerged an error al actualizar videos');
								}
								else{

									Championship.update( { '_id' : idChampionship }, { $set: { 'listofmatchs': games, 'numberofmatchs': games.length } }, function (err, result0) {
										if (err) 
											throw err;
										else{
											console.log("actualizacion correcta " + result0);
											console.log(games);
											res.json({ status:'true', del:'0' });
										}
									});
								}
							});
						}
						else{
							res.json({ status:'true', exist: 'video existe. Elimine video antes del partido', del:'1' });
						}
					}
				});
			}
		});
	}
	else{
		res.redirect('/../login');
	}

}


exports.delete_video_game = function(req, res){
	if(req.session.user){
		var idChampionship = req.body.idCh;
		var idvideo = req.body.iDvideo;
		var index_game = req.body.indexMatch;

		console.log(idvideo);
		var id_delete = 'ObjectId("'+idvideo+'")';
		console.log(id_delete);


		const fs = require('fs');

		Video.findById(idvideo, function(err, myvideo){
			if(err)
				throw err;
			else{
				var name_analisis = "";
				if(myvideo.analysis.length > 0){

					for(var i=0; i<myvideo.analysis.length; i++)
						name_analisis += myvideo.analysis[i].name + " ";

					res.json({msg: 'Existe analisis creados. Elimine los analisis antes de eliminar el video', names: name_analisis});
				}
				else{
					Championship.findById(idChampionship, function(err1, myChamp){
						if(err1)
							throw err1;
						else{
							var listofmatchs_n = myChamp.listofmatchs;

							var name_frontal = myvideo.name_frontal;
							var name_lateral = myvideo.name_lateral;

							fs.unlink('../../voleibol/'+myChamp._id + '/' + name_frontal+'.mp4', (err) => {
								if (err) throw err;
								else{
									fs.unlink('../../voleibol/'+myChamp._id + '/' + name_lateral+'.mp4', (err) => {
										if (err) throw err;
										else{
											Video.remove({"_id": idvideo}, function(err2, result2){
												if(err2)
													throw err2;
												else{
													listofmatchs_n[index_game].video = "";
													Championship.update( { '_id' : idChampionship }, { $set: { 'listofmatchs': listofmatchs_n } }, function (err, result0) {
														if (err) 
															throw err;
														else{
																console.log(result2);
																res.json({msg: 'Exito', names: name_analisis});
															}
													});
												}
											});
											console.log('successfully deleted');
										}
									});
									console.log('successfully deleted');
								}
							});
						}
					});
				}
			}
		});
	}
	else{
		res.redirect('/../login');
	}
}
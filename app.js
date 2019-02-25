//**************************//
//	 Module dependencies.	//
//**************************//

var express 	= require('express');
var routes 		= require('./routes');
var user 		= require('./routes/user');
var http 		= require('http');
var app 		= express();
var path 		= require('path');
var mongoose 	= require('mongoose'); //MongoDB
var multipart 	= require('connect-multiparty');
var multiparty 	= require('multiparty');
var util		= require('util');
var ffprobe 	= require('ffprobe');
var probe 		= require('node-ffprobe');
var users 		= require('./routes/users'); //users functions
var sessions 	= require('./routes/sessions'); //sessions functions
var videos 		= require('./routes/videos'); // videos functions
var teams 		= require('./routes/teams'); // teams functions
var tags 		= require('./routes/tags'); // tags functions
var championships = require('./routes/championships'); // championships functions
var categories 	= require('./routes/categories'); // categories functions
var criteries 	= require('./routes/criteries'); // criteries functions
var descriptors = require('./routes/descriptors'); // descriptors functions
var templates 	= require('./routes/templates'); // criteries functions
var formidable 	= require('formidable');
var fs 			= require('fs');
var getDimensions = require('get-video-dimensions');
const cv 		= require('opencv4nodejs');
var mysql = require('mysql');

//Config parameters
var parameters	= fs.readFileSync('./config.cfg', 'utf8', function(err, parameters){
	if(err){
		console.log(err);
	}
});
parameters = JSON.parse(parameters);
exports.parameters;


//User Schema
var user_schema	= fs.readFileSync('./models/SchemaUser.JSON', 'utf8', function(err, user_schema){
	if(err){
		console.log(err);
	}
});
user_schema = JSON.parse(user_schema);

//Team Schema
var team_schema	= fs.readFileSync('./models/SchemaTeam.JSON', 'utf8', function(err, team_schema){
	if(err){
		console.log(err);
	}
});
team_schema = JSON.parse(team_schema);

//Championship Schema
var championship_schema = fs.readFileSync('./models/SchemaChampionship.JSON', 'utf8', function(err, championship_schema){
	if(err){
		console.log(err);
	}
});
championship_schema = JSON.parse(championship_schema);

//Video Schema
var video_schema = fs.readFileSync('./models/SchemaVideo.JSON', 'utf8', function(err, video_schema){
	if(err){
		console.log(err);
	}
});
video_schema = JSON.parse(video_schema);

//Tag Schema (video-analisis)
var tag_schema = fs.readFileSync('./models/SchemaTag.JSON', 'utf8', function(err, tag_schema){
	if(err){
		console.log(err);
	}
});
tag_schema = JSON.parse(tag_schema);

//Critery Schema (video-analisis)
var critery_schema = fs.readFileSync('./models/SchemaCritery.JSON', 'utf8', function(err, critery_schema){
	if(err){
		console.log(err);
	}
});
critery_schema = JSON.parse(critery_schema);

//Category Schema (video-analisis)
var category_schema = fs.readFileSync('./models/SchemaCategory.JSON', 'utf8', function(err, category_schema){
	if(err){
		console.log(err);
	}
});
category_schema = JSON.parse(category_schema);

//Template Schema (video-analisis)
var template_schema = fs.readFileSync('./models/SchemaTemplate.JSON', 'utf8', function(err, template_schema){
	if(err){
		console.log(err);
	}
});
template_schema = JSON.parse(template_schema);

//Template Schema (video-analisis)
var descriptor_schema = fs.readFileSync('./models/SchemaDescriptor.JSON', 'utf8', function(err, descriptor_schema){
	if(err){
		console.log(err);
	}
});
descriptor_schema = JSON.parse(descriptor_schema);


// New Schemas
var UserSchema 	= mongoose.Schema(user_schema);
var TeamSchema 	= mongoose.Schema(team_schema);
var ChampSchema = mongoose.Schema(championship_schema);
var VideoSchema = mongoose.Schema(video_schema);
var TagSchema 	= mongoose.Schema(tag_schema);
var CriterySchema = mongoose.Schema(critery_schema);
var CategorySchema = mongoose.Schema(category_schema);
var DescriptorSchema = mongoose.Schema(descriptor_schema);
var TemplateSchema = mongoose.Schema(template_schema);

// creation model from the schema
var UserModel 	= mongoose.model('User', UserSchema);
var TeamModel 	= mongoose.model('Team', TeamSchema);
var ChampModel 	= mongoose.model('Championship', ChampSchema);
var VideoModel 	= mongoose.model('Video', VideoSchema);
var TagModel 	= mongoose.model('Tag', TagSchema);
var CriteryModel = mongoose.model('Critery', CriterySchema);
var DescriptorModel = mongoose.model('Descriptor', DescriptorSchema);
var CategoryModel = mongoose.model('Category', CategorySchema);
var TemplateModel = mongoose.model('Template', TemplateSchema);

// Import models to the appropriate files
sessions.setModel(UserModel);
sessions.setModelVideo(VideoModel);
sessions.setModelChampionship(ChampModel);
sessions.setModelTeam(TeamModel);

users.setModel(UserModel);

teams.setModel(TeamModel);
teams.setModelChampionship(ChampModel);

championships.setModelCham(ChampModel);
championships.setModelTeam(TeamModel);
championships.setModelVideo(VideoModel);

videos.setModel(VideoModel);
videos.setModelCham(ChampModel);
videos.setModelTag(TagModel);
videos.setModelTeam(TeamModel);
videos.setModelTemplate(TemplateModel);
videos.setModelCritery(CriteryModel);
videos.setModelDescriptor(DescriptorModel);
videos.setModelCategory(CategoryModel);

tags.setModelTag(TagModel);

criteries.setModelCritery(CriteryModel);
criteries.setModelCategory(CategoryModel);
criteries.setModelDescriptor(DescriptorModel);
criteries.setModelTemplate(TemplateModel);

descriptors.setModelDescriptor(DescriptorModel);
descriptors.setModelCategory(CategoryModel);
descriptors.setModelCritery(CriteryModel);
descriptors.setModelTemplate(TemplateModel);

categories.setModelCategory(CategoryModel);
categories.setModelCritery(CriteryModel);
categories.setModelDescriptor(DescriptorModel);

templates.setModelCritery(CriteryModel);
templates.setModelTemplate(TemplateModel);
templates.setModelDescriptor(DescriptorModel);
templates.setModelVideo(VideoModel);
templates.setModelChampionship(ChampModel);

/* Conexion a mySQL
var connection1 = mysql.createConnection({
	host: parameters.mysql.host,
	user: parameters.mysql.username ,
	password: parameters.mysql.password ,
	database: parameters.mysql.database
});

connection1.connect(function(err) {
	if (err) {
		console.error('error conectando a mySQL: ' + err.stack);
		console.log('El servicio -mySQL: "systemctl status mysql.service"- puede no estar activo.');
		return;
	}
	console.log('Conectado a mySQL correctamente');
});
*/

//Conection to DB (MongoDB) 
var connection = 'mongodb://'+ parameters.mongodb.host +'/' + parameters.mongodb.database;
//var connection = 'mongodb://'+ parameters.mongodb.username +':'+ parameters.mongodb.password +'@'+ parameters.mongodb.host +':'+ parameters.mongodb.portdb +'/' + parameters.mongodb.database;

console.log("la conexion es: "+ connection);
mongoose.Promise = global.Promise;
mongoose.connect(connection, function(error){
	if(error){
		console.log('Imposible conectar a MongoDB correctamente.');
		console.log('El servicio -mongod- puede no estar activo.');
		throw error;
	}
	else{
		console.log('Conectado a MongoDB correctamente');
	}
});


// all environments
app.set('port', process.env.PORT || parameters.entorno.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(body_parser()); //Express 4
//app.use(fileUpload());

app.use(express.cookieParser());
app.use(express.session({secret: 'abcd1234'}));


app.use(app.router);
app.use(multipart());
app.use(express.static(path.join(__dirname, 'public')));

var dir = '../../voleibol';
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir, function(err, result){
	    	if(err)
	    		throw err;
	    	else{
	    		console.log("Directorio voleibol creado con éxito");
	    	}
	    });
	}
	else{
		console.log("Directorio voleibol existe");
	}


app.use(express.static(path.join(__dirname, '../../voleibol')));
//console.log("DIRNAME:" + __dirname);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Identificación de rutas
app.get('/', sessions.index);



//Sessions
app.get('/login', sessions.get_login);
app.post('/login', sessions.post_login);
app.get('/api/index', sessions.index);
app.get('/exit', sessions.exit);
app.get('/logout', sessions.logout);


//Users
app.get('/users', users.index);
app.post('/users', users.store);
app.get('/users/create', users.create);
app.get('/users/:id', users.show);
app.get('/users/:id/edit', users.edit);
app.put('/users/:id', users.update);
app.delete('/users/:id', users.destroy);

//Teams
app.get('/api/showteams', teams.index);
app.post('/api/showteams/addnewteam', teams.addnewteam);
app.post('/api/deleteteam', teams.deleteteam);

// Championships
app.get('/api/showchampionships', championships.index);
app.post('/api/showchampionships', championships.store);
app.post('/api/deletegame', championships.deletegame);
app.post('/api/delete_video_game', championships.delete_video_game);
app.post('/api/getrestteams', championships.getrestteams);
app.post('/api/addnewteamC', championships.addnewteamC);
app.post('/api/deleteteamC', championships.deleteteamC);
app.post('/api/addnewgame', championships.addnewgame);
app.get('/api/newchampionship', championships.create);
app.get('/api/showchampionship/:id', championships.show);
app.get('/api/showchampionship/:id/edit', championships.edit);
app.put('/api/showchampionship/:id', championships.update);
app.post('/api/destroyChampionship', championships.destroy);

//Video
app.get('/api/showvideos', videos.index);
app.post('/api/showvideos', videos.store);
app.post('/api/showvideos/addgrid', videos.addgrid);
app.post('/api/showvideos/addanalysis', videos.addanalysis);
app.post('/api/showvideos/showanalysis', videos.showanalysis);
app.post('/api/showvideos/drawgrid', videos.drawgrid);
app.post('/api/showvideos/tracking', videos.tracking);
app.post('/api/showvideos/trackingExit', videos.trackingExit);
app.get('/api/addvideo/:id/:id_match', videos.create);
app.get('/api/showvideo/:id', videos.show);
app.get('/api/editvideo/:id', videos.edit);
app.get('/api/analisis/:id', videos.show);
app.get('/api/showvideo/:id/edit', videos.edit);
app.put('/api/showvideo/:id', videos.update);
app.delete('/api/deletevideo/:id', videos.destroy);
app.post('/api/gettemplates', videos.gettemplates);
app.post('/api/gettemplate', videos.gettemplate);
app.post('/api/delete_video_template', videos.delete_video_template);
app.post('/api/showvideos/addInfoTemplate', videos.addInfoTemplate);
app.post('/api/showvideos/drawcriteries', videos.drawcriteries);

//Tags
app.get('/api/showtags', tags.index);
app.post('/api/showtags/addnewtag', tags.addnewtag);
app.post('/api/deletetag', tags.deletetag);
app.post('/api/updatetag', tags.updatetag);

//Criteries
app.get('/api/showcriteries', criteries.index);
app.post('/api/showcriteries/addnewcritery', criteries.addnewcritery);
app.get('/api/showcriteries/:id', criteries.show);
app.post('/api/deletecriteries/:id', criteries.deletecriteries);
app.post('/api/updatecriteries', criteries.updatecriteries);

//Descriptors
app.get('/api/showdescriptors', descriptors.index);
app.post('/api/showdescriptors/addnewdescriptor', descriptors.addnewdescriptor);
app.get('/api/showdescriptors/:id', descriptors.show);
app.post('/api/deletedescriptor/:id', descriptors.deletedescriptor);
app.post('/api/updatedescriptor', descriptors.updatedescriptor);

//Categories
app.post('/api/addnewcategory', categories.addnewcategory);
app.post('/api/deletecategory', categories.deletecategory);
app.post('/api/updatecategory', categories.updatecategory);
app.post('/api/addnewcategoryDescriptor', categories.addnewcategoryDescriptor);
app.post('/api/deletecategoryDescriptor', categories.deletecategoryDescriptor);
app.post('/api/updatecategoryDescriptor', categories.updatecategoryDescriptor);

//Template
app.get('/api/showtemplates', templates.index);
app.post('/api/addnewtemplate', templates.addnewtemplate);
app.post('/api/deletetemplate', templates.deletetemplate);
app.post('/api/updatetemplate', templates.updatetemplate);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

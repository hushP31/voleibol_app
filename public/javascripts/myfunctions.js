
function removeDuplicateRows($table){
    function getVisibleRowText($row){
        return $row.find('td:visible').text().toLowerCase();
    }

    $table.find('tr').each(function(index, row){
        var $row = $(row);
        $row.nextAll('tr').each(function(index, next){
            var $next = $(next);
            if(getVisibleRowText($next) == getVisibleRowText($row))
                $next.remove();
        })
    });
}

//**************************************************************** Championships *******************************************************************/
//Add new match
var n_parings = 0;
$(document).ready(function(){
    $("#addparings").click(function(){
        //Read teams selected
        var idteams = [];
        var nameteams = [];
        $("#selectteams :selected").each(function(i, selected){
            idteams[i] = $(selected).val();
            nameteams[i] = $(selected).text();
        });
        
        if(nameteams.length != 0){
            //Clear list partings
            $('#parone').html('');
            $('#partwo').html('');

            //Add new values to the <select>
            for(j=0; j<nameteams.length; j++){
                $('#parone').append($('<option>', {
                    value: idteams[j],
                    text: nameteams[j]
                }));
                $('#partwo').append($('<option>', {
                    value: idteams[j],
                    text: nameteams[j]
                }));
            }
            n_parings = n_parings + 1;
            $("#parmatchtocopy").clone().removeClass("hidden").addClass(n_parings + 'par').appendTo("#form_parings");
        }
        else{
            swal("No has seleccionado equipos");
        }
    });

    $("#form_parings").on("click", "#deletepar", function(){
                //alert(this);
    })

    $("#form_parings").submit(function(){
        if(n_parings == 0){
            swal("No has seleccionado equipos");
            return false;
        }
        else{
            return true;
        }
    });

});

//Championships sub functions
$(document).ready(function(){

    $("#teamsChamps tbody").on("click", "#delete_team_champ", function(){
        var idteam = $(this).attr("idteam");
        var nteam = $(this).attr("Nteam");

        var idChampionship = $("h1").attr("idChampionship");
        var txt = [];
        var teamA = [], teamB = [];
        var nogames = false;

        $('#gamesteams > tbody  > tr').each(function(){ 
            teamA.push($(this).find("td:first").text());
        });
        $('#gamesteams > tbody  > tr').each(function(){ 
            teamB.push($(this).find("td:nth-child(2)").text());
        });
        //teamA.splice(0, 1);
        //teamB.splice(0, 1);
        //alert(teamA +"\n" + teamB);
        //Comprobar si existen partidos con el equipo seleccionado
        
        for(var i=0; i<teamA.length; i++)
            if((teamA[i] == nteam) || (teamB[i] == nteam))
                nogames = true;

        if(!nogames){
            $.ajax({
                type:"POST",
                url: "/api/deleteteamC",
                data: JSON.stringify({idteam: idteam, idChampionship: idChampionship}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    //alert("eliminar la fila del equipo " + idteam);
                    $("#row-"+idteam).remove();
                }
            })
        }
        else{
            swal("Not Remove!", "Exist games with " + nteam + " in the Championship", "error");
        }
    });


    $("#mynewteamchamp").on("click", "#new_team_champ", function(){
        var actual_teams = [];
        $("#teamsChamps tbody tr").each(function(){
            actual_teams.push($(this).find("td:first").text()); //put elements into array
        });
        //alert(actual_teams);

        $.ajax({
            type:"POST",
            url: "/api/getrestteams",
            data: JSON.stringify({teams: actual_teams}), //parameters tag identification
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if(data.nteams == 0){
                    swal("Ups!", "There are not more teams in system", "error");
                }
                else{
                    //swal("Teams!", data.teams, "success");
                    var txtoption = "";
                    if(data.teams.length>0)
                        for(var i=0; i < data.teams.length; i++){
                           txtoption  += '<option value=' + data.idteams[i] + ' sortname="'+ data.sort[i] +'">' + data.teams[i] + '</option>';
                        }
                    else{
                        $("#restofteams").remove();
                    }

                    $("#new_team_champ" ).replaceWith(
                                        '<select id="restofteams">'+
                                            txtoption + 
                                        '</select>'+
                                        '<button type="button" class="btn btn-success btn-sm" id="addnewteamChamp"> Add team </button>' + 
                                        '<button type="button" class="btn btn btn-danger btn-sm" id="cancelnewteamChamp"> Cancel </button>'
                    );
                    
                    $("#mynewteamchamp").on("click", "#cancelnewteamChamp", function(){
                        $("#restofteams" ).replaceWith(  
                            '<button type="button" id="new_team_champ" class="btn btn-info btn-xs"><span aria-hidden="true" class="glyphicon glyphicon-plus"></span></button>'
                        );
                        $("#addnewteamChamp").remove();
                        $("#cancelnewteamChamp").remove();
                    });

                    $("#mynewteamchamp").on("click", "#addnewteamChamp", function(){

                        var newteamtoaddN = $("#restofteams option:selected").text();
                        var newteamtoaddV = $("#restofteams option:selected").val();
                        var newteamtoaddS = $("#restofteams option:selected").attr('sortname');
                        var idChampions = $("h1").attr("idChampionship");

                        $.ajax({
                            type:"POST",
                            url: "/api/addnewteamC",
                            data: JSON.stringify({newteamN: newteamtoaddN, newteamV: newteamtoaddV, newteamS: newteamtoaddS, idCh: idChampions}), //parameters tag identification
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(data){
                                //alert(newteamtoaddN + newteamtoaddV + newteamtoaddS);
                                //Delete duplicates
                                removeDuplicateRows($('teamsChamps'));


                                $("#restofteams option[value="+newteamtoaddV+"]").remove();
                                
                                //alert($('#restofteams option').length);
                                
                                if($('#restofteams option').length == 0){
                                    $('#restofteams').replaceWith(
                                            '<button type="button" id="new_team_champ" class="btn btn-info btn-xs"><span aria-hidden="true" class="glyphicon glyphicon-plus"></span></button>'
                                    );
                                    $('#addnewteamChamp').remove();
                                    $('#cancelnewteamChamp').remove();
                                } 

                                if(newteamtoaddN != ""){
                                    if(!data.add){
                                        $('#teamsChamps > tbody:last-child').append(
                                                    
                                                        '<tr id="row-'+ data.idteam +'">'+
                                                            '<td class="video_match">'+
                                                                newteamtoaddN+
                                                            '</td>'+
                                                            '<td class="video_match">'+
                                                                newteamtoaddS+
                                                            '</td>'+
                                                            '<td class="video_match">'+
                                                                newteamtoaddV+
                                                            '</td>'+ 
                                                            '<td class="video_match">'+
                                                                '<button type="button" aria-label="Close" id="delete_team_champ" nteam="'+newteamtoaddN+'" idteam="'+data.idteam+'" class="close"> '+
                                                                    '<span aria-hidden="true" class="glyphicon glyphicon-trash"></span>'+
                                                                '</button>'+
                                                            '</td>'+
                                                        '</tr>'           
                                        );
                                    }
                                }
                                else{
                                    swal("Error", "No hay mas equipos en el sistema");
                                }
                            },
                            error: function(err){
                                swal(err);
                            }
                        });
                    });
                }
            },
            error: function(err){
                swal(err);
                swal("There are not more teams");
            }
        });

    });
	
	$("#gamesteams tbody").on("click", "#delete_video_game", function(){
		var eqA = $(this).parents('tr').find("td:eq(0)").text();
        var eqB = $(this).parents('tr').find("td:eq(1)").text();
        var idvideo = $(this).attr("idvideo");
        var idChampions = $("h1").attr("idChampionship");
        var nameC = $("h1").text();
        var me = $(this);
        var idgame = $(this).attr("idgame");

		swal({
            title: "Are you sure?",
            text: "Eliminar video del encuentro del campeonato \n" + nameC + " \n que enfrenta a:\n " + eqA + " VS " + eqB + "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
            closeOnConfirm: false
            },  function (isConfirm) { 
                    if(!isConfirm)
                    	return;
                    
                    $.ajax({
                        type:"POST",
                        url: "/api/delete_video_game",
                        data: JSON.stringify({idCh: idChampions, iDvideo: idvideo, indexMatch: idgame}), //parameters tag identification
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                        	if(data.names != ""){
                				swal({
						            title: "Existen análisis",
						            text: "Existen los analisis \n" + data.names + " \n Es necesario eliminarlos antes que los videos. ",
						            type: "warning",
						            confirmButtonColor: '#DD6B55',
	            					confirmButtonText: 'De acuerdo!'
            					});
                    		}
                        	else{
                        		me.remove();
                        		swal(data.msg);
                        	}
                        },
                        error: function(err){
                            swal(err);
                            swal("error al Eliminar");
                        }
                    });
                    
            });
	});

    $("#gamesteams tbody").on("click", "#delete_game", function(){
        //Delete match??
        var eqA = $(this).parents('tr').find("td:eq(0)").text();
        var eqB = $(this).parents('tr').find("td:eq(1)").text();
        var idgame = $(this).attr("idgame");
        var idChampions = $("h1").attr("idChampionship");
        var nameC = $("h1").text();

        swal({
            title: "Estás seguro?",
            text: "Eliminar encuentro vacio (" + nameC + ") entre: " + eqA + " y " + eqB + "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Si, Estoy seguro!',
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false
            },  function (isConfirm) { 
                    if(!isConfirm)
                    	return;
                    
                    $.ajax({
                        type:"POST",
                        url: "/api/deletegame",
                        data: JSON.stringify({idCh: idChampions, indexMatch: idgame}), //parameters tag identification
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                            if(data.del == 0){
                                var idrow = "#row-game-" + idgame;
                                //Delete the tag row
                                $(idrow).remove();
                                swal("Hecho!", "Partido eliminado  con éxito!", "success");
                            }
                            else{
                                swal("No hecho!", "Primero se debe de eliminar el video asociado", "error");
                            }
                        },
                        error: function(err){
                            swal(err);
                            swal("error al Eliminar");
                        }
                    });
            });
    });


    //Add new game between two teams
    $("#mynewgamechamp").on("click", "#addnewgame", function(){
        
        var teams = [];

        $('#teamsChamps > tbody  > tr').each(function(){ 
            teams.push($(this).find("td:first").text());
        });
        //alert(teams)
        var txtoption = "";

        if(teams.length>1){
            for(var i=0; i < teams.length; i++)
               txtoption  += '<option value="'+teams[i] +'">' + teams[i] + '</option>';
        
            $("#addnewgame").remove();
            if($("#newpair-game").length < 1){
                $('#gamesteams > tbody:last-child').append( 
                            '<tr id="newpair-game">'+
                                '<td class="">'+
                                    '<select id="teamgameA">'+
                                        txtoption + 
                                    '</select>'+
                                '</td>'+
                                '<td class="">'+
                                    '<select id="teamgameB">'+
                                        txtoption + 
                                    '</select>'+
                                '</td>'+
                                '<td class="">'+
                                    '<button type="button" aria-label="Close" id="addgame" > ADD'+
                                        '<span aria-hidden="true" class="glyphicon glyphicon-check"></span>'+
                                    '</button>'+
                                '</td>'+ 
                                '<td class="">'+
                                    ''+
                                '</td>'+
                                '<td class="">'+
                                    '<button type="button" aria-label="Close" id="cancel-game" > CANCEL'+
                                        '<span aria-hidden="true" class="glyphicon glyphicon-ban-circle"></span>'+
                                    '</button>'+
                                '</td>'+
                            '</tr>'           
                );  
            } 
        }
    });

    $('#gamesteams').on("click", '#cancel-game', function(){
        //alert("cancel");
        $('#newpair-game').remove();
        
        $('#mynewgamechamp').append(
                '<button type="button" id="addnewgame" class="btn btn-info btn-sm">'+
                    '<span aria-hidden="true" class="glyphicon glyphicon-plus"></span>'+
                '</button>'
        );
    });

    $("#gamesteams").on("click", "#addgame", function(){
        var teamA = $("#teamgameA option:selected").text();
        var teamB = $("#teamgameB option:selected").text();
        var teamsA = [], teamsB = [];
        var idChampionship = $("h1").attr("idChampionship");

        $('#gamesteams > tbody  > tr').each(function(){ 
            teamsA.push($(this).find("td:first").text());
        });
        $('#gamesteams > tbody  > tr').each(function(){ 
            teamsB.push($(this).find("td:nth-child(2)").text());
        });

        if(teamA == teamB){
            swal("Teams must be differents.(" + teamA + ", " + teamB + ")");
        }
        else{
            var indice;
            var existe = false;

            for(var i = 0; i<teamsA.length; i++)
                if(teamsA[i] == teamA && teamsB[i] == teamB){
                    indice = i;
                    existe = true;
                }

            if(existe){
                indice+=1;
                swal("This game already exist in row "+indice+".(" + teamA + ", " + teamB + ")");
            }
            else{
                $.ajax(
                {
                    type: "POST",
                    url: "/api/addnewgame",
                    data: JSON.stringify({ nameA: teamA, nameB: teamB, idChamp: idChampionship }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    {   

                        //alert(data.status);
                        var teams = [];
                        $('#newpair-game').replaceWith('<tr id="row-game-0">'+
                                '<td>'+teamA+'</td>'+
                                '<td>'+teamB+'</td>'+
                                '<td class="video_match">'+
                                    '<a href="/api/addvideo/'+idChampionship+'/'+data.idgame+'">'+
                                        '<span aria-hidden="true" class="glyphicon glyphicon-upload"></span>'+
                                    '</a>'+
                                '</td>'+
                                '<td class="video_match"></td>'+
                                '<td class="video_match">'+
                                    '<button type="button" aria-label="Close" id="delete_game" idgame="" class="close">'+
                                        '<span aria-hidden="true" class="glyphicon glyphicon-trash"></span>'+
                                    '</button>'+
                                '</td>'+
                            '</tr>')

                        $('#teamsChamps > tbody  > tr').each(function(){ 
                            teams.push($(this).find("td:first").text());
                        });
                        //alert(teams)
                        var txtoption = "";

                        if(teams.length>1){
                            for(var i=0; i < teams.length; i++)
                               txtoption  += '<option value="'+teams[i] +'">' + teams[i] + '</option>';

                            $('#gamesteams > tbody:last-child').append( 
                                        '<tr id="newpair-game">'+
                                            '<td class="">'+
                                                '<select id="teamgameA">'+
                                                    txtoption + 
                                                '</select>'+
                                            '</td>'+
                                            '<td class="">'+
                                                '<select id="teamgameB">'+
                                                    txtoption + 
                                                '</select>'+
                                            '</td>'+
                                            '<td class="">'+
                                                '<button type="button" aria-label="Close" id="addgame" > ADD'+
                                                    '<span aria-hidden="true" class="glyphicon glyphicon-check"></span>'+
                                                '</button>'+
                                            '</td>'+ 
                                            '<td class="">'+
                                                ''+
                                            '</td>'+
                                            '<td class="">'+
                                                '<button type="button" aria-label="Close" id="cancel-game" > CANCEL'+
                                                    '<span aria-hidden="true" class="glyphicon glyphicon-ban-circle"></span>'+
                                                '</button>'+
                                            '</td>'+
                                        '</tr>'           
                            );
                        }
                    }
                });
            }
        }
        
    });
    
    $('.list-video').on("click", '#delete_championship', function(){
        //alert("cancel");

        var idC = $(this).attr("idCh");
        var namec = $(this).attr("nameC");
        swal({
                title: 'Está seguro que desea eliminar el campeonato '+ namec +'?',
                text: "No se podrá revertir la operación si ésta se lleva a cabo.",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!',
                closeOnConfirm: false
            },  function (isConfirm){ 
                    $.ajax({
                        type:"POST",
                        url: "/api/destroyChampionship",
                        data: JSON.stringify({id: idC}), //id: Identification team (mongo id)
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){

                            if(data.n_teams > 0){
                                swal("Error al Eliminar. Aún existen equipos en el campeonato");
                            }
                            else{
                                var idrow = "#row-" + idC;
                                //Delete the tag row
                                $(idrow).remove();
                                swal("Campeonato eliminado")
                            }
                            
                        },
                        error: function(err){
                            swal(err);
                        }
                    });
                
                });

    });

});






//**************************************************************** Tags *******************************************************************/


//Add new tag in system.
$(function(){
    $('#botonaddtag').click(function(){
        var error_exists = 0;
        var error_exists_ = 0;
        //Name tag captation from input
        var name = $('#InputNameTag').val();
        var shortcut = $('#shortcuttag').val();
        var tagtype = $('#tagtype').val();
        var tagdescription = $('#InputDescrTag').val();

        if(name.trim().length == 0){
            swal("Name is empty");
        }
        else
        {
            $.ajax(
            {
                type: "POST",
                url: "/api/showtags/addnewtag",
                data: JSON.stringify({ name: name, shortcut: shortcut, tagdescription: tagdescription, tagtype: tagtype }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) 
                { 
                    if(data.error_name == 'true'){
                        //Show error. Tag name exists
                        var error_exists = $("#error_name").text();
                        if(error_exists == 0){
                            $(".list-inline").append('<li><p id="error_name" class="error"> ERROR. Name exists </p></li>');
                        }
                    }
                    else{
                        if(data.error_cut == 'true'){
                            //Show error. Tag name exists
                            var error_exists_ = $("#error_cut").text();
                            if(error_exists_ == 0){
                                $(".error_cut").append('<li><p id="error_cut" class="error"> ERROR. Shortcut exists </p></li>');
                            }
                        }
                        else{
                            if(error_exists != 0){
                                //Remove error name
                                $("#error_name").remove();
                                error_exists = 0;
                            }
                            if(error_exists_ != 0){
                                //Remove error cut
                                $("#error_cut").remove();
                                error_exists_ = 0;
                            }
                            //Add new row with the new tag information 
                            $("#table-tags tbody").append(  '<tr id="row_tag-' + data.id + '">' +
                                                                '<td id="name_tag-' + data.id + '">' +
                                                                    name +
                                                                '</td> ' + 
                                                                '<td id="name_tag-' + data.id + '">' +
                                                                    'MAY + ' + shortcut +
                                                                '</td> ' + 
                                                                '<td id="name_tag-' + data.id + '">' +
                                                                    tagtype +
                                                                '</td> ' + 
                                                                '<td id="name_tag-' + data.id + '">' +
                                                                    tagdescription +
                                                                '</td> ' + 
                                                                '<td>' + 
                                                                    '<a href="javascript:void(0);" class="btn btn-info showtag" id="btn-show" idmongo='+ data.id +'> Show </a>' +
                                                                '</td> ' + 
                                                                '<td>' + 
                                                                    '<a href="javascript:void(0);" class="btn btn-info updatetag" id="btn-update" idmongo='+ data.id +'> Edit </a>' +
                                                                '</td> ' + 
                                                                '<td>' + 
                                                                    '<a href="javascript:void(0);" class="btn btn-info deletetag" id="btn-delete" idmongo='+ data.id +'> Delete </a>' +
                                                                '</td> ' + 
                                                            '</tr>'
                                                    );
                        }
                    }

                },
                error: function(err) 
                {
                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                    swal(msg);
                }
            });
        }
        return false;
    });

});

//Delete tag 
$(document).ready(function(){
    
    $("#table-tags tbody").on("click", ".deletetag", function(){

        //Delete tag??
        var deleting = confirm("Eliminar: " + $(this).attr("idmongo") + " ?");
        var idmon = $(this).attr("idmongo");
        
        if(deleting){
            $.ajax({
                type:"POST",
                url: "/api/deletetag",
                data: JSON.stringify({id: idmon}), //parameters tag identification
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    var idrow = "#row_tag-" + idmon;
                    //Delete the tag row
                    $(idrow).remove();
                },
                error: function(err){
                    swal(err);
                    swal("error al Eliminar");
                }
            });
        }
        return false;
    });
});
var update_active = false;


//Change row. Add a new input.
$(document).ready(function(){
    //Edit tag
    $("#table-tags tbody").on("click", ".updatetag", function(){
        var idmon = $(this).attr("idmongo");
        var name = "#name_tag-"+idmon;

        var valor_inicial = $(name).text();
        //alert("el valor inicial es: " + valor_inicial)
        var idrow = "#row_tag-" + idmon;

        if(update_active == false){
            $( "tr"+idrow ).replaceWith(    
                                        '<tr id="row_tag-' + idmon + '">' +
                                                '<td>' + 
                                                    '<ul class="list-inline" id="list-updatetag">'+
                                                        '<li><label for="InputName-update">'+
                                                            '<input class="form-control" type="text" value="'+ valor_inicial +'" name="update_tag" id="InputName-update" idmongo='+ idmon +'></input>'+
                                                        '</li>' +
                                                    '</ul>' +                                            
                                                '</td> ' + 
                                                '<td>' + 
                                                    '<a href="javascript:void(0);" class="btn btn-info updatesavetag" id="btn-save_update" idmongo='+ idmon +'> Save </a>' +
                                                '</td> ' + 
                                                '<td>' + 
                                                    '<a href="javascript:void(0);" class="btn btn-info cancelupdate" id="btn-update" ini="'+ valor_inicial +'" idmongo='+ idmon +'> Cancel </a>' +
                                                '</td> ' + 
                                            '</tr>'
                                        );
            update_active = true;
        }
        else{
            swal("Update activo");
        }
    });
}); 


//Save update tag
$(document).ready(function(){

    $("#table-tags tbody").on("click", ".updatesavetag", function(){
        var idmon = $(this).attr("idmongo");
        var name = $("#InputName-update").val();
        var error_exists = 0;

        $.ajax({
            type:"POST",
            url: "/api/updatetag",
            data: JSON.stringify({id: idmon, name: name}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if(data.error_name == 'true'){
                    var error_exists = $("#error_name").text();
                    //Tag name introduced exists in the system
                    if(error_exists == 0){
                        $("#list-updatetag").append('<li><p id="error_name" class="error"> ERROR. Name exists </p></li>');
                    }
                }
                else{
                     if(error_exists != 0){
                        //Delete the error
                        $("#error_name").remove();
                        error_exists = 0;
                    }
                    var idrow = "#row_tag-" + idmon;

                    //Change row for update information
                    $( "tr"+idrow ).replaceWith(    '<tr id="row_tag-' + data.id + '">' +
                                                        '<td id="name_tag-' + data.id + '">' +
                                                            data.name +
                                                        '</td> ' + 
                                                        '<td>' + 
                                                            '<a href="javascript:void(0);" class="btn btn-info showtag" id="btn-show" idmongo='+ data.id +'> Show </a>' +
                                                        '</td> ' + 
                                                        '<td>' + 
                                                            '<a href="javascript:void(0);" class="btn btn-info updatetag" id="btn-update" idmongo='+ data.id +'> Edit </a>' +
                                                        '</td> ' + 
                                                        '<td>' + 
                                                            '<a href="javascript:void(0);" class="btn btn-info deletetag" id="btn-delete" idmongo='+ data.id +'> Delete </a>' +
                                                        '</td> ' + 
                                                    '</tr>'
                                        );
                    update_active = false;
                }   
            },
            error: function(err){
                swal("error al actualizar: " + err);
            }
        });
        return false;
    });
});

//Cancel update tag
$(document).ready(function(){
    //Edit tag
    $("#table-tags tbody").on("click", ".cancelupdate", function(){
        var idmon = $(this).attr("idmongo");
        var name = $(this).attr("ini");
        var idrow = "#row_tag-" + idmon;

        // Replace the row for the above information
        $( "tr"+idrow ).replaceWith(  
                                    '<tr id="row_tag-' + idmon + '">' +
                                        '<td id="name_tag-' + idmon + '">' +
                                            name +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="javascript:void(0);" class="btn btn-info showtag" id="btn-show" idmongo='+ idmon +'> Show </a>' +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="javascript:void(0);" class="btn btn-info updatetag" id="btn-update" idmongo='+ idmon +'> Edit </a>' +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="javascript:void(0);" class="btn btn-info deletetag" id="btn-delete" idmongo='+ idmon +'> Delete </a>' +
                                        '</td> ' + 
                                    '</tr>'
                                );
        update_active = false;
    });
}); 

//Clean input tag name
 $(document).ready(function() {
        $("#InputNameTag").on("focus", function(){
            $("#InputNameTag").val("");

        });

        $("#botonaddtag").on("click", function(event){
            $("#InputNameTag").val("");
    });
});

 //******************************************************* Teams *******************************************************************/


//Add new team in system.
$(function(){
    $('#botonaddteam').click(function(){
        var error_exists = 0;
        $("#error_name").remove();
        //data capture
        var name = $('#InputNameTeam').val();
        var sortname = $('#InputSortnameTeam').val();
        var id = $('#InputRankingTeam').val();

        sortname = sortname.toUpperCase();
        //alert('Name es: ' + name + ' ' + sortname + ' ' + id);
        var name_exist = false;
        var sortname_exist = false;
        var id_exist = false;

        var names_ = $('#table-teams tbody tr > :nth-child(1)').map(function(){
                               return $(this).text();
                           }).get();


        for(var i=0; i<names_.length; i++){
            if(names_[i] == name) name_exist = true;
        }

        var sorts_ = $('#table-teams tbody tr > :nth-child(2)').map(function(){
                               return $(this).text();
                           }).get();

        for(var i=0; i<sorts_.length; i++){
            if(sorts_[i] == sortname) sortname_exist = true;
        }

        var id1_ = $('#table-teams tbody tr > :nth-child(3)').map(function(){
                               return $(this).text();
                           }).get();


        for(var i=0; i<id1_.length; i++){
            if(id1_[i] == id) id_exist = true;
        }

        //alert(names_ + "\n" + sorts_ + "\n" + id1_);

        if(name_exist){
            $(".list-inline").append('<li><p id="error_name" class="error"> ERROR. Name exists </p></li>');
        }
        else if(sortname_exist){
            swal("sortname is repeted")
        }
        else if(id_exist){
            swal("ranking is repeted")
        }
        else{
            $.ajax({
                type: "POST",
                url: "/api/showteams/addnewteam",
                data: JSON.stringify({ name: name, sortname: sortname, id: id}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) { 
                    if(data.error_name == 'true'){
                        var error_exists = $("#error_name").text();
                        if(error_exists == 0){
                            $(".list-inline").append('<li><p id="error_name" class="error"> ERROR. Name exists </p></li>');
                        }
                    }
                    else{
                        if(error_exists != 0){
                            $("#error_name").remove();
                            error_exists = 0;
                        }
                        //Add new row in table-teams
                        $("#table-teams tbody").append(     '<tr id="row_team-'+ data.id + '">' +
                                                                '<td id="team_name">' +
                                                                    data.name +
                                                                '</td>' +
                                                                '<td id="team_sortname">' +
                                                                    data.sort +
                                                                '</td>' +
                                                                '<td id="team_id">' +
                                                                    data.rank +
                                                                '</td>' +
                                                                '<td>' +
                                                                  '<a href="javascript:void(0);" class="btn btn-info showteam" id="btn-show" idmongo="'+ data.id +'"> Show </a>' +
                                                                '</td>' +
                                                                '<td>' + 
                                                                  '<a href="javascript:void(0);" class="btn btn-info updateteam" id="btn-update" idmongo="'+ data.id +'"> Edit </a>' +
                                                                '</td>' +
                                                                '<td>' + 
                                                                  '<a href="javascript:void(0);" class="btn btn-info deleteteam" id="btn-delete" idmongo="'+ data.id +'"> Delete </a>' +
                                                                '</td>' +
                                                            '</tr>'
                        );
                    }

                },
                error: function(err) {
                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                    swal(msg);
                }
            });
        }   
        return false;
    });

});



//Delete team
$(document).ready(function(){
    
    $("#table-teams tbody").on("click", ".deleteteam", function(){
        

        //'id mongo' capture
        var idmon = $(this).attr("idmongo");
        var nameT = $(this).attr("name");

        //Confirm the team deletion
/*
        swal({
            title: 'Are you sure for deleting '+nameT+'?',
            text: "It will permanently deleted !",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: false
            },  function (isConfirm) { 
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
            })
*/



        swal({
                title: 'Are you sure deleting '+nameT+'?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: false
            },  function (isConfirm){ 
                    $.ajax({
                        type:"POST",
                        url: "/api/deleteteam",
                        data: JSON.stringify({id: idmon}), //id: Identification team (mongo id)
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data){
                            //Delete the team row
                            if(data.status){
                                swal(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                    );  
                                var idrow = "#row_team-" + idmon;
                                $(idrow).remove();
                            }
                            else{
                                swal({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Something went wrong!. There are Championship ('+ data.championship +') with '+ nameT,
                                    animation: false,
                                    customClass: 'animated tada'
                                });
                            }
                        },
                        error: function(err){
                            swal(err);
                            swal("error al Eliminar");
                        }
                    });
                
                });
    });
});



/**     Control de video     **/
var eventos = 0;

var n_jugada = 1;

var id_td_anterior =0;
var escribiendo = false;

function foco(idElemento){
    document.getElementById(idElemento).focus();
}

$(document).ready(function(){

    $('.boton-analysis').on("click", function(){
        //Valores de primera fila HEAD
        var myTableArray = [];
        var idvideo_ = $(".boton-grid").attr("idMongo-video");

        $("table#tabla_eventos tr").each(function() {
            var arrayOfThisRow = [];
            var tableData = $(this).find('td');
            if (tableData.length > 0) {
                tableData.each(function() { arrayOfThisRow.push($(this).text()); });
                myTableArray.push(arrayOfThisRow);
            }
        });
        var title_ = myTableArray[0];
        var cuerpo_ = myTableArray;

        cuerpo_.splice(0,1); //Eliminar la fila del titulo
        cuerpo_.reverse(); //Invertimos tabla

        $.ajax({
                type:"POST",
                url: "/api/showvideos/addanalysis",
                data: JSON.stringify({idvideo: idvideo_, title: title_, cuerpo: cuerpo_}), //parameters tag identification
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    swal("Tabla almacenada correctamente")
                },
                error: function(err){
                    swal("error al guardar: " + err);
                }
        });

    });
});


//Exportar la tabla a CSV
$(document).ready(function () {

    function exportTableToCSV($table, filename) {

        var $rows = $table.find('tr:has(td)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '";"',
            rowDelim = '"\r\n"',

            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    }

    // This must be a hyperlink
    $(".export-csv").on('click', function (event) {
        // CSV
        exportTableToCSV.apply(this, [$('#tabla_eventos'), 'export.csv']);
        
        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });
});




//Create analysis table 

$(document).ready(function(){
    var idvideo_ = $(".boton-grid").attr("idMongo-video");
    //alert(idvideo_);

    if(idvideo_ != null){
        $.ajax(
                {
                    type: "POST",
                    url: "/api/showvideos/showanalysis",
                    data: JSON.stringify({idvideo: idvideo_}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    {
                        /*
                            data.tags
                            data.video.analysis[i][j]
                        */
                        //alert(data.alltags[0].name);
                        //alert(data.analysis[0][0]);

                        var cabecera = '<ul class="list-inline">'+
                                            '<li>'+
                                                '<h3 class="adquisicion"> Tabla de adquisicion de datos </h3>'+
                                            '</li>'+
                                            '<li>'+
                                                '<input type="button" value="add analysis" idMongo-video="'+ idvideo_ +'" class="boton-analysis">'+
                                            '</li>  ' +
                                            '<li>'+
                                                '<a href="#" class="export-csv">Export Table data into Excel</a>'+
                                            '</li>'+
                                        '</ul>';

                        var tabla_analysis_cabecera = '<table class="table table-condensed fin-table" id="tabla_eventos">'+
                                                            '<thead>'+
                                                                '<tr class="">';
                        if(data.analysis != ""){                                            
                            for(var i=0; i<data.analysis[0].length; i++){
                                tabla_analysis_cabecera += '<td>' + data.analysis[0][i] + '</td>';
                            }

                            if((data.analysis[0].length-2) < data.alltags.length){
                                for (var i = data.analysis[0].length - 2; i < data.alltags.length; i++) {
                                    tabla_analysis_cabecera += '<td>' + data.alltags[i].name + '</td>';
                                }
                            }

                            tabla_analysis_cabecera += '</tr></thead><tbody>';

                            var id;
                            for(var i=data.analysis[1].length-1; i>=0; i--){

                                tabla_analysis_cabecera += '<tr>';
                                for(var j=0; j<data.analysis[1][i].length; j++){

                                    if(j==1) id = 'id="time_second"';
                                    if(j==0) id = 'id="evento' + data.analysis[1][i][j] + '"';
                                    if(j>1) id = 'id="evento' + (i+1) + data.analysis[0][i] + '" class="fila-tag"'
        
                                    tabla_analysis_cabecera += '<td ' + id + '><p>' + data.analysis[1][i][j] + '</p></td>';
                                }

                                tabla_analysis_cabecera += '</tr>';
                            }
                            eventos = data.analysis[1].length;
                            var video = document.getElementById("videomatch");
                            var longitud = data.analysis[1].length -1;
                            video.currentTime = data.analysis[1][longitud][1];
                            
                        }
                        else{
                            tabla_analysis_cabecera += '<td> Evento </td><td> Tiempo </td>';
                            //All tags:
                            for(var i=0; i<data.alltags.length; i++){
                                tabla_analysis_cabecera += '<td>' + data.alltags[i].name + '</td>';
                            }
                            tabla_analysis_cabecera += '</tr></thead><tbody>';
                        }
                        
                        tabla_analysis_cabecera += '</tbody></table>'
                        $('.table-play-to-play').append($(tabla_analysis_cabecera));
                        ResaltarFila('tabla_eventos');

                    },
                    error: function(err) 
                    {
                        //Mostrar error
                        var msg = 'Status: error';
                        swal(msg);
                    }
                }); 
    }
});



function ResaltarFila(id_tabla){
    if (id_tabla == undefined)      // si no se le pasa parametro
        // recupera todas las filas de todas las tablas
        var filas = document.getElementsByTagName("tr");
    else{
        // recupera todas las filas de la tabla indicada en el parametro
        var tabla = document.getElementById(id_tabla);
        var filas = tabla.getElementsByTagName("tr");
    }
    // recorre cada una de las filas
    for(var i in filas) {
        // si el puntero esta encima de la fila asigna la regla css: resaltar
        if(i>0)
            filas[i].onmouseover = function() {
                this.className = "resaltar";
                //this.append('<td> Edit </td>');
            }
        // si el puntero salga de la fila asigna ninguna regla
        filas[i].onmouseout = function() {
            this.className = null;
        }
    }
}




function AddTimeVideo(flecha){
    var video = document.getElementById("videomatch");

    if(flecha == 39){
        video.currentTime += 0.10;
    }
    if(flecha == 37){
        video.currentTime += (-0.10);
    }
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: AddTimeVideo(37);
        break;

        case 38: // up
        break;

        case 39: AddTimeVideo(39);
        break;

        case 40: // down
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

function trunc (x, posiciones = 0) {
  var s = x.toString()
  var l = s.length
  var decimalLength = s.indexOf('.') + 1

  if (l - decimalLength <= posiciones){
    return x
  }
  // Parte decimal del número
  var isNeg  = x < 0
  var decimal =  x % 1
  var entera  = isNeg ? Math.ceil(x) : Math.floor(x)
  // Parte decimal como número entero
  // Ejemplo: parte decimal = 0.77
  // decimalFormated = 0.77 * (10^posiciones)
  // si posiciones es 2 ==> 0.77 * 100
  // si posiciones es 3 ==> 0.77 * 1000
  var decimalFormated = Math.floor(
    Math.abs(decimal) * Math.pow(10, posiciones)
  )
  // Sustraemos del número original la parte decimal
  // y le sumamos la parte decimal que hemos formateado
  var finalNum = entera + 
    ((decimalFormated / Math.pow(10, posiciones))*(isNeg ? -1 : 1))
  
  return finalNum
}

function handleFileSelectFF(){
    var x = document.getElementById("fileinputvideoF");
    var escale = [" ", " Kilo", " Mega", " Giga"];
    var txt = "";
    
    if ('files' in x){
        if (x.files.length == 0)
            txt = "Select one or more files.";
        else
            for (var i = 0; i < x.files.length; i++){
                txt += "<br><strong>" + (i+1) + ". FRONTAL: </strong><br>";
                var file = x.files[i];

                if ('name' in file)
                    txt += "name: " + file.name + "<br>";
                if ('size' in file){
                    var tam = file.size;
                    var i;
                    if(tam > 1024)
                        for(i=0; tam > 1024; i++)
                            tam /= 1024;
                    tam = trunc(tam, 2);
                    txt += "size: " + tam + escale[i]+"bytes <br>";
                }
            }
    } 
    else{
        if (x.value == "")
            txt += "Select one or more files.";
        else{
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
    document.getElementById("editorF").innerHTML = txt;
}


function handleFileSelectF(){

    var myVideos = [];

    window.URL = window.URL || window.webkitURL;

    document.getElementById('fileinputvideoF').onchange = setFileInfo;

    function setFileInfo() {
      var files = this.files;
      myVideos.push(files[0]);
      var video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        var duration = video.duration;
        //alert(duration);
        alert("duration");
        myVideos[myVideos.length - 1].duration = duration;
        updateInfos();
      }

      video.src = URL.createObjectURL(files[0]);;
    }


    function updateInfos() {
      var infos = document.getElementById('editorF');
      infos.textContent = "";
      for (var i = 0; i < myVideos.length; i++) {
        infos.textContent += myVideos[i].name + " duration: " + myVideos[i].duration + '\n';
      }
    }
}


$(document).ready(function(){
        $("#startVideo").click(function(){
                let video = document.getElementById('videoInput');
                video.play();
                processVideo();
            });
    });


$(document).ready(function(){
    //binds to onchange event of your input field
    $('#fileinputvideoF').bind('change', function() {

        //this.files[0].size gets the size of your file.
        var t = (this.files[0].size);
        var tt = (this.files[0].name);
        var k= t/1024/1024/1024;

        k = Math.round(k*100)/100;	
    	//alert("t: " + t + ", k: " + k + "MB" + "Name: " + tt);

    	var path = (this.files[0]);
        console.log(path);

        if(k < 1.5)
            $('#fileinputvideoF').attr('correct', 'on');
        else{
            $( "span" ).text( "Not valid!" ).show().fadeOut( 1000 );
            $('#fileinputvideoF').attr('correct', 'off');
        }

    });

    //binds to onchange event of your input field
    $('#fileinputvideoL').bind('change', function() {
    	console.log(this.files[0].mozFullPath);
        var t = (this.files[0].size);
        var tt = (this.files[0].name);
        var k= t/1024/1024/1024;
        k = Math.round(k*100)/100;
        //alert("t: " + t + ", k: " + k + "MB" + " path" + tt);


        var path = (this.files[0]);

        console.log(path);


        if(k < 1.5)
            $('#fileinputvideoL').attr('correct', 'on');
        else{
            $( "span" ).text( "Not valid!" ).show().fadeOut( 1000 );
            $('#fileinputvideoL').attr('correct', 'off');
        }
    });
    
    $("form.video").submit(function( event ) {
        
        var l = $('#fileinputvideoL').attr('correct');
        var f = $('#fileinputvideoF').attr('correct');

        if(l=='on' && f=='on'){
            //alert("Todo correcto");
            $( "span" ).text( "Not valid!" ).show().fadeOut( 1000 );
            return;
        }

        $( "span" ).text( "Not valid!" ).show().fadeOut( 1000 );
        event.preventDefault();
    });
});

$(document).ready(function(){
    //binds to onchange event of your input field
    $('#NombreVideoFrontal_UP').bind('change', function() {

        //this.files[0].size gets the size of your file.
        var t = (this.files[0].size);
        var tt = (this.files[0].name);
        var k= t/1024/1024/1024;

        k = Math.round(k*100)/100;	

        if(k < 2.5){
        	$('#NombreVideoFrontal_UP').attr('nameVideo', tt);
            $('#NombreVideoFrontal_UP').attr('correct', 'on');
        }
        else{
            $( "span#sNombreVideoFrontal_UP" ).text( "Not valid!" ).show().fadeOut( 3000 );
            $('#NombreVideoFrontal_UP').attr('correct', 'off');
        }
	
    });

    //binds to onchange event of your input field
    $('#NombreVideoLateral_UP').bind('change', function() {
        var t = (this.files[0].size);
        var tt = (this.files[0].name);
        var k= t/1024/1024/1024;
        k = Math.round(k*100)/100;
        //alert("t: " + t + ", k: " + k + "MB" + " path" + tt);

        if(k < 2.5){
            $('#NombreVideoLateral_UP').attr('correct', 'on');
            $('#NombreVideoLateral_UP').attr('nameVideo', tt);
        }
        else{
            $( "span#sNombreVideoLateral_UP" ).text( "Not valid!" ).show().fadeOut( 3000 );
            $('#NombreVideoLateral_UP').attr('correct', 'off');
        }
    });
    
    $("form.nuevoParVideo").submit(function( event ) {
        
        var l = $('#NombreVideoLateral_UP').attr('correct');
        var f = $('#NombreVideoFrontal_UP').attr('correct');

        if(l=='on' && f=='on'){
            //alert("Todo correcto");
            
            var name_video_frontal = $('#NombreVideoFrontal_UP').attr('nameVideo');
            var name_video_lateral = $('#NombreVideoLateral_UP').attr('nameVideo');
            var idChamp = $("#AlmacenarNuevoVideo").attr('idCh');
            var match = $("#AlmacenarNuevoVideo").attr('match');

            //alert(name_video_frontal + ", " + name_video_lateral + ", " + idChamp + ", " + match);

            $.ajax({
                type:"POST",
                url: "/api/showvideos/addnuevovideoruta",
                data: JSON.stringify({nameFrontal: name_video_frontal, nameLateral:name_video_lateral, nMatch:match, idChampionship: idChamp}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    
                }
            });

        }
        else{
        	if(l=='off'){
	           $( "span#sNombreVideoLateral_UP" ).text( "Not valid!" ).show().fadeOut( 3000 );
	            //return;
	        }
	        if(f=='off'){
	            $( "span#sNombreVideoFrontal_UP" ).text( "Not valid!" ).show().fadeOut( 3000 );
	            //return;
	        }
        }

        $( "span#AlmacenarNuevoVideo" ).text( "Not valid!" ).show().fadeOut( 3000 );
        event.preventDefault();
    });
});

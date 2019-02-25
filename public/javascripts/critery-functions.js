
//**************************************************************** Criteries *******************************************************************/
//Add new critery in system.
$(function(){
    $('#btn-add-critery').click(function(){
        
        var error_exists = 0;
        var error_exists_ = 0;
        //Name tag captation from input
        var name = $('#InputNameCritery').val();
        var crtrydescription = $('#InputDescrCritery').val();
        var pre_t = $('#InputPreCritery').val();
        var post_t = $('#InputPostCritery').val();
        var type_ = $('input:radio[name=position]:checked').val()
        var diff = $('#critery-time-diff-check').is(":checked");
        var critery_diff_time = $( "#critery-time-diff option:selected" ).text();
        var id_critery_diff = $( "#critery-time-diff option:selected" ).val();

        if(!diff){
            id_critery_diff = -1;
        }

        name = $.trim(name);
        crtrydescription = $.trim(crtrydescription);

        if(name.trim().length == 0){
            swal("Name is empty. \nPlease insert a name critery");
        }
        else
        {
            $.ajax(
            {
                type: "POST",
                url: "/api/showcriteries/addnewcritery",
                data: JSON.stringify({ name: name, crtrydescription: crtrydescription, pre_time: pre_t, post_time: post_t, type: type_, id_critery_time: id_critery_diff }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) 
                { 
                    if(data.error_name == 'true'){
                        //Show error. Tag name exists
                        var error_exists = $("#error_name").text();
                        if(error_exists == 0){
                            $(".list-inline").append('<li><p id="error_name" class="error"> ERROR. Name already exists in criteries or descriptors </p></li>');
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

                            $('#critery-time-diff').append('<option id="'+ data.id +'" value="'+ data.id +'"> ' + name + ' </option>');

                            //Add new row with the new tag information 
                            $("#table-critery tbody").append(  
                                '<tr id="row_crtry-' + data.id + '">' +
                                    '<td id="name_crtry-' + data.id + '">' +
                                        name +
                                    '</td> ' +
                                    '<td id="name_crtry-' + data.id + '">' +
                                        pre_t +
                                    '</td> ' + 
                                    '<td id="name_crtry-' + data.id + '">' +
                                        post_t +
                                    '</td> ' + 
                                    '<td id="name_crtry-' + data.id + '">' +
                                        type_ +
                                    '</td> ' + 
                                    '<td>' + 
                                        '<a href="/api/showcriteries/' + data.id + '" class="btn btn-info showtag" id="btn-show" idmongo='+ data.id +'> Show </a>' +
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


$(document).ready(function(){
    $('h3').on("click", "#btn-new-category", function(){
            $('#btn-new-category').replaceWith( '<button class="btn btn-default" type="submit" id="btn-new-category" value="-"> -' );

            $('.ctgry-in').replaceWith( '<div class="form-inline", id="form-category">' +
                                            '<ul class="list-inline">' +
                                                '<li>' +
                                                    '<div.form-group>' +
                                                        '<label for="InputNameCategory categoryname"> Name ' +
                                                        '<input class="form-control" type="text" name="name" placeholder="category name" id="InputNameCategory" required> '+
                                                '</li>' +
                                                '<li>' +
                                                    '<button class="btn btn-default" type="submit" id="btn-add-category"> Add category '+
                                                '</li>' +
                                           '</ul>' +
                                            '<textarea name="categorydescription", placeholder="category description", required, id="InputDescrCtgry"></textarea>' +
                                        '</div>'  );
            $('#btn-new-category').click(function(){
                $('#btn-new-category').replaceWith( '<button class="btn btn-default" type="submit" id="btn-new-category" value="+"> + ' );
                $('#form-category').replaceWith( '<div class="ctgry-in"></div>'  );
            });   

        $('#btn-add-category').click(function(){
            
            var error_exists = 0;
            var error_exists_ = 0;

            //Name category captation from input
            var namecategory = $('#InputNameCategory').val();
            var ctgrydescription = $('#InputDescrCtgry').val();
            var id_critery = $("h1").attr("idmongo");

            namecategory = $.trim(namecategory);
            ctgrydescription = $.trim(ctgrydescription);

            var names_ = $('#table-category tbody tr > :nth-child(1)').map(function(){
                               return $(this).text();
                           }).get();

            var name_exist = false;

            for(var i=0; i<names_.length; i++){
                if(names_[i] == namecategory) name_exist = true;
            }

            if((namecategory.trim().length == 0) || name_exist){
                swal("Name is empty. \nPlease insert a new name category that not exists");
            }
            else
            {
                $.ajax(
                {
                    type: "POST",
                    url: "/api/addnewcategory",
                    data: JSON.stringify({ namecategory: namecategory, ctgrydescription: ctgrydescription, idcritery: id_critery }),
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
                                $("#table-category tbody").append(  
                                    '<tr id="row_category-' + data.id + '">' +
                                        '<td id="name_category-' + data.id + '">' +
                                            namecategory +
                                        '</td> ' + 
                                        '<td id="name_category-' + data.id + '">' +
                                            data.keyaccess +
                                        '</td> ' + 
                                        '<td id="name_category-' + data.id + '">' +
                                            ctgrydescription +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="" class="btn btn-info showtag" id="btn-update-Categorycritery" idmongo='+ data.id +'> Update </a>' +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="" class="btn btn-info showtag" id="btn-delete-Categorycritery" idmongo='+ data.id +'> Delete </a>' +
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
    //Actualzia valores de un criterio
    $('#table-critery').on("click", "#btn-up-critery", function(){
        var idmongo = $( this ).attr( "idmongo" );
        var name_critery = $('p#name_critery-'+idmongo).text();
        var pre = $('p#pre_critery-'+idmongo).text();
        var post =  $('p#post_critery-'+idmongo).text();
        var dsrcp =  $('p#description_critery-'+idmongo).text();
        
        $('p#name_critery-'+idmongo).replaceWith( '<input type="text" min="0" name="name_critery" placeholder="(s)" id="InputNameCritery2" required="true" value="'+name_critery+'" class="form-control">');
        $('p#pre_critery-'+idmongo).replaceWith( '<input type="number" min="0" name="pre_time" placeholder="(s)" id="InputPreCritery" required="true" value="'+pre+'" class="form-control">');
        $('p#post_critery-'+idmongo).replaceWith( '<input type="number" min="0" name="post_time" placeholder="(s)" id="InputPostCritery" required="true" value="'+post+'" class="form-control">');
        $('p#description_critery-'+idmongo).replaceWith( '<textarea name="criterydescription" placeholder="critery description" required="" id="AreaDescrCritery">'+dsrcp+'</textarea>' )
        $('#btn-up-critery').replaceWith( '<button type="button" id="btn-up-save-critery" class="btn btn-info btn-lg updatecrtry"><span class="glyphicon glyphicon-pencil"></span> Update</button>' );

        $('#btn-up-save-critery').click(function(){

            var name_critery_new = $('#InputNameCritery2').val();
            var pre_new = $('#InputPreCritery').val();
            var post_new = $('#InputPostCritery').val();
            var dscrptn_new = $("#AreaDescrCritery").val();

            name_critery_new = $.trim(name_critery_new);
            dscrptn_new = $.trim(dscrptn_new);
            //swal(name_critery_new + ", " + pre_new + ", " + post_new + ", " + dscrptn_new + "\n " + idmongo);
            
            if(name_critery_new.length == 0){
                swal("Critery name can not be empty. \nChange it, please.");
            }
            else{
                /*****/
                $.ajax(
                {
                    type: "POST",
                    url: "/api/updatecriteries",
                    data: JSON.stringify({ name: name_critery_new, pre: pre_new, post: post_new, ctgrydescription: dscrptn_new, idcritery: idmongo }),
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

                            $('#InputNameCritery2').replaceWith( '<p id="name_critery-'+ idmongo +'">'+ name_critery_new +'</p>');
                            $('#InputPreCritery').replaceWith( '<p id="pre_critery-'+ idmongo +'">'+ pre_new +'</p>');
                            $('#InputPostCritery').replaceWith( '<p id="post_critery-'+ idmongo +'">'+ post_new +'</p>');
                            $('#AreaDescrCritery').replaceWith( '<p id="description_critery-'+ idmongo +'">'+ dscrptn_new +'</p>' )
                            $('#btn-up-save-critery').replaceWith( '<button type="button" id="btn-up-critery" idmongo="'+idmongo+'" class="btn btn-info btn-lg updatecrtry"><span class="glyphicon glyphicon-pencil"></span> Update</button>' );
                        }

                    },
                    error: function(err) 
                    {
                        var msg = 'Status: ' + err.status + ': ' + err.responseText;
                        swal(msg);
                    }
                });
                /*****/
            }
            
        });

    });

    $('#table-critery').on("click", "#btn-dlt-critery", function(){
        var idmongo = $( this ).attr( "idmongo" );
        var namec = $('h1').text();
        console.log(namec);

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                    $.ajax(
                    {
                        type: "POST",
                        url: "/api/deletecriteries/:id",
                        data: JSON.stringify({ id: idmongo, namec: namec }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data) 
                        {
                            if(data.status == 'false'){
                                swal("Imposible de eliminar!", "EL criterio existe en los templates siguientes: " + data.existe , "success");
                            }
                            else{
                                swal("Deleted!", "Your critery has been deleted.", "success");
                            }
                        },
                        error: function(err) 
                        {
                            swal("Eliminado!", "Your critery has been deleted.", "success");
                            setTimeout("window.location.href='/api/showcriteries';",1200);
                        }
                    });
                } 
                else {
                    swal("Cancelled", "Not deleted", "error");
                }
        });

    });
    
    //Actualiza categoría de un criterio
    $('#table-category tr').on("click", '#btn-update-Categorycritery', function(){
        var namecategory = $(this).attr("category-name");    // Find the row
        var id_critery = $("h1").attr("idmongo");
        var keyaccess = $(this).attr("key");
        var dsrcp = $('#descrip_category-'+namecategory).text()

        //alert(namecategory + ", " + id_critery + ", " + keyaccess +", " + dsrcp)
        if(($('#InputNameCategory'+namecategory).length != 0)){
            //alert("has pulsado descriptor C")
            var name_category_new = $('#InputNameCategory'+namecategory).val();
            var dscrptn_new = $('#AreaDescrCategory'+namecategory).val();

            var names_ = $('#table-category tbody tr > :nth-child(1) p').map(function(){
                               return $(this).text();
                           }).get();

            var name_exist = false;

            for(var i=0; i<names_.length; i++){
                if(names_[i] == name_category_new) name_exist = true;
            }
             //alert(name_exist)
            if((namecategory.trim().length == 0) || name_exist){
                swal("Name is empty or repeated. \nPlease insert a new name category (that not exists)");
            }
            else{
                $.ajax(
                {
                    type: "POST",
                    url: "/api/updatecategory",
                    data: JSON.stringify({ name: name_category_new, criterydescription: dscrptn_new, key: keyaccess, idcritery: id_critery }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    { 
                        $('#InputNameCategory'+namecategory).replaceWith( '<p>'+ name_category_new +'</p>');
                        $('#AreaDescrCategory'+namecategory).replaceWith( '<p>'+ dscrptn_new +'</p>' )
                        $('#btn-up-save-descriptorC').replaceWith( '<button type="button" id="btn-update-Categorydescriptor" class="btn btn-info btn-lg updatecrtry"><span class="glyphicon glyphicon-pencil"></span> Update</button>' );
    
                    },
                    error: function(err) 
                    {
                        var msg = 'Status: ' + err.status + ': ' + err.responseText;
                        swal(msg);
                    }
                });
            }
        }
        else{
            $('#name_category-'+namecategory+ " p").replaceWith( '<input type="text" min="0" name="name_descriptor" placeholder="(s)" id="InputNameCategory'+namecategory+'" required="true" value="' + namecategory + '" class="form-control">');
            $('#descrip_category-'+namecategory+ " p").replaceWith( '<textarea name="descriptordescription" placeholder="descriptor description" required="" id="AreaDescrCategory'+namecategory+'">' + dsrcp + '</textarea>' )
        }
    });


    //ELIMINAR CATEGORIA de un Criterio
    $('#table-category tr').on("click", "#btn-delete-Categorycritery", function(){
       var namecategory = $(this).attr("category-name");    // Find the row
        var id_critery = $("h1").attr("idmongo");
        var keyaccess = $(this).attr("key");
        
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                        $.ajax({
                            type: "POST",
                            url: "/api/deletecategory",
                            data: JSON.stringify({ idcritery: id_critery, namecategory: namecategory, keyaccess: keyaccess }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(data) 
                            {   
                                $("tr#row_category-"+namecategory).remove();

                                var names_ = $('#table-category tbody tr > :nth-child(1) p').map(function(){
                                                return $(this).text();
                                            }).get();
                                //alert(names_)

                                for(var i=0; i<names_.length; i++){
                                    var indice = i+1;
                                    $("#key_category-"+names_[i]+" p").text(indice);
                                }

                                swal("Deleted!", "Your category has been deleted.", "success");
                            },
                            error: function(err) 
                            {
                                alert(err);
                            }
                        });
                } 
                else {
                    swal("Cancelled", "Not deleted", "error");
                }
        });
    });
    
    
});




//**************************************************************** Templates *******************************************************************/

$(document).ready(function(){
    $('div').on("click", "#btn-add-template", function(){
                $('#add-new-template').css({opacity: 0.0, visibility: "visible", display: "block"}).animate({opacity: 1}, 400);
    });

    $('#btn-cancel-template').click(function(){
        $('#add-new-template').css({ opacity: 1, visibility: "hidden", display: "none"});
    });

    $('div').on("click", "#btn-new-template", function(){
            var criterios = [];
            var descriptores = [];
            var letra = [];
            var name_tmplt = $('input#name-tmplt').val();
            var description_tmplt = $('#description-tmplt').val();
            var allchar = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "Z"];
            var repetidos = [];
            var enviar = false;
            var criterios_list = "";
            var descriptores_list = "";
            var c_list = "";
            var d_list = "";

            $("#errorname").remove();
            $("#error_template").remove();
            
            if(name_tmplt == ""){
                $("ul#name-tmplt").append('<li id="errorname"><p>Insert a name</p></li>');
            }


            $("input[name='critery-char']:checked").each(function ()
            {
                var id_ = $(this).attr( "idmongo" );
                var name_ = this.value;
                var letra_ = $('select[id="'+ id_ +'"]').val();

                criterios_list = criterios_list + name_ + ", ";
                criterios.push({ name:name_, id:id_, letra:letra_ });
                
                allchar.splice( allchar.indexOf(letra_), 1 );

                c_list = c_list + name_ + ", " + id_ + " - " + letra_ + "\n" ;
            });
            

            for(var j=0; j<criterios.length; j++)
                for(var k=j+1; k<criterios.length; k++)
                    if(criterios[j].letra == criterios[k].letra)
                        repetidos.push(criterios[k]);

            $("input[name='descriptor-t']:checked").each(function ()
            {
                var id = $(this).attr( "idmongo" );
                var name_ = this.value;
                
                descriptores_list = descriptores_list + name_ + ", ";
                descriptores.push({ name: name_, id: id});
                d_list = d_list + name_ + ", " + id + " - \n" ;
            });


            $("#freekeys").remove();
            if(repetidos.length != 0){
                for(var k=0; k<repetidos.length; k++)
                    $('#'+repetidos[k].id+'critery-slctr').css( "border-bottom", "solid 1px #ff0000");
                $("#error_chars").append('<p id="freekeys"> Free Keys:  '+allchar+' </p>');
            }

            if(((repetidos.length == 0) && (name_tmplt != "") && (description_tmplt != ""))){
                enviar = true;
            }

            if(!enviar){
                swal("Nombre o decripción tiene que tener información. Puede que haya criterios con la mima letra de acceso.");
            }
            else
            {   
                $.ajax(
                {
                    type: "POST",
                    url: "/api/addnewtemplate",
                    data: JSON.stringify({ name: name_tmplt, description: description_tmplt, criteries: criterios, descriptors: descriptores }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    { 
                    	if(data.status == 'false'){
            				$("#add-new-template").append('<p class="error" id="error_template">Existe ya una plantilla con el nombre '+ name_tmplt +'. Por favor, cambie de nombre la plantilla actual</p>')
                    	}
                    	else{
	                        $("#table-templates tbody").append(  
	                                '<tr id="row_template-' + data.id + '">' +
	                                    '<td id="name_template-' + data.id + '">' +
	                                        name_tmplt +
	                                    '</td> ' + 
	                                    '<td id="name_template-' + data.id + '">' +
	                                        description_tmplt +
	                                    '</td> ' + 
	                                    '<td id="name_template-' + data.id + '">' +
	                                        criterios_list +
	                                    '</td> ' + 
	                                    '<td id="name_template-' + data.id + '">' +
	                                        descriptores_list +
	                                    '</td> ' + 
	                                    '<td>' + 
	                                        '<a href="" class="btn btn-info" id="btn-show" idmongo='+ data.id +'> Update </a>' +
	                                    '</td> ' + 
	                                    '<td>' + 
	                                        '<a href="" class="btn btn-info" id="btn-show" idmongo='+ data.id +'> Delete </a>' +
	                                    '</td> ' + 
	                                '</tr>'
	                        );
	                    }
                    },
                    error: function(err) 
                    {
                        var msg = 'Status: ' + err.status + ': ' + err.responseText;
                        swal(msg);
                    }
                });
            }
    });


    $('#table-templates').on("click", "#btn-delete-tmplt", function(){
        var idmongo = $( this ).attr( "idmongo" );

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm){
                if (isConfirm) {
                    $.ajax(
                    {
                        type: "POST",
                        url: "/api/deletetemplate",
                        data: JSON.stringify({ id: idmongo }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data) 
                        {
                            if(data.status == 'false'){
                                swal("Imposible de eliminar!", "El template existe en" + data.existe, "success");
                            }
                            else{
                                swal("Eliminado!", "Template eliminado con éxito", "success");
                                $('tr#row_templates-'+ idmongo).remove();
                            }
                            
                        },
                        error: function(err) 
                        {
                            swal("Error!", "Ha ocurrido el error" + err.err, "success");
                            //$('tr#row_templates-'+ idmongo).remove();
                        }
                    });
                } 
                else {
                    swal("Cancelled", "Not deleted", "error");
                }
        });
    });
});



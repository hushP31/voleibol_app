
//**************************************************************** Descriptors *******************************************************************/
//Add new critery in system.
$(function(){
    $('#btn-add-descriptor').click(function(){
        //alert("Insertar nuevo descriptor")
        var error_exists = 0;
        var error_exists_ = 0;
        //Name tag captation from input
        var name = $('#InputNameDescriptor').val();
        var dscrptrdescription = $('#InputDescrDescriptor').val();
        var key = $('#keyaccessDescriptor').val();
        //alert(key);

        name = $.trim(name);
        dscrptrdescription = $.trim(dscrptrdescription);


        if(name.trim().length == 0){
            swal("Name is empty. \nPlease insert a name descriptor");
        }
        else
        {
            $.ajax(
            {
                type: "POST",
                url: "/api/showdescriptors/addnewdescriptor",
                data: JSON.stringify({ name: name, dscrptrdescription: dscrptrdescription, keyaccess: key }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) 
                { 
                    if(data.error_name == 'true'){
                        //Show error. Tag name exists
                        var error_exists = $("#error_name").text();
                        if(error_exists == 0){
                            $(".list-inline").append('<li><p id="error_name" class="error"> ERROR. Name already exists in descriptors or criteries</p></li>');
                        }
                    }
                    else{	
                    		$("#Option-"+key).remove();

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
                            $("#table-descriptor tbody").append(  
                                '<tr id="row_descriptor-' + data.id + '">' +
                                    '<td id="name_descriptor-' + data.id + '">' +
                                        name +
                                    '</td> ' +
                                    '<td>' + 
                                    	key +
                                    '</td>' +
                                    '<td>' + 
                                        '<a href="/api/showdescriptors/' + data.id + '" class="btn btn-info showtag" id="btn-show-descriptor" idmongo='+ data.id +'> Show </a>' +
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
        return false;
    });

});


$(document).ready(function(){
    $('h3').on("click", "#btn-new-categoryD", function(){
            $('#btn-new-categoryD').replaceWith( '<button class="btn btn-default" type="submit" id="btn-new-categoryD" value="-"> -' );

            $('.dscrptr-in').replaceWith( '<div class="form-inline", id="form-category">' +
                                            '<ul class="list-inline">' +
                                                '<li>' +
                                                    '<div.form-group>' +
                                                        '<label for="InputNameCategory categoryname"> Name ' +
                                                        '<input class="form-control" type="text" name="name" placeholder="category name" id="InputNameCategory" required> '+
                                                '</li>' +
                                                '<li>' +
                                                    '<button class="btn btn-default" type="submit" id="btn-add-categoryD"> Add category '+
                                                '</li>' +
                                           '</ul>' +
                                            '<textarea name="categorydescription", placeholder="category description", required, id="InputDescrCtgry"></textarea>' +
                                        '</div>'  );
            $('#btn-new-categoryD').click(function(){
                $('#btn-new-categoryD').replaceWith( '<button class="btn btn-default" type="submit" id="btn-new-categoryD" value="+"> + ' );
                $('#form-category').replaceWith( '<div class="dscrptr-in"></div>'  );
            });   

        //Añadir nueva categoria a un descriptor
        $('#btn-add-categoryD').click(function(){
            
            var error_exists = 0;
            var error_exists_ = 0;

            //Name category captation from input
            var namecategory = $('#InputNameCategory').val();
            
            var ctgrydescription = $('#InputDescrCtgry').val();
            var id_descriptor = $("h1").attr("idmongo");

           
            ctgrydescription = $.trim(ctgrydescription);

            var names_ = $('#table-category tbody tr > :nth-child(1)').map(function(){
                               return $(this).text().trim();
                           }).get();

            var name_exist = false;
            console.log(names_);
            for(var i=0; i<names_.length; i++)
                if(names_[i] == namecategory) 
                    name_exist = true;

            //alert(namecategory);
            if((namecategory.trim().length == 0) || name_exist){
                swal("Name is empty. \nPlease insert a new name category that not exists");
            }
            else
            {
                $.ajax(
                {
                    type: "POST",
                    url: "/api/addnewcategoryDescriptor",
                    data: JSON.stringify({ namecategory: namecategory, ctgrydescription: ctgrydescription, iddescriptor: id_descriptor }),
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
                                        '<td id="key_category-' + data.id + '">' +
                                            data.keyaccess +
                                        '</td> ' + 
                                        '<td id="descrip_category-' + data.id + '">' +
                                            ctgrydescription +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="" class="btn btn-info showtag" id="btn-update-Categorydescriptor" category-name='+ namecategory +'> Update </a>' +
                                        '</td> ' + 
                                        '<td>' + 
                                            '<a href="" class="btn btn-info showtag" id="btn-delete-Categorydescriptor" category-name='+ namecategory +' key='+data.keyaccess+'> Delete </a>' +
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

    //Actualizar valores de un descriptor
    $('#table-descriptor').on("click", "#btn-up-descriptor", function(){
        var idmongo = $( this ).attr( "idmongo" );
        var name_descriptor = $('p#name_descriptor-'+idmongo).text();
        var dsrcp =  $('p#description_descriptor-'+idmongo).text();

        //alert(idmongo + ", " + name_descriptor + ", " + dsrcp)
        $('p#name_descriptor-'+idmongo).replaceWith( '<input type="text" min="0" name="name_descriptor" placeholder="(s)" id="InputNameDescriptor2" required="true" value="' + name_descriptor + '" class="form-control">');
        $('p#description_descriptor-'+idmongo).replaceWith( '<textarea name="descriptordescription" placeholder="descriptor description" required="" id="AreaDescrDescriptor">' + dsrcp + '</textarea>' )
        $('#btn-up-descriptor').replaceWith( '<button type="button" id="btn-up-save-descriptor" class="btn btn-info btn-lg updatecrtry" idmongo="'+idmongo+'"><span class="glyphicon glyphicon-pencil" ></span> Update</button>' );



        $('#btn-up-save-descriptor').click(function(){
        	var idmongo = $( this ).attr( "idmongo" );
            var name_descriptor_new = $('#InputNameDescriptor2').val();
            var dscrptn_new = $("#AreaDescrDescriptor").val();
 
            name_descriptor_new = $.trim(name_descriptor_new);
            dscrptn_new = $.trim(dscrptn_new);
            //swal(name_critery_new + ", " + pre_new + ", " + post_new + ", " + dscrptn_new + "\n " + idmongo);
            
            if(name_descriptor_new.length == 0){
                swal("Descriptor's name can not be empty. \nChange it, please.");
            }
            else{
                $.ajax(
                {
                    type: "POST",
                    url: "/api/updatedescriptor",
                    data: JSON.stringify({ name: name_descriptor_new, descripdescription: dscrptn_new, iddescriptor: idmongo }),
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
                            $('#InputNameDescriptor2').replaceWith( '<p id="name_descriptor-'+ idmongo +'">'+ name_descriptor_new +'</p>');
                            $('#AreaDescrDescriptor').replaceWith( '<p id="description_descriptor-'+ idmongo +'">'+ dscrptn_new +'</p>' )
                            $('#btn-up-save-descriptor').replaceWith( '<button type="button" id="btn-up-descriptor" idmongo="'+idmongo+'" class="btn btn-info btn-lg updatecrtry"><span class="glyphicon glyphicon-pencil"></span> Update</button>' );
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

    });
    //Eliminar el descriptor
    $('#table-descriptor').on("click", "#btn-dlt-descriptor", function(){
        var idmongo = $( this ).attr( "idmongo" );
        var named = $('h1').text();
        
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
                        url: "/api/deletedescriptor/:id",
                        data: JSON.stringify({ id: idmongo, named: named }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data) 
                        { 
                            if(data.status == 'false'){
                                swal("Imposible de eliminar!", "El descriptor existe en los templates siguientes: " + data.existe , "success");
                            }
                            else{
                                swal("Deleted!", "Your descriptor has been deleted.", "success");
                            }
                        },
                        error: function(err) 
                        {
                            swal("Deleted!", "Your critery has been deleted.", "success");
                            setTimeout("window.location.href='/api/showdescriptors';",1200);
                        }
                    });
                } 
                else {
                    swal("Cancelled", "Not deleted", "error");
                }
        });

    });
    //Actualiza categoría de un descriptor
    $('#table-category tr').on("click", '#btn-update-Categorydescriptor', function(){
        var namecategory = $(this).attr("category-name");    // Find the row
        var id_descriptor = $("h1").attr("idmongo");
        var keyaccess = $(this).attr("key");
        var dsrcp = $('#descrip_category-'+namecategory).text()

        
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
                    url: "/api/updatecategoryDescriptor",
                    data: JSON.stringify({ name: name_category_new, descripdescription: dscrptn_new, key: keyaccess, iddescriptor: id_descriptor }),
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


    //ELIMINAR CATEGORIA de un DESCRIPTOR
    $('#table-category tr').on("click", "#btn-delete-Categorydescriptor", function(){
        var namecategory = $(this).attr("category-name");    // Find the row
        var id_descriptor = $("h1").attr("idmongo");
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
                            url: "/api/deletecategoryDescriptor",
                            data: JSON.stringify({ iddescriptor: id_descriptor, namecategory: namecategory, keyaccess: keyaccess }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(data) 
                            {   
                                $("tr#row_category-"+namecategory).remove();

                                var names_ = $('#table-category tbody tr > :nth-child(1) p').map(function(){
                                                return $(this).text();
                                            }).get();
                                
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


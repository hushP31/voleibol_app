/*
    Funciones sobre la rejilla GRID
*/

var points = [];
var totalpoints = [];


var data_play = '<div class="data-play"><h1>Datos de Juego</h1><div class="data-info"><ul class="list-inline"><li class="set"><div class="input-group input-group-sm puntuacion"><span id="sizing-addon1" class="input-group-addon">SET</span><input type="number" placeholder="0" aria-describedby="sizing-addon3" class="form-control"></div></li><li class="saque"><div class="input-group input-group-sm puntuacion"><span id="sizing-addon1" class="input-group-addon">Equipo saque</span><select class="saque-team"><option value="volvo">Volvo</option><option value="saab">Saab</option></select></div></li></ul><div class="input-group input-group-sm puntuacion"><span id="sizing-addon1" class="input-group-addon team-name-point">Puntuacion Equipo A</span><input type="number" placeholder="0" aria-describedby="sizing-addon3" class="form-control team-point"></div><div class="input-group input-group-sm puntuacion"><span id="sizing-addon1" class="input-group-addon team-name-point">Puntuacion Equipo B</span><input type="number" placeholder="0" aria-describedby="sizing-addon3" class="form-control team-point"></div></div></div>'

/***************************************
    Mantener Scroll en el video NO FUNCIONA

/***************************************/
$(document).ready(function(){
    //Se obtiene la altura del video:
    var altura = $("#videomatch").height();
     $("html, body").animate({scrollTop:altura+"px"});
});

/********************************************************/


//Aparecer y desaparecer Lienzo
$(document).ready(function(){

    $(".onoffswitch-inner").on("click",function(){
        var vsbl = $("#svgContainer").css("visibility");

        if(vsbl == "hidden"){
            $("#svgContainer").css("visibility", "visible");
        }
        else{
            $("#svgContainer").css("visibility", "hidden");
        }
    });
});




/***************************************
    OPCIONES PARA CREAR GRID ON VIDEO
****************************************/

$(document).ready(function(){

    $(".boton-grid").on("click", function(){

        document.body.scrollTop = 0;

        var activ = $("#svgContainer").attr("active");
        var existe_grid = $(".boton-grid").attr("grid");

        if(existe_grid == "true"){
            var idvideo_ = $(".boton-grid").attr("idMongo-video");
            $.ajax(
                {
                    type: "POST",
                    url: "/api/showvideos/drawgrid",
                    data: JSON.stringify({idvideo: idvideo_}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    { 
                        //alert("Pintar grid");
                        var color = data.grid.color;
                        var size = data.grid.size;
                        var bases = data.grid.bases;
                        var points = data.grid.points;
                        var laterales = data.grid.laterales;

                        if(activ == "OFF"){
                            $("#svgContainer").attr("active", "ON");
                            drawPoints(points, size[0], color[0]);
                            drawLines(bases[0], bases[1], size[1], color[1]);
                            drawLines(laterales[0], laterales[1], size[2], color[2]);
                            //alert("PINTARR");
                        }
                    },
                    error: function(err) 
                    {
                        var msg = 'Status: ' + err.status + ': ' + err.responseText;
                        swal(msg);
                    }
                }
            ); 

        }
        else{
            swal("Add new grid", "Choose the grid parameters and pulse create-grid for create a new grid.")

            $(".data-play").replaceWith(   '<div class="data-play">' + 
                                                '<h1>Opciones de Rejilla</h1>'+
                                                '<div class="data-info">'+
                                                   '<table id="options-grid-table">' + 
                                                       '<thead>' + 
                                                            '<tr id="options-grid-title">'+
                                                                '<td id="title-grid">' +
                                                                    'Lines'+
                                                                '</td>'+
                                                                '<td>' +
                                                                    'Number' +
                                                                '</td>'+
                                                                '<td>'+
                                                                    'Size' +
                                                                '</td>'+
                                                                '<td> '+
                                                                    'Color' +
                                                                '</td>'+
                                                            '</tr>' + 
                                                        '</thead>' + 
                                                        '<tbody>' +
                                                            '<tr id="options-grid">'+
                                                                '<td id="title-grid">' +
                                                                    'Perfil'+
                                                                '</td>'+
                                                                '<td>' +
                                                                '</td>'+
                                                                '<td>'+
                                                                    '<select id="size_perfil">'+
                                                                        '<option value="1" selected> 1' +
                                                                        '<option value="2"> 2 '  +
                                                                        '<option value="3"> 3 '  +
                                                                    '</select>'+
                                                                '</td>'+
                                                                '<td> '+
                                                                    '<select id="color_perfil">'+
                                                                        '<option value="white" selected> white' +
                                                                        '<option value="red"> red '  +
                                                                        '<option value="blue"> blue '  +
                                                                    '</select>'+
                                                                '</td>'+
                                                            '</tr>' + 
                                                            '<tr id="options-grid">'+
                                                                '<td id="title-grid">' +
                                                                    'Vertical'+
                                                                '</td>'+
                                                                '<td>' +
                                                                    '<input type="number" class="n_lines" id="n_vertical" min="0" required >'+
                                                                '</td>'+
                                                                '<td>'+
                                                                    '<select id="size_vertical">'+
                                                                        '<option value="1" selected> 1' +
                                                                        '<option value="2"> 2 '  +
                                                                        '<option value="3"> 3 '  +
                                                                    '</select>'+
                                                                '</td>'+
                                                                '<td> '+
                                                                    '<select id="color_vertical">'+
                                                                        '<option value="white" selected> white' +
                                                                        '<option value="red"> red '  +
                                                                        '<option value="blue"> blue '  +
                                                                    '</select>'+
                                                                '</td>'+
                                                            '</tr>' + 
                                                            '<tr id="options-grid">'+
                                                                '<td id="title-grid">' +
                                                                    'Horizontal'+
                                                                '</td>'+
                                                                '<td>' +
                                                                    '<input type="number" class="n_lines" id="n_horizontal" min="0" required >'+
                                                                '</td>'+
                                                                '<td>'+
                                                                    '<select id="size_horizontal">'+
                                                                        '<option value="1" selected> 1' +
                                                                        '<option value="2"> 2 '  +
                                                                        '<option value="3"> 3 '  +
                                                                    '</select>'+
                                                                '</td>'+
                                                                '<td> '+
                                                                    '<select id="color_horizontal">'+
                                                                        '<option value="white" selected> white' +
                                                                        '<option value="red"> red '  +
                                                                        '<option value="blue"> blue '  +
                                                                    '</select>'+
                                                                '</td>'+
                                                            '</tr>' + 
                                                        '</tbody>' +
                                                    '</table>' +
                                                    '<ul class="list-inline" id="list-boton-grid">' + 
                                                        '<li>'+
                                                            '<input type="button" value="create-grid" class="boton-create-grid boton-grid-options">' +
                                                        '</li>'+
                                                        '<li>'+
                                                            '<input type="button" value="delete-grid" class="boton-delete-grid boton-grid-options">' +
                                                        '</li>'+
                                                        '<li>'+
                                                            '<input type="button" value="save-grid" class="boton-save-grid boton-grid-options">' +
                                                        '</li>'+
                                                        '<li>'+
                                                            '<input type="button" value="auto-grid" class="boton-auto-grid boton-grid-options">' +
                                                        '</li>'+
                                                    '</ul>'+
                                                '</div>'+
                                            '</div>'
                                           
            );

            $(".boton-delete-grid").on("click", function(){
                swal({
                      title: "Are you sure?",
                      text: "The Grid going to be deleted",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Yes, delete it!",
                      closeOnConfirm: false
                    },
                    function(){
                        var el = document.getElementById('svgContainer');
                        var ctx = el.getContext('2d');

                        ctx.clearRect(0, 0, 700, 400);
                        points.length = 0;
                        totalpoints.length = 0;
                        swal("Deleted!", "Grid is empty.", "success");
                });
            });

            $(".boton-auto-grid").on("click", function(){
                swal("No implementado");
            });
            

            $(".boton-save-grid").on("click", function(){
                var msg;

                var size_horizontal = $("#size_horizontal").val();
                var size_vertical = $("#size_vertical").val();
                var color_horizontal = $("#color_horizontal").val();
                var color_vertical = $("#color_vertical").val();
                var size_perfil = $("#size_perfil").val();
                var color_perfil = $("#color_perfil").val();

                var numero_divisiones_verticales = $("#n_vertical").val();
                var numero_divisiones_horizontales = $("#n_horizontal").val();

                if(numero_divisiones_verticales == ""){
                    numero_divisiones_verticales = 0;
                }
                if(numero_divisiones_horizontales == ""){
                    numero_divisiones_horizontales = 0;
                }

                if(totalpoints.length != 0){
                    msg =   "Usted va a alamcenar una rejilla con los siguientes valores: " + 
                            "\n\nPerfil size: " + size_perfil + 
                            "\nVertical size: " + size_vertical + 
                            "\nHorizontal size: " + size_horizontal + 

                            "\n\nPerfil color: " + color_perfil + 
                            "\nVertical color: " + color_vertical + 
                            "\nHorizontal color: " + color_horizontal + 

                            "\n\nDivisiones en Vertical: "  + numero_divisiones_verticales + 
                            "\nDivisiones en Horizontal: " + numero_divisiones_horizontales;
                }
                else{
                    msg = "Por favor, cree una rejilla";
                }

                swal({
                      title: "Are you sure?",
                      text: "You will not be able to recover this imaginary file!",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Yes, create it!",
                      cancelButtonText: "No, cancel grid!",
                      closeOnConfirm: false,
                      closeOnCancel: false
                    },
                    function(isConfirm){
                      if (isConfirm) {
                        if(totalpoints.length != 0){
                            var idvideo_ = $(".boton-grid").attr("idMongo-video");
                            var sizes = [];
                            var colores = [];
                            var divisionesHV = [];

                            colores.push(color_perfil);
                            colores.push(color_vertical);
                            colores.push(color_horizontal);
                            
                            sizes.push(size_perfil);
                            sizes.push(size_vertical);
                            sizes.push(size_horizontal);

                            divisionesHV.push(numero_divisiones_verticales);
                            divisionesHV.push(numero_divisiones_horizontales);

                            $.ajax(
                            {
                                type: "POST",
                                url: "/api/showvideos/addgrid",
                                data: JSON.stringify({idvideo: idvideo_,  points: totalpoints[0], bases: totalpoints[1], laterales: totalpoints[2], color: colores, size: sizes, divisiones: divisionesHV}),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function(data) 
                                { 
                                    swal("Grid almacenado en Base de datos");
                                    $(".data-play").replaceWith(data_play);
                                    var existe_grid = $(".boton-grid").attr("grid", "true");
                                },
                                error: function(err) 
                                {
                                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                                    swal(msg);
                                }
                            });  
                            swal("Created Grid!", "", "success");    
                        }
                        
                      } 
                      else {
                        swal("Cancelled", "Select the desired data", "error");
                      }
                    }
                    );
            });

            $(".boton-create-grid").on("click", function(){

                    var size_horizontal = $("#size_horizontal").val();
                    var size_vertical = $("#size_vertical").val();
                    var color_horizontal = $("#color_horizontal").val();
                    var color_vertical = $("#color_vertical").val();
                    var size_perfil = $("#size_perfil").val();
                    var color_perfil = $("#color_perfil").val();

                    var numero_divisiones_verticales = $("#n_vertical").val();
                    var numero_divisiones_horizontales = $("#n_horizontal").val();

                    if(numero_divisiones_verticales == ""){
                        numero_divisiones_verticales = 0;
                    }
                    if(numero_divisiones_horizontales == ""){
                        numero_divisiones_horizontales = 0;
                    }

                    var msg = "Usted va a crear una rejilla con los siguientes valores: " + 
                                "\n\nPerfil size: " + size_perfil + 
                                "\nVertical size: " + size_vertical + 
                                "\nHorizontal size: " + size_horizontal + 

                                "\n\nPerfil color: " + color_perfil + 
                                "\nVertical color: " + color_vertical + 
                                "\nHorizontal color: " + color_horizontal + 

                                "\n\nDivisiones en Vertical: "  + numero_divisiones_verticales + 
                                "\nDivisiones en Horizontal: " + numero_divisiones_horizontales;

                    swal({
                          title: "Are you sure?",
                          text: msg,
                          type: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#DD6B55",
                          confirmButtonText: "Yes, create it!",
                          closeOnConfirm: false
                        },
                        function(){
                            swal("To create grid!", "Select the four corners", "success");
                            var el = document.getElementById('svgContainer');
                            var ctx = el.getContext('2d');

                            ctx.width=720;
                            ctx.height=480;

                            ctx.lineJoin = ctx.lineCap = 'round';

                            var isDrawing;
                            var pointslines_v = [];


                            el.onmouseup = function(e){
                                
                                points.push({ x: e.clientX, y: e.clientY });

                                var rect = el.getBoundingClientRect();
                                var desviacionx = rect.left;
                                var desviaciony = rect.top;

                                if (points.length == 4)
                                {   
                                    
                                    var z = [];
                                    z=points;
                                    var aux_z;

                                    //Se ordenan los puntos por si al fijarlos con el raton han seguido un orden no-correcto
                                    for(var i=0; i<points.length; i++)
                                        for(var j=i; j<points.length; j++)
                                            if(z[i].x > points[j].x){
                                                aux_z = z[i];
                                                z[i] = points[j];
                                                points[j] = aux_z;
                                            }
                                            
                                    /**********************************
                                      Los puntos se deben de iniciar:
                                        - Point1: Down  - Left
                                        - Point2: High  - Left
                                        - Point3: Hight - Right
                                        - Point4: Down  - Right
                                    ***********************************/    

                                    var h1 = points[0].y + points[3].y;
                                    points[0].y = h1/2;
                                    points[3].y = h1/2;

                                    h1 = points[1].y + points[2].y;
                                    points[1].y = h1/2;
                                    points[2].y = h1/2;
                                    
                                    totalpoints.push(points);
                                    totalpoints.push(CutPointsBases(points, numero_divisiones_verticales));
                                    totalpoints.push(CutPointsLateral(points, numero_divisiones_horizontales));
                                    
                                    if(activ == "OFF"){
                                        $("#svgContainer").attr("active", "ON");
                                        drawPoints(totalpoints[0], size_perfil, color_perfil);
                                        drawLines(totalpoints[1][0], totalpoints[1][1], size_vertical, color_vertical);
                                        drawLines(totalpoints[2][0], totalpoints[2][1], size_horizontal, color_horizontal);

                                        swal({
                                            title: "Is the grid correct?",
                                            text: "",
                                            type: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#DD6B55",
                                            confirmButtonText: "Yes, save it!",
                                            cancelButtonText: "No, deleted!",
                                            closeOnConfirm: false,
                                            closeOnCancel: false
                                            },
                                            function(isConfirm){
                                            if (!isConfirm) {
                                                var el = document.getElementById('svgContainer');
                                                var ctx = el.getContext('2d');

                                                ctx.clearRect(0, 0, 700, 400);
                                                points.length = 0;
                                                totalpoints.length = 0;
                                                swal("Deleted!", "The grid is empty. Select the four corners.", "success");
                                            } else {
                                                swal("Created Grid", "The grid is OK. Pulse save-grid for save the grid.", "success");
                                            }
                                        });
                                    }
                                }         
                            };
                            
                        });
            });
        }
    });

});

function drawPoints(points, size, color){

    var el = document.getElementById('svgContainer');
    var rect = el.getBoundingClientRect();
    var ctx = el.getContext('2d');

    ctx.width=$("#svgContainer").css("width");
    ctx.height=$("#svgContainer").css("height");

    var desviacionx = rect.left;
    var desviaciony = rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    ctx.beginPath();  
        ctx.moveTo(points[0].x-desviacionx, points[0].y-desviaciony);
            
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x-desviacionx, points[i].y-desviaciony);
        }       
        ctx.lineTo(points[0].x-desviacionx, points[0].y-desviaciony);
    ctx.stroke();

}

function drawLines(points1, points2, size, color){
    var el = document.getElementById('svgContainer');
    var rect = el.getBoundingClientRect();
    var ctx = el.getContext('2d');

    ctx.width=$("#svgContainer").css("width");
    ctx.height=$("#svgContainer").css("height");

    var elemento = document.getElementById('svgContainer');
    var posicion = elemento.getBoundingClientRect();
 
    var desviacionx = rect.left;
    var desviaciony = rect.top;

    //alert("Top: " + posicion.top + "\nRight: " + posicion.right + "\nBottom: " +  posicion.bottom + "\nLeft: " +  posicion.left + "\n\nDesvX: " + desviacionx + "DesvY: " + desviaciony);

    ctx.beginPath();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        for (var i = 0; i < points1.length; i++) {
            ctx.moveTo(points1[i].x-desviacionx, points1[i].y-desviaciony);
            ctx.lineTo(points2[i].x-desviacionx, points2[i].y-desviaciony);
        }       
    ctx.stroke();
}


function CutPointsBases(points, n_divisiones){
    var numero_divisiones_verticales = n_divisiones;
    var cutpoints = [];

    var pfv, d1, d2;

    var rectas_laterales = [];  // Laterales del trapecio
    var rectas_bases = [];      // Bases del trapecio
    var rectas_pfv = [];        // rectas que pasan por Punto de Fuga -- Vertical
    var rectas_pfh = [];        // rectas que pasan por Punto de Fuga -- Horizontal
    var fugasD = [];            // Puntos de fuga D1 y D2. Determinan las lineas horizontales
    var cutbasemenor = [];      // Puntos de corte en la base menor
    var cutbasemayor = [];      // Puntos de corte en la base Mayor
    var cutlateralizda = [];    // Puntos de corte en el lado lateral izquierdo
    var cutlateraldcha = [];    // Puntos de corte en el lado lateral derecho


    var p1 = points[0];
    var p2 = points[1];

    rectas_laterales.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y}); //Izquierdo

    p1 = points[2];
    p2 = points[3];

    rectas_laterales.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y}); //Derecho

    var p1 = points[1];
    var p2 = points[2];

    rectas_bases.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y});

    p1 = points[3];
    p2 = points[0];

    rectas_bases.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y});

    //Punto de fuga pfv
    var x_ = ((rectas_laterales[1].k - rectas_laterales[0].k)/(rectas_laterales[0].m - rectas_laterales[1].m));
    var y_ = x_*rectas_laterales[0].m + rectas_laterales[0].k;

    pfv = {x: x_, y: y_};


    /***************************************************************************************/
    /*      DIVISIONES EN LAS BASES::
    /*
    /*      CÁLCULO DE DIVISIONES VERTICALES DEL CAMPO
    /***************************************************************************************/

    /***************************************************************************************
        Calcular los puntos de la base del triangulo isosceles donde el angulo diferente se
        encuentra donde el vértice el PFV.
        Es decir, dos puntos P y S, donde 
            1. |P-PFV| = |S-PFV|
            2. P pertenece a rectas_laterales[0] 
            3. S pertenece a rectas_laterales[1]
    ****************************************************************************************/

    //Se elige un punto al azar en una de las rectas de rectas_laterales.

    var p1x=pfv.x-50;
    var p2y=p1x*rectas_laterales[0].m + rectas_laterales[0].k;
    var pfvP={x: p1x, y: p2y};
    var pfhP = {x: p1x, y: p2y};
    var pfv_p = Math.pow((pfv.x-pfvP.x)*(pfv.x-pfvP.x) + (pfv.y-pfvP.y)*(pfv.y-pfvP.y), 0.5);
    var a,b,c,m,k,t;
    
    m = rectas_laterales[1].m;
    k = rectas_laterales[1].k;
    t = pfv_p;
    a = 1+m*m;
    b = -2*pfv.x + 2*m*k - 2*pfv.y*m;
    c = -2*pfv.y*k + k*k -t*t + pfv.x*pfv.x + pfv.y*pfv.y;

    var aux = Math.pow(b*b - 4*a*c, 0.5);
    var p2x = (-1*b + aux)/(2*a);
    var p2x_ = (-1*b - aux)/(2*a);
    var p2y, pfvS, pfhS;

    if(p2x > p2x_){
        p2y = m*p2x + k;
        pfvS = {x: p2x, y: p2y};
        pfhS = {x: p2x, y: p2y};
    }
    else{
        p2y = m*p2x_ + k;
        pfvS = {x: p2x_, y: p2y};
        pfhS = {x: p2x, y: p2y};
    }

    var pfv_s = Math.pow((pfv.x-pfvS.x)*(pfv.x-pfvS.x) + (pfv.y-pfvS.y)*(pfv.y-pfvS.y), 0.5);

    /*****************************************************************************************
        Se calcula la recta que pasa por P y S (pfvP y pfvS respectivamente) y a continuación 
        los n puntos que indican el numero de divisiones.
    *****************************************************************************************/

    var cutpoints_vertical = [];
    var p1 = pfvP;
    var p2 = pfvS;
    var incremento_x = (p2.x - p1.x)/numero_divisiones_verticales;
    var incremento_y = (p2.y - p1.y)/numero_divisiones_verticales;

    for(var i=0; i<numero_divisiones_verticales-1; i++){
        p1.x = p1.x+incremento_x;
        p1.y = p1.y+incremento_y;

        cutpoints_vertical.push({x:p1.x, y:p1.y});
        //$('#points_ppl').append($('<li> x: ' + cutpoints_vertical[i].x + ', y: '+ cutpoints_vertical[i].y +' </li>'));
    }

    //Cálculo de las rectas que pasan por PFV y los puntos de corte cutpoints_vertical.
    
    p1 = pfv;

    for(var i=0; i<numero_divisiones_verticales-1; i++){
        p2 = cutpoints_vertical[i];
        rectas_pfv.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y});
    }

    //Puntos de corte de base menor y base mayor con rectas_pfv

    for(var i=0; i<rectas_pfv.length; i++){
        x_ = ((rectas_pfv[i].k - rectas_bases[0].k)/(rectas_bases[0].m - rectas_pfv[i].m));
        y_ = x_*rectas_pfv[i].m + rectas_pfv[i].k;

        cutbasemenor.push( {x: x_, y: y_} );

        x_ = ((rectas_pfv[i].k - rectas_bases[1].k)/(rectas_bases[1].m - rectas_pfv[i].m));
        y_ = x_*rectas_pfv[i].m + rectas_pfv[i].k;

        cutbasemayor.push( {x: x_, y: y_} );
    }

    cutpoints.push(cutbasemayor);
    cutpoints.push(cutbasemenor);

    return cutpoints;
}



function CutPointsLateral(points, n_divisiones){

    var cutpoints = [];

    var pfv, d1, d2;

    var rectas_laterales = [];  // Laterales del trapecio
    var rectas_bases = [];      // Bases del trapecio
    var rectas_pfv = [];        // rectas que pasan por Punto de Fuga -- Vertical
    var rectas_pfh = [];        // rectas que pasan por Punto de Fuga -- Horizontal
    var fugasD = [];            // Puntos de fuga D1 y D2. Determinan las lineas horizontales
    var cutbasemenor = [];      // Puntos de corte en la base menor
    var cutbasemayor = [];      // Puntos de corte en la base Mayor
    var cutlateralizda = [];    // Puntos de corte en el lado lateral izquierdo
    var cutlateraldcha = [];    // Puntos de corte en el lado lateral derecho


    var p1 = points[0];
    var p2 = points[1];

    rectas_laterales.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y}); //Izquierdo

    p1 = points[2];
    p2 = points[3];

    rectas_laterales.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y}); //Derecho

    var p1 = points[1];
    var p2 = points[2];

    rectas_bases.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y});

    p1 = points[3];
    p2 = points[0];

    rectas_bases.push({ m: (p2.y - p1.y)/(p2.x-p1.x), k: -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y});

    //Punto de fuga pfv
    var x_ = ((rectas_laterales[1].k - rectas_laterales[0].k)/(rectas_laterales[0].m - rectas_laterales[1].m));
    var y_ = x_*rectas_laterales[0].m + rectas_laterales[0].k;

    pfv = {x: x_, y: y_};


    var numero_divisiones_horizontales = n_divisiones;
    var cutpoints = [];
    var p1x=pfv.x-50;
    var p2y=p1x*rectas_laterales[0].m + rectas_laterales[0].k;
    var pfvP={x: p1x, y: p2y};
    var pfhP = {x: p1x, y: p2y};
    var pfv_p = Math.pow((pfv.x-pfvP.x)*(pfv.x-pfvP.x) + (pfv.y-pfvP.y)*(pfv.y-pfvP.y), 0.5);
    var a,b,c,m,k,t;
    
    m = rectas_laterales[1].m;
    k = rectas_laterales[1].k;
    t = pfv_p;
    a = 1+m*m;
    b = -2*pfv.x + 2*m*k - 2*pfv.y*m;
    c = -2*pfv.y*k + k*k -t*t + pfv.x*pfv.x + pfv.y*pfv.y;

    var aux = Math.pow(b*b - 4*a*c, 0.5);
    var p2x = (-1*b + aux)/(2*a);
    var p2x_ = (-1*b - aux)/(2*a);
    var p2y, pfvS, pfhS;

    if(p2x > p2x_){
        p2y = m*p2x + k;
        pfvS = {x: p2x, y: p2y};
        pfhS = {x: p2x, y: p2y};
    }
    else{
        p2y = m*p2x_ + k;
        pfvS = {x: p2x_, y: p2y};
        pfhS = {x: p2x, y: p2y};
    }

    var pfv_s = Math.pow((pfv.x-pfvS.x)*(pfv.x-pfvS.x) + (pfv.y-pfvS.y)*(pfv.y-pfvS.y), 0.5);

                var cutpoints_horizontal = [];
                var q1 = pfhP;
                var q2 = pfhS;
                var qincremento_x = (q2.x - q1.x)/numero_divisiones_horizontales;
                var qincremento_y = (q2.y - q1.y)/numero_divisiones_horizontales;

                for(var i=0; i<numero_divisiones_horizontales-1; i++){
                    q1.x = q1.x+qincremento_x;
                    q1.y = q1.y+qincremento_y;

                    cutpoints_horizontal.push({x:q1.x, y:q1.y});
                }

                //Cálculo de las rectas que pasan por PFV y los puntos de corte cutpoints_horizontal.
                
                var cutbasemayorh = [];
                var cutbasemenorh = [];
                var rectas_pfh = [];
                q1 = pfv;

                for(var i=0; i<numero_divisiones_horizontales-1; i++){
                    q2 = cutpoints_horizontal[i];
                    rectas_pfh.push({ m: (q2.y - q1.y)/(q2.x-q1.x), k: -1*(q1.x*((q2.y-q1.y)/(q2.x-q1.x)))+q1.y});
                }

                //Puntos de corte de base menor y base mayor con rectas_pfh

                for(var i=0; i<rectas_pfh.length; i++){
                    x_ = ((rectas_pfh[i].k - rectas_bases[0].k)/(rectas_bases[0].m - rectas_pfh[i].m));
                    y_ = x_*rectas_pfh[i].m + rectas_pfh[i].k;

                    cutbasemenorh.push( {x: x_, y: y_} );

                    x_ = ((rectas_pfh[i].k - rectas_bases[1].k)/(rectas_bases[1].m - rectas_pfh[i].m));
                    y_ = x_*rectas_pfh[i].m + rectas_pfh[i].k;

                    cutbasemayorh.push( {x: x_, y: y_} );
                }

                /*********************************
                    Crear las rectas diagonales:
                        points[0] -- points[2]
                        points[1] -- points[3]

                *********************************/
                var diagonales = [];
                var d1 = points[0];
                var d2 = points[2];

                diagonales.push({ m: (d2.y - d1.y)/(d2.x-d1.x), k: -1*(d1.x*((d2.y-d1.y)/(d2.x-d1.x)))+d1.y}); 

                d1 = points[1];
                d2 = points[3];

                diagonales.push({ m: (d2.y - d1.y)/(d2.x-d1.x), k: -1*(d1.x*((d2.y-d1.y)/(d2.x-d1.x)))+d1.y}); 

                
                //Puntos de corte de rectas_pfh con diagonales:

                var cut_d1 = [];
                var cut_d2 = [];
                var x_, y_;

                for(var i=0; i<rectas_pfh.length; i++){
                    x_ = ((rectas_pfh[i].k - diagonales[0].k)/(diagonales[0].m - rectas_pfh[i].m));
                    y_ = x_*rectas_pfh[i].m + rectas_pfh[i].k;

                    cut_d1.push( {x: x_, y: y_} );

                    x_ = ((rectas_pfh[i].k - diagonales[1].k)/(diagonales[1].m - rectas_pfh[i].m));
                    y_ = x_*rectas_pfh[i].m + rectas_pfh[i].k;

                    cut_d2.push( {x: x_, y: y_} );
                }

                cut_d1.reverse();

                var rectas_horizontales = [];

                //Crear las rectas que cruzan por cut_d1[i]-cut_d2[i]
                var l1, l2 = cut_d1[i];
                var l2 = cut_d2[i];


                for(var i=0; i<cut_d1.length; i++){
                    l1 = cut_d1[i];
                    l2 = cut_d2[i];
                    rectas_horizontales.push({ m: (l2.y - l1.y)/(l2.x-l1.x), k: -1*(l1.x*((l2.y-l1.y)/(l2.x-l1.x)))+l1.y}); 
                }


                //  Crear rectas paralelas a las bases que pasan por los puntos de corte de una diagonal.

                var paralelas_bases = [];

                for(var i=0; i<cut_d1.length; i++){
                    paralelas_bases.push({m: rectas_bases[0].m, k: rectas_bases[0].m*cut_d1[i].x + cut_d1[i].y});
                }


                //Determinar punto de corte de rectas_paralelas con los laterales

                for(var i=0; i<paralelas_bases.length; i++){
                    x_ = ((paralelas_bases[i].k - rectas_laterales[0].k)/(rectas_laterales[0].m - paralelas_bases[i].m));
                    y_ = x_*paralelas_bases[i].m + paralelas_bases[i].k;

                    cutlateralizda.push( {x: x_, y: y_} );
                    
                    x_ = ((paralelas_bases[i].k - rectas_laterales[1].k)/(rectas_laterales[1].m - paralelas_bases[i].m));
                    y_ = x_*paralelas_bases[i].m + paralelas_bases[i].k;

                    cutlateraldcha.push( {x: x_, y: y_} );
                }
    cutpoints.push(cutlateralizda);
    cutpoints.push(cutlateraldcha);

    return cutpoints;
}

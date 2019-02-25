var divisionesV = 9;
var divisionesH = 18;
var colorDraw = 'white';
var colorDraw2 = 'blue';
var sizeDraw = 0.25;
var draw1 = false;
var points = [];
var points2 = [];
var pointsC = [];
var pointsC2 = [];

var extension_frontal = false;
var extension_lateral = false;

var l_ante;
var letra_criterio = false;
var n_Categoria = "";
var critery_key = "";
var type_crtry;
var id_radio;
var n_fila = 0;
var marA, marB;
var marA_anterior = -1;
var marB_anterior = -1;
var nueva_info = false;
var name_critery = "";
var name_category = "";
var criteries_types = "";
var suelo_altura_=false;

var keys_to_criterys = [];
var keys_to_descriptors = [];
var puntos_lateral = [], puntos_frontal = [];

function PuntoEquidistanteRecta(recta, punto, distancia){
    var y_ = recta.m*punto.x + recta.k;

    if(y_ == punto.y){
        var ai, bi, ti, ki, ci, mi;
        var Ai, Bi, CCi;

        ai = punto.x; 
        bi = punto.y; 
        ti = distancia; 
        ki = recta.k; 
        mi = recta.m;

        Ai = 1+mi*mi;
        Bi = 2*(mi*ki - ai - bi*mi);
        CCi = -1*(ti*ti - ai*ai - bi*bi - ki*ki + 2*bi*ki);

        var x1_aux = (-1*Bi + Math.sqrt(Bi*Bi - 4*Ai*CCi)) / (2*Ai);
        var x2_aux = (-1*Bi - Math.sqrt(Bi*Bi - 4*Ai*CCi)) / (2*Ai);
        var x1 = x1_aux;
        var x2 = x2_aux;
        
        var y1 = mi*x1 + ki;
        var y2 = mi*x2 + ki;

        var pcorte1 = { x: x1, y: y1 };
        var pcorte2 = { x: x2, y: y2 };

        var puntos = [pcorte1, pcorte2];
        return puntos;
    }
    else{
        return 0;
    }
}


function ExtensionFrontal(points3m){
    var p_extension = [];

    var recta_inferior = RectaDosPuntos(points3m[0], points3m[3]);
    var recta_superior = RectaDosPuntos(points3m[1], points3m[2]);
    var recta_izda = RectaDosPuntos(points3m[0], points3m[1]);
    var recta_dcha = RectaDosPuntos(points3m[2], points3m[3]);

    var fugas = PuntosDeFuga(points3m);
    var centro = (PuntoDeCorte(RectaDosPuntos(points3m[0], points3m[2]), RectaDosPuntos(points3m[1], points3m[3])));
    var p_centro_sup = PuntoDeCorte(RectaDosPuntos(fugas[0], centro), recta_superior);
    var p_centro_inf = PuntoDeCorte(RectaDosPuntos(fugas[0], centro), recta_inferior);

    p_extension.push(PuntoDeCorte(RectaDosPuntos(points3m[2], p_centro_inf), recta_izda));
    p_extension.push(PuntoDeCorte(RectaDosPuntos(points3m[3], p_centro_sup), recta_izda));

    p_extension.push(PuntoDeCorte(RectaDosPuntos(points3m[0], p_centro_sup), recta_dcha));
    p_extension.push(PuntoDeCorte(RectaDosPuntos(points3m[1], p_centro_inf), recta_dcha));

    console.log("Puntos_entendidos Frontal");
    console.log(p_extension);

    return p_extension;
}


function ExtensionLateral(points3m){
    var p_extension = [];
    
    var fugas = PuntosDeFuga(points3m);
    var recta_superior = RectaDosPuntos(points3m[1], points3m[2]);
    var recta_inferior = RectaDosPuntos(points3m[0], points3m[3]);

    p_extension.push(PuntoDeCorte(RectaDosPuntos(fugas[2], points3m[1]), recta_inferior));
    p_extension.push(PuntoDeCorte(RectaDosPuntos(fugas[1], points3m[0]), recta_superior));

    p_extension.push(PuntoDeCorte(RectaDosPuntos(fugas[2], points3m[3]), recta_superior));
    p_extension.push(PuntoDeCorte(RectaDosPuntos(fugas[1], points3m[2]), recta_inferior));

    console.log("Puntos_entendidos Frontal");
    console.log(p_extension);


    return p_extension;
}

function PerpendicularPunto(r, p){
	var nueva_recta = {
		m: (-1.0)/(1.0*r.m),
		k: 0
	}
    nueva_recta.k = -1.0*nueva_recta.m*p.x + p.y;
    
    return nueva_recta;
}

function PuntosDeFuga(puntos_campo){

    var rectas_campo = [];
    var fugas = [];
    var diagonal1, diagonal2;
    var auxiliar_fugas;


    for(var i=0; i<4; i++)
        rectas_campo.push(RectaDosPuntos(puntos_campo[i], puntos_campo[(i+1)%4]));

    diagonal2 = RectaDosPuntos(puntos_campo[0], puntos_campo[2]);
    diagonal1 = RectaDosPuntos(puntos_campo[1], puntos_campo[3]);

    fugas.push(PuntoDeCorte(rectas_campo[0], rectas_campo[2]));
    /*
    Triangulo formado por puntos_campo[0], fugas[0], puntos_campo[3]
    */
    var rr = PerpendicularPunto(rectas_campo[3], fugas[0]);
    var aa = PerpendicularPunto(rr, fugas[0]);

    auxiliar_fugas = ParalelaPunto(aa, fugas[0]);

    fugas.push(PuntoDeCorte(auxiliar_fugas, diagonal1));
    fugas.push(PuntoDeCorte(auxiliar_fugas, diagonal2));

    fugas.push(PuntoDeCorte(diagonal1, diagonal2));
    
    //Recta perpendicular a rectas_campo[3] que pasa por fugas[0]
    var perpendicular_aux = PerpendicularPunto(rectas_campo[3], fugas[0]);
    fugas.push(PuntoDeCorte(rectas_campo[3], perpendicular_aux));

    return fugas;
}

function ABC(puntos_campo){

    var rectas_campo = [];
    var fugas = [];
    var abc = []; //SOLUCION
    var diagonal1, diagonal2;
    var auxiliar_fugas;
    var r, t;
    var a, b, c;
    var error = 1, margen;
    var ab, ac;
    var contador = 0;    
    var err = false;
    var err_aux = false;

    for(var i=0; i<4; i++)
        rectas_campo.push(RectaDosPuntos(puntos_campo[i%4], puntos_campo[(i+1)%4]));

    fugas = PuntosDeFuga(puntos_campo);

    //Recta que contiene a A.
    r = RectaDosPuntos(fugas[0], fugas[3]);
    
    a = {
    	x: 0,
    	y: fugas[0].y - 50
    }
    a.x = (a.y - r.k)/r.m;

    //b, c, t

    t = ParalelaPunto(rectas_campo[1], a);
    b = PuntoDeCorte(rectas_campo[2], t);
    c = PuntoDeCorte(rectas_campo[0], t);

    ab = DistanciaPuntos(a,b);
    ac = DistanciaPuntos(a,c);

    error = Math.abs(ab - ac);
    margen = 0.1;

    while(error > 0.00001){
        if(ab > ac){
            b.y+=margen;
            err = false;
        }
        else{
            b.y-=margen;
            err = true;
        }

        b.x = (b.y - rectas_campo[2].k)/rectas_campo[2].m;
        t = RectaDosPuntos(a, b);
        c = PuntoDeCorte(t, rectas_campo[0]);

        ab = DistanciaPuntos(a,b);
        ac = DistanciaPuntos(a,c);

        error = Math.abs(ab - ac);
        
        if(error > 10)
            margen = Math.abs(error/4.0);
        else{
            if(contador < 10)
                margen = 0.01;
            else
                margen = margen/2.0;
        }

        if(err_aux != err){
            contador ++;
            err_aux = err;
        }

    }

    abc.push(a);
    abc.push(b);
    abc.push(c);

    return abc;
}



function drawGrid(points3m, divisionesV, divisionesH, colorV, colorH, size, svg, el_ctx, camara, extender){

    var el = svg;
    var ctx = el_ctx;

    ctx.lineWidth = size+0.5;
    ctx.width=665;
    ctx.height=500;
    ctx.lineJoin = ctx.lineCap = 'round';

    var scroll1 = $(window).scrollTop();
    var rect = el.getBoundingClientRect();
    var desviacionx = rect.left;
    var desviaciony = rect.top + scroll1;

    var points_field = [];

	if(extender){   
	    if(camara == "frontal")
	        points_field = ExtensionFrontal(points3m);
	    else
	        if(camara == "lateral")
	            points_field = ExtensionLateral(points3m);
	}
	else
		points_field = points3m.slice();


	/************************************************/
	//		Annadir un atributo 
	//		al id en canvas HTML con los puntos
	//************************************************/
	var id_canvas;
	if(camara == "frontal")
	    id_canvas = "#svgContainer1"
	
	 if(camara == "lateral")
	    id_canvas = "#svgContainer2"
	
	for(var i=0; i<points_field.length; i++)
		$(id_canvas).attr("p"+i, points_field[i].x + "," + points_field[i].y);

    $(id_canvas).attr("desviacionX", desviacionx);
    $(id_canvas).attr("desviacionY", desviaciony);
/*
	console.log("Puntos:");
	for(var i=0; i<4; i++)
		console.log(points_field[i].x + ", " + points_field[i].y)
*/
	/******************************************/
	var fugas = PuntosDeFuga(points_field);
    var abc = ABC(points_field);
    var field_limits = []; //Lineas limitadoras del campo	
	var recta_BC = RectaDosPuntos(abc[1], abc[2]);

	for(var i=0; i<4; i++)
		field_limits.push(RectaDosPuntos(points_field[i], points_field[(i+1)%4]));

	/*** Pinto lineas limitadoras del campo ***/
    ctx.beginPath();  
        ctx.moveTo(points_field[0].x-desviacionx, points_field[0].y-desviaciony);
            
        for (var i = 1; i < points_field.length; i++) {
            ctx.lineTo(points_field[i].x-desviacionx, points_field[i].y-desviaciony);
        }       
        ctx.strokeStyle = colorV;
        ctx.lineTo(points_field[0].x-desviacionx, points_field[0].y-desviaciony);
    ctx.stroke();
/*
    console.log("Puntos FUGA:");
	for(var i=0; i<fugas.length; i++)
		console.log(fugas[i].x + ", " + fugas[i].y)

	console.log("Puntos ABC:");
	for(var i=0; i<abc.length; i++)
		console.log(abc[i].x + ", " + abc[i].y)

*/
    /******************************************************************************
        Lineas verticales // divisionesV
    /******************************************************************************/

    var c_aux = abc[2];
    c_aux.y -= divisionesV;
    var p_aux = c_aux;
    var recta_paralela_principal = RectaDosPuntos(c_aux, abc[1]);
    var recta_paralela_aux;

    var cortes_abc = [];

    for(var i=0; i<divisionesV; i++){
    	cortes_abc.push(PuntoDeCorte(recta_BC, ParalelaPunto(recta_paralela_principal, c_aux)));
    	c_aux.y+=1;
    }

	/*******/
	var cortes_menor = [], cortes_mayor = [];

	for(var i=0; i<cortes_abc.length; i++){
		cortes_menor.push(PuntoDeCorte(RectaDosPuntos(cortes_abc[i], fugas[0]), field_limits[1]));
		cortes_mayor.push(PuntoDeCorte(RectaDosPuntos(cortes_abc[i], fugas[0]), field_limits[3]));
	}

    
    for(var i=0; i<cortes_menor.length; i++){
        ctx.beginPath();  
            ctx.moveTo(cortes_menor[i].x-desviacionx, cortes_menor[i].y-desviaciony);
            ctx.strokeStyle = colorV;
            ctx.lineTo(cortes_mayor[i].x-desviacionx, cortes_mayor[i].y-desviaciony);
        ctx.stroke();
    }
    
    /******************************************************************************
        Lineas Horizontales // divisionesH
    /******************************************************************************/

    c_aux = abc[2];
    c_aux.y -= divisionesH;
    recta_paralela_principal = RectaDosPuntos(c_aux, abc[1]);
    cortes_abc = [];

    for(var i=0; i<divisionesH; i++){
    	cortes_abc.push(PuntoDeCorte(recta_BC, ParalelaPunto(recta_paralela_principal, c_aux)));
    	c_aux.y+=1;
    }

	/*******/
	cortes_menor = [];
	cortes_mayor = [];

	for(var i=0; i<cortes_abc.length; i++){
		cortes_menor.push(PuntoDeCorte(RectaDosPuntos(cortes_abc[i], fugas[0]), field_limits[1]));
		cortes_mayor.push(PuntoDeCorte(RectaDosPuntos(cortes_abc[i], fugas[0]), field_limits[3]));
	}

	var lateral_dcho = [], lateral_izdo = [];

	for(var i=0; i<cortes_menor.length; i++){
		lateral_dcho.push(PuntoDeCorte(RectaDosPuntos(fugas[1], cortes_menor[i]), field_limits[2]));
		lateral_izdo.push(PuntoDeCorte(RectaDosPuntos(fugas[1], cortes_mayor[i]), field_limits[0]));
	}

	/**/
    for(var i=1; i<lateral_dcho.length; i++){
        ctx.beginPath();  
            ctx.moveTo(lateral_dcho[i].x-desviacionx, lateral_dcho[i].y-desviaciony);
            ctx.strokeStyle = colorH;
            ctx.lineTo(lateral_izdo[i].x-desviacionx, lateral_izdo[i].y-desviaciony);
        ctx.stroke();
    }

    var idvideo = $("#margen-frontal").attr("idvideo");

    $.ajax({
            type: "POST",
            url: "/api/showvideos/addgrid",
            data: JSON.stringify({ id: idvideo, puntos: points3m, 
                                        dvV: divisionesV, dvH: divisionesH, clrV: colorV, clrH: colorH, sz: size, 
                                                    plano: camara, desvX: desviacionx, desvY: desviaciony }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) 
            {
                console.log(data.status);
            },
            error: function(err) 
            {
                console.log(err.status);
            }
        });
    
}

var puntoX=-1, puntoY=-1; puntoZ=-1;

function ReDrawGrid(points, divisionesV, divisionesH, colorV, colorH, size, svg, el_ctx, camara, extender){
    var el = svg;
    var ctx = el_ctx;

    var rect = el.getBoundingClientRect();
    var desviacionx = rect.left;
    var desviaciony = rect.top;

    ctx.width=665;
    ctx.height=500;
    var puntos_altura = [];//, puntos_lateral = [], puntos_frontal = [];

    var suelo_x;
    var suelo_y;
    el.onmouseup = function(e) {

        //alert($('input[name=opt-grid]:checked').val()); 
        var can_draw = $('input[name=opt-grid]:checked').val();

        var in_table = $('input[name=opt-grid]:checked').attr("insert");

        //alert(can_draw);
        var distancia = [];
        var d_menor;
        var indice;
        
        var new_point;

        var scroll = $(window).scrollTop();
        var yx = e.clientY + scroll;
        
        new_point = { x: e.clientX, y: yx };
        

        for(var i=0; i<points.length; i++){
            var d = Math.sqrt((new_point.x - points[i].x)*(new_point.x - points[i].x) + (new_point.y - points[i].y)*(new_point.y - points[i].y));
            distancia.push(d);
        }
        if(can_draw == "draw"){
            d_menor = distancia[0];
            indice = 0;
            for(var j=0; j<distancia.length; j++){
                if(d_menor > distancia[j]){
                    d_menor = distancia[j];
                    indice = j;
                }
            }
            points[indice] = new_point;

            ctx.clearRect(0, 0, ctx.width, ctx.height);

            drawGrid(points, divisionesV, divisionesH, colorV, colorH, size, svg, el_ctx, camara, extender);
        }
        else{
            var coordenadaxy = CoordenadaXY(new_point, svg, el_ctx, camara);
            var x, y, altura;
            if(can_draw == "positionxy"){ 

                if(in_table == "ON"){
                	x = coordenadaxy.x;
                	y = coordenadaxy.y;

                    $('td#'+n_fila+'-x-'+name_critery).text(x);
                    $('td#'+n_fila+'-y-'+name_critery).text(y);
                }   
            }
            else{
                if(can_draw == "positionxyz"){
                	if(el.id == "svgContainer2"){
                		console.log("ADD 2");
                    	puntos_lateral.push(new_point);
                    	console.log(puntos_lateral);
                	}
                    if(el.id == "svgContainer1"){
                    	console.log("ADD 1");
                    	puntos_frontal.push(new_point); 
                    	console.log(puntos_frontal);
                    }
                }
                
                if(el.id == "svgContainer2"){
                        y = coordenadaxy[0];
                        x = (Math.abs(((coordenadaxy[1])/2)-9))%9;
                        x = x.toFixed(2);
                        //alert(x + ", " + y + ", altura: " + altura);
                    }
                    else{
                        x = (coordenadaxy[0]/2);
                        x = x.toFixed(2);
                        y = coordenadaxy[1];  
                    } 

                if(puntos_altura.length==1){
                    suelo_x = x;
                    suelo_y = y;
                }

                console.log(puntos_lateral.length + " " + puntos_frontal.length + " " + can_draw);
                if((puntos_lateral.length >0) && (puntos_frontal.length >0) && (can_draw == "positionxyz")){
                	console.log("Entro");
                    var punto0 = balon3D(puntos_frontal, puntos_lateral);
                    
                    altura = punto0.y;
                    suelo_x = punto0.x;
                    suelo_y = punto0.z;

                    can_draw = $('input[name=opt-grid]:checked').val();
                    

                    if(in_table == "ON"){
                        $('td#'+n_fila+'-x-'+name_critery).text(suelo_x);
                        $('td#'+n_fila+'-y-'+name_critery).text(suelo_y);
                        $('td#'+n_fila+'-z-'+name_critery).text(altura);
                        
                    }
                    puntos_altura = []; 
                    puntos_lateral = [];
                    puntos_frontal = [];
                }
            }

        }
    }
}

function CoordenadaXYZ(p_clicks, svg, el_ctx, position){
    var points = [];
    if(position == "lateral"){
        points = ExtensionLateral(points3m);
    }
    else if(position == "frontal"){
        points = ExtensionFrontal(points3m);
    }

    var coordenada = [];
    //Calcular las rectas que originan el campo y diagonales
    var limites = [];
    var d = [];

    for(var i=0; i<points.length; i++){
        var recta_aux = RectaDosPuntos(points[i], points[(i+1)%4]);
        limites.push(recta_aux);

        if(d.length<2){
            var recta_d = RectaDosPuntos(points[i], points[(i+2)%4]);
            d.push(recta_d);
        }
    }

    /******************************************************************************
        A.Calcular puntos de fuga C, PFD, PFI
            1. C = punto de corte de extension de laterales
            2. Trazar recta paralela (t) a base menor por el punto C
            3. Crear rectas diagonales del campo (D1, D2)
                -d0: p0-p2
                -d1: p1-p3
            4. Calcular puntos de corte de las diagonales (D1, D2) con la recta t
                - PFD: D1-t
                - PFI: D2-t
    /******************************************************************************/

    //Paso 1.
    var c1 = PuntoDeCorte(limites[0], limites[2]);
    //Paso 2.
    var t = ParalelaPunto(limites[1], c1);
    //Paso 3. Realizado, var d
    var pf = [];
    pf.push(PuntoDeCorte(t, d[0])); // punto de fuga derecha
    pf.push(PuntoDeCorte(t, d[1])); // punto de fuga izquierda


    var punto_altura;

    var k = p_clicks[0];

    //Calculo de la coordenada Y para calcular la medida relativa a un metro
    //Recta que pasa por c1 y p_click
    var r1 = RectaDosPuntos(c1, k); //r1
    //Punto de corte de r1 y base mayor del campo
    var a = PuntoDeCorte(limites[3], r1); //a
    //Recta de punto a hasta pf[1], (izquierda)
    var r2 = RectaDosPuntos(pf[1], a); //r2
    //Recta que pasa por pf[0] y k
    var r3 = RectaDosPuntos(pf[0], k);
    //Punto de corte de r3 y base mayor del campo
    var b = PuntoDeCorte(limites[3], r3); //b
    //Recta que pasa por b y c1
    var r4 = RectaDosPuntos(b, c1);
    //Punto de corte de r3 y base mayor del campo
    var d = PuntoDeCorte(r2, r4); //d
    //Recta que pasa por d y k
    var r5 = RectaDosPuntos(d, k);
    //Punto de corte de r5 y lateral izquierdo
    var e = PuntoDeCorte(limites[0], r5); //e
   //Punto de corte de r5 y lateral derecho
    var f = PuntoDeCorte(limites[2], r5); //e
   
    var n_metro = 9;

    if(svg.id == "svgContainer2"){
        n_metro = 18;
    }

    var metro_relativo = DistanciaPuntos(e, f)/n_metro;
    metro_relativo = metro_relativo.toFixed(2);

    var psuelo = p_clicks[0];
    var pcielo = p_clicks[1];

    var x_media = (psuelo.x + pcielo.x)/2;

    psuelo = {x: x_media, y: psuelo.y};
    pcielo = {x: x_media, y: pcielo.y};

    var altura = DistanciaPuntos(p_clicks[0], p_clicks[1]);
    altura = altura/metro_relativo;
    altura = altura.toFixed(2);

    return altura;
}

function CoordenadaXY(p_click, svg, el_ctx, position){
    var points = [];
    var distancia_mayor, distancia_lateral;

    var solucion = {x:0, y:0};

    if(position == "lateral"){
    	distancia_mayor = 18;
    	distancia_lateral = 9;
		for(var i=0; i<4; i++)
			points.push(DividePar($("#svgContainer2").attr("p"+i)));
    }
		
    if(position == "frontal"){
    	distancia_mayor = 9;
    	distancia_lateral = 18;
       	for(var i=0; i<4; i++)
			points.push(DividePar($("#svgContainer1").attr("p"+i)));
    }

	var abc = ABC(points);
	var fugas = PuntosDeFuga(points);

	// eje X
	var r1 = RectaDosPuntos(p_click, fugas[0]);
	var r2 = RectaDosPuntos(abc[1], abc[2]);
	var p1 = PuntoDeCorte(r1, r2);
	var valor_x = DistanciaPuntos(p1, abc[2]);
	var distanciaBC = DistanciaPuntos(abc[1], abc[2]);
	
	var X_real = (distancia_mayor*valor_x)/distanciaBC;
	
	if(p1.x > abc[2].x)
		X_real *=-1;
	X_real = Math.round(X_real * 100) / 100.0;
	solucion.x = X_real;
	
	//eje Y
	
	//Paralela inferior
	var p1 = PuntoDeCorte(ParalelaPunto(RectaDosPuntos(points[3], points[0]), p_click), RectaDosPuntos(points[0], points[1]));
	var p2 = PuntoDeCorte(RectaDosPuntos(fugas[1], p1), RectaDosPuntos(points[3], points[0]));
	var p3 = PuntoDeCorte(RectaDosPuntos(p2, fugas[0]), RectaDosPuntos(abc[1], abc[2]));

	var distancia1 = DistanciaPuntos(p3, abc[2]);
	distancia1 = (distancia1*distancia_lateral)/DistanciaPuntos(abc[1], abc[2]);
	
	p1 = PuntoDeCorte(ParalelaPunto(RectaDosPuntos(points[1], points[2]), p_click), RectaDosPuntos(points[0], points[1]));
	p2 = PuntoDeCorte(RectaDosPuntos(fugas[1], p1), RectaDosPuntos(points[3], points[0]));
	p3 = PuntoDeCorte(RectaDosPuntos(p2, fugas[0]), RectaDosPuntos(abc[1], abc[2]));

	var distancia2 = DistanciaPuntos(p3, abc[2]);
	distancia2 = (distancia2*distancia_lateral)/DistanciaPuntos(abc[1], abc[2]);
		
	var distancia3 = Math.round(((distancia1+distancia2)/2) * 100) / 100.0;
	solucion.y = distancia3;

	if(distancia_lateral == 9){
		solucion.x = 9-distancia3;
		solucion.y = X_real;
	}
	//console.log("solucion: ");
	//console.log(solucion);
    return solucion;
}


$(document).ready(function(){
    var el = document.getElementById('svgContainer1');
    var ctx = el.getContext('2d');

    el.onmouseup = function(e) {
        var scroll = $(window).scrollTop();
        var yx = e.clientY + scroll;
        points.push({ x: e.clientX, y: yx });
        var color = 'white';
        var size = 0.5;


        //Reordenar puntos
        if (points.length == 4){
            //var lineade3 = $('#')
            if(!extension_frontal){
                var z = [];
                var aux_z;
                z=points;
                //Se ordenan los puntos por si al fijarlos con el raton han seguido un orden no-correcto
                for(var i=0; i<points.length; i++)
                    for(var j=i; j<points.length; j++)
                        if(z[i].x > points[j].x){
                            aux_z = z[i];
                            z[i] = points[j];
                            points[j] = aux_z;
                        }
            }

            drawGrid(points, divisionesV, divisionesH, colorDraw, colorDraw2, sizeDraw, el, ctx, "frontal", extension_frontal);
            draw1 = true;
            el.addEventListener("mousedown", ReDrawGrid(points, divisionesV, divisionesH, colorDraw, colorDraw2, sizeDraw, el, ctx, "frontal", extension_frontal));
        }
    }
});

$(document).ready(function(){
    var el2 = document.getElementById('svgContainer2');
    var ctx2 = el2.getContext('2d');
    
    el2.onmouseup = function(e) {
        var scroll = $(window).scrollTop();
        var yx = e.clientY + scroll;
        points2.push({ x: e.clientX, y: yx });
        var color = 'white';
        var size = 0.5;

        //Reordenar puntos
        if (points2.length == 4) {

            if(!extension_lateral){
                var z = [];
                var aux_z;
                z=points2;
                //Se ordenan los puntos por si al fijarlos con el raton han seguido un orden aleatorio
                for(var i=0; i<points2.length; i++)
                    for(var j=i; j<points2.length; j++)
                        if(z[i].x > points2[j].x){
                            aux_z = z[i];
                            z[i] = points2[j];
                            points2[j] = aux_z;
                        }
            }

            drawGrid(points2, divisionesH, divisionesV, colorDraw2, colorDraw, sizeDraw, el2, ctx2, "lateral", extension_lateral);
            draw2 = true;
            el2.addEventListener("mousedown", ReDrawGrid(points2, divisionesH, divisionesV, colorDraw2, colorDraw, sizeDraw, el2, ctx2, "lateral", extension_lateral));
        }
    }
});


function PuntoDeCorte(r, s){
    var puntoCorte;
    var x_, y_;
     
    x_ = (r.k - s.k)/(s.m - r.m);
    y_ = x_*r.m + r.k;

    puntoCorte = {	
    				x: x_, 
    				y: y_
    			};
    return puntoCorte;
}

function RectaDosPuntos(p1, p2){
    var nueva_recta;
    var m_, k_;

    m_ = (p2.y - p1.y) / (p2.x-p1.x);
    k_ =  -1*(p1.x*((p2.y-p1.y)/(p2.x-p1.x)))+p1.y;
    
    nueva_recta = {
					m: m_, 
					k: k_
				};
    return nueva_recta;
}

function SonParalelas(r, s){
    var paralela = false;

    if(r.m == s.m)
        paralela = true;

    return paralela;
}

function ParalelaPunto(r, p){
    var nueva_recta;
    var k1 = -1*(r.m*p.x) + p.y;

    nueva_recta = {
    				m: r.m, 
    				k: k1
    			};
    return nueva_recta;
}

function DistanciaPuntos(p1, p2){
    var d = Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));

    return d;
}

function ActualizaPuntuacion(equipoA, equipoB){
            var puntuacion = $("#puntos"+equipoA).text();
            //alert(puntuacion)
            puntuacion = 1*(puntuacion) + 1;
            $("#puntos"+equipoA).text(puntuacion);
            $("#puntos"+equipoA).css("border-bottom", "solid 1px red");
            $("#puntos"+equipoB).css("border-bottom", "");

            var puntuacionB = $("#puntos"+equipoB).text();
            puntuacionB = 1*(puntuacionB);

            var diferencia = puntuacion - puntuacionB;

            $("#saque").attr( "saque"+equipoA, "ON");
            $("#saque").attr( "saque"+equipoB, "OFF");

            if(puntuacion >=25 && diferencia > 1){
                var setA = $("#Set"+equipoA).text();
                //alert(puntuacion)
                setA = 1*(setA) + 1;
                $("#Set"+equipoA).text(setA);
                $("#puntos"+equipoA).text("0");
                $("#puntos"+equipoB).text("0");
            }
        }

function ActualizaRotacion(equipo){
    var rotacion = $("#rot"+equipo).text();
    //alert(puntuacion)
    var rot = (1*(rotacion[3])-1)%6;
    if(rot == 0) rot = 6;
    var r = "R"+equipo+"-"+rot;
    //alert(r)
    $("#rot"+equipo).text(r);

    //Actualizo rotacion
    $("input[name=rotation"+equipo+"][value=" + rot + "]").prop('checked', true);

    //Actualizo jugadores
    var pos_players = [];
    var contador = 0;
    for(var i=1; i<7; i++)
        pos_players.push($('#pos'+i+equipo).val());

    for(var i=0; i<pos_players.length; i++)
            pos_players[i] = 1*pos_players[i] +1-1;
    //alert(pos_players);

    var pos_new = [];

    for(var i=0; i<pos_players.length; i++){
        pos = i+1;
        if(pos == pos_players.length)
            pos_new.push(pos_players[0]);
        else
            pos_new.push(pos_players[pos]);
    }

    for(var i=0; i<6; i++){
        var pos = i+1;
        $('#pos'+pos+equipo).val(pos_new[i]);
    }

}

$(document).ready(function(){

    $("#add-puntuacionA").on("click",function(){

        var sacaA = $("#saque").attr("saqueA");
        var sacaB = $("#saque").attr("saqueB");
        //alert(sacaA + ", " + sacaB)
        ActualizaPuntuacion("A", "B");
        
        if(sacaA == "OFF"){
            //alert("dentro de if"+sacaA + ", " + sacaB)
            ActualizaRotacion("A");
        }
    });

    $("#add-puntuacionB").on("click",function(){

        var sacaA = $("#saque").attr("saqueA");
        var sacaB = $("#saque").attr("saqueB");
        //alert(sacaA + ", " + sacaB)

        ActualizaPuntuacion("B", "A");

        if(sacaB == "OFF"){
            //alert(sacaA + ", " + sacaB)
            ActualizaRotacion("B");
        }
    });
    
    $("#sub-puntuacionA").on("click",function(){
        var puntuacion = $("#puntosA").text();
        //alert(puntuacion)
        if(puntuacion != "0")
            puntuacion = 1*(puntuacion) - 1;
        $("#puntosA").text(puntuacion);
        $("#puntosA").css("border-bottom", "");
    });

    $("#sub-puntuacionB").on("click",function(){
        var puntuacion = $("#puntosB").text();
        //alert(puntuacion)
        if(puntuacion != "0")
            puntuacion = 1*(puntuacion) - 1;
        $("#puntosB").text(puntuacion);
        $("#puntosB").css("border-bottom", "");
    });


    $("#btn-rotationB").on("click", function(){
       $(".rotation#equipoB").css("display", "block");
       $(".rotation#equipoA").css("display", "none");
    });

    $("#btn-rotationA").on("click", function(){
       $(".rotation#equipoA").css("display", "block");
       $(".rotation#equipoB").css("display", "none");
    });

    $("#btn-rttn-a").on("click", function(){

        var pos_players = [];
        var contador = 0;
        for(var i=1; i<7; i++)
            pos_players.push($('#pos'+i+'A').val());


        for(var i=0; i<pos_players.length; i++){
            for(j=i+1; j<pos_players.length; j++)
                if(pos_players[i] == pos_players[j])
                    contador++;
        }


        for(var i=1; i<7; i++)
            $('#pos'+i+'A').attr("value", ""+pos_players[i-1]+"");

        var rotation = $('input[name=rotationA]:checked').val();

        var r= "RA-"+rotation;
        

        if(contador > 0){
            swal("No puede haber dorsales repetidos.");
        }
        else{
            if(rotation == null)
                swal("Elige una rotacion");
            else{
                $("#rotA").text(r);
                $(".rotation#equipoA").css("display", "none");
            }
        }
    });

    $("#btn-rttn-b").on("click", function(){

        var pos_players = [];
        var contador = 0;
        for(var i=1; i<7; i++)
            pos_players.push($('#pos'+i+'B').val());


        for(var i=0; i<pos_players.length; i++){
            for(j=i+1; j<pos_players.length; j++)
                if(pos_players[i] == pos_players[j])
                    contador++;
        }


        for(var i=1; i<7; i++)
            $('#pos'+i+'B').attr("value", ""+pos_players[i-1]+"");

        var rotation = $('input[name=rotationB]:checked').val();

        var r= "RB-"+rotation;
        

        if(contador > 0){
            swal("No puede haber dorsales repetidos.");
        }
        else{
            if(rotation == null)
                swal("Elige una rotacion");
            else{
                $("#rotB").text(r);
                $(".rotation#equipoB").css("display", "none");
            }
        }
    });
        

});


//Menu de criterios de template
$(document).ready(function() {
    $('ul.menu li:has(ul)').hover(function(e) {
         $(this).find('ul').css({display: "block"});
     },
     function(e) {
         $(this).find('ul').css({display: "none"});
     });
});

$(document).ready(function(){

    $("#opt-grid").on("click", function(){
        if(!document.getElementById( "grid-options" )) {

            $(".info-basic-video").append( '<table class="table" id="grid-options">'+
                                                '<thead>'+
                                                    '<tr>'+
                                                        '<th scope="col">#</th>'+
                                                        '<th scope="col">Color</th>'+
                                                        '<th scope="col">Tamaño Linea</th>'+
                                                        '<th scope="col">Nº Divisiones</th>'+
                                                    '</tr>'+
                                                '</thead>'+
                                                '<tbody>'+
                                                    '<tr>'+
                                                        '<th scope="row">Vertical</th>'+
                                                        '<td>'+
                                                            '<input class="form-control" type="color" value="#563d7c" id="color-vertical">'+
                                                        '</td>'+
                                                        '<td>'+
                                                            '<select class="form-control" id="size-vertical">'+
                                                                '<option>1</option>'+
                                                                '<option>2</option>'+
                                                                '<option>3</option>'+
                                                                '<option>4</option>'+
                                                            '</select>'+
                                                        '</td>'+
                                                        '<td>'+
                                                            '<input class="form-control" type="number" min="1" max="9" value="" id="n-vertical">'+
                                                        '</td>'+
                                                    '</tr>'+
                                                    '<tr>'+
                                                        '<th scope="row">Horizontal</th>'+
                                                        '<td>'+
                                                            '<input class="form-control" type="color" value="#563d7c" id="color-horizontal">'+
                                                        '</td>'+
                                                        '<td>'+
                                                            '<select class="form-control" id="size-horizontal">'+
                                                                '<option>1</option>'+
                                                                '<option>2</option>'+
                                                                '<option>3</option>'+
                                                                '<option>4</option>'+
                                                            '</select>'+
                                                        '</td>'+
                                                        '<td>'+
                                                            '<input class="form-control" type="number" min="1" max="18" value="" id="n-horizontal">'+
                                                        '</td>'+
                                                    '</tr>'+
                                                    '<tr>'+
                                                        '<th scope="row">Usar linea de 3 metros en Frontal</th>'+
                                                        '<td>'+
                                                            '<input type="checkbox" id="3metersF" name="check3metersF" value="check3metersF">'+
                                                        '</td>'+
                                                    '</tr>'+
                                                    '<tr>'+
                                                        '<th scope="row">Usar linea de 3 metros en Lateral</th>'+
                                                        '<td>'+
                                                            '<input type="checkbox" id="3metersL" name="check3metersL" value="check3metersL">'+
                                                        '</td>'+
                                                    '</tr>'+
                                                '</tbody>'+
                                                '<tr>'+
                                                    '<td>'+
                                                        '<p id="inftabledivisiones">Valores con respecto <br> al plano frontal del partido</p>'+
                                                    '</td>'+
                                                    '<td>'+
                                                        '<button type="submit" class="btn btn-default" id="btn-opts-grid">Submit</button>'+
                                                    '</td>'+
                                                '</tr>'+
                                                '<tr>'+
                                                    '<td>'+
                                                        '<button type="submit" class="btn btn-default" id="btn-opts-grid-cancel">Cancel</button>'+
                                                    '</td>'+
                                                '</tr>'+
                                            '</table>' 
                                        );
                    
                        $("#btn-opts-grid").click(function(){
                                var l3metrosF = $("#3metersF:checkbox:checked").length;
                                var l3metrosL = $("#3metersL:checkbox:checked").length;

                                //HOLIIII
                                if(l3metrosF > 0)
                                    extension_frontal = true;
                                else
                                    extension_frontal = false;
                                
                                if(l3metrosL > 0)
                                    extension_lateral = true;
                                else
                                    extension_lateral = false;

                                //alert(l3metrosF + ", " + l3metrosL);
                        });
                        /*
            $(".info-basic-video").append( '<div id="grid-options">'+
                                                '<div class="form-group">'+
                                                    '<label for="usr"><p id="title-div">Divisiones Verticales:</p></label>'+
                                                    '<ul class="list-inline" id="vlrs-grid">'+
                                                        '<li>'+
                                                            '<label for="color-vertical">Color:</label>'+
                                                            '<input class="form-control" type="color" value="#563d7c" id="color-vertical">'+
                                                            '</select>'+
                                                        '</li>'+
                                                        '<li>'+
                                                            '<label for="sel1">Size:</label>'+
                                                            '<select class="form-control" id="size-vertical">'+
                                                                '<option>1</option>'+
                                                                '<option>2</option>'+
                                                                '<option>3</option>'+
                                                                '<option>4</option>'+
                                                            '</select>'+
                                                        '</li>'+
                                                        '<li>'+
                                                            '<label for="sel1">N:</label>'+
                                                            '<input class="form-control" type="number" value="" id="n-vertical">'+
                                                         '</li>'+
                                                    '</ul>'+
                                                '</div>'+
                                                '<div class="form-group">'+
                                                    '<label for="usr"><p id="title-div">Divisiones Horizontales:</p></label>'+
                                                    '<ul class="list-inline" id="vlrs-grid">'+
                                                        '<li>'+
                                                            '<label for="color-horizontal">Color:</label>'+
                                                            '<input class="form-control" type="color" value="#563d7c" id="color-horizontal">'+
                                                        '</li>'+
                                                        '<li>'+
                                                            '<label for="sel1">Size:</label>'+
                                                            '<select class="form-control" id="size-horizontal">'+
                                                                '<option>1</option>'+
                                                                '<option>2</option>'+
                                                                '<option>3</option>'+
                                                                '<option>4</option>'+
                                                            '</select>'+
                                                        '</li>'+
                                                        '<li>'+
                                                            '<label for="sel1">N:</label>'+
                                                            '<input class="form-control" type="number" value="" id="n-horizontal">'+
                                                        '</li>'+
                                                    '</ul>'+
                                                '</div>'+
                                            '<button type="submit" class="btn btn-default" id="btn-opts-grid">Submit</button>'+
                                            '<button type="submit" class="btn btn-default" id="btn-opts-grid-cancel">Cancel</button>'+
                                        '</div>'
                                    );
                                    */
            $("#btn-opts-grid-cancel").on("click", function(){
                $('#grid-options').remove();
            });
            $("#btn-opts-grid").on("click", function(){
                sizeDraw = 0.25*($('#size-vertical').val());
                divisionesV = $('#n-vertical').val();
                divisionesH = $('#n-horizontal').val();
                colorDraw = $('#color-vertical').val();
                colorDraw2 = $('#color-horizontal').val();
                $("#grid-options").remove();
                if(draw1){
                    //console.log("repinta")
                    var el = document.getElementById('svgContainer1');
                    var ctx = el.getContext('2d');
                    var el2 = document.getElementById('svgContainer2');
                    var ctx2 = el2.getContext('2d');
                    ReDrawGrid(points, divisionesV, divisionesH, colorDraw, colorDraw2, sizeDraw, el, ctx, extension_frontal);
                    ReDrawGrid(points2, divisionesH, divisionesV, colorDraw2, colorDraw, sizeDraw, el2, ctx2, extension_lateral);
                }

            });
        }
    });

    

});

$(document).ready(function(){

    $("#new-analisis").on("click",function(){
        if(!document.getElementById( "first-values" )) {

            var p1F = $("#svgContainer1").attr("p1");
            var p1L = $("#svgContainer2").attr("p1");

            $.ajax(
            {
                    type: "POST",
                    url: "/api/gettemplates",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    { 
                        var options = "";

                        for(var i=0; i< data.templates.length; i++){
                            options += '<option id="'+ data.templates[i]._id +'">'+ data.templates[i].name + '</option>';
                        }
                       
                        $('.info-basic-video').append('<div id="first-values">'+
                                                            '<div class="form-group">'+
                                                                '<label for="sel1">Select TEMPLATE (select one):</label>'+
                                                                '<select class="form-control" id="chosen-template">'+
                                                                    options +
                                                                '</select>' +
                                                            '<button type="submit" class="btn btn-default" id="btn-enviar-template">Submit</button>'+
                                                            '<button type="submit" class="btn btn-default" id="btn-cancel-template">Cancel</button>'+
                                                        '</div>');

                        $("#btn-cancel-template").on("click",function(){
                            $('#first-values').remove();

                        });

                        $("#btn-enviar-template").on("click",function(){
                            var template1 = $("#chosen-template").val();
                            var idvideo_ = $("#margen-frontal").attr("idvideo");

                            $.ajax(
                            {
                                type: "POST",
                                url: "/api/gettemplate",
                                data: JSON.stringify({ t: template1, idvideo: idvideo_ }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function(data) 
                                {

                                    $('#first-values').remove();
                                    $('#menu-criteries').remove();
                                    $('#table-analisis-t').remove();
                                    $('#delete_all_template').remove();
                                    $('#drawercriterios').remove();
                                    $('#nuevodibujo').remove();
                                    $('#dvData').remove();
                                    n_fila = 0;

                                    if(data.body_elmnts.length > 0)
                					   n_fila = (data.body_elmnts.length);


                                    var menu = "";
                                    var title_criterios = '<tr id=row-title>'+
                                                            '<td>#</td>'+
                                                            '<td>Champ</td>'+
                                                            '<td>Time</td>'+
                                                            '<td>Time (s)</td>'+
                                                            '<td>NameA</td>'+
                                                            '<td>NameB</td>'+
                                                            '<td>Rot-A</td>'+
                                                            '<td>Rot-B</td>'+
                                                            '<td>SetA</td>'+
                                                            '<td>SetB</td>'+
                                                            '<td>MarcadorA</td>'+
                                                            '<td>MarcadorB</td>';

                                    var cont_criterios = "";
                                    for(var i=0; i<data.template.list_criteries.length; i++){
                                        /******************************************************************
                                            MENU DE PULSACION
                                        ******************************************************************/
                                        //Criterios
                                        menu += '<li class="dropdown"  id="key-in-'+ data.template.list_keyaccess[i] +'" type-crtry="'+data.template.list_criteries[i].type+'" name-cr="'+data.template.list_criteries[i].name+'">'+
                                                    '<a href="#" class="dropdown-toggle dropup" data-toggle="dropdown" id="key-in-'+ data.template.list_keyaccess[i] +'" type-crtry="'+data.template.list_criteries[i].type+'" pre-time="'+data.template.list_criteries[i].pre_time+'" post-time="'+data.template.list_criteries[i].post_time+'" role="button" aria-haspopup="true" aria-expanded="false" name-cr="'+data.template.list_criteries[i].name+'">('+data.template.list_keyaccess[i]+') ' + data.template.list_criteries[i].name+'<span class="caret"></span></a>'+
                                                    '<ul class="dropdown-menu dropup">';

                                        keys_to_criterys.push(data.template.list_keyaccess[i]);

                                        //Categorias de criterios
                                        for(var k=0; k<data.template.list_criteries[i].categories.length; k++){
                                            menu += '<li><a id="'+data.template.list_criteries[i].name + '-' + data.template.list_criteries[i].categories[k].keyaccess+'" keyaccess="'+data.template.list_criteries[i].categories[k].keyaccess+'" name-ctgry="'+data.template.list_criteries[i].categories[k].name+'">('+data.template.list_criteries[i].categories[k].keyaccess+') '+data.template.list_criteries[i].categories[k].name+'</a></li>';
                                        }
                                        menu +=     '</ul>'+
                                                '</li>';


                                        /***********************************************************************
                                            TITULO Y CUERPO DE TABLA DE ANALISIS
                                        ************************************************************************/
                                        title_criterios += '<td id="critery-border">' + data.template.list_criteries[i].name + '</td>';
                                        

                                        if(data.template.list_criteries[i].type == 'xy')
                                            title_criterios += '<td id="x-border">X</td>' + '<td id="xy-border">Y</td>';
                                        
                                        if(data.template.list_criteries[i].type == 'xyz')
                                            title_criterios += '<td id="x-border">X</td>' + '<td id="x-border">Y</td>' + '<td id="xy-border">Z</td>';
                                        
                                    }

                                    //Add los descriptores del template
                                    for(var i=0; i<data.template.list_descriptors.length; i++){
                                        /******************************************************************
                                            MENU DE PULSACION
                                        ******************************************************************/
                                        //Descriptores
                                        menu += '<li class="dropdown"  id="key-in-'+ data.template.list_descriptors[i].keyaccess +'" name-dr="'+data.template.list_descriptors[i].name+'">'+
                                                    '<a href="#" class="dropdown-toggle dropup" data-toggle="dropdown" id="key-in-'+ data.template.list_descriptors[i].keyaccess +'" role="button" aria-haspopup="true" aria-expanded="false" name-dr="'+data.template.list_descriptors[i].name+'">('+ data.template.list_descriptors[i].keyaccess +') ' + data.template.list_descriptors[i].name+'<span class="caret"></span></a>'+
                                                    '<ul class="dropdown-menu dropup">';

                                        keys_to_descriptors.push(data.template.list_descriptors[i].keyaccess);

                                        //Categorias de Descriptores
                                        for(var k=0; k<data.template.list_descriptors[i].categories.length; k++){
                                            menu += '<li><a id="'+data.template.list_descriptors[i].name + '-' + data.template.list_descriptors[i].categories[k].keyaccess+'" keyaccess="'+data.template.list_descriptors[i].categories[k].keyaccess+'" name-ctgry="'+data.template.list_descriptors[i].categories[k].name+'">('+data.template.list_descriptors[i].categories[k].keyaccess+') '+data.template.list_descriptors[i].categories[k].name+'</a></li>';
                                        }
                                        menu +=     '</ul>'+
                                                '</li>';


                                        /***********************************************************************
                                            TITULO Y CUERPO DE TABLA DE ANALISIS
                                        ***********************************************************************/
                                        title_criterios += '<td id="critery-border">' + data.template.list_descriptors[i].name + '</td>';
                                    }
                                    
                                    //Add the player's position in the floor 
                                    var position = "posA";
                                    for(var j=1; j<=12; j++){
                                        title_criterios += '<td id="critery-border>'+position+j/2+'</td>';
                                    }
                                    var position = "posB";
                                    for(var j=1; j<13; j++){
                                        title_criterios += '<td id="critery-border>'+position+j/2+'</td>';
                                    }
                                    title_criterios += '</tr>';

                                    //Add the player's position in the floor 
                                    //Add the player's position in the floor 
                                    var position = "posA";
                                    
                                    var position = "posB";
                                    

                                    
                                    $('body').append(   '<nav class="navbar navbar-default" id="menu-criteries">'+
                                                            '<div class="collapse navbar-collapse dropup" id="bs-example-navbar-collapse-1">'+
                                                                '<ul class="nav navbar-nav" id="list-of-criteries">'+
                                                                    menu +
                                                                '</ul>'+
                                                            '</div>'+
                                                        '</nav>'
                                                        );

                                    $('body').append(   '<div id="dvData" name_template='+template1+'>'+
                                    						'<table class="table table-sm table-hover" id="table-analisis-t" template="'+template1+'">'+
	                                                            '<thead>'+
	                                                                title_criterios +
	                                                            '</thead>'+
	                                                            '<tbody>'+
	                                                            '</tbody>'+
	                                                        '</table>'+
                                                        '</div>'
                                                    );

                                    /**************************************************/
                                    //  Insetar filas en la tabla si existen
                                    /**************************************************/
                                    var criterios_actuales = "";
                                    for(var i=0; i<data.template.list_criteries.length; i++){

                                        criterios_actuales += '<td id="critery-border">' + data.template.list_criteries[i].name + '</td>';
                                        

                                        if(data.template.list_criteries[i].type == 'xy')
                                            criterios_actuales += '<td id="x-border">X</td>' + '<td id="xy-border">Y</td>';
                                        
                                        if(data.template.list_criteries[i].type == 'xyz')
                                            criterios_actuales += '<td id="x-border">X</td>' + '<td id="x-border">Y</td>' + '<td id="xy-border">Z</td>';
                                    }




                                    if(data.body_elmnts.length > 0){
                                        var bbody = data.body_elmnts;
                                        var cuerpo_tabla = bbody.slice();
                                        var head_tabla = data.head_elements.slice();
                                        
                                        var row_descriptor_tabla = [];
                                        var row_actual = "";
                                        var last_one = 0;

                                        for(var i=0; i<cuerpo_tabla.length; i++){
                                            last_one = cuerpo_tabla[i].length - 12;
                                            for(var j=12; j<last_one; j++){
                                                var n_filaa = i+1;
                                                if((head_tabla[j] != 'X') && (head_tabla[j] != 'Y') && (head_tabla[j] != 'Z')){
                                                    row_actual += '<td id="'+n_filaa+'-'+head_tabla[j]+'" class="critery-border">'+cuerpo_tabla[i][j]+'</td>';
                                                }
                                                if(head_tabla[j] == 'X'){
                                                    row_actual += '<td id="'+n_filaa+'-x-'+head_tabla[j-1]+'" class="x-border">'+cuerpo_tabla[i][j]+'</td>';
                                                }
                                                if(head_tabla[j] == 'Y'){
                                                    row_actual += '<td id="'+n_filaa+'-y-'+head_tabla[j-2]+'" class="x-border">'+cuerpo_tabla[i][j]+'</td>';
                                                }
                                                if(head_tabla[j] == 'Z'){
                                                    row_actual += '<td id="'+n_filaa+'-z-'+head_tabla[j-3]+'" class="xy-border">'+cuerpo_tabla[i][j]+'</td>';
                                                }
                                            }
                                            row_descriptor_tabla.push(row_actual);
                                            row_actual = "";
                                        }
                                        n_fila = data.body_elmnts.length;

                                        var info_1 = "";
                                        var fin = data.body_elmnts.length -1;

                                        //Actualizar marcadores
                                        $('#SetA').text(data.body_elmnts[fin][8]);
                                        $('#SetB').text(data.body_elmnts[fin][9]);
                                        $('#puntosA').text(data.body_elmnts[fin][10]);
                                        $('#puntosB').text(data.body_elmnts[fin][11]);

                                        //Actualizar posiciones A
                                        var total = data.body_elmnts[fin].length;
                                        $('#pos1A').val(data.body_elmnts[fin][total-12]);
                                        $('#pos2A').val(data.body_elmnts[fin][total-11]);
                                        $('#pos3A').val(data.body_elmnts[fin][total-10]);
                                        $('#pos4A').val(data.body_elmnts[fin][total-9]);
                                        $('#pos5A').val(data.body_elmnts[fin][total-8]);
                                        $('#pos6A').val(data.body_elmnts[fin][total-7]);
                                        //Actualizar posiciones B
                                        $('#pos1B').val(data.body_elmnts[fin][total-6]);
                                        $('#pos2B').val(data.body_elmnts[fin][total-5]);
                                        $('#pos3B').val(data.body_elmnts[fin][total-4]);
                                        $('#pos4B').val(data.body_elmnts[fin][total-3]);
                                        $('#pos5B').val(data.body_elmnts[fin][total-2]);
                                        $('#pos6B').val(data.body_elmnts[fin][total-1]);

                                        //Actualizar rotacion A
                                        var rotA = data.body_elmnts[fin][6];
                                        $("input[name=rotationA][value=" + rotA + "]").prop('checked', true);
                                        var r = "RA-"+rotA;
                                        $("#rotA").text(r);

                                        //Actualizar rotacion B
                                        var rotB = data.body_elmnts[fin][7];
                                        $("input[name=rotationB][value=" + rotB + "]").prop('checked', true);
                                        var r = "RA-"+rotB;
                                        $("#rotB").text(r);

                                        for(var i=fin; i>-1; i--){
                                            var total = data.body_elmnts[i].length;
                                            info_1 +=   '<tr id="row-'+i+'">'+
                                                            '<td scope="row" id="row-'+i+'">'+data.body_elmnts[i][0]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][1]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][2]+'</td>'+
                                                            '<td id="time-seconds" class="time-seconds'+i+'" pre_time="2">'+data.body_elmnts[i][3]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][4]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][5]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][6]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][7]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][8]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][9]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][10]+'</td>'+
                                                            '<td>'+data.body_elmnts[i][11]+'</td>'+
                                                            row_descriptor_tabla[i] +
                                                            '<td id="'+i+'-pos1A">'+data.body_elmnts[i][total-12]+'</td>'+
                                                            '<td id="'+i+'-pos2A">'+data.body_elmnts[i][total-11]+'</td>'+
                                                            '<td id="'+i+'-pos3A">'+data.body_elmnts[i][total-10]+'</td>'+
                                                            '<td id="'+i+'-pos4A">'+data.body_elmnts[i][total-9]+'</td>'+
                                                            '<td id="'+i+'-pos5A">'+data.body_elmnts[i][total-8]+'</td>'+
                                                            '<td id="'+i+'-pos6A">'+data.body_elmnts[i][total-7]+'</td>'+
                                                            '<td id="'+i+'-pos1B">'+data.body_elmnts[i][total-6]+'</td>'+
                                                            '<td id="'+i+'-pos2B">'+data.body_elmnts[i][total-5]+'</td>'+
                                                            '<td id="'+i+'-pos3B">'+data.body_elmnts[i][total-4]+'</td>'+
                                                            '<td id="'+i+'-pos4B">'+data.body_elmnts[i][total-3]+'</td>'+
                                                            '<td id="'+i+'-pos5B">'+data.body_elmnts[i][total-2]+'</td>'+
                                                            '<td id="'+i+'-pos6B">'+data.body_elmnts[i][total-1]+'</td>'+
                                                        '</tr>';
                                        }
                                        $('#table-analisis-t tbody').append(info_1);
                                    }

                                    $("td#time-seconds").click(function() {

                                            var time_click = parseInt($(this).text()); 
                                            var rest = 2; //parseInt($(this).attr("pre_time"));
                                            
                                            if((time_click-rest) != 0){
                                                var t = Math.round(time_click - rest);
                                                console.log(time_click + ", " + rest)
                                                var video_frtl = document.getElementById("frontal");
                                                var video_lateral = document.getElementById("lateral");

                                                video_frtl.currentTime = t;
                                                video_lateral.currentTime = t;
                                            }
                                            else{
                                                var video_frtl = document.getElementById("frontal");
                                                var video_lateral = document.getElementById("lateral");

                                                video_frtl.currentTime = 0;
                                                video_lateral.currentTime = 0;
                                            }
                                    });

                                    /**************************************************/

                                    $(".export").css("visibility", "visible");

                                    $('body').append('<button id="delete_all_template" nameT='+template1+' class="btn btn-default">Eliminar template</button>');
                                    //ELIMINAR el template del video
                                    $('#delete_all_template').click(function(){
                                        var nameTemp = $(this).attr("nameT");
                                        var idvideo = $("#margen-frontal").attr("idvideo");
                                        //alert(nameTemp + ", " + idvideo); 

                                        swal({
                                                title: "Estas seguro?",
                                                text: "Al eliminar la plantilla actual " + nameTemp + " no se podrá recuperar en un futuro la información introducida para esta pareja de videos",
                                                showCancelButton: true,
                                                confirmButtonColor: '#DD6B55',
                                                confirmButtonText: 'Yes, I am sure!',
                                                cancelButtonText: "No, cancel it!",
                                                closeOnConfirm: false
                                            },  function (isConfirm){ 
                                                    if(!isConfirm){
                                                        return;
                                                    }
                                                    else{
                                                        $.ajax({
                                                            type:"POST",
                                                            url: "/api/delete_video_template",
                                                            data: JSON.stringify({iDvideo: idvideo, Nametemplate: nameTemp }), //parameters tag identification
                                                            contentType: "application/json; charset=utf-8",
                                                            dataType: "json",
                                                            success: function(data){

                                                                $('#first-values').remove();
                                                                $('#menu-criteries').remove();
                                                                $('#table-analisis-t').remove();
                                                                $('#delete_all_template').remove();
                                                                $('#drawercriterios').remove();
                                                                $('#nuevodibujo').remove();
                                                                $('#dvData').remove();

                                                                swal(data.msg);

                                                            },
                                                            error: function(err){
                                                                swal(err);
                                                                swal("error al Eliminar");
                                                            }
                                                        });
                                                    }
                                                }
                                        );
                                    });

                                    var myTableArray = [];
                                    $("table#table-analisis-t tr").each(function() {
                                        var arrayOfThisRow = [];
                                        var tableData = $(this).find('td');
                                        if (tableData.length > 0) {
                                            tableData.each(function() { 
                                                arrayOfThisRow.push($(this).text()); 
                                            });
                                            myTableArray.push(arrayOfThisRow);
                                        }
                                    });

                                    //alert(myTableArray);
                                    var options_query = "<option selected>...</option>";
                                    for(var i=3; i<myTableArray[0].length; i++){
                                        if(myTableArray[0][i] != 'NameA' && myTableArray[0][i] != 'NameB' && myTableArray[0][i] != 'X' && myTableArray[0][i] != 'Y' && myTableArray[0][i] != 'Z' ){
                                            options_query += '<option value="'+myTableArray[0][i]+'">'+myTableArray[0][i]+'</option>';
                                        }
                                    }

                                    var critery3d_options_query  = "<option selected>...</option>";
                                    for(var i=11; i<myTableArray[0].length-12; i++){
                                        if(myTableArray[0][i+3] == 'Z' ){
                                            critery3d_options_query += '<option value="'+myTableArray[0][i]+'">'+myTableArray[0][i]+'</option>';
                                        }
                                    }
                                    //alert(options_query);

                                    $('body').append(   '<div id="drawercriterios">'+
                                                            '<table class="table" id="table_query_draw">'+
                                                                '<tbody>'+
                                                                    '<tr>'+
                                                                        '<td>'+
                                                                            '<select class="custom-select" name="input_critery_draw" id="input_critery_draw">'+
                                                                                critery3d_options_query +
                                                                            '</select>'+
                                                                        '</td>'+
                                                                        '<td>'+
                                                                            '<select class="custom-select" name="input_operation_draw" id="input_operation_draw">'+
                                                                                '<option selected>...</option>'+
                                                                                '<option value="="> = </option>'+
                                                                                '<option value=">"> > </option>'+
                                                                                '<option value="<"> < </option>'+
                                                                            '</select>'+
                                                                        '</td>'+
                                                                        '<td>'+
                                                                            '<input class="form-control" type="text" value="0" name="input_draw" id="input_draw">'+
                                                                        '</td>'+
                                                                    '</tr>'+
                                                                '</tbody>'+
                                                            '</table>'+
                                                            '<button id="add_query_descriptors"  class="btn btn-default">+</button>'+   
                                                            '<br>'+
                                                            '<button id="drawer_criteries"  class="btn btn-default">Representar</button>'+ 
                                                        '</div>'+
                                                        '<div id="drawer_points">'+
                                                            '<div id="drawer_canvas">'+
                                                            '</div>'+
                                                        '</div>'
                                            );

                                    $('button#add_query_descriptors').click(function(){
                                        $("#nuevodibujo").remove();
                                        $('#table_query_draw tbody').append('<tr>'+
                                                                                '<td>'+
                                                                                    '<select class="custom-select" name="input_critery_draw" id="input_critery_draw">'+
                                                                                        options_query +
                                                                                    '</select>'+
                                                                                '</td>'+
                                                                                '<td>'+
                                                                                    '<select class="custom-select" name="input_operation_draw" id="input_operation_draw">'+
                                                                                        '<option selected>...</option>'+
                                                                                        '<option value="="> = </option>'+
                                                                                        '<option value=">"> > </option>'+
                                                                                        '<option value="<"> < </option>'+
                                                                                    '</select>'+
                                                                                '</td>'+
                                                                                '<td>'+
                                                                                    '<input class="form-control" type="text" value="0" name="input_draw" id="input_draw">'+
                                                                                '</td>'+
                                                                            '</tr>'
                                                                                );
                                    });
                                    

                                    $('#table_query_draw td #input_critery_draw').click(function(){
                                        $(this).focus();
                                        swal("Usa el tabulador para avanzar en las opciones o bien, tabulador+shift para retroceder.")
                                    });

                                    $('#drawer_criteries').click(function(){
                                        $("#nuevodibujo").remove();
                                                                                
                                        var nTemplate = $("#dvData").attr("name_template");
                                        var idV = $("#margen-frontal").attr("idvideo");
                                        var critery = "c1"; //critery_draw
                                        
                                        
                                        var criteries_actual = [];
                                        var descriptors_actual = [];
                                        
                                        var criteries_Draw = $.map($('select[name="input_critery_draw"]'), function (val, _) {
                                            return val.value;
                                        });
                                        //console.log(criteries_Draw)

                                        var operation_Draw = $.map($('select[name="input_operation_draw"]'), function (val, _) {
                                            return val.value;
                                        });
                                        //console.log(operation_Draw)

                                        var input_Draw = $.map($('input[name="input_draw"]'), function (val, _) {
                                            return val.value;
                                        });
                                        //console.log(input_Draw)

                                        var myTableArray = [];
                                        $("table#table-analisis-t tr").each(function() {
                                            var arrayOfThisRow = [];
                                            var tableData = $(this).find('td');
                                            if (tableData.length > 0) {
                                                tableData.each(function() { 
                                                    arrayOfThisRow.push($(this).text()); 
                                                });
                                                myTableArray.push(arrayOfThisRow);
                                            }
                                        });

                                        //Get rows with critery select:
                                        var tableCritery = [];
                                        var indice_critery = 0;
                                        //2. Get position on myTableArray[i] of the critery select.
                                        for(var i=0; i<myTableArray[0].length; i++){
                                            if(myTableArray[0][i] == criteries_Draw[0])
                                                indice_critery = i;
                                        }
                                        //console.log("Indice de critery:" + indice_critery);

                                        for(var i=0; i<myTableArray.length; i++)
                                            if(myTableArray[i][indice_critery] != "")
                                                tableCritery.push(myTableArray[i])
                                        //console.log(tableCritery);
                                        //console.log("Siguente: ");

                                        var tableCriterySelect = [];
                                        var operation = operation_Draw[0];
                                        if(operation != "..."){
                                            tableCriterySelect.push(tableCritery[0]);
                                            for(var i=1; i<tableCritery.length; i++){
                                                if((tableCritery[i][indice_critery] < input_Draw[0]) && (operation == "<")){
                                                    tableCriterySelect.push(tableCritery[i]);
                                                }
                                                else if((tableCritery[i][indice_critery] > input_Draw[0]) && (operation == ">")){
                                                    tableCriterySelect.push(tableCritery[i]);
                                                }
                                                else if((tableCritery[i][indice_critery] == input_Draw[0]) && (operation == "=")){
                                                    tableCriterySelect.push(tableCritery[i]);
                                                }
                                            }
                                        }
                                        else{
                                            tableCriterySelect = tableCritery.slice();
                                        }
                                        //console.log("tableCriterySelect");
                                        //console.log(tableCriterySelect);

                                        for(var i=1; i<tableCriterySelect.length; i++){
                                            for(var j=0; j<tableCriterySelect[i].length; j++){
                                                var k=1;
                                                while(k < criteries_Draw.length){
                                                    if(tableCriterySelect[0][j] == criteries_Draw[k]){
                                                        if((tableCriterySelect[i][j] >= input_Draw[k]) && (operation_Draw[k] == "<")){
                                                            tableCriterySelect.splice(i, 1);
                                                            k = criteries_Draw.length;
                                                            j = tableCriterySelect[i-1].length;
                                                            i = i-1;
                                                        }
                                                        else if((tableCriterySelect[i][j] <= input_Draw[k]) && (operation_Draw[k] == ">")){
                                                                tableCriterySelect.splice(i, 1);
                                                                k = criteries_Draw.length;
                                                                j = tableCriterySelect[i-1].length;
                                                                i = i-1;
                                                            }
                                                            else if((tableCriterySelect[i][j] != input_Draw[k]) && (operation_Draw[k] == "=")){
                                                                    tableCriterySelect.splice(i, 1);
                                                                    k = criteries_Draw.length;
                                                                    j = tableCriterySelect[i-1].length;
                                                                    i = i-1;
                                                                }
                                                    }
                                                    k++;
                                                }
                                            }
                                        }
                                        console.log("tableCriterySelect tras inputs");
                                        console.log(tableCriterySelect);
                                        
                                        var balones = [];
                                        for(var i=0; i< tableCriterySelect.length; i++){
                                            var p = {
                                                x: 4.5+(4.5-tableCriterySelect[i][indice_critery+1]),
                                                y: tableCriterySelect[i][indice_critery+2]+0,
                                                z: tableCriterySelect[i][indice_critery+3]+0
                                            }
                                            balones.push(p);
                                        }
                                        balones.splice(0,1);
                                        console.log(balones);

                                        var mouseover = true;
                                        DibujaCampo(balones, mouseover);
                                        
                                    //----------------------------------------------------------------------------
                                    });

                                },
                                error: function(err) 
                                {
                                    var msg = 'Status: ' + err.status + ': ' + err.responseText;
                                    swal(msg);
                                }
                            });
                        });
                    },
                    error: function(err) 
                    {
                        var msg = 'Status: ' + err.status + ': ' + err.responseText;
                        swal(msg);
                    }
            });
        }

    });

    /*
        Funciones de insert in table-analisis
    */
    var pre_timeACtive = 0;
    var contador = 0;

    $(window).keypress(function(e) {
        //Capturar letra de criterio
        var letra = String.fromCharCode(e.which);
		console.log("Letra: " + letra);
		var existe_letra = false;
        
        for(var i=0; i<keys_to_criterys.length; i++)
            if(letra == keys_to_criterys[i]) 
            	existe_letra = true;

        if((!(e.which >= 48) || !(e.which <= 57)) && e.which != 13 && (!(e.which >= 97) || !(e.which <= 122)) && existe_letra){
            //Seleccion de critery
            //Almacenar nueva fila del template elegido.
            var nameTemplate = $("#table-analisis-t").attr("template");
            var idVideo = $("#margen-frontal").attr("idvideo");
            //alert(nameTemplate);
            var lines = [];
            var nuevo;

            if(n_fila > 0){
	            $('#table-analisis-t tr#row-'+n_fila).each(function(index, tr) {
					    lines = $('td', tr).map(function(index, td) {
					        return $(td).text();
					    });
				});
	            console.log("lines" + lines);
                console.log(lines);
	            nuevo = false;
        	}
        	else{
        		//ALmacenar el HEAD de la tabla
        		$('#table-analisis-t tr#row-title').each(function(index, tr) {
					    lines = $('td', tr).map(function(index, td) {
					        return $(td).text();
					    });
				});
                console.log("LINES:: ");
				console.log(lines);
				nuevo = true;
        	}

        	//AJAX, guarda la nueva fila
            if(lines.length > 0){

            	$.ajax({
                    type: "POST",
                    url: "/api/showvideos/addInfoTemplate",
                    data: JSON.stringify({ idV:idVideo, nTemplate:nameTemplate, new:nuevo, info:lines }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    {
                        console.log("success");
                    },
                    error: function(err) 
                    {
                        console.log(err);
                    }
                });
            }


            critery_key = String.fromCharCode(e.which);

            $("li#key-in-"+l_ante).attr('class', "dropdown");

            pre_timeACtive = $("a#key-in-"+l_ante).attr("pre-time");
            
            var letra_c = $("li#key-in-"+letra).attr('class', "dropdown open");    
            l_ante = String.fromCharCode(e.which);
            n_Categoria = "";

            name_critery = $("li#key-in-"+letra).attr("name-cr");

            //Seleccionar el tipo de criterio (-, xy, xyz)
            type_crtry = $("li#key-in-"+l_ante).attr('type-crtry');
            id_radio = "#opt-grid-"+type_crtry;
            //Actualizar type-click
            $('input[name=opt-grid]').prop('checked', false);
            $(id_radio).prop('checked', true);
        
            $("input").attr("insert", "OFF");
            $(id_radio).attr("insert", "ON");

            contador ++;
        }
        else{
            if(e.which == 13){
                $("li#key-in-"+l_ante).attr('class', "dropdown");
                //alert(name_critery + ", " + name_category);
                //Añadir a la fila-columna correspondiente
                
                if(name_category == ""){
                    name_category = name_critery;
                }

                console.log("Introduzco: " + name_category + " en: " + "td#" + n_fila + "-" + name_critery);

                $('td#'+n_fila+'-'+name_critery).text(name_category);

                $('td.time-seconds'+n_fila).attr("pre_time", pre_timeACtive);
                pre_timeACtive = 0;
                name_category = "";
            }
            else{
                if((e.which >= 97) || !(e.which <= 122)){
                    //alert("descriptor");
                    //Seleccion de critery
                    descriptor_key = String.fromCharCode(e.which);
                    $("li#key-in-"+l_ante).attr('class', "dropdown");
                    var letra_c = $("li#key-in-"+letra).attr('class', "dropdown open");    
                    l_ante = String.fromCharCode(e.which);
                    n_Categoria = "";

                    name_critery = $("li#key-in-"+letra).attr("name-dr");
                }
                else{ //Categoria
                    var num_category = String.fromCharCode(e.which);
                    n_Categoria += num_category;
                    name_category = $("a#"+name_critery+"-"+num_category).attr("name-ctgry");
                }
            }
        }
        marA = $('p#puntosA').text();
        marB = $('p#puntosB').text();

        if(contador == 1){
            contador = 0;

            var header = Array();
            var data = Array();
            $("table tr th").each(function(i, v){
                    header[i] = $(this).text();
            })
            //alert(header);

            $("table tr").each(function(i, v){
                data[i] = Array();
                $(this).children('td').each(function(ii, vv){
                    data[i][ii] = $(this).text();
                }); 
            });

            marA_anterior = marA;
            marB_anterior = marB;
            //alert($("td#"+n_fila).text());
            //Nueva fila en la tabla
            n_fila = n_fila+1;
            var current = $('#current').text();
            var setA = $('#SetA').text();
            var setB = $('#SetB').text();
            var ra = $('#rotA').text();
            var rb = $('#rotB').text();

            var video_frtl = document.getElementById("frontal");
            var current_seconds = video_frtl.currentTime;

            if(criteries_types == ""){
                var template1 = $('table').attr("template"); 
                var idvideo_ = $("#margen-frontal").attr("idvideo");

                $.ajax({
                    type: "POST",
                    url: "/api/gettemplate",
                    data: JSON.stringify({ t: template1, idvideo: idvideo_}),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) 
                    {	

                    	console.log(data.body_elmnts);
                		n_fila1 = n_fila;
                        //n_fila = n_fila1;

                        for(var i=0; i<data.template.list_criteries.length; i++){
                            criteries_types += '<td id="'+n_fila1+'-'+data.template.list_criteries[i].name+'" class="critery-border">'+'</td>';

                            if(data.template.list_criteries[i].type == 'xy'){
                                criteries_types += '<td id="'+n_fila1+'-x-'+data.template.list_criteries[i].name+'" class="x-border"></td>' + '<td id="'+n_fila1+'-y-'+data.template.list_criteries[i].name+'" class="xy-border"></td>';
                            }
                            if(data.template.list_criteries[i].type == 'xyz'){
                                criteries_types += '<td id="'+n_fila1+'-x-'+data.template.list_criteries[i].name+'" class="x-border"></td>' + '<td id="'+n_fila1+'-y-'+data.template.list_criteries[i].name+'" class="x-border"></td>' + '<td id="'+n_fila1+'-z-'+data.template.list_criteries[i].name+'" class="xy-border"></td>';
                            }
                        }

                        for(var i=0; i<data.template.list_descriptors.length; i++){
                            criteries_types += '<td id="'+n_fila1+'-'+data.template.list_descriptors[i].name+'" class="critery-border">'+'</td>';
                        }

                        var championship = $("#champ_name_1").text();
                        var teamA = $("#teamA_name").text();
                        var teamB = $("#teamB_name").text();

                        var pos_valor;
                        var letraT = "A";
                        //Add the player's position in the floor 
                        var position = "pos";
                        for(var i=0; i<2; i++){
                            if(i!=0)
                                letraT = "B";
                            for(var j=1; j<7; j++){
                                pos_valor = $('#'+position+j+letraT).val();
                                criteries_types += '<td id="'+n_fila1+'-'+position+j+letraT+'">'+ pos_valor +'</td>';
                            }
                        }
                        //alert(pos_valor);

                        $("#table-analisis-t tbody").prepend('<tr id="row-'+n_fila+'">'+
                                                                '<td scope="row" id="row-'+n_fila+'">'+n_fila+'</td>'+
                                                                '<td>'+championship+'</td>'+
                                                                '<td>'+current+'</td>'+
                                                                '<td id="time-seconds" class="time-seconds'+n_fila+'">'+ Math.round(current_seconds) +'</td>'+
                                                                '<td>'+teamA+'</td>'+
                                                                '<td>'+teamB+'</td>'+
                                                                '<td>'+ra[3]+'</td>'+
                                                                '<td>'+rb[3]+'</td>'+
                                                                '<td>'+setA+'</td>'+
                                                                '<td>'+setB+'</td>'+
                                                                '<td>'+marA+'</td>'+
                                                                '<td>'+marB+'</td>'+
                                                                criteries_types +
                                                            '</tr>');
                        criteries_types="";
                        
                        $(".critery-border").click(function(){
                                var W_actual = $(this).css("width");
                                var thistd = $(this);
                                //$(this).css("width", '250');
                                $(this).replaceWith('<select id="valor_nuevo_criterio">'+
                                                        '<option>1</option>'+
                                                        '<option>2</option>'+
                                                        '<option>3</option>'+
                                                        '<option>4</option>'+
                                                    '</select>'
                                                    );
                        });

                        $("td#time-seconds").click(function() {
                                var time_click = Math.round($(this).text()); 
                                var rest = 2; //parseInt($(this).attr("pre_time"));
                                var t = Math.round(time_click - rest);
                                if(t != 0){
                                    var video_frtl = document.getElementById("frontal");
                                    var video_lateral = document.getElementById("lateral");

                                    video_frtl.currentTime = t;
                                    video_lateral.currentTime = t;
                                }
                                else{
                                    var video_frtl = document.getElementById("frontal");
                                    var video_lateral = document.getElementById("lateral");

                                    video_frtl.currentTime = 0;
                                    video_lateral.currentTime = 0;
                                }   
                        });


                    },
                    error: function(err) 
                    {
                        var msg = 'Status: ' + err.status + ': ' + err.responseText;
                        swal(msg);
                    }
                });
            }
            else{
                var pos_valor;
                var letraT = "A";
                //Add the player's position in the floor 
                var position = "pos";
                for(var i=0; i<2; i++){
                    if(i!=0)
                        letraT = "B";
                    for(var j=1; j<7; j++){
                        pos_valor = $('#'+position+j+letraT).val();
                        criteries_types += '<td id="'+n_fila1+'-'+position+j+letraT+'">'+ pos_valor +'</td>';
                    }
                }
                $("#table-analisis-t tbody").prepend('<tr id="row-'+n_fila+'">'+
                                                        '<td scope="row" id="row-'+n_fila+'">'+n_fila+'</td>'+
                                                        '<td>'+championship+'</td>'+
                                                        '<td>'+current+'</td>'+
                                                        '<td>'+teamA+'</td>'+
                                                        '<td>'+teamB+'</td>'+
                                                        '<td>'+ra[3]+'</td>'+
                                                        '<td>'+rb[3]+'</td>'+
                                                        '<td>'+setA+'</td>'+
                                                        '<td>'+setB+'</td>'+
                                                        '<td>'+marA+'</td>'+
                                                        '<td>'+marB+'</td>'+
                                                        criteries_types +
                                                    '</tr>');
                criteries_types="";
                
            }
        }
    });

});


//Exportar tabla a .csv
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
                .split(tmpColDelim).join(colDelim) + '"';

                // Deliberate 'false', see comment below
        if (false && window.navigator.msSaveBlob) {

            var blob = new Blob([decodeURIComponent(csv)], {
                              type: 'text/csv;charset=utf8'
                        });
            
            // Crashes in IE 10, IE 11 and Microsoft Edge
            // See MS Edge Issue #10396033: https://goo.gl/AEiSjJ
            // Hence, the deliberate 'false'
            // This is here just for completeness
            // Remove the 'false' at your own risk
            window.navigator.msSaveBlob(blob, filename);
            
        } else if (window.Blob && window.URL) {
                        // HTML5 Blob        
            var blob = new Blob([csv], { type: 'text/csv;charset=utf8' });
            var csvUrl = URL.createObjectURL(blob);

            $(this)
                    .attr({
                        'download': filename,
                        'href': csvUrl
                    });
                } else {
            // Data URI
            var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                        $(this)
                .attr({
                    'download': filename,
                    'href': csvData,
                    'target': '_blank'
                    });
        }
    }

    // This must be a hyperlink
    $(".export").on('click', function (event) {
        // CSV
        var name_tem = $("#dvData").attr("name_template");
        var f = new Date();
        var date_now = (f.getDate() + "_" + (f.getMonth() +1) + "_" + f.getFullYear());


        var args = [$('#dvData>table'), name_tem+'_'+date_now+'.csv'];
        
        exportTableToCSV.apply(this, args);
        
        // If CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });
});




$(document).ready(function() {
    $("#trckng").click(function(){
        var video_frtl = document.getElementById("frontal");
        var video_ltrl = document.getElementById("lateral");

        if($('div.btn-primary')[0]){
            if($('#svgContainer1').attr('p1')) {

                if($('#svgContainer2').attr('p1')) {
                    
                    var puntosF = [], puntosL = [];

                    for(var i=0; i<4; i++){
                        puntosF.push(DividePar($("#svgContainer1").attr("p"+i)));
                        puntosL.push(DividePar($("#svgContainer2").attr("p"+i)));
                    }
                                
                    //for(var i=0; i<puntosF.length; i++)
                    //    console.log(puntosF[i].x + ", " + puntosF[i].y + "\t" + puntosL[i].x + ", " + puntosL[i].y);
                    
                    $.ajax({
                        type: "POST",
                        url: "/api/showvideos/trackingExit",
                        data: JSON.stringify({ pF: puntosF, pL: puntosL, trck:false }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(data) 
                        {
                            //console.log(data.punto4D.tiempo)
                            //$("#champ_name_1").replaceWith('<h4 id="champ_name_1">'+ data.dato_random +'</h4>');
                            

                        },
                        error: function(err) 
                        {
                            
                        }
                    });
                    
                }
                else{
                    alert("REJILLA EN LATERAL NECESARIO");
                }
            }
            else{
                alert("REJILLA EN FRONTAL NECESARIO");
            }
        }
        else{
            if($('div.btn-default')[0]){
                /************  AQUI HAY ERRORR *********/
                if($('#svgContainer1').attr('p1')) {

                    if($('#svgContainer2').attr('p1')) {
                        
                        /*
                        for(var i=0; i<puntosF.length; i++)
                            console.log(puntosF[i].x + ", " + puntosF[i].y + "\t" + puntosL[i].x + ", " + puntosL[i].y);
                        
                        */

                        var pathfrontal = $("#path_f").attr("src");
                        var pathlateral = $("#path_l").attr("src");

                        //alert(pathlateral + "\n" + pathfrontal);

                        var puntosF = [], puntosL = [];

                        for(var i=0; i<4; i++){
                            puntosF.push(DividePar($("#svgContainer1").attr("p"+i)));
                            puntosL.push(DividePar($("#svgContainer2").attr("p"+i)));
                        }

                        var dimensionFrontal = {
                                                    width: $("#svgContainer1").attr("width"), 
                                                    height: $("#svgContainer1").attr("height")
                                                }
                        var dimensionLateral = {
                                                    width: $("#svgContainer2").attr("width"), 
                                                    height: $("#svgContainer2").attr("height")
                                                }

                        var desviacionFrontal = {
                                                    x: $("#svgContainer1").attr("desviacionX"), 
                                                    y: $("#svgContainer1").attr("desviacionY")
                                                }
                        var desviacionLateral = {
                                                    x: $("#svgContainer2").attr("desviacionX"), 
                                                    y: $("#svgContainer2").attr("desviacionY")
                                                }

                        //console.log(dimensionLateral.width + ", " + dimensionFrontal.height);
                        var video_frtl = document.getElementById("frontal");
                        var current_seconds = 68;//video_frtl.currentTime;
                        var idChampionship = $("#margen-frontal").attr("idchampionship");
                        $.ajax({
                            type: "POST",
                            url: "/api/showvideos/tracking",
                            data: JSON.stringify({ pF: puntosF, pL: puntosL, trck:true, pathF: pathfrontal, pathL: pathlateral, 
                                                        dimF: dimensionFrontal, dimL: dimensionLateral, desvF: desviacionFrontal, 
                                                                    desvL: desviacionLateral, video_time: current_seconds, idChampionship: idChampionship }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(data) 
                            {   
                                //alert("Next");
                                $("#champ_name_1").replaceWith('<h4 id="champ_name_1">'+ data.dato_random +'</h4>');
                                $('div.toggle').removeClass('btn-primary').addClass('btn-default off');
                            },
                            error: function(err) 
                            {
                               alert("ERR"); 
                            }
                        });
                    }
                    else{
                        alert("REJILLA EN LATERAL NECESARIO");
                    }
                }
                else{
                    alert("REJILLA EN FRONTAL NECESARIO");
                }
            }
        }
    });

});


function DividePar(par){
    var p = {
        x: 0,
        y: 0
    };

    var indice = 0;
    for(var i=0; i<par.length; i++)
        if(par[i] == ',')
            indice = i;

    p.x = parseInt(par.substring(0, indice));
    p.y = parseInt(par.substring(indice+1, par.length));

    return p;
}

function balon3D(ball_frontal1, ball_lateral1){

	//Calcular ABC y puntos de fuga
	console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
	var ball_frontal = ball_frontal1[ball_frontal1.length-1];
	var ball_lateral = ball_lateral1[ball_lateral1.length-1];
	var campoF = [];
	var campoL = [];

	for(var i=0; i<4; i++){
		campoF.push(DividePar($("#svgContainer1").attr("p"+i)));
		campoL.push(DividePar($("#svgContainer2").attr("p"+i)));
	}

	var fugaF = PuntosDeFuga(campoF);
	var fugaL = PuntosDeFuga(campoL);
	var abcF = ABC(campoF);
	var abcL = ABC(campoL);

	var segmento_BC_f = RectaDosPuntos(abcF[1], abcF[2]);
	var segmento_BC_l = RectaDosPuntos(abcL[1], abcL[2]);

	//Crear lineas exteriores del campo
	var limite_F = [], limite_L = [];

	for(var i=0; i<4; i++){
		limite_F.push(RectaDosPuntos(campoF[i], campoF[(i+1)%4]));
		limite_L.push(RectaDosPuntos(campoL[i], campoL[(i+1)%4]));
	}

	//Trazar recta perpendicular al campo desde la posicion del balon (En cada campo)
	var p1={x:ball_frontal.x+5, y:0}, 
		p2={x:ball_lateral.x+5, y:0};

	var perp_F = RectaDosPuntos(p1, ball_frontal);
	var perp_L = RectaDosPuntos(p2, ball_lateral);
	

	//Punto de corte con la bases mayor del campo
	var pF_corte_M = PuntoDeCorte(perp_F, limite_F[3]);
	var pL_corte_M = PuntoDeCorte(perp_L, limite_L[3]);
	//Punto de corte con la base menor del campo
	var pF_corte_m = PuntoDeCorte(perp_F, limite_F[1]);
	var pL_corte_m = PuntoDeCorte(perp_L, limite_L[1]);
	
	
	/******	BASE MAYOR ******/

	//Recta desde el punto de fuga[0] (principal) hasta punto de corte en la bases mayor.
	var corte_fugaF_M = RectaDosPuntos(fugaF[0], pF_corte_M);
	var corte_fugaL_M = RectaDosPuntos(fugaL[0], pL_corte_M);

	//Punto de corte de recta anterior con su segmento_BC
	var p_distancia_f_M = PuntoDeCorte(segmento_BC_f, corte_fugaF_M);
	var p_distancia_l_M = PuntoDeCorte(segmento_BC_l, corte_fugaL_M);

	var distancia_bc_f = DistanciaPuntos(abcF[1], abcF[2]);
	var distancia_bc_l = DistanciaPuntos(abcL[1], abcL[2]);

	var p_abcF_2_M = DistanciaPuntos(p_distancia_f_M, abcF[2]);
	var p_abcL_2_M = DistanciaPuntos(p_distancia_l_M, abcL[2]);

	var distancia_ponderada_frontal_M =  (9.0*p_abcF_2_M)/distancia_bc_f; //9
	var distancia_ponderada_lateral_M =  (18.0*p_abcL_2_M)/distancia_bc_l; //9

	distancia_ponderada_frontal_M = Math.round(distancia_ponderada_frontal_M * 100) / 100.0;
	distancia_ponderada_lateral_M = Math.round(distancia_ponderada_lateral_M * 100) / 100.0;

	if(p_distancia_f_M.x > abcF[2].x) 
		distancia_ponderada_frontal_M*=(-1.0);
	if(p_distancia_l_M.x > abcL[2].x) 
		distancia_ponderada_lateral_M*=(-1.0);

	/******	BASE MENOR ******/

	//Recta desde el punto de fuga[0] (principal) hasta punto de corte en la bases mayor.
	var corte_fugaF_m = RectaDosPuntos(fugaF[0], pF_corte_m);
	var corte_fugaL_m = RectaDosPuntos(fugaL[0], pL_corte_m);

	//Punto de corte de recta anterior con su segmento_BC
	var p_distancia_f_m = PuntoDeCorte(segmento_BC_f, corte_fugaF_m);
	var p_distancia_l_m = PuntoDeCorte(segmento_BC_l, corte_fugaL_m);
	/*
	var distancia_bc_f = DistanciaPuntos(abcF[1], abcF[2]);
	var distancia_bc_l = DistanciaPuntos(abcL[1], abcL[2]);
	*/
	var p_abcF_2_m = DistanciaPuntos(p_distancia_f_m, abcF[2]);
	var p_abcL_2_m = DistanciaPuntos(p_distancia_l_m, abcL[2]);

	var distancia_ponderada_frontal_m =  (9.0*p_abcF_2_m)/distancia_bc_f; //9
	var distancia_ponderada_lateral_m =  (18.0*p_abcL_2_m)/distancia_bc_l; //9

	distancia_ponderada_frontal_m = Math.round(distancia_ponderada_frontal_m * 100) / 100.0;
	distancia_ponderada_lateral_m = Math.round(distancia_ponderada_lateral_m * 100) / 100.0;

	if(p_distancia_f_m.x > abcF[2].x) 
		distancia_ponderada_frontal_m*=(-1.0);
	if(p_distancia_l_m.x > abcL[2].x) 
		distancia_ponderada_lateral_m*=(-1.0);

	
	/******************************************************************************************************/
	var d0 = distancia_ponderada_lateral_m;		// distancia_ponderada_frontal_m --> base_izquierda_l
 	var d1 = distancia_ponderada_frontal_m;		// distancia_ponderada_frontal_M --> base_derecha_l
	var d2 = distancia_ponderada_lateral_M;		// distancia_ponderada_lateral_m --> lateral_izquierdo_f
	var d3 = distancia_ponderada_frontal_M;		// distancia_ponderada_lateral_M --> lateral_derecho_f

	/********************************************************************************************************
					  FRONTAL 							  LATERAL
		
						d1 									d0
					------------						-----------
			  d0   /____________\ d2	  <==>		   /	 |		\
   				  /				 \				  d3  /		 |		 \ d1
   				 /________________\					 /_______|________\
						d3									d2
			
	/*********************************************************************************************************/

	//					FRONTAL (d0, d2)
	//	segmento de referencia de medidas
	var p_c_aux = {x: abcF[2].x+1, y:  abcF[2].y - 18};

	var p_referencia0 = {x: abcF[2].x, y: abcF[2].y - d0}; 
	var p_referencia2 = {x: abcF[2].x, y: abcF[2].y - d2}; 

	var recta_paralela_18 = RectaDosPuntos(p_c_aux, abcF[1]);
	var p_bc0 = PuntoDeCorte(ParalelaPunto(recta_paralela_18, p_referencia0), RectaDosPuntos(abcF[1], abcF[2]));
	var p_bc2 = PuntoDeCorte(ParalelaPunto(recta_paralela_18, p_referencia2), RectaDosPuntos(abcF[1], abcF[2]));

	//Punto de corte de la base mayor con la recta que pasa por p_bc0 y fugaF[0]. Idem con p_bc2
	var corte_BASE_0 = PuntoDeCorte(limite_F[3], RectaDosPuntos(fugaF[0], p_bc0));
	var corte_BASE_2 = PuntoDeCorte(limite_F[1], RectaDosPuntos(fugaF[0], p_bc2));
	
	//Punto de corte en el lateral izquierdo (fugasF[0]-corte_BASES_0) y lateral derecho (fugasF[2]-corte_BASES_2)
	var corte_LATERAL_0 = PuntoDeCorte(limite_F[0], RectaDosPuntos(fugaF[1], corte_BASE_0));
	var corte_LATERAL_2 = PuntoDeCorte(limite_F[2], RectaDosPuntos(fugaF[1], corte_BASE_2));

	
	//Punto de corte con la perpendicular del balon en el campo Frontal.
	var corte_balon_frontal = PuntoDeCorte(RectaDosPuntos(corte_LATERAL_0, corte_LATERAL_2), perp_F);
	var corte_balon_bc_F = PuntoDeCorte(RectaDosPuntos(corte_balon_frontal, fugaF[0]), RectaDosPuntos(abcF[1], abcF[2]));
	var corte_ponderado_18 = PuntoDeCorte(ParalelaPunto(recta_paralela_18, corte_balon_bc_F), RectaDosPuntos(abcF[2], p_c_aux));

	var distancia_bc_frontal_ponderada = DistanciaPuntos(corte_ponderado_18, abcF[2]);

	if(corte_balon_bc_F.x > abcF[2].x)
		distancia_bc_frontal_ponderada *=(-1);

	var distancia_bc_frontal_real = (distancia_bc_frontal_ponderada*9)/18;

	distancia_bc_frontal_real = Math.round(distancia_bc_frontal_real * 100) / 100.0;
	
	//		LATERAL (d1, d3);
	p_c_aux = {x: abcL[2].x+1, y:  abcL[2].y - 9};

	var p_referencia1 = {x: abcL[2].x, y: abcL[2].y - d3}; 
	var p_referencia3 = {x: abcL[2].x, y: abcL[2].y - d1};

	var recta_paralela_9 = RectaDosPuntos(p_c_aux, abcL[1]);
	var p_bc1 = PuntoDeCorte(ParalelaPunto(recta_paralela_9, p_referencia1), RectaDosPuntos(abcL[1], abcL[2]));
	var p_bc3 = PuntoDeCorte(ParalelaPunto(recta_paralela_9, p_referencia3), RectaDosPuntos(abcL[1], abcL[2]));

	//Punto de corte de la base mayor con la recta que pasa por p_bc1 y fugaL[0]. Idem con p_bc3
	var corte_BASE_1 = PuntoDeCorte(limite_L[1], RectaDosPuntos(fugaL[0], p_bc1));
	var corte_BASE_3 = PuntoDeCorte(limite_L[3], RectaDosPuntos(fugaL[0], p_bc3));

	//Punto de corte en el lateral izquierdo (fugasF[0]-corte_BASES_0) y lateral derecho (fugasF[2]-corte_BASES_2)
	var corte_LATERAL_1 = PuntoDeCorte(limite_L[0], RectaDosPuntos(fugaL[2], corte_BASE_1));
	var corte_LATERAL_3 = PuntoDeCorte(limite_L[2], RectaDosPuntos(fugaL[2], corte_BASE_3));

	//Punto de corte con la perpendicular del balon en el campo lateral.
	var corte_balon_lateral = PuntoDeCorte(RectaDosPuntos(corte_LATERAL_1, corte_LATERAL_3), perp_L);
	var corte_balon_bc_L = PuntoDeCorte(RectaDosPuntos(corte_balon_lateral, fugaL[0]), RectaDosPuntos(abcL[1], abcL[2]));
	var corte_ponderado_9 = PuntoDeCorte(ParalelaPunto(recta_paralela_9, corte_balon_bc_L), RectaDosPuntos(abcL[2], p_c_aux));

	var distancia_bc_lateral_ponderada = DistanciaPuntos(corte_ponderado_9, abcL[2]);

	if(corte_balon_bc_L.x > abcL[2].x)
		distancia_bc_lateral_ponderada*=(-1);

	var distancia_bc_lateral_real = (distancia_bc_lateral_ponderada*18)/9;

	distancia_bc_lateral_real = Math.round(distancia_bc_lateral_real * 100) / 100.0;

	corte_balon_lateral.x = Math.round(corte_balon_lateral.x);
	corte_balon_lateral.y = Math.round(corte_balon_lateral.y);
	corte_balon_frontal.x = Math.round(corte_balon_frontal.x);
	corte_balon_frontal.y = Math.round(corte_balon_frontal.y);


	/******************************************************************************
									ALTURA DEL BALON.

	//	Calculo la altura en el plano frontal, luego en el 
	//	plano lateral y hago la media para minimizar el error.
	********************************************************************************/

	var paralela_baseMayor_p = ParalelaPunto(limite_F[3], corte_balon_frontal);
	var p1 = PuntoDeCorte(limite_F[0], paralela_baseMayor_p);
	var p2 = PuntoDeCorte(limite_F[2], paralela_baseMayor_p);
	var dist_p12 = DistanciaPuntos(p1, p2);
	var dist_high_low_f = DistanciaPuntos(corte_balon_frontal, ball_frontal);

	var dist_ponderada_1 = (dist_high_low_f*9)/dist_p12;

	var paralela_basemenor_p = ParalelaPunto(limite_F[1], corte_balon_frontal);
	p1 = PuntoDeCorte(limite_F[0], paralela_basemenor_p);
	p2 = PuntoDeCorte(limite_F[2], paralela_basemenor_p);
	dist_p12 = DistanciaPuntos(p1, p2);
	
	var dist_ponderada_2 = (dist_high_low_f*9)/dist_p12;

	var paralela_baseMayor_p = ParalelaPunto(limite_L[3], corte_balon_lateral);
	p1 = PuntoDeCorte(limite_L[0], paralela_baseMayor_p);
	p2 = PuntoDeCorte(limite_L[2], paralela_baseMayor_p);
	dist_p12 = DistanciaPuntos(p1, p2);
	var dist_high_low_l = DistanciaPuntos(corte_balon_lateral, ball_lateral);

	var dist_ponderada_3 = (dist_high_low_l*18)/dist_p12;

	var paralela_basemenor_p = ParalelaPunto(limite_L[1], corte_balon_lateral);
	p1 = PuntoDeCorte(limite_L[0], paralela_basemenor_p);
	p2 = PuntoDeCorte(limite_L[2], paralela_basemenor_p);
	dist_p12 = DistanciaPuntos(p1, p2);
	dist_high_low_l = DistanciaPuntos(corte_balon_lateral, ball_lateral);

	var dist_ponderada_4 = (dist_high_low_l*18)/dist_p12;
	var media_alturas = (dist_ponderada_1+dist_ponderada_2+dist_ponderada_3+dist_ponderada_4)/4;
	var media = Math.round(media_alturas*100)/100;

	/******************************************************************************/

	var solucion_xyz = {x: distancia_bc_frontal_real, y: distancia_bc_lateral_real, z: media};

	console.log("solucion_xyz");
	console.log(solucion_xyz);
	return solucion_xyz;
}



function GetFileSize(fileid) {
	try{
		var fileSize = 0;
		//for IE
		if ($.browser.msie) {
			//before making an object of ActiveXObject, 
			//please make sure ActiveX is enabled in your IE browser
			var objFSO = new ActiveXObject("Scripting.FileSystemObject"); 
			var filePath = $("#" + fileid)[0].value;
			var objFile = objFSO.getFile(filePath);
			var fileSize = objFile.size; //size in kb
			fileSize = fileSize / 1048576; //size in mb 
		}
		//for FF, Safari, Opeara and Others
		else {
			fileSize = $("#" + fileid)[0].files[0].size //size in kb
			fileSize = fileSize / 1048576; //size in mb 
		}
		alert("Uploaded File Size is" + fileSize + "MB");
	}
	catch(e){
		alert("Error is :" + e);
	}
}	

function DibujaCampo(puntos_dibujar, mouseIshover){
    var scene, renderer, camera;
    var cube;
    var controls;

    init(puntos_dibujar);
    var dr = document.getElementById('nuevodibujo');

    dr.onmouseover = function(event) {
        console.log("IN")
        animate();
    };

    
    function init(puntos_dibujar){

        renderer = new THREE.WebGLRenderer( {antialias:true} );
        var width = 1200;
        var height = 800;
        renderer.setSize (width, height);
        renderer.setClearColor( 0xffffff, 1 );
         
        $("#drawer_canvas").append(renderer.domElement).attr('id','nuevodibujo');
        //g.setAttribute("id", "nuevodibujo");

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera (45, width/height, 1, 10000);

        var Axis = new THREE.AxesHelper(0, 0, 0);
        scene.add(Axis);

        camera.position.y = 160;
        camera.position.z = 800;
        camera.lookAt (new THREE.Vector3(4.5,0,-9));
        camera.fov = 1.3;
        camera.updateProjectionMatrix();
        controls = new THREE.OrbitControls (camera, renderer.domElement);
        controls.target.set( 4.5, 0, 9 );

        DibujaTerreo(scene);
        DibujaCampoVoleibol(scene);
        PintaCriterios(scene, puntos_dibujar);
    }

    function animate(){
        if(camera.position.y > 0){
            renderer.render (scene, camera);
        }
    
        controls.update();
        requestAnimationFrame(animate);    
    }
}

function DibujaTerreo(escena){
    /******************************************************/
    //  Terreno
    /******************************************************/
    var materiall = new THREE.LineBasicMaterial( { color: 0xcccccc } );
    for(var i= -3.5; i<24; i+=1){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -5, 0, i) );
        geometry.vertices.push(new THREE.Vector3( 14, 0, i) );

        var line = new THREE.Line( geometry, materiall );
        escena.add( line );
    }

    for(var i=-5; i<15; i+=1){
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( i, 0, -3.5) );
        geometry.vertices.push(new THREE.Vector3( i, 0, 23.5) );

        var line = new THREE.Line( geometry, materiall );
        escena.add( line );
    }
    /******************************************************/
}

function PintaCriterios(escena, puntos_a_dibujar){
    var materiall = new THREE.LineBasicMaterial( { color: 0xcccccc } );
    var material = new THREE.MeshNormalMaterial();
    
    var balones = puntos_a_dibujar;

    for(var i=0; i<balones.length; i++){  
        var geometry = new THREE.SphereGeometry(0.2, 5, 5, 0, Math.PI * 2, 0, Math.PI * 2);                                          
        var sphere = new THREE.Mesh( geometry, material );

        sphere.translateX(balones[i].x);
        sphere.translateZ(balones[i].z);
        sphere.translateY(balones[i].y);

        escena.add( sphere );

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( balones[i].x, 0, balones[i].z) );
        geometry.vertices.push(new THREE.Vector3( balones[i].x, balones[i].y, balones[i].z) );

        var line = new THREE.Line( geometry, materiall );
        escena.add( line );
    }
    
}


function DibujaCampoVoleibol(escena){
    //Campo de juego:


    var materiall = new THREE.LineBasicMaterial( { color: 0x666666 } );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, 0.1, 0) );
    geometry.vertices.push(new THREE.Vector3( 9, 0.1, 0) );
    geometry.vertices.push(new THREE.Vector3( 9, 0.1, 18) );
    geometry.vertices.push(new THREE.Vector3( 0, 0.1, 18) );
    geometry.vertices.push(new THREE.Vector3( 0, 0.1, 0) );
    var line = new THREE.Line( geometry, materiall );
    escena.add( line );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, 0.1, 6) );
    geometry.vertices.push(new THREE.Vector3( 9, 0.1, 6) );
    var line = new THREE.Line( geometry, materiall );
    escena.add( line );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, 0.1, 9) );
    geometry.vertices.push(new THREE.Vector3( 9, 0.1, 9) );
    var line = new THREE.Line( geometry, materiall );
    escena.add( line );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( 0, 0.1, 12) );
    geometry.vertices.push(new THREE.Vector3( 9, 0.1, 12) );
    var line = new THREE.Line( geometry, materiall );
    escena.add( line );

}


$(document).ready(function(){

    $('input#input_draw').click(function(){
        alert($(this).val());
    })

});
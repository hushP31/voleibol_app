
//Clean input tag name
$(document).ready(function() {

    var video_frtl = document.getElementById("frontal");
    var video_ltrl = document.getElementById("lateral");

    $('#btn-play-pause').on("click", function(){
        if (video_frtl.paused == true){
            video_ltrl.play();
            video_frtl.play();
        }
        else{
            video_ltrl.pause();
            video_frtl.pause();
        }
    });   

    var aux_sinc = false;

    $('#btn-sinc').on("click", function(){
        $("#frontal_lateral_sinc").remove();
        if(!aux_sinc){
            $('.functions_video ul').append('<li id="frontal_lateral_sinc">' +
                                                '<ul class="list-inline">' +
                                                    '<li id="sincDivF">' + 
                                                        '<p>Frontal</p>' + 
                                                        '<a id="sinc_frtal_sub" class="sinc">' +
                                                          '<span class="glyphicon glyphicon-backward"> </span>' +
                                                        '</a>' +
                                                        '<a id="sinc_frtal_add" class="sinc">' +
                                                          '<span class="glyphicon glyphicon-forward"> </span>' +
                                                        '</a>' +
                                                    '</li>' +
                                                    '<li id="sincDivL">' + 
                                                        '<p>Lateral</p>' + 
                                                        '<a id="sinc_ltral_sub" class="sinc">' +
                                                          '<span class="glyphicon glyphicon-backward"> </span>' +
                                                        '</a>' +
                                                        '<a id="sinc_ltral_add" class="sinc">' +
                                                          '<span class="glyphicon glyphicon-forward"> </span>' +
                                                        '</a>' +
                                                    '</li>' +
                                                '</ul>' +
                                            '</li>'
                            );
            aux_sinc = true;
            $("#frontal_lateral_sinc").remove();
            $('#sinc_frtal_add').on("click", function(){
                video_frtl.currentTime += (1/25);
            });   

            $('#sinc_ltral_add').on("click", function(){
                video_ltrl.currentTime += (1/25);
            });  

            $('#sinc_frtal_sub').on("click", function(){
                video_frtl.currentTime -= (1/25);
            });   

            $('#sinc_ltral_sub').on("click", function(){
                video_ltrl.currentTime -= (1/25);
            });  
        }   
        else{
            $("#sincDivF").remove();
            $("#sincDivL").remove();
            $("#frontal_lateral_sinc").remove();
            aux_sinc = false;
        }

    });   
});

$(document).ready(function(){
    $("#frontal").on("timeupdate", function(event){
            onTrackedVideoFrame(this.currentTime, this.duration);
        }
    );
});

function onTrackedVideoFrame(currentTime, duration){
    
    var hund = currentTime*100;
    hund = hund.toFixed()%100;

    currentTime = Math.trunc(currentTime);
    duration = duration.toFixed();

    var hours_current = Math.floor( currentTime / 3600 );
    var minutes_current = Math.floor( currentTime / 60 );
    var seconds_current = currentTime % 60;

    //Anteponiendo un 0 a las horas si son menos de 10 
    hours_current = hours_current < 10 ? '0' + hours_current : hours_current;
     
    //Anteponiendo un 0 a los minutos si son menos de 10 
    minutes_current = minutes_current < 10 ? '0' + minutes_current : minutes_current;
     
    //Anteponiendo un 0 a los segundos si son menos de 10 
    seconds_current= seconds_current%60;
    seconds_current = seconds_current < 10 ? '0' + seconds_current : seconds_current;

    hund = hund < 10 ? '0' + hund : hund;
    
    var result = hours_current + ":" + minutes_current + ":" + seconds_current + ":" + hund ;  // 00:00:00:00


    var hours = Math.floor( duration / 3600 );
    var minutes = Math.floor( duration / 60 );
    var seconds = duration % 60;
    
    //Anteponiendo un 0 a los minutos si son menos de 10 
    hours = hours < 10 ? '0' + hours : hours;

    //Anteponiendo un 0 a los minutos si son menos de 10 
    minutes = minutes < 10 ? '0' + minutes : minutes;
     
    //Anteponiendo un 0 a los segundos si son menos de 10 
    seconds = seconds < 10 ? '0' + seconds : seconds;
     
    var r_duration = " / " + hours + ":" + minutes + ":" + seconds;  // 161:30

    $("#current").text(result);
    $("#duration").text(r_duration);
}

$(document).ready(function() {

    var video_frtl = document.getElementById("frontal");
    var video_ltrl = document.getElementById("lateral");
        
    $('#btn-add').on("click", function(){
        video_ltrl.currentTime += (1/25);
        video_frtl.currentTime += (1/25);
    });   

    $('#btn-sub').on("click", function(){
        video_ltrl.currentTime -= (1/25);
        video_frtl.currentTime -= (1/25);
    });   
});

var shift = false;

function AddTimeVideo(flecha, shift){
    var video_frtl = document.getElementById("frontal");
    var video_ltrl = document.getElementById("lateral");
    var add = (1/25);
    
    if(shift == true){
        add = 5;
    }

    if(flecha == 39){
        video_frtl.currentTime += add;
        video_ltrl.currentTime += add;
        
    }
    if(flecha == 37){
        video_frtl.currentTime -= add;
        video_ltrl.currentTime -= add;
    }
    if(flecha == 38 && shift){
        add = 10;
        video_frtl.currentTime += add;
        video_ltrl.currentTime += add;
        
    }
    if(flecha == 40 && shift){
        add = 10;
        video_frtl.currentTime -= add;
        video_ltrl.currentTime -= add;
    }

    shift = false;
}

$(document).keyup(function(e) {
    if(e.which == 16){
        shift = false;
        //alert(shift);
    } 
});

$(document).keypress(function(e) {
    if(e.which == 16){
        shift = true;
        //alert(shift);
    }
});

function PlayPauseVideo(){
    var video_frtl = document.getElementById("frontal");
    var video_ltrl = document.getElementById("lateral");
    

    if(video_frtl.paused == true){
        video_frtl.play();
        video_ltrl.play();
        $('li.playvideo').replaceWith(' <li class="playvideo">' +
                                                '<button type="button" id="btn-play-pause" class="btn btn-default btn-sm">' +
                                                    '<span class="glyphicon glyphicon-pause"></span> Pause ' +
                                                '</button>' +
                                            '</li>');
        
    }
    else{
        video_frtl.pause();
        video_ltrl.pause();
        $('li.playvideo').replaceWith(' <li class="playvideo">' +
                                                '<button type="button" id="btn-play-pause" class="btn btn-default btn-sm">' +
                                                    '<span class="glyphicon glyphicon-play"></span> Play ' +
                                                '</button>' +
                                            '</li>');
    }
}

$(document).keydown(function(e) {
    if(e.which == 16){
        shift = true;
    }
    switch(e.which) {
        case 37: AddTimeVideo(37, shift); // left
        break;

        case 38: AddTimeVideo(38, shift); // up
        break;

        case 39: AddTimeVideo(39, shift); // right
        break;

        case 40: AddTimeVideo(40, shift); // down
        break;

        case 32: PlayPauseVideo();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


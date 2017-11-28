Aeronautics=new Array("Mixed Aeronautics");
Alpine_Skiing=new Array('Combined','Downhill','Slalom','Giant Slalom','Super G');
total = new Array(Aeronautics,Alpine_Skiing);

populateSelect();

$(function() {

      $('#sports').change(function(){
        populateSelect();
    });
    
});


function populateSelect(){
    cat=$('#sports').val();
    $('#discipline').html('');
    
    
    if(cat=='Aeronautics'){
        Aeronautics.forEach(function(t) { 
            $('#discipline').append('<option value='+'"t"'+'>'+t+'</option>');
        });
    }
    
    if(cat=='Alpine Skiing'){
        Alpine_Skiing.forEach(function(t) {
            $('#discipline').append('<option value='+'"t"'+'>'+t+'</option>');
            //$('#discipline').append('<option>'+t+'</option>');
        });
    }
    
} 
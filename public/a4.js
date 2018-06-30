function test() {
	alert(window.location.href);	
}

$(document).ready(function (){
    $.ajax({                   
    	url: "/getProductNames",
    	data: { get_param: 'value' }, 
    	dataType: 'json',                   
      // url: "/getProduct?id=2",              
  		type: "get",
  		success: function (data) { 
  			// alert("here");
  			var $dropdown = $("#products");
        $.each(data, function(index, element) {
        	$dropdown.append($("<option />").text(this.name).val(this.id));
        });
    },     
        complete: function () {
        	// alert("complete");
        },
        fail: function(xhr, textStatus, errorThrown){
       alert('request failed: ' + errorThrown);
       }           
   });
});


$('#products').on('change', function() {
  alert("changed");
})

$("#products").change(function(){
	alert("The text has been changed.");
	var id = ("#products").val();
	alert(id);
	$.ajax({
    	// url: "/getProductNames",
    	// data: { get_param: 'value' }, 
    	// dataType: 'json',                   
      	url: "/getProduct?id=" + id,              
  		type: "get",
      success: function (res) {
      	alert("success!");
          $('#product').text("Name: " + res.name + "\nPrice: " + res.price + "\nDescription: " + res.description);
        },
        complete: function () {
        	alert("complete");
        },
        fail: function(xhr, textStatus, errorThrown){
       alert('request failed: ' + errorThrown);
       }           
   });
});

$(document).ready(function (){
    $.ajax({                   
    	url: "/getProductNames",
    	data: { get_param: 'value' }, 
    	dataType: 'json',                   
  		type: "get",
  		success: function (data) { 
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

   $('#products').on('change', function() {
	var id = $("#products").val();
	$.ajax({    	                 
      	url: "/getProduct?id=" + id,              
  		type: "get",
      success: function (res) {
          $('#product').text("Name: " + res.name + "\nPrice: $" + res.price + "\nDescription: " + res.description);
        },
        complete: function () {
        	// alert("complete");
        },
        fail: function(xhr, textStatus, errorThrown){
       alert('request failed: ' + errorThrown);
       }           
   });
}) 
});

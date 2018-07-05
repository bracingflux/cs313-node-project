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

$('#productName').change(function() {
 var name = $("#productName").val();
 console.log(name);
 $.ajax({

    // url : "http://api.walmartlabs.com/v1/items/42608125?format=json&apiKey=nsgjenyj5zedvuz746ugac4k",
    url: "/getWalmartProduct?name=" + name,                       
    // url: "http://api.walmartlabs.com/v1/search?apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew&query=" + name,     /*http://api.walmartlabs.com/v1/search?apiKey=nsgjenyj5zedvuz746ugac4k&lsPublisherId=eliandrew&query=*/         
     type: "get",
      success: function (res) {
        console.log("Name of first item: " + res/*res.items[0].name*/);
        var names = "";
        var $target = $("body").find('#productInfo');
        // $("#productInfo").empty(); // empty previous search results
        
        /*for (var i = 0; i < res.Search.length; i++) {
          console.log(res.Search[i].Title);
          titles = titles + "<span>" + res.Search[i].Title + "</span>" + "<button class='details' id='" + res.Search[i].imdbID + "'>Details</button><br>";
        }*/
        titles = "<p>" + res + "</p>";
        $target.append(titles); 

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

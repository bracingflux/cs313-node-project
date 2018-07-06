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
 $.ajax({

    url: "/getWalmartProduct?name=" + name,                       
     type: "get",
      success: function (res) {
        var names = "";
        var names2 = ""; 
        var names3 = "";       
        var $target = $("body").find('#productInfo');
        var $target2 = $("body").find('#productInfo2');
        var $target3 = $("body").find('#productInfo3');

        $("#productInfo").empty(); // empty previous search results
        $("#productInfo2").empty(); // empty previous search results
        $("#productInfo3").empty(); // empty previous search results

        var products = JSON.parse(res);
        var totalWithCommas = addCommas(products.totalResults);
        $("#totalItems").text("Total results found: " + totalWithCommas);
        var modNum = 0;
        for (var i in products.items) {
          modNum = i % 3;
          console.log(modNum);
          if (modNum == 0) {
            names = names + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + products.items[i].name + "<br>$" + products.items[i].salePrice + "</p></div>";
          } else if (modNum == 1) {
            names2 = names2 + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + products.items[i].name + "<br>$" + products.items[i].salePrice + "</p></div>";
          } else {
            names3 = names3 + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + products.items[i].name + "<br>$" + products.items[i].salePrice + "</p></div>";
          }
          
        }
        $target.append(names);
        $target2.append(names2); 
        $target3.append(names3); 
        // console.log(res.items);
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

function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

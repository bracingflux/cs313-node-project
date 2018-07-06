$(document).ready(function (){

  var queryNext = "";
  var queryPrev = "";
  var currentIndex = 0;
  var currentQuery = "";
  var totalRes = 0;
  $('.prevRef').hide();
  $('.nextRef').hide();
  $('#productName').focus();


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
  var url1 = "/getWalmartProduct?name=" + name;

  addItems(url1, true);
})

$(".prevRef").click(function() {
  var num = (parseInt(currentIndex));
  if (num > 20) {
    queryPrev = "/previousPage?queryString=" + currentQuery + "&pageIndex=" + (parseInt(currentIndex) - 20);
  } else {
    queryPrev = "/previousPage?queryString=" + currentQuery + "&pageIndex=" + 1;
  }
  // console.log(queryPrev);
  addItems(queryPrev, false);
})

$(".nextRef").click(function() {
  currentIndex = parseInt(currentIndex) + 20;
  queryNext = "/nextPage?queryString=" + currentQuery + "&pageIndex=" + currentIndex;
  // console.log("Value: " + queryNext);
  addItems(queryNext, false);
})


function addItems(url1, isSearch) {
  $.ajax({

    url: url1,                       
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
        currentQuery = products.query;
        currentIndex = products.start;

        if (isSearch) {
          var totalWithCommas = addCommas(products.totalResults);
          $("#totalItems").text("Total results found: " + totalWithCommas);
        }
        totalRes = products.totalResults;
        
        var modNum = 0;
        for (var i in products.items) {
          var pName = products.items[i].name;
          if (pName.length > 40) {
            pName = pName.substring(0, 41) + "..";
          }
          modNum = i % 3;
          if (modNum == 0) {
            names = names + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + pName + "<br><strong>$" + products.items[i].salePrice + "</strong></p><button class='detailsBtn' id='" + products.items[i].itemId + "'>More Details</button></div>";
          } else if (modNum == 1) {
            names2 = names2 + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + pName + "<br><strong>$" + products.items[i].salePrice + "</strong></p><button class='detailsBtn' id='" + products.items[i].itemId + "'>More Details</button></div>";
          } else {
            names3 = names3 + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + pName + "<br><strong>$" + products.items[i].salePrice + "</strong></p><button class='detailsBtn' id='" + products.items[i].itemId + "'>More Details</button></div>";
          }
          
        }
        $('.prevRef').show();
        $('.nextRef').show();
        if (parseInt(totalRes) <= 20) {
          $('#extraNext').hide();
          $('#extraPrev').hide();
        } 
        $target.append(names);
        $target2.append(names2); 
        $target3.append(names3); 
        // console.log(res.items);
        },
        complete: function () {
           // console.log("Finished..");
        },
        fail: function(xhr, textStatus, errorThrown){
          alert('request failed: ' + errorThrown);
       }           
   });
}

});


$(document).on('click', ".detailsBtn", function(){
    var itemId = $(this).attr('id');
    console.log("itemId: " + itemId);
    $('#id01').show();
    $.ajax({                       
      url: "/getWalmartProductById?itemId=" + itemId,              
      type: "get",
      success: function (res) {
        console.log("success!");
        var $target = $("body").find('#extendedProductInfo');        
        var info = "";
        $("#extendedProductInfo").empty();
          var product = JSON.parse(res);
          info = info + "<div class='itemSpan2'><img class='center' src='" + product.mediumImage + "'><p>" + product.shortDescription + "<br><br><strong>$" + 
          product.salePrice + "</strong><br><br>" + product.stock + "</p></div>";

        $target.append(info);

        },
        complete: function () {
          // alert("complete");
        },
        fail: function(xhr, textStatus, errorThrown){
       alert('request failed: ' + errorThrown);
       }           
   });
 
})


function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}



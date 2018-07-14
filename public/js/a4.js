$(document).ready(function (){

  var queryNext = "";
  var queryPrev = "";
  var currentIndex = 0;
  var currentQuery = "";
  var currentUser = "";
  var totalRes = 0;
  $('.prevRef').hide();
  $('.nextRef').hide();
  $('#productName').focus();

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
  var names = "";
        var names2 = ""; 
        var names3 = "";       
        var $target = $("body").find('#productInfo');
        var $target2 = $("body").find('#productInfo2');
        var $target3 = $("body").find('#productInfo3');

        $("#productInfo").empty(); // empty previous search results
        $("#productInfo2").empty(); // empty previous search results
        $("#productInfo3").empty(); // empty previous search results
        var modNum = 0;
        for (var i = 0; i < 21; ++i) {          
          modNum = i % 3;
          if (modNum == 0) {
            names = names.concat("<div class='itemSpan'>");
            for (var j = 0; j < 10; ++j) {
              var width = Math.floor((Math.random() * 70) + 20);
              var divLine = "<div class='line' style='width:" + width + "%'></div>";
              names = names.concat(divLine);
            }
            names = names.concat("</div>");
          } else if (modNum == 1) {
            names2 = names2.concat("<div class='itemSpan'>");
            for (var j = 0; j < 10; ++j) {
              var width = Math.floor((Math.random() * 70) + 20);
              var divLine = "<div class='line' style='width:" + width + "%'></div>";
              // var divLine = "<div class='line'></div>";
              names2 = names2.concat(divLine);
            }
            names2 = names2.concat("</div>");
          } else {
            names3 = names3.concat("<div class='itemSpan'>");
            for (var j = 0; j < 10; ++j) {
              var width = Math.floor((Math.random() * 70) + 20);
              var divLine = "<div class='line' style='width:" + width + "%'></div>";
              // var divLine = "<div class='line'></div>";
              names3 = names3.concat(divLine);
            }
            names3 = names3.concat("</div>");
          }
          
        }
        $target.append(names);
        $target2.append(names2); 
        $target3.append(names3);

  $.ajax({
    xhr: function(){
       var xhr = new window.XMLHttpRequest();
       
     //Download progress
       xhr.addEventListener("progress", function(evt){
         if (evt.lengthComputable) {
           var percentComplete = evt.loaded / evt.total;

         //Do something with download progress
           console.log(percentComplete);
         }
       }, false);
       return xhr;
     },
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
            + pName + "<br><strong>$" + products.items[i].salePrice + "</strong></p><button class='detailsBtn btn btn-primary' id='" + products.items[i].itemId + "'>More Details</button></div>";
          } else if (modNum == 1) {
            names2 = names2 + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + pName + "<br><strong>$" + products.items[i].salePrice + "</strong></p><button class='detailsBtn btn btn-primary' id='" + products.items[i].itemId + "'>More Details</button></div>";
          } else {
            names3 = names3 + "<div class='itemSpan'><img class='itemPhoto' src='" + products.items[i].thumbnailImage + "'><p>" 
            + pName + "<br><strong>$" + products.items[i].salePrice + "</strong></p><button class='detailsBtn btn btn-primary' id='" + products.items[i].itemId + "'>More Details</button></div>";
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

$(document).on('click', '.wishBtn', function() {
  console.log("About to add to wishlst..");
  var productId = $(this).attr("id");
  var currentUserId = $('.random1').attr('id');
  console.log(currentUserId);
  if (currentUserId == "random") {
    console.log("User id not set...");
    // return;
  }

  var serializedData = "pId=" + productId + "&userId=" + currentUserId;
  console.log("serializedData: " + serializedData);   

  $.ajax({  
    type: 'post',
    url: '/addWishList',
    data: serializedData,
    success: function (response) {
      console.log("Added to wishlist!");
    },
    error: function(xhr, textStatus, errorThrown){
      console.log(errorThrown);
       // alert('Username or password is incorrect. Please try again.');
    },
    complete: function () {
      // $('.loader').hide();
      console.log("done!");
    }             
  });
})

$(document).on('click', '#logInBtn', function() {
  // alert("monkey");
  // $("#login_form").preventDefault();
  // e.stopImmediatePropagation();
  var verify = verfiyInputs("username1", "password1");
  if (!verify) {
    console.log("No username or password provided.");
    return;
  }        
  var $form = $("#login_form");
  var $inputs = $form.find("input, select, button, textarea");
  var serializedData = $form.serialize();
  console.log(serializedData);    
  $.ajax({  
    type: 'post',
    url: '/logIn',
    data: serializedData,
    success: function (response) {
      $('#id02').hide();
      $('.input1').val('');
      console.log(response.username);
      currentUser = response.id;
      $("#random").attr("id", response.id);
      $("#showWishList").show();
      console.log("User's id: " + currentUser);
      $("#logInFailure").hide();
    },
    error: function(xhr, textStatus, errorThrown){
      $("#logInFailure").show();
       // alert('Username or password is incorrect. Please try again.');
    },
    complete: function () {
      // $('.loader').hide();
    }             
  });
})

$(document).on('click', '#showWishList', function() {
  $("#wishListItems").empty();
  var $target1 = $("body").find('#wishListItems');        
  var info1 = "<div class='itemSpan' style='border: none;'>";
  for (var j = 0; j < 10; ++j) {
    var width = Math.floor((Math.random() * 70) + 20);
    var divLine = "<div class='line' style='width:" + width + "%'></div>";
    info1 = info1.concat(divLine);
  }
  info1 = info1.concat("</div>")
  $target1.append(info1);
  $("#id04").show();
  var currentUserId = $(".random1").attr("id");
  var serializedData = "uId=" + currentUserId;
  console.log(serializedData);

  $.ajax({  
    type: 'post',
    url: '/getWishList',
    data: serializedData,
    success: function (response) {
      $("#wishListItems").empty();
      var wishItems = JSON.parse(response);
      console.log(wishItems.items[0].name);
      var $target = $("body").find('#wishListItems');
      console.log($target);        

      for (var i = 0; i < wishItems.items.length; ++i) {
        var pDescription = document.createElement("p");
        pDescription.innerHTML = wishItems.items[i].shortDescription;
        var text = pDescription.textContent || pDescription.innerText || "";

        var info = "<div class='itemSpan3'><h4 class='productH2'>" + wishItems.items[i].name + 
        "</h4><img class='center' src='" + wishItems.items[i].mediumImage + "'><p>" + text + "<br><br><strong>$" + 
        wishItems.items[i].salePrice + "</strong><br><br>" + wishItems.items[i].stock + "</p>";
        $target.append(info + "</div>");
      }
      
    },
    complete: function () {
      // $('.loader').hide();
    }             
  });
})

$(document).on('click', '#signUpBtn', function() {
  // alert("monkey");
  // $("#login_form").preventDefault();
  // e.stopImmediatePropagation();
  var verify = verifyPassword(true); // pass true since we are in sign up form
  var verify2 = verifyDisplayName(true);
  var verify3 = verfiyInputs("username2", "pass1");
  if (!verify || !verify2 || !verify3) {
    console.log("passwords did not match or no display name...");
    return;
  }        
  var $form = $("#signup_form");
  var $inputs = $form.find("input, select, button, textarea");
  var serializedData = $form.serialize();
  console.log(serializedData);    
  $.ajax({  
    type: 'post',
    url: '/signUp',
    data: serializedData,
    success: function (response) {
      $('#id03').hide();
      $('.input1').val('');
      $("#showWishList").show();
      console.log(response);
    },
    complete: function () {
      // $('.loader').hide();
    }             
  });
})


$(document).on('click', ".detailsBtn", function(){
    $("#extendedProductInfo").empty();
    var $target1 = $("body").find('#extendedProductInfo');        
    var info1 = "<div class='itemSpan' style='border: none;'>";
    for (var j = 0; j < 10; ++j) {
      // var divLine = "<div class='line'></div>";
      var width = Math.floor((Math.random() * 70) + 20);
      var divLine = "<div class='line' style='width:" + width + "%'></div>";
      info1 = info1.concat(divLine);
    }
    info1 = info1.concat("</div>")
    $target1.append(info1);
    var itemId = $(this).attr('id');
    $('#id01').show();    
    $.ajax({                       
      url: "/getWalmartProductById?itemId=" + itemId,              
      type: "get",
      success: function (res) {
        $("#extendedProductInfo").empty();
        console.log("success!");
        var $target = $("body").find('#extendedProductInfo');        
        var info = "";
          var product = JSON.parse(res);
          var pDescription = document.createElement("p");
          pDescription.innerHTML = product.shortDescription;
          var text = pDescription.textContent || pDescription.innerText || "";

          info = info + "<div class='itemSpan2'><h2 class='productH2'>" + product.name + "</h2><img class='center' src='" + product.mediumImage + "'><p>" + text + "<br><br><strong>$" + 
          product.salePrice + "</strong><br><br>" + product.stock + "</p>";
          var currentUserId = $('.random1').attr('id');
          if (currentUserId != "random") {
            info = info + "<button type='button' class='wishBtn btn btn-primary' id='" + product.itemId + "'>Add to Wish List</button></div>";
          } 
          else {
            // console.log("Length: " + currentUser.length);
            info = info + "</div>";
          }

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

function showSignUp() {
  document.getElementById('id03').style.display='block';
  document.getElementById('id02').style.display='none';
  document.getElementById('username2').focus();  
}

function showSignIn() {
  document.getElementById('id02').style.display='block';
  document.getElementById('id03').style.display='none';
  document.getElementById('username1').focus();  
}

function verifyPassword(onSubmit) {
  var pass1 = document.getElementById('pass1').value;
  var pass2 = document.getElementById('pass2').value;

  if (pass1 && pass2) {
    var result = pass1.localeCompare(pass2);
    if (result == 0) {
      document.getElementById('passVerify').style.display = 'none';
      return true;
    }
    else {
      document.getElementById('passVerify').style.display = 'block';
      if (onSubmit) {
        document.getElementById('pass2').focus();
      }
      return false;      
    }
  }
  else {
    document.getElementById('passVerify').style.display = 'block';
    if (onSubmit) {
      document.getElementById('pass2').focus();
    }
    return false;
  }
  
}

function verifyDisplayName(onSubmit) {
  var displayName = document.getElementById('displayname1').value;
  if (displayName) {
    document.getElementById('displayVerify').style.display = 'none';
    return true;
  }
  else {
    document.getElementById('displayVerify').style.display = 'block';
    if (onSubmit) {
      document.getElementById('displayname1').focus();
    }
    return false;
  }
}

function verfiyInputs(username, password) {
  var user = document.getElementById(username).value;
  var pass = document.getElementById(password).value;

  if (user && pass) {
    return true;
  }
  else {
    document.getElementById(username).focus();
    return false;
  }
}


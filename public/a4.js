$(document).ready(function(){
$.ajax({ url: "https://limitless-wildwood-69266.herokuapp.com/getProduct?id=2",
        context: document.body,
        success: function(response){
           alert("done");
           $("#product").text(response);
        }});
});
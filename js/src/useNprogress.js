NProgress.start();
var request = new XMLHttpRequest();

 
$(document).ready(function(){
   
  setTimeout("NProgress.inc()",1000);
  setTimeout("NProgress.done()",1000);
  /*
  $("a").click(function(){
    //alert("1");
    var url = $(this).attr("href");
    //alert("2");
    var method = "GET";
    //alert("3");
    request.open(method,url);
    //alert("4");
    request.send(null);
    //alert("5");
    request.onreadystatechange = function(){
      if(request.readyState == 4){
        if(request.status == 200 || request.status == 304){
          $("body").html(request.responseText.substring( request.responseText.indexOf("<body") + 68 , request.responseText.indexOf("</body")) );
        }
      }
    }

    return false;
  })
  */
});


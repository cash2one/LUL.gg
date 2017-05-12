(function () {

      var remote = require('electron').remote;

     function init() {
          document.getElementById("min-btn").addEventListener("click", function (e) {
               var window = remote.getCurrentWindow()
               window.minimize();
          });

          document.getElementById("max-btn").addEventListener("click", function (e) {
               var window = remote.getCurrentWindow()
               window.maximize();
          });

          document.getElementById("close-btn").addEventListener("click", function (e) {
               var window = remote.getCurrentWindow()
               window.close();
          });
     };

     document.onreadystatechange = function () {
          if (document.readyState == "complete") {
               init();
          }
     };

})();

var count = 0;;

function navBar() {
    if (count % 2 == 0){
      document.getElementById("mySidenav").style.width = "250px";
    } else{
      document.getElementById("mySidenav").style.width = "0";
    }
    count++;
}

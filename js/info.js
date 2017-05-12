var url = 'https://na.api.riotgames.com/api/lol/NA/v1.3/stats/by-summoner/39129642/ranked?season=SEASON2017&api_key=RGAPI-795e904f-77c3-4914-968d-16794eb87d4f';

var summoner;
var id;
var key = 'RGAPI-795e904f-77c3-4914-968d-16794eb87d4f';

function setup(){
	loadJSON(url,gotData);
}


function loadJSON(url, callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Mooolestor?api_key=RGAPI-795e904f-77c3-4914-968d-16794eb87d4f', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

function gotData(data){
  var json = JSON.parse(data);
	document.write(json['mooolestor'].id);
}

var summoner;
var id;
var icon;
var key = 'RGAPI-795e904f-77c3-4914-968d-16794eb87d4f';

function setup(){
	loadJSON(url,gotData);
}

function getFormData(){
	var x = document.getElementById("summoner_Search");
	summoner = x.elements["summoner_Name"].value;
	getBasicSummonerInfo(summoner);
}

function getBasicSummonerInfo(s){
	var basicInfoURL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" +summoner+"?api_key=" + key;
	loadJSON(basicInfoURL, gotBasicSumData);
}

function gotBasicSumData(data){
  var json = JSON.parse(data);
	id = json[summoner].id;
	icon = json[summoner].profileIconId;
}

function loadJSON(url, callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

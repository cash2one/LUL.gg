var summoner;
var id;
var icon;
var championName;
var key = 'RGAPI-795e904f-77c3-4914-968d-16794eb87d4f';

// Reads the data from the form
function getFormData(){
	var x = document.getElementById("summoner_Search");

	localStorage.setItem(summoner, x.elements["summoner_Name"].value);
	window.location.href = "summoner-info.html"; //Loads the next page, saving the enter summoner name in the local storage
}

// Function that calls other functions to fetch data and then compiles the data
function getSummonerInfo(){
	summoner = localStorage.getItem(summoner); // Retreiving summoner name from localStorage
	document.getElementById("summoner-name").innerHTML = summoner;// Writes out the summoner name
	getBasicSummonerInfo(summoner); // Storing id and icon id into the variables

	getRankedStats(id);
}

// Function that fetches profile id and icon id
function getBasicSummonerInfo(summoner_name){
	var basicInfoURL = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" +summoner_name+"?api_key=" + key;
	loadJSON(basicInfoURL, gotBasicSumData);
}

function gotBasicSumData(data){
  var json = JSON.parse(data);
	//Saves the retrieved basic info into the variables
	id = json[summoner].id;
	icon = json[summoner].profileIconId;

	//Loads the summoner icon
	document.getElementById("summoner-icon").src = "img/summoner_icons/ProfileIcon" + icon + ".png";
}

//Collects data for ranked stats
function getRankedStats(summoner_id){
	var rankedStatsURL = "https://na.api.riotgames.com/api/lol/NA/v1.3/stats/by-summoner/" + summoner_id + "/ranked?season=SEASON2017&api_key=" + key;
	loadJSON(rankedStatsURL, gotRankedStats);
}

function gotRankedStats(data){
	var json = JSON.parse(data);
	var gamesplayed, win, loss, champion, ratio;
	var img;
	var played = []
	var champion_list = []
	var games = [];

	//Find the top 10 most played champions
	//Method:
	//			Traverse the array and hash the index. They key is the number of games played on the
	//			champion. Collisions will be hashed into the next available index. Array will then be sorted.
	for (i = 0; i < json.champions.length; i++){
		gamesplayed = json.champions[i].stats.totalSessionsPlayed;
		if (played[gamesplayed] == null){
			played[gamesplayed] = i;
		} /*else {
			while (played[gamesplayed] != null){
				gamesplayed++;
			}
			played[gamesplayed] = i;
		}*/
	}

	var count = 0; //Get the last 10 elements in the Array
	var index = played.length - 1;
	while (count < 10){
		if (played[index] != null && json.champions[played[index]].id != 0){ //id 0 is undefined in riot api
			champion_list[count] = played[index]; // Array contains the index of the champions with the most fames apepar at
			//games[count] = json.champions[played[index]].stats.totalSessionsPlayed; //games contains the amount of games corresponding to the champion index in champion_list
			//document.write(played[index] + " ");
			count ++;
		}
		index--;
	}
	/*
	//Sort list of champions by games played
	for (){

	} */

	//Get the information from the top 10 most played champions
	for (i = 0; i < 10; i++){
		//win = json.champions[i].stats.totalSessionsWon;
		//loss = json.champions[i].stats.totalSessionsLost;

		champion = json.champions[champion_list[i]].id;

		ratio = win/loss;

		//document.write(champion + " ");
		getChampionInfo(champion);

		img = "champ" + i;
		document.getElementById(img).style.backgroundImage = "url('img/Champion_Splash/Champion_Heads/"+ championName +"_Splash_0.jpg')";
	}
}

//Collect champion info
function getChampionInfo(champion_id){
	var champURL = "https://na1.api.riotgames.com/lol/static-data/v3/champions/" + champion_id +"?api_key=" + key;
	loadJSON(champURL, gotChampData);
}

function gotChampData(data){
	var json = JSON.parse(data);
	championName = json.key;
}

// Fetches data from the api given the link
// Callback is the function that uses the loaded json data
function loadJSON(url, callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', url, false); // <- setting to false is deprecated (using until a solution is found)
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

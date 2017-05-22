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
	summoner = summoner.toLowerCase();
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
	var gamesplayed, win, loss, champion, ratio, len;
	var img;
	var games = []; //Number of games played which will be sorted
	var indexOfChamp = []; //indexes corresponding to the number of games played

	//Traverse the array and store the number of games played into an Array
	//Store the array index that the number of games played appears at in the respective array
	for (i = 0; i < json.champions.length; i++){
		gamesplayed = json.champions[i].stats.totalSessionsPlayed;
		games[i] = gamesplayed;
		indexOfChamp[i] = i;
	}

	//Sort the number of games played per champion in ascending order
	//Ignore final index because it is used for total games from ALL Champions
	insertionSort(indexOfChamp, games);

	len = indexOfChamp.length; //Get length of the array

	//Get the information from the top 10 most played champions
	for (i = 0; i < 10; i++){
		//win = json.champions[i].stats.totalSessionsWon;
		//loss = json.champions[i].stats.totalSessionsLost;
		champion = json.champions[indexOfChamp[len - 2 - i]].id; //Get champion index starting from second last array element (Most played champion)

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

///////////////////////////////////////////////
/// Insertion sort For Most Played Champion///
/////////////////////////////////////////////
/*
	*Quick sort caused Maximum call stack size exceeded
*/
function insertionSort(idx, items) {
    var len = items.length;     // number of items in the array
    var value, i, j, index;

    for (i=1; i < len; i++) {
        // store the current value because it may shift later
        value = items[i];
				index = idx[i];

        /*
         * Whenever the value in the sorted section is greater than the value
         * in the unsorted section, shift all items in the sorted section over
         * by one. This creates space in which to insert the value.
         */

        for (j=i-1; j > -1 && items[j] > value; j--) {
            items[j+1] = items[j];
						idx[j+1] = idx[j]; //Swap the indexes when swapping the elements
        }

        items[j+1] = value;
				idx[j+1] = index;
    }

    return items;
}

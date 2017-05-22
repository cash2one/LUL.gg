//Global Variables
var summoner;
var id;
var icon;
var key = 'RGAPI-795e904f-77c3-4914-968d-16794eb87d4f';
var indexOfChamp = []; //indexes corresponding to the number of games played

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
	var gamesplayed, win, loss, championID, championName, ratio, len;
	var img;
	var games = []; //Number of games played which will be sorted

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
		championID = json.champions[indexOfChamp[len - 2 - i]].id; //Get champion index starting from second last array element (Most played champion)
		
		championName = ChIDToName(championID)
		ratio = win/loss;

		img = "champ" + i;
		document.getElementById(img).style.backgroundImage = "url('img/Champion_Splash/Champion_Heads/"+ championName +"_Splash_0.jpg')";
	}

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

//converts the given id to a string with the Champion name
function ChIDToName(id){
    switch(id){
    case 266: return "Aatrox"; break;
    case 412: return "Thresh"; break;
    case 23: return "Tryndamere"; break;
    case 79: return "Gragas"; break;
    case 69: return "Cassiopeia"; break;
    case 136: return "AurelionSol"; break;
    case 13: return "Ryze"; break;
    case 78: return "Poppy"; break;
    case 14: return "Sion"; break;
    case 1: return "Annie"; break;
    case 202: return "Jhin"; break;
    case 43: return "Karma"; break;
    case 111: return "Nautilus"; break;
    case 240: return "Kled"; break;
    case 99: return "Lux"; break;
    case 103: return "Ahri"; break;
    case 2: return "Olaf"; break;
    case 112: return "Viktor"; break;
    case 34: return "Anivia"; break;
    case 27: return "Singed"; break;
    case 86: return "Garen"; break;
    case 127: return "Lissandra"; break;
    case 57: return "Maokai"; break;
    case 25: return "Morgana"; break;
    case 28: return "Evelynn"; break;
    case 105: return "Fizz"; break;
    case 74: return "Heimerdinger"; break;
    case 238: return "Zed"; break;
    case 68: return "Rumble"; break;
    case 82: return "Mordekaiser"; break;
    case 37: return "Sona"; break;
    case 96: return "KogMaw"; break;
    case 55: return "Katarina"; break;
    case 117: return "Lulu"; break;
    case 22: return "Ashe"; break;
    case 30: return "Karthus"; break;
    case 12: return "Alistar"; break;
    case 122: return "Darius"; break;
    case 67: return "Vayne"; break;
    case 110: return "Varus"; break;
    case 77: return "Udyr"; break;
    case 89: return "Leona"; break;
    case 126: return "Jayce"; break;
    case 134: return "Syndra"; break;
    case 80: return "Pantheon"; break;
    case 92: return "Riven"; break;
    case 121: return "KhaZix"; break;
    case 42: return "Corki"; break;
    case 268: return "Azir"; break;
    case 51: return "Caitlyn"; break;
    case 76: return "Nidalee"; break;
    case 85: return "Kennen"; break;
    case 3: return "Galio"; break;
    case 45: return "Veigar"; break;
    case 432: return "Bard"; break;
    case 150: return "Gnar"; break;
    case 90: return "Malzahar"; break;
    case 104: return "Graves"; break;
    case 254: return "Vi"; break;
    case 10: return "Kayle"; break;
    case 39: return "Irelia"; break;
    case 64: return "LeeSin"; break;
    case 420: return "Illaoi"; break;
    case 60: return "Elise"; break;
    case 106: return "Volibear"; break;
    case 20: return "Nunu"; break;
    case 4: return "TwistedFate"; break;
    case 24: return "Jax"; break;
    case 102: return "Shyvana"; break;
    case 429: return "Kalista"; break;
    case 36: return "DrMundo"; break;
    case 427: return "Ivern"; break;
    case 131: return "Diana"; break;
    case 223: return "TahmKench"; break;
    case 63: return "Brand"; break;
    case 113: return "Sejuani"; break;
    case 8: return "Vladimir"; break;
    case 154: return "Zac"; break;
    case 421: return "RekSai"; break;
    case 133: return "Quinn"; break;
    case 84: return "Akali"; break;
    case 163: return "Taliyah"; break;
    case 18: return "Tristana"; break;
    case 120: return "Hecarim"; break;
    case 15: return "Sivir"; break;
    case 236: return "Lucian"; break;
    case 107: return "Rengar"; break;
    case 19: return "Warwick"; break;
    case 72: return "Skarner"; break;
    case 54: return "Malphite"; break;
    case 157: return "Yasuo"; break;
    case 101: return "Xerath"; break;
    case 17: return "Teemo"; break;
    case 75: return "Nasus"; break;
    case 58: return "Renekton"; break;
    case 119: return "Draven"; break;
    case 35: return "Shaco"; break;
    case 50: return "Swain"; break;
    case 91: return "Talon"; break;
    case 40: return "Janna"; break;
    case 115: return "Ziggs"; break;
    case 245: return "Ekko"; break;
    case 61: return "Orianna"; break;
    case 114: return "Fiora"; break;
    case 9: return "Fiddlesticks"; break;
    case 31: return "Cho'Gath"; break;
    case 33: return "Rammus"; break;
    case 7: return "LeBlanc"; break;
    case 16: return "Soraka"; break;
    case 26: return "Zilean"; break;
    case 56: return "Nocturne"; break;
    case 222: return "Jinx"; break;
    case 83: return "Yorick"; break;
    case 6: return "Urgot"; break;
    case 203: return "Kindred"; break;
    case 21: return "MissFortune"; break;
    case 62: return "Wukong"; break;
    case 53: return "Blitzcrank"; break;
    case 98: return "Shen"; break;
    case 201: return "Braum"; break;
    case 5: return "XinZhao"; break;
    case 29: return "Twitch"; break;
    case 11: return "MasterYi"; break;
    case 44: return "Taric"; break;
    case 32: return "Amumu"; break;
    case 41: return "Gangplank"; break;
    case 48: return "Trundle"; break;
    case 38: return "Kassadin"; break;
    case 161: return "Vel'Koz"; break;
    case 143: return "Zyra"; break;
    case 267: return "Nami"; break;
    case 59: return "JarvanIV"; break;
    case 81: return "Ezreal"; break;
		case 164: return "Camille"; break;
		case 497: return "Rakan"; break;
		case 498: return "Xayah"; break;
    }
}

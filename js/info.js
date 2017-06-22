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
	getRecentGames(id);
}

// Function that fetches profile id and icon id
function getBasicSummonerInfo(summoner_name){
	var basicInfoURL = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" +summoner_name+"?api_key=" + key;
	loadJSON(basicInfoURL, gotBasicSumData);
}

function gotBasicSumData(data){
  var json = JSON.parse(data);
	//Saves the retrieved basic info into the variables
	id = json.id;
	icon = json.profileIconId;

	//Loads the summoner icon
	document.getElementById("summoner-icon").src = "img/summoner_icons/ProfileIcon" + icon + ".png";
}

//Collects data for ranked stats
function getRankedStats(summoner_id){
	var rankedStatsURL;
	//Load Rank
	rankedStatsURL = "https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/"+ summoner_id + "?api_key=" + key;
	loadJSON(rankedStatsURL, gotRank);
	//Load Ranked Champion Info
	rankedStatsURL = "https://na.api.riotgames.com/api/lol/NA/v1.3/stats/by-summoner/" + summoner_id + "/ranked?season=SEASON2017&api_key=" + key;
	loadJSON(rankedStatsURL, gotRankedStats);
}

function gotRank(data){
	var json = JSON.parse(data);
	var wins, losses, tier, rank, lp, league, wlRatio;

	//Load Rank Data
	//json.[0] because we want ranked solo not ranked flex
	wins = json[0].wins;
	losses = json[0].losses;
	tier = json[0].tier;
	rank = json[0].rank;
	lp = json[0].leaguePoints;
	league = json[0].leagueName;

	//Calculate win/Loss ratio and round
	wlRatio = Math.round(wins/(wins+losses)*100);

	document.getElementById("ranked-icon").src = "img/ranks/" + tier + ".png";
	document.getElementById("ranked-stats").innerHTML = tier + " " + rank + "<br />" + lp + " LP / " + wins + "W " + losses + "L<br />Win Ratio " + wlRatio + "%<br />" + league;
}

function gotRankedStats(data){
	var json = JSON.parse(data);
	var gamesplayed, win, loss, championID, championName, ratio, len, total;
	var kills, assists, deaths, kda;
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
		championID = json.champions[indexOfChamp[len - 2 - i]].id; //Get champion index starting from second last array element (Most played champion)
		championName = ChIDToName(championID);
		//Loading the image of the champion into the side profile
		img = "champ" + i;
		document.getElementById(img).style.backgroundImage = "url('img/Champion_Splash/Champion_Heads/"+ championName +"_Splash_0.jpg')";

		//Wins/Losses per champion
		win = json.champions[indexOfChamp[len - 2 - i]].stats.totalSessionsWon;
		loss = json.champions[indexOfChamp[len - 2 - i]].stats.totalSessionsLost;
		total  = win + loss;

		ratio = Math.round((win/total)*100);

		//Kills/Assists/Deaths per champion
		kills = json.champions[indexOfChamp[len - 2 - i]].stats.totalChampionKills;
		deaths = json.champions[indexOfChamp[len - 2 - i]].stats.totalDeathsPerSession;
		assists = json.champions[indexOfChamp[len - 2 - i]].stats.totalAssists;

		kda = (kills + assists) / deaths;
		kda = Math.round(kda * 100) / 100; //Round to 2 decimal places

		//Average kills/assists/deaths per session
		kills /= total;
		deaths /= total;
		assists /= total;

		//Round the kills/deaths/assists to 1 decimal
		kills = Math.round(kills * 10) / 10;
		deaths = Math.round(deaths * 10) / 10;
		assists = Math.round(assists * 10) / 10;

		document.getElementById(img).innerHTML = kills + "/" + deaths + "/" + assists + "   " +  kda + " KDA <br />" + "Total Games: " + total + "<br />Wins: " + win + "<br />Losses: " + loss + "<br />W/L:" + ratio + "%";

	}
}

function getRecentGames(summoner_id){
	var recentGameURL = "https://na.api.riotgames.com/api/lol/NA/v1.3/game/by-summoner/" + summoner_id + "/recent?api_key=" + key;
	loadJSON(recentGameURL, gotRecentGames);
}

function gotRecentGames(data){
	var json = JSON.parse(data);
	var list = document.getElementById("history");
	var li, img, src, p, ul;
	var gametype;
	var playerChampion;
	var kills, assists, deaths, kda;
	var x;
	var ss = [];
	var item = [];
	var keystone;
	var win, time, min, sec;
	var gold, cs, damageDealt, largestMK, wardsKilled, wardsPlaced;

	for (i = 0; i < json.games.length; i++){
		gametype = json.games[i].subType;

		if (gametype == "RANKED_SOLO_5x5"){
			gametype = "Ranked Solo";
		} else if (gametype == "RANKED_FLEX_SR"){
			gametype = "Ranked Flex";
		} else if (gametype == "ARAM_UNRANKED_5x5"){
			gametype = "ARAM";
		} else if (gametype == "NORMAL"){
			gametype = "Normal";
		} else {
			gametype = "Special";
		}

		//Adding a list element
		li = document.createElement("li");
		list.appendChild(li);
		li.setAttribute("id", "game" + i);

		if (json.games[i].stats.win){ //If the user won this game
			document.getElementById("game" + i).style.backgroundColor = "#7AFF8C";
		} else { // User lost the game
			document.getElementById("game" + i).style.backgroundColor= "#F97272";
		}

		//Adding a p tag for the game type
		p = document.createElement("p");
		src = document.getElementById("game" + i);
		src.appendChild(p);
		p.innerHTML = gametype;
		p.style.padding = "0 0 0 20px";

		//Get the champion that the player played
		playerChampion = json.games[i].championId;
		playerChampion = ChIDToName(playerChampion);

		//Add the champion image to the li element
		img = document.createElement("img");
		img.src = "img/Champion_Splash/Champion_Icon/" + playerChampion + "_Square_0.png";
		src = document.getElementById("game" + i);
		src.appendChild(img);

		//Get the summoner spells
		ss[0] = json.games[i].spell1;
		ss[0] = idToSS(ss[0]) ; //Convert from int to string
		ss[1] = json.games[i].spell2;
		ss[1] = idToSS(ss[1]) ; //Convert from int to string

		//Create img for summoner spells
		for (j = 0; j < 2; j++){
			img = document.createElement("img");
			img.src = "img/summoner_spells/"+ ss[j] +".png";
			img.setAttribute("id", "ss" + i + "" + j);
			src = document.getElementById("game" + i);
			src.appendChild(img);

			img.style.width = "40px";
		}

		//Changing style of summoner spells
		x = document.getElementById("ss" + i +""+ 0);
		x.style.position = "relative";
		x.style.left = "0px";
		x.style.bottom = "50px";

		y = document.getElementById("ss" + i +""+ 1);
		y.style.position = "relative"
		y.style.right = "50px";

		/*

		API does not contain info for keystone

		//Adding keystone image
		img = document.createElement("img");
		img.src = "img/keystones/FervorOfBattle.png";
		img.setAttribute("id", "keystone" + i);
		src = document.getElementById("game" + i);
		src.appendChild(img);

		//Changins style of keystone
		x = document.getElementById("keystone" + i);
		x.style.position = "relative";
		x.style.right = "50px";
		x.style.bottom = "25px";
		x.style.width = "40px";
		*/

		//Find the kda of the player for that game
		deaths = checkUndefined(json.games[i].stats.numDeaths);
		kills = checkUndefined(json.games[i].stats.championsKilled);
		assists = checkUndefined(json.games[i].stats.assists);

    //Checks for undefined kda (number of deaths = 0)
    if (deaths == 0){
      kda = "Perfect";
    } else {
		  kda = (Math.round((kills + assists)/deaths * 100))/100;
    }

		//Adding a p tag for the player score
		p = document.createElement("p");
		src = document.getElementById("game" + i);
		src.appendChild(p);
		p.innerHTML = kills + " / " + deaths + " / " + assists + "<br/>KDA: " + kda;

		//Changing the style of the p tag
		p.style.color = "#000"
		p.style.position = "relative"
		p.style.right = "30px";
		p.style.bottom = "25px";
		p.style.display = "inline-block"
		p.style.fontSize = "20px";

		//Get the win and time information
		win = json.games[i].stats.win;
		time = json.games[i].stats.timePlayed;

		//Calculate the minutes and seconds
		min = Math.floor(time/60);
		sec = time%60;

		//Adding a p tag for win and time info
		p = document.createElement("p");
		src = document.getElementById("game" + i);
		src.appendChild(p);

		if (win){
			p.innerHTML = "Victory <br/>" + min + "m " + sec + "s";
		} else {
			p.innerHTML = "Defeat <br/>" + min + "m " + sec + "s";
		}

		//Changing the style of the p tag
		p.style.position = "relative"
		p.style.bottom = "25px";
		p.style.display = "inline-block"
		p.style.fontSize = "20px";

		//Get the items
		item[0] = json.games[i].stats.item0;
		item[1] = json.games[i].stats.item1;
		item[2] = json.games[i].stats.item2;
		item[3] = json.games[i].stats.item3;
		item[4] = json.games[i].stats.item4;
		item[5] = json.games[i].stats.item5;
		item[6] = json.games[i].stats.item6;

		//Create img for items
		for (j = 0; j < 7; j++){

			if (item[j] == null){
				item[j] = 0;
			}

			img = document.createElement("img");
			img.src = "img/items/"+ item[j] +".png";
			img.setAttribute("id", "item" + i + "" + j);
			src = document.getElementById("game" + i);
			src.appendChild(img);

			img.style.width = "40px";
		}

		//Changing style of items
		for (j = 0; j < 3; j++){
			x = document.getElementById("item" + i +""+ j);
			x.style.position = "relative";
			x.style.bottom = "50px";
		}

		for (j = 3; j < 6; j++){
			y = document.getElementById("item" + i +""+ j);
			y.style.position = "relative";
			y.style.right = "150px";
		}

		z = document.getElementById("item" + i +""+ 6);
		z.style.position = "relative";
		z.style.right = "150px";
		z.style.bottom = "25px";

		gold = json.games[i].stats.goldEarned;
		cs = json.games[i].stats.minionsKilled;
		damageDealt = json.games[i].stats.totalDamageDealt;
		largestMK = json.games[i].stats.largestMultiKill;
		wardsKilled = json.games[i].stats.wardKilled;
		wardsPlaced = json.games[i].stats.wardPlaced;

		//Checking for undefined numbers
		if (typeof wardsKilled == "undefined"){
			wardsKilled = 0;
		}
		if (typeof wardsPlaced == "undefined"){
			wardsPlaced = 0;
		}

		/*
		    Stats
								*/
		p = document.createElement("p");
		src = document.getElementById("game" + i);
		src.appendChild(p);

		p.innerHTML = "Gold: " + gold + "<br/>Minions Killed:" + cs + "<br/>Damage Dealt: " + damageDealt + "<br/>Largest Kill Streak: " + largestMK + "<br/>Wards Killed: " + wardsKilled + "<br/>Wards Placed: " + wardsPlaced;

		//Changing the style of the p tag
		p.style.position = "relative";
		p.style.left = "600px";
		p.style.bottom = "150px";
		p.style.fontSize = "15px";
	}

}

//Checks for null variables and returns a 0
function checkUndefined(varToCheck){
  if (varToCheck == null){
    return 0;
  }
  return varToCheck;
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

function openTab(evt, tabName) {
     // Declare all variables
     var i, tabcontent, tablinks;

     // Get all elements with class="tabcontent" and hide them
     tabcontent = document.getElementsByClassName("tabcontent");
     for (i = 0; i < tabcontent.length; i++) {
         tabcontent[i].style.display = "none";
     }

     // Show the current tab, and add an "active" class to the button that opened the tab
     document.getElementById(tabName).style.display = "block";
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
    case 31: return "ChoGath"; break;
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

//Converts the given id to a string with the summoner spell name
function idToSS(id){
	//Commented cases do not exist anymore
	switch(id){
		case 13: return "Clarity"; break;
		case 6: return "Ghost"; break;
		case 7: return "Heal"; break;
		case 1: return "Cleanse"; break;
		case 12: return "Teleport"; break;
		case 11: return "Smite"; break;
		case 21: return "Barrier"; break;
		case 3: return "Exhaust"; break;
		case 14: return "Ignite"; break;
		case 4: return "Flash"; break;
		case 32: return "Mark"; break;
	}
}

//Converts the given id to a string with the Keystone name
function idToKeyStone(id){
	switch(id){
		case 45: return "CourageOfTheColossus"; break;
		case 35: return "DeathfireTouch"; break;
		case 34: return "FervorOfBattle"; break;
		case 39: return "GraspOfTheUndying"; break;
		case 41: return "StonebornPact"; break;
		case 36: return "Stormraider'sSurge"; break;
		case 37: return "Thunderlord'sDecree"; break;
		case 33: return "Warlord'sBloodlust"; break;
		case 38: return "Windspeaker'sBlessing"; break;
	}
}

var UI = require('ui');
var URL = "https://firepoweredgaming.com/servers.php";
var URL2 = "https://firepoweredgaming.com:4443/users";
var ajax = require('ajax');
var servers;
var servers2;
var ready = false;
var lastMenu;

var main = new UI.Card({
  title: 'FP Server Info' ,
  subtitle: 'Welcome',
  body: 'refreshing...',
  subtitleColor: 'orange', // Named colors
  bodyColor: '#9a0036', // Hex colors
	titleColor: "orange"
});

main.show();

var err = new UI.Card({
  title: 'FP Server Info' ,
	subtitle: "ERROR",
  subtitleColor: 'red', // Named colors
	body: "Unable to Fetch Server List.",
  bodyColor: '#9a0036', // Hex colors
});

var menu = new UI.Menu({

});

// Make the request
function load () {
	ajax (
	{
		url: URL2,
		type: 'json'
	},
	function (data) {
		servers2 = data;
		ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
		servers = data.servers;
    console.log('Successfully fetched server data!');
		var eastcoast = {
			title: "East",
			items: []
		};
		var westcoast = {
			title: "West",
			items: []
		};
		var trade = {
			title: "Trade",
			items: []
		};
		for (var i in data.servers) {
			if (data.servers[i].group == "East") {
				eastcoast.items.push({title: i,subtitle: "[" + servers2[i].length + "/24] " + data.servers[i].name});
				menu.section(0,eastcoast);
			}
			else if (data.servers[i].group == "West") {
				westcoast.items.push({title: i,subtitle: "[" + servers2[i].length + "/24] " + data.servers[i].name});
				menu.section(1,westcoast);
			}
			else if (data.servers[i].group == "Trade") {
				trade.items.push({title: i,subtitle: "[" + servers2[i].length + "/32] " + data.servers[i].name});
				menu.section(2,trade);
			}
		}
		ready = true;
		main.body("Press Select to Continue");
  },
  function(error) {
    // Failure!
    console.log('Failed fetching server data: ' + error);
		err.show();
  }
);
	},
	function (error) {
		console.log('Error fetching servers2 for playercount.');
	}
	);}

load();

main.on("click","select",function (e) {
	if (ready) {
		menu.show();
	}
});

main.on("click","down",function (e) {
	ready = false;
	main.body("refreshing...");
	load();
});

var infoCard = new UI.Card();

menu.on("select", function (e) {
	infoCard.title(servers[e.item.title].name);
	infoCard.subtitle(servers[e.item.title].location);
	infoCard.body(servers[e.item.title].ip + ":" + servers[e.item.title].port + "\n[" + servers2[e.item.title].length + "/24]");
	if (e.item.title == "ABTR1" || e.item.title == "ABUN1") {
		infoCard.body(servers[e.item.title].ip + ":" + servers[e.item.title].port + "\n[" + servers2[e.item.title].length + "/32]");
	}
	lastMenu = e.item.title;
	infoCard.show();
});

infoCard.on( "click", "select", function (e){
	var subMenu = new UI.Menu();
	var spec = {
		title: "Unassigned/Spectator",
		items: []
	};
	var blu = {
		title: "BLU",
		items: []
	};
	var red = {
		title: "RED",
		items: []
	};
	for (var i = 0; i < servers2[lastMenu].length; i++) {
		var pClass;
		switch (servers2[lastMenu][i].class) {
			case 0:
				pClass = "N/A";
				break;
			case 1:
				pClass = "Scout";
				break;
			case 2:
				pClass = "Sniper";
				break;
			case 3:
				pClass = "Soldier";
				break;
			case 4:
				pClass = "Demoman";
				break;
			case 5:
				pClass = "Medic";
				break;
			case 6:
				pClass = "Heavy";
				break;
			case 7:
				pClass = "Pyro";
				break;
			case 8:
				pClass = "Spy";
				break;
			case 9:
				pClass = "Engineer";
				break;
		}
		if (servers2[lastMenu][i].team === 0 || servers2[lastMenu][i].team === 1) {
			spec.items.push({title: servers2[lastMenu][i].name});
			subMenu.section(0,spec);
		}
		else if (servers2[lastMenu][i].team === 2) {
			red.items.push({title: servers2[lastMenu][i].name, subtitle: pClass});
			subMenu.section(1,red);
		}
		else if (servers2[lastMenu][i].team === 3) {
			blu.items.push({title: servers2[lastMenu][i].name, subtitle: pClass});
			subMenu.section(2, blu);
		}
	}
	subMenu.show();
});

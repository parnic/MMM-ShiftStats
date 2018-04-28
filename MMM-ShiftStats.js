shiftStats = {};

Module.register("MMM-ShiftStats",{
	defaults: {
		apiKey: null,
		type: 'Regular Season',
		teamName: null,
		sport: null,
		mode: 'standings',
		maxGames: 6,
		teamNameClass: "light",
		updateInterval: 12 * 60 * 60 * 1000
	},
// search for team name, look for newest team, pick playoffs if there are games, otherwise reg season, otherwise exhibition?
// teamSearch response comes with references.season which should get you the info you need. season has multiple season.stats
// which has .Exhibition and etc. which contains games_played.
	start: function() {
		this.sendSocketNotification('SHIFTSTATS_CONFIG', this.config);
		this.sendSocketNotification('SHIFTSTATS_UPDATE');
	},

	getStyles: function() {
		return ["shiftstats.css"];
	},

	getDom: function() {
		if (!shiftStats.standings || !shiftStats.games) {
			let wrapper = document.createElement("div");
			wrapper.innerHTML = 'Loading...';
			wrapper.className += "dimmed light small";

			return wrapper;
		} else {
			let table = document.createElement('table');
			table.className = "small";
			if (this.config.colored) {
				table.className += " colored";
			}

			if (this.config.mode == 'games') {
				table = showGames(table, this.config)
			} else {
				table = showStandings(table)
			}

			return table;
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'SHIFTSTATS_STANDINGS') {
			shiftStats = payload;
			this.updateDom();
		}
	}
});

function showGames(table, config) {
	let now = new Date()
	let mostRecent = []
	shiftStats.games.games.forEach((game) => {
		if (new Date(game.datetime) < now) {
			mostRecent.push({
				game: game,
				home_team: shiftStats.games.references.team.find(team => team.id == game.home_team_id),
				away_team: shiftStats.games.references.team.find(team => team.id == game.away_team_id),
			})
			if (mostRecent.length > config.maxGames) {
				mostRecent.shift()
			}
		}
	})

	let row
	let cell
	mostRecent.forEach((game) => {
		row = document.createElement('tr')

		cell = document.createElement('td')
		cell.innerHTML = game.home_team.name
		cell.className = config.teamNameClass
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = game.game.stats.home_score
		cell.className = 'center'
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = game.game.stats.away_score
		cell.className = 'center'
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = game.away_team.name
		cell.className = `left ${config.teamNameClass}`
		row.appendChild(cell)

		table.appendChild(row)
	})

	return table
}

function showStandings(table) {
	let row = document.createElement('tr')

	let cell = document.createElement('th')
	cell.innerHTML = 'Team'
	row.appendChild(cell)

	cell = document.createElement('th')
	cell.className = 'center'
	cell.innerHTML = 'W'
	row.appendChild(cell)

	cell = document.createElement('th')
	cell.className = 'center'
	cell.innerHTML = 'L'
	row.appendChild(cell)

	cell = document.createElement('th')
	cell.className = 'center'
	cell.innerHTML = 'OTW'
	row.appendChild(cell)

	cell = document.createElement('th')
	cell.className = 'center'
	cell.innerHTML = 'OTL'
	row.appendChild(cell)

	table.appendChild(row)

	shiftStats.standings.teams.forEach((team) => {
		row = document.createElement('tr')

		cell = document.createElement('td')
		cell.innerHTML = team.name
		cell.className = 'light'
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = team.stats['Regular Season'].wins
		cell.className = 'center'
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = team.stats['Regular Season'].losses
		cell.className = 'center'
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = team.stats['Regular Season'].otw
		cell.className = 'center'
		row.appendChild(cell)

		cell = document.createElement('td')
		cell.innerHTML = team.stats['Regular Season'].otl
		cell.className = 'center'
		row.appendChild(cell)

		table.appendChild(row)
	})

	return table
}

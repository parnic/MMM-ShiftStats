let NodeHelper = require('node_helper')
let ShiftStats = require('node-shiftstats')

module.exports = NodeHelper.create({
	start: function() {
		this.setTimer(12 * 60 * 60 * 1000)
	},

	doUpdate: async function() {
		if (!this.config) {
			return
		}

		const s = new ShiftStats(this.config.apiKey)
		await s.login()
		let teams = await s.teamSearch(this.config.sport, this.config.teamName)
// standings will be sorted in the order of the type we requested (regular season, playoffs, ...) but also includes
// stats for other types. consider sorting by the type we want first. see property division_rank
		let standings = await s.divisionStandings(teams.references.division[0].id, this.config.type)
		let games = sortGames(await s.divisionGamesList(teams.references.division[0].id), this.config.type)
		this.sendSocketNotification('SHIFTSTATS_STANDINGS', {standings: standings, games: games})
	},

	setTimer: function(updateInterval) {
		var update = true
		update = typeof this.updateInterval === 'undefined' || this.updateInterval != updateInterval
		this.updateInterval = updateInterval

		if (update) {
			if (typeof this.timer !== 'undefined') {
				clearInterval(this.timer)
			}

			this.timer = setInterval(() => {
				this.doUpdate()
			}, this.updateInterval)
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'SHIFTSTATS_CONFIG') {
			this.config = payload
			this.setTimer(this.config.updateInterval)
		}
		if (notification === 'SHIFTSTATS_UPDATE') {
			this.doUpdate()
		}
	}
})

function sortGames(games, type) {
	games.games = games.games.filter(game => game.type == type)
	games.games.sort((a, b) => {
		return new Date(a.datetime) - new Date(b.datetime)
	})

	return games
}

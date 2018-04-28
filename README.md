# MMM-ShiftStats
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module used to display stats from any DigitalShift site ([HockeyShift](https://hockeyshift.com), [SoccerShift](https://soccershift.com), [LacrosseShift](https://lacrosseshift.com), [FootballShift](http://footballshift.com), [BasketballShift](https://basketballshift.com), and [BaseballShift](http://baseballshift.com)).

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/parnic/MMM-ShiftStats.git`.
2. `cd MMM-ShiftStats`
3. Execute `npm install` to install the node dependencies.
4. Add the module inside `config.js` placing it where you prefer.

## Config
|Option|Type|Description|Default|
|---|---|---|---|
|apiKey|`string`|Your API key. If not supplied, the HockeyShift Android app's key is used by default.||
|teamName|`string`|(REQUIRED) The name of the team you want to track.||
|sport|`string`|(REQUIRED) The name of the sport you want to track (e.g. `'hockey'`, `'soccer'`).||
|mode|`string`|What mode the module should run in. Valid values: `'standings'`, `'games'`|`'standings'`|
|maxGames|`number`|When in `games` mode, how many games should be shown (it will show this many most recent games).|`6`|
|teamNameClass|`string`|CSS class to apply to displayed team names.|`'light'`|
|updateInterval|`number`|How frequently, in milliseconds, to update the info.|`12 * 60 * 60 * 1000` (every 12 hours)|

Here is an example of an entry in config.js
```
{
	module: 'MMM-ShiftStats',
	header: 'Standings',
	position: 'top_left',
	config: {
		teamName: 'Bears',
		sport: 'Hockey'
	}
},
```

## Screenshot
![Screenshot](/screenshot.png?raw=true "screenshot")

## Notes
Pull requests are very welcome! If you'd like to see any additional functionality, don't hesitate to let me know.

## Dependencies
This uses a Node.JS library I created for interfacing with DigitalShift sites: [node-shiftstats](https://github.com/parnic/node-shiftstats), so feel free to check that out for more information.

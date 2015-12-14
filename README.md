# nba-shooting (WIP)

WORK IN PROGRESS. Mostly just imported the code from an [older attempt](https://github.com/nickb1080/nba-shooting-chart), and got it working again. 

Current status:
It generates a [Kirk Goldsberry-style](https://twitter.com/kirkgoldsberry/status/669221652580794368) shot chart for all shots league-wide for this season. By modifying `/scripts/update-shots.js` where noted you can pull data from past seasons. See the [nba API client](https://github.com/nickb1080/nba) for docs.

You can enter a player id to generate a shot chart for that player, relative to league shooting, although it's buggy right now and partially incomplete.

- clone the repo
- `cd nba-shooting`
- `npm install`
- `npm run update-shots`
- `npm start`
- point your browser to `http://localhost:3000`

The client code lives in `server/public`. The server will re-bundle the code (via browserify) each time it is requested.

Plans:
- Fix the odd behavior shown in the individual player maps (i.e. bin id mismatches between player shooting data and league shootin data)

- Add some UI (tooltips?) to provide data about each hexagonal bin.

- d3 is great, but would like to explore using canvas. For instance creating an un-binned chart of every one of a player's career shots might be unworkable, performance-wise.

- When pulling shots, go back as far as nba data provides, and add query strings to endpoints to filter by season

Suggestions and PRs welcome.


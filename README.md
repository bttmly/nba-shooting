# nba-shooting (WIP)

WORK IN PROGRESS. Mostly just imported the code from an [older attempt](https://github.com/nickb1080/nba-shooting-chart), and got it working again. 

Current status:
It generates a [Kirk Goldsberry-style](https://twitter.com/kirkgoldsberry/status/669221652580794368) shot chart for all shots league-wide for this season. By modifying the scripts in `/server` you could get data from past seasons. See the [nba API client](https://github.com/nickb1080/nba) for docs.

You can enter a player id to generate a shot chart for that player, relative to league shooting, although it's buggy right now and partially incomplete.

Run it (actual server coming soon, will obviate most of this crap)
- clone the repo
- `cd nba-shooting`
- `npm install`
- `npm run update-shots`
- `npm start`

- point your browser to `http://localhost:3000`

The client code lives in `server/public`. The server will re-bundle the code (via browserify) each time it is requested.

Plans:
- The key feature of Goldsberry's charts is they show player shooting percentage against league average _at that spot on the floor_. I'll implement this for both players and lineups. (Initial implementation exists, but has some issues.)

- Add some UI (tooltips?) to provide data about each hexagonal bin.

- d3 is great, but would like to explore using canvas. For instance creating an un-binned chart of every one of a player's career shots might be unworkable, performance-wise.

Suggestions and PRs welcome.


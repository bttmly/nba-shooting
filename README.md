# nba-shooting (WIP)

WORK IN PROGRESS. So far just imported the code from an [older attempt](https://github.com/nickb1080/nba-shooting-chart), and got it working again. 

Current status:
It generates a [Kirk Goldsberry-style](https://twitter.com/kirkgoldsberry/status/669221652580794368) shot chart for all shots league-wide for this season. By modifying the scripts in `/server` you could get data from past seasons. See the [nba API client](https://github.com/nickb1080/nba) for docs.

Run it (actual server coming soon, will obviate most of this crap)
- clone the repo
- `cd nba-shooting`
- `mkdir data`
- `node server/league-shots.js`
- `mv data client`
- `cd client`
- `python -m SimppleHTTPServer` (or any other static server)
- browse to `localhost:8000` (or whatever port your server is running on)
- wait a moment while the data loads and the chart is drawn


Plans:
- The key feature of Goldsberry's charts is they show player shooting percentage against league average _at that spot on the floor_. I'll implement this for both players and lineups. 

- Add some UI (tooltips?) to provide data about each hexagonal bin.

- d3 is great, but would like to explore using canvas. For instance creating an un-binned chart of every one of a player's career shots might be unworkable, performance-wise.

- Put in a modern build system for the client.

- Implement a thin server layer to wrap around the NBA API client.

Suggestions and PRs welcome.


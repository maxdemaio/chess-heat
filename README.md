# chess-heat

This web app fetches monthly games from <a href="https://chess.com">chess.com</a> and creates a heatmap of a player's game activity over the year. Hovering/clicking highlighted squares shows the player's win/loss/draw record for that day. It's a fun and easy way to track consistency over time!

<img src="./static/screenshot.png" width="400px"/>

---

## Figma

https://www.figma.com/file/CANI1h7DVzg9Hy3gCMk3MI/Chess-App?node-id=259%3A2&t=664uYhGFovqink1x-1

## How it works

The form takes a username and year. Upon submission, we make 12 api calls to the chess.com backend for each month. Each month contains an array of JSON objects that have game information for the username for the given month/year.

We wait to receive the response to our previous request before making the next request. This way, we should never encounter rate limiting according to the chess.com API documentation.

If we make requests in parallel (for example, in a threaded application or a webserver handling multiple simultaneous requests), then some requests may be blocked depending on how much work it takes to fulfill the previous request. This would result in a "429 Too Many Requests" response from chess.com's server for any non-serial request.

## Chess.com Game JSON

```json
{
  "url": "https://www.chess.com/game/live/74444987023",
  "pgn": "[Event \"Live Chess\"]\n[Site \"Chess.com\"]\n[Date \"2023.04.05\"]\n[Round \"-\"]\n[White \"Duhless\"]\n[Black \"rpragchess\"]\n[Result \"1/2-1/2\"]\n[CurrentPosition \"1nrq1rk1/p4ppp/bp2pn2/2b5/Q1N5/5NP1/PP1BPPBP/2R2RK1 w - -\"]\n[Timezone \"UTC\"]\n[ECO \"D30\"]\n[ECOUrl \"https://www.chess.com/openings/Queens-Gambit-Declined-3.Nf3-Nf6\"]\n[UTCDate \"2023.04.05\"]\n[UTCTime \"14:43:11\"]\n[WhiteElo \"2694\"]\n[BlackElo \"2709\"]\n[TimeControl \"900+3\"]\n[Termination \"Game drawn by repetition\"]\n[StartTime \"14:43:11\"]\n[EndDate \"2023.04.05\"]\n[EndTime \"15:04:16\"]\n[Link \"https://www.chess.com/game/live/74444987023\"]\n\n1. d4 {[%clk 0:15:00.7]} 1... Nf6 {[%clk 0:15:01.8]} 2. c4 {[%clk 0:14:53.4]} 2... e6 {[%clk 0:15:03.8]} 3. Nf3 {[%clk 0:14:54.1]} 3... d5 {[%clk 0:15:05.6]} 4. g3 {[%clk 0:14:53.7]} 4... dxc4 {[%clk 0:15:04.7]} 5. Bg2 {[%clk 0:14:53.6]} 5... Bb4+ {[%clk 0:15:06.6]} 6. Bd2 {[%clk 0:14:27.2]} 6... c5 {[%clk 0:15:06.7]} 7. O-O {[%clk 0:14:19.1]} 7... O-O {[%clk 0:13:22.3]} 8. dxc5 {[%clk 0:12:30.2]} 8... Bxc5 {[%clk 0:13:17.4]} 9. Qc2 {[%clk 0:12:13.8]} 9... Nbd7 {[%clk 0:13:13.3]} 10. Na3 {[%clk 0:11:35]} 10... b6 {[%clk 0:11:04.5]} 11. Nxc4 {[%clk 0:09:18.7]} 11... Ba6 {[%clk 0:09:56]} 12. Rac1 {[%clk 0:07:48]} 12... Rc8 {[%clk 0:09:14.2]} 13. Qa4 {[%clk 0:07:28.3]} 13... Nb8 {[%clk 0:08:43.1]} 14. Qb3 {[%clk 0:07:28]} 14... Nc6 {[%clk 0:08:25.2]} 15. Qa4 {[%clk 0:06:43.1]} 15... Nb8 {[%clk 0:07:17.1]} 16. Qb3 {[%clk 0:06:43.5]} 16... Nc6 {[%clk 0:05:06.8]} 17. Qa4 {[%clk 0:05:40.4]} 17... Nb8 {[%clk 0:05:05.5]} 1/2-1/2\n",
  "time_control": "900+3",
  "end_time": 1680707056,
  "rated": true,
  "accuracies": {
    "white": 96.49,
    "black": 97.35
  },
  "tcn": "lB!TkA0SgvZJowJAfo9zclYIeg8!BIzIdk5ZbqXPqA6Oac46kyZ5yr5QryQ5yr5QryQ5",
  "uuid": "2f4388b2-d3c0-11ed-97b1-6cfe544c0428",
  "initial_setup": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "fen": "1nrq1rk1/p4ppp/bp2pn2/2b5/Q1N5/5NP1/PP1BPPBP/2R2RK1 w - -",
  "time_class": "rapid",
  "rules": "chess",
  "white": {
    "rating": 2694,
    "result": "repetition",
    "@id": "https://api.chess.com/pub/player/duhless",
    "username": "Duhless",
    "uuid": "86d87ccc-4f88-11e2-803c-000000000000"
  },
  "black": {
    "rating": 2709,
    "result": "repetition",
    "@id": "https://api.chess.com/pub/player/rpragchess",
    "username": "rpragchess",
    "uuid": "36ecefaa-35c0-11e6-8024-000000000000"
  }
}
```

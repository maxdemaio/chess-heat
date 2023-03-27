We have 31 svg boxes that represent the maximum number of days in a month. Then, we color them green based on chess.com game activity and populate the hover popup with the day's game stats.

take in username, take in year, generate heatmap graphs (monthly)

this submission makes 12 api calls to the chesscom backend

---

PGN:

```
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2023.03.25"]
[Round "-"]
[White "Djembe58"]
[Black "max_mayo"]
[Result "0-1"]
[CurrentPosition "8/pr4pp/5pk1/p1K5/5P2/6PP/8/8 w - -"]
[Timezone "UTC"]
[ECO "B10"]
[ECOUrl "https://www.chess.com/openings/Caro-Kann-Defense-2.f4-d5"]
[UTCDate "2023.03.25"]
[UTCTime "16:14:06"]
[WhiteElo "1213"]
[BlackElo "1242"]
[TimeControl "900+10"]
[Termination "max_mayo won by resignation"]
[StartTime "16:14:06"]
[EndDate "2023.03.25"]
[EndTime "16:36:51"]
[Link "https://www.chess.com/game/live/73500008985"]
```

annotations parsed from the PGN:

```json
{
    "Event": "Live Chess",
    "Site": "Chess.com",
    "Date": "2023.03.25",
    "Round": "-",
    "White": "Djembe58",
    "Black": "max_mayo",
    "Result": "0-1",
    "CurrentPosition": "8/pr4pp/5pk1/p1K5/5P2/6PP/8/8 w - -",
    "Timezone": "UTC",
    "ECO": "B10",
    "ECOUrl": "https://www.chess.com/openings/Caro-Kann-Defense-2.f4-d5",
    "UTCDate": "2023.03.25",
    "UTCTime": "16:14:06",
    "WhiteElo": "1213",
    "BlackElo": "1242",
    "TimeControl": "900+10",
    "Termination": "max_mayo won by resignation",
    "StartTime": "16:14:06",
    "EndDate": "2023.03.25",
    "EndTime": "16:36:51",
    "Link": "https://www.chess.com/game/live/73500008985"
};
```

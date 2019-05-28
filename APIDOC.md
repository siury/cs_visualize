# CSGO Matches API Documentation

This API returns match data based on matchID and team names

## Get a match by team name

**Request Format:** source.php?team=random

**Request Type:** GET

**Returned Data Format**: JSON or plaintext

**Description:** Returns a JSON containing information about a specific CSGO match. Can be passed
`random` for a random match or `help` for a list of team names. Can also pass `{teamname}` for a
match containing that specific team

**Example Request:** source.php?team=Liquid

**Example Response for team=random or team={teamname}:**

```json
{
  "tournament": "IEM Sydney 2019",
  "date": "2019-04-29 22:00",
  "map": "Dust2",
  "team1": "Liquid",
  "team2": "BIG",
  "winner": "Liquid",
  "team1Rounds": "16",
  "team2Rounds": "7",
  "mostKills": "22",
  "mostKillsPlayer": "nitr0",
  "mostDamage": "91.8",
  "mostDamagePlayer": "EliGE",
  "mostAssists": "6",
  "mostAssistsPlayer": "NAF",
  "mvpRating": "1.49",
  "mvp": "nitr0",
  "id": "85204"
}
```

**Example Response for team=help:**

```
team1,team2,astralis,ence,cloud9,natus vincere,giants,nip,big,hellraisers,ex-3dmax,faze,liquid,mibr,avangar,ldlc,renegades,complexity,ghost,fnatic,boot-d[s],lazarus,rogue,luminosity,vitality,movistar riders,vici,spirit,sprout,izako boars,virtus.pro,alternate attax,unicorns of love,uruguay,chaos,forze,g2,winstrike,expert,havu,sj,ago,north...
```

**Error Handling:** If an invalid team is passed in, it will display an error message:
`"That team wasn't found in our database, try again"`

## Get a match by ID

**Request Format:** source.php endpoint with POST parameter of `id`

**Request Type**: POST

**Returned Data Format**: JSON

**Description:** Returns match data in JSON format based on a given match `id`

**Example Request:** source.php endpoint with POST parameter of `id=85204`

**Example Response:**

```json
{
  "tournament": "IEM Sydney 2019",
  "date": "2019-04-29 22:00",
  "map": "Dust2",
  "team1": "Liquid",
  "team2": "BIG",
  "winner": "Liquid",
  "team1Rounds": "16",
  "team2Rounds": "7",
  "mostKills": "22",
  "mostKillsPlayer": "nitr0",
  "mostDamage": "91.8",
  "mostDamagePlayer": "EliGE",
  "mostAssists": "6",
  "mostAssistsPlayer": "NAF",
  "mvpRating": "1.49",
  "mvp": "nitr0",
  "id": "85204"
}
```

**Error Handling:**
If id is invalid, returns the error: `"That team wasn't found in our database, try again"`

// Name: Ryan Siu
// Date: 18 May 2019
// Section: CSE 154 AC

/*  This file contains the javascript that fetches and displays results
    for previous csgo match information that is taken from source.php
*/

(function() {
  "use strict";

  //const API_URL = "./source.php"; // it's good to factor out your url base as a constant
  const API_URL = "https://ryansiu17.000webhostapp.com/source.php";
  let currentMatch;
  let savedMatches = {};

  window.addEventListener("load", init);

  /**
   * Initializes the website state to no match data shown. Checks to see if user has a
   * local saved matches, otherwise creates a new one and sets it to null. Adds all
   * form submit listeners.
   */
  function init() {
    savedMatches = JSON.parse(window.localStorage.getItem("saved"));
    if (savedMatches === null) {
      savedMatches = {};
    }
    id("another").addEventListener("click", () => {
      id("modal").classList.add("open");
      getTeamNames();
    });
    id("close").addEventListener("click", () => {
      id("modal").classList.remove("open");
    });
    id("search").addEventListener("click", e => {
      initialFetch();
    });
    id("team-form").addEventListener("submit", e => {
      submitTeam(e);
    });
    id("save-form").addEventListener("submit", e => {
      submitNewName(e);
    });
    id("name-form").addEventListener("submit", e => {
      submitId(e);
    });
  }

  /**
   * Handles the form submission of searching by team, fetches team data if valid
   * @param {event} e - form submission event
   */
  function submitTeam(e) {
    e.preventDefault();
    id("modal").classList.remove("open");
    fetchWithTeam(e.target["team"].value);
    e.target.reset();
  }

  /**
   * Handles the form submission when saving a current match by a new codename
   * @param {event} e - form submission event
   */
  function submitNewName(e) {
    e.preventDefault();
    id("modal").classList.remove("open");
    savedMatches[e.target["name"].value] = currentMatch;
    e.target.reset();
    window.localStorage.setItem("saved", JSON.stringify(savedMatches));
  }

  /**
   * Handles the form submission of searching for a match by codename, which can
   * be translated to match ID from localstorage
   * @param {event} e - form submission event
   */
  function submitId(e) {
    e.preventDefault();
    id("modal").classList.remove("open");
    fetchWithId(savedMatches[e.target["name"].value]);
    e.target.reset();
  }

  /**
   * Fetches a comma separated list of teamnames from the web API
   */
  function getTeamNames() {
    let url = API_URL + "?" + "team=help";
    fetch(url, { mode: "no-cors" })
      .then(checkStatus)
      .then(loadTeams)
      .catch(handleError);
  }

  /**
   * Loads a random 15 of the return list of team names
   * @param {response} response - element ID
   */
  function loadTeams(response) {
    id("team-holder").innerHTML = "";
    let teams = response.split(",");
    for (let i = 0; i < 15; i++) {
      addChip(teams);
    }
  }

  /**
   * Adds a random team name to the team-holder container, if it doesn't already exist in the
   * container
   * @param {array} teams - list of all team names
   */
  function addChip(teams) {
    let team = teams[Math.floor(Math.random() * teams.length)];
    if (
      id(team) === null &&
      team !== "" &&
      team !== "match1" &&
      team !== "match2"
    ) {
      let chip = document.createElement("div");
      chip.classList.add("teamChip");
      chip.innerText = team;
      chip.addEventListener("click", () => {
        fetchWithTeam(chip.innerText);
        id("modal").classList.remove("open");
      });
      id("team-holder").appendChild(chip);
    } else {
      addChip(teams);
    }
  }

  /**
   * Performs a bunch of pretty loading animations while fetching a random match's data
   */
  function initialFetch() {
    let url = API_URL + "?" + "team=random";
    fetch(url, { mode: "no-cors" })
      .then(checkStatus)
      .then(JSON.parse)
      .then(loadMatch)
      .then(() => {
        id("search").classList.add("fadeOut");
        id("match").classList.remove("hidden");
        setTimeout(() => id("match").classList.add("fadeIn"), 200);
        id("another").classList.remove("hidden");
        setTimeout(() => id("another").classList.add("fadeIn"), 200);
        setTimeout(() => {
          id("main").classList.add("big");
          id("search").classList.add("hidden");
          setTimeout(() => {
            id("results").classList.remove("hidden");
            setTimeout(() => id("results").classList.add("fadeIn"), 200);
          }, 600);
        }, 400);
      })
      .catch(handleError);
  }

  /**
   * Fetches a random match where given team is present
   * @param {string} team - team name
   */
  function fetchWithTeam(team) {
    let url = API_URL + "?team=" + team;
    fetch(url, { mode: "no-cors" })
      .then(checkStatus)
      .then(JSON.parse)
      .then(loadMatch)
      .catch(() => handleError("There was an issue with your team name!"));
  }

  /**
   * Fetches a the match with given match id
   * @param {string} id - team name
   */
  function fetchWithId(id) {
    let url = API_URL + "?id=" + id;
    let data = new FormData();
    data.append("id", id);
    fetch(url, { method: "POST", body: data, mode: "no-cors" })
      .then(checkStatus)
      .then(JSON.parse)
      .then(loadMatch)
      .catch(() => handleError("There was an issue with your codename!"));
  }

  /**
   * Loads a match onto the screen
   * @param {object} response - match data to be loaded
   */
  function loadMatch(response) {
    loadMap(response.map);
    loadMatchData(response);
    loadTeamScores(response);
    loadStats(response);
    updateId(response.id);
  }

  /**
   * Updates the global currentMatch id to the most recently loaded one
   * @param {string} id - id to be saved
   */
  function updateId(id) {
    currentMatch = id;
  }

  /**
   * Updates the map image based on a response object
   * @param {object} response - match with map data
   */
  function loadMap(map) {
    let element = id("map");
    element.src = "img/" + map.toLowerCase() + ".png";
    element.className = "";
    element.classList.add(map.toLowerCase());
    element.innerText = map;
  }

  /**
   * Updates information about the match date and tournament from a response object
   * @param {object} response - match data to be loaded
   */
  function loadMatchData(response) {
    id("tournament").innerText = response.tournament;
    id("date").innerText = response.date;
  }

  /**
   * Updates team scores from a given response object
   * @param {object} response - match data with scores to be loaded
   */
  function loadTeamScores(response) {
    let t1Score = document.createElement("div");
    let t2Score = document.createElement("div");
    t1Score.innerText = " " + response.team1Rounds;
    t2Score.innerText = " " + response.team2Rounds;
    if (response.team1 === response.winner) {
      t1Score.classList.add("winner");
      t2Score.classList.add("loser");
    } else {
      t2Score.classList.add("winner");
      t1Score.classList.add("loser");
    }
    id("team1").innerText = response.team1;
    id("team1").appendChild(t1Score);
    id("team2").innerText = response.team2;
    id("team2").appendChild(t2Score);
  }

  /**
   * Loads player information from a given match object
   * @param {object} response - match data with player scores to be loaded
   */
  function loadStats(response) {
    let mostKills = id("mostkills");
    mostKills.querySelector(".name").innerText = response.mostKillsPlayer;
    mostKills.querySelector(".score").innerText = response.mostKills;

    let mostDamage = id("mostdamage");
    mostDamage.querySelector(".name").innerText = response.mostDamagePlayer;
    mostDamage.querySelector(".score").innerText = response.mostDamage;

    let mostAssists = id("mostassists");
    mostAssists.querySelector(".name").innerText = response.mostAssistsPlayer;
    mostAssists.querySelector(".score").innerText = response.mostAssists;

    let mvp = id("mvp");
    mvp.querySelector(".name").innerText = response.mvp;
    mvp.querySelector(".score").innerText = response.mvpRating;
  }

  /**
   * Displays a visual error message on screen when an error is caught
   * @param {object} response - server response to be verified
   */
  function handleError(response) {
    let alert = document.createElement("p");
    alert.innerText = response;
    alert.classList.add("alert");
    id("header").appendChild(alert);
    console.error(response);
    alert.classList.add("fadeIn");
    setTimeout(() => {
      alert.classList.add("fadeOut");
      setTimeout(() => alert.parentNode.removeChild(alert), 2000);
    }, 2000);
  }

  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (
      (response.status >= 200 && response.status < 300) ||
      response.status === 0
    ) {
      return response.text();
    } else {
      return Promise.reject(
        new Error(response.status + ": " + response.statusText)
      );
    }
  }
})();

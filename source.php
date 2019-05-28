<?php
/*
    Ryan Siu
    18 May 2019
    CSE 154 AC
    This php file serves as the web api which reads in a matches.csv 
    containing information about ~2000 csgo matches and returns them
    based on fetch calls made from external js files.

    required Params:
        GET: 
            - team
        POST:
            - id
    examples:
        GET:
            team=Liquid
            team=random
        POST:
            id=83356    
    format:
        txt or json
    details:
        If GET is set:
            if team is set to random:
                returns a random match
            if team is set to help:
                returns a plaintext comma separated list of team names
            if team is set to a team name:
                returns a random match where that team is present
        If POST is set:
            if id is set to a match ID:
                returns that match
            else 
                returns an error
        Otherwise, returns an error            
*/
if (isset($_GET["team"]) || isset($_POST["id"])) {
    list($matches, $teams) = get_matches_from_file();
    if(isset($_POST["id"])){
        $id = $_POST["id"];
        if(array_key_exists($id, $matches)){
            header("Content-type: application/json");
            print_r(json_encode($matches[$id]));
        } else {
            header("HTTP/1.1 400 Invalid Request");
            echo "That ID wasn't found in our database, try again";
        }
    }
    else {
        if(isset($_GET["team"])){
            $team = $_GET["team"];
            $team = strtolower($team);
            if($team == "help") {
                header("Content-type: text/plain");
                foreach(array_keys($teams) as $key){
                    echo $key . ",";
                }
            } elseif ($team == "random") {
                header("Content-type: application/json");
                $key = array_rand($matches);
                print_r(json_encode($matches[$key]));
            } elseif (array_key_exists($team, $teams)) {
                header("Content-type: application/json");
                $match = $matches[$teams[$team][array_rand($teams[$team])]];
                print_r(json_encode($match));
            }
            else {
                header("HTTP/1.1 400 Invalid Request");
                echo "That team wasn't found in our database, try again";
            }
        }
    }
}
else {
    header("HTTP/1.1 400 Invalid Request");
    echo "You need to pass either a team or id parameter for this api";
}

function get_matches_from_file() {
    $teams = array();
    $output = array();
    $matches = file("matches.csv", FILE_IGNORE_NEW_LINES);
    foreach ($matches as $line) {
        $columns = explode(",", $line);
        $output[$columns[0]] = new stdClass();
        $output[$columns[0]]->tournament = $columns[1];
        $output[$columns[0]]->date = $columns[2];
        $output[$columns[0]]->map = $columns[3];
        $output[$columns[0]]->team1 = $columns[4];
        $output[$columns[0]]->team2 = $columns[5];
        $output[$columns[0]]->winner = $columns[6];
        $output[$columns[0]]->team1Rounds = $columns[7];
        $output[$columns[0]]->team2Rounds = $columns[8];
        $output[$columns[0]]->mostKills = $columns[48];
        $output[$columns[0]]->mostKillsPlayer = $columns[47];
        $output[$columns[0]]->mostDamage = $columns[51];
        $output[$columns[0]]->mostDamagePlayer = $columns[50];
        $output[$columns[0]]->mostAssists = $columns[54];
        $output[$columns[0]]->mostAssistsPlayer = $columns[53];
        $output[$columns[0]]->mvpRating = $columns[63];
        $output[$columns[0]]->mvp = $columns[62];
        $output[$columns[0]]->id = $columns[0];
        if(!array_key_exists(strtolower($columns[4]), $teams)){
            $newArr = array();
            $newArr[] = $columns[0];
            $teams[strtolower($columns[4])] = $newArr;
        } else {
            $teams[strtolower($columns[4])][] = $columns[0];
        }
        if(!array_key_exists(strtolower($columns[5]), $teams)){
            $newArr = array();
            $newArr[] = $columns[0];
            $teams[strtolower($columns[5])] = $newArr;
        } else {
            $teams[strtolower($columns[5])][] = $columns[0];
        }
    }
    $result = array();
    $result[] = $output;
    $result[] = $teams;
    return $result;
}
?>
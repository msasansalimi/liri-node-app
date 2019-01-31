require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var moment = require("moment");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//I used switchcase to use the specified function relevant to it`s command on node.

var COMMANDS = process.argv[2];
var USERQUERY = process.argv[3];
function switchCase(commands, userQuery) {

  switch (commands) {

    case 'concert-this':
      bandsInTown(userQuery);
      break;

    case 'spotify-this-song':
      spotifySearch(userQuery);
      break;

    case 'movie-this':
      movieSearch(userQuery);
      break;

    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log("Invalid Instruction");
      break;

  }
};
switchCase(COMMANDS,USERQUERY);
//This function is using npm file system to get data from random.txt file and impelement the text on command line.
function doWhatItSays(){
 fs.readFile("random.txt", "utf8", function (error, data) {

  if (error) {
    return console.log(error);
  }
  console.log(data);
  var dataArr = data.split(",");
   console.log(dataArr[0]);
   switchCase(dataArr[0],dataArr[1]);
 });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This function retrive data about concerts and events, using bandsintown API.
function bandsInTown(userQuery) {

  //var artist = process.argv[3];
  var queryUrl = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp";

  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var userInput = JSON.parse(body);
      console.log('Name Of Venue:', userInput[0].venue.name);
      console.log("Venue Country :", userInput[0].venue.country);
      console.log("Venue City :", userInput[0].venue.city);
      console.log("Venue Date: ", moment(userInput[0].datetime).format("DD/MM/YYYY"));

      console.log("====================================================");
    }

  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This function we are using spotify npm to get access to its huge API and recieve any information about required song.
function spotifySearch(userQuery) {
  if(userQuery == undefined){
    userQuery = "the sign";
  }
  spotify.search({ type: 'track', query: userQuery }, function (err, data) {
    if (err) {

      return console.log('Error occurred: ' + err);
    }

    console.log("Song Name: ", data.tracks.items[0].name);
    console.log("Artist Name: ", data.tracks.items[0].artists[0].name);
    console.log("Album Name: ", data.tracks.items[0].album.name);
    console.log("Release Date: ", data.tracks.items[0].album.release_date);
    console.log("Preview Link: ", data.tracks.items[0].album.external_urls);

    console.log("====================================================");
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//This function for receiving data about any required movie.
function movieSearch(userQuery) {
  if(userQuery == undefined){
    userQuery = "Mr.Nobody";
  }
  
  var omdbUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=full&tomatoes=true&apikey=trilogy"; 

  request(omdbUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      var userMovie = JSON.parse(body);
      console.log("Title of the movie: ", userMovie.Title);
      console.log("Year the movie came out: ", userMovie.Year);
      console.log("IMDB Rating of the movie: ", userMovie.imdbRating);
      console.log("Rotten Tomatoes Rating of the movie: ", userMovie.tomatoRating);
      console.log("Country where the movies was produced: ", userMovie.Country);
      console.log("Language of the movie: ", userMovie.Language);
      console.log("Actors in the movie: ", userMovie.Actors);
      console.log("Plot of the movie: ", userMovie.Plot);

      console.log("====================================================");

    }

  });
}

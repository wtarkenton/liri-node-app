var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./key.js");
var fs = require("fs");

function spotifyHelper(err, data){
  if(err){
    console.log("Spotify isn't working");
    log("Spotify isn't working");
  }
  else{
    var output = ""
    output += "Artist(s): ";
    for(artist of data.tracks.items[0].artists){
      output += artist.name + " ";
    }
    output += "\nAlbum: " + data.tracks.items[0].album.name;
    output += "\nSong Name: " + data.tracks.items[0].name;
    output += "\nPreview URL: ";
    if(data.tracks.items[0].preview_url !== null){
      output += data.tracks.items[0].preview_url;
    }
    else {
      output += "No preview found... Sorry.";
    }
    console.log(output);
    log(output + "\n");
  }
}

function useSpotify(name){
  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
  });
  if(name !== undefined){
    spotify.search({
      type: "track",
      query: name,
      limit: 1
    }, spotifyHelper);
  }
  else{
    spotify.search({
      type: "track",
      query: "The Sign",
      limit: 1
    }, spotifyHelper);
  }
}

function movieHelper(err, response, body){
  if (!err && response.statusCode == 200){
    var output = "";
    body = JSON.parse(body);
    output += "Title: " + body.Title;
    output += "\nYear: " + body.Year;
    for(var rater of body.Ratings){
      if(rater.Source === "Internet Movie Database"){
        output += "\nIMDB Rating: " + rater.Value;
      }
      else if(rater.Source === "Rotten Tomatoes"){
        output += "\nRotten Tomatoes Rating: " + rater.Value;
      }
    }
    output += "\nCountry: " + body.Country;
    output += "\nLanguage: " + body.Language;
    output += "\nActors: " + body.Actors;
    output += "\nPlot: " + body.Plot;
    console.log(output);
    log(output + "\n");
  }
  else{
    console.log("OMDB not working");
    log("OMDB not working\n");
  }
}

function getAMovie(title){
  if(title !== undefined){
    var query = "http://www.omdbapi.com/?apikey=40e9cece&t=" + title;
    request(query, movieHelper);
  }
  else{
    request("http://www.omdbapi.com/?apikey=40e9cece&t=Mr.Nobody", movieHelper);
  }
}

var getTweets = function() {
  var client = new twitter(dataKeys.twitterKeys);

  var params = { screen_name: '@BillTwill378', count: 10 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = []; 
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};

function doStuff(){
  fs.readFile("./random.txt", "utf8",function(error, data){
    if(error){
      console.log("An error occurred");
      log("\nAn error occurred\n");
      process.exit(-1);
    }
    else{
      data = data.split(" ");
      main(data[0], data[1], data[2]);
    }
  });
}

function log(message){
  fs.appendFile("log.txt", message + "\n", (err) => {
    if(err){
      console.log("Not working.");
      process.exit(-1);
    }
  });
}

function main(command, parameter = process.argv[3], parameter2 = process.argv[4]){
  switch(command){
    case("my-twitter"):
      log(command + " " + parameter);
      calcBMI(parameter, parameter2);
      break;
    case("spotify-this-song"):
      log(command + " " + parameter);
      useSpotify(parameter);
      break;
    case("movie-this"):
      log(command + " " + parameter);
      getAMovie(parameter);
      break;
    case("do-what-it-says"):
      log(command);
      doStuff()
  }
}

main(process.argv[2]);
// Create Variables
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var request = require('request');
var command = process.argv[2];
var query = process.argv[3];

// 3 Main App Functions
var myTweets = function() {

	// Twitter keys from keys file
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret
	});

	// Twitter API parameters
	var params = {
		screen_name: 'SusieQueue18',
		count: 20
	};

	// GET request for last 20 tweets on my account's timeline
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) { // if there IS an error
			console.log('Error occurred: ' + error);
		} else { // if there is NO error
	  		console.log("My 20 Most Recent Tweets");
	  		console.log("");

	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("( #" + (i + 1) + " )  " + tweets[i].text);
	  		console.log("Created:  " + tweets[i].created_at);
	  		console.log("");
	  	}
	  }
	});
}

var spotifyThisSong = function(songName) {

	// Spotify keys from keys file	
	var spotify = new Spotify({
  		id:  spotifyKeys.id,
  		secret:  spotifyKeys.secret
	});

	// Default song if one is not entered
		if(songName === undefined) {
			songName = "the sign ace of base";
		}

		// Spotify API request (if an object is returned, output the first search result's artist(s), song, preview link, and album)
		spotify.search({type: 'track', query: songName}, function(error, data) {
	    	if(error) {
	        	console.log('Error occurred: ' + error);
	        	return;
	    	} else { 
	    		// For loop manages is a track that has multiple artists
				for(var i = 0; i < data.tracks.items[0].artists.length; i++){

     //Spotify Variables
     var results = data.tracks.items[i];
     var artist = results.artists[0].name;
     var songName = results.name;
     var songLink = results.external_urls.spotify;
     var album = results.album.name;

     //Print artist(s), song name, preview link of song, album//
     console.log("Artist: " + artist);
     console.log("Song: " + songName);
     console.log("Preview Link: " + songLink);
     console.log("Album: " + album);
     console.log("************");

 				  }

				}
	 		
		});
}

var movieThis = function(movieQuery) {
	if(movieQuery === undefined) {
		movieQuery = "Mr Nobody";
	}

    console.log(movieQuery);

    request("http://www.omdbapi.com/?t="+movieQuery+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("");
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country Made: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("");
        }
    });
}

// App functionality based on user input
if(command === "my-tweets") {
	myTweets();
} else if(command === "spotify-this-song") {
	spotifyThisSong(query);
  } else if(command === "movieThis") {
	movieThis(query);
  } else if(command === "do-what-it-says") {
	// App functionality from file read / loads fs npm package
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;

		// If there is a comma, split the string from file in order to differentiate between the command and query
		// 	--> if there is no comma, then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		  }

		// After reading the command from the file, decides which app function to run
		if(command === "my-tweets") {
			myTweets();
		} else if(command === "spotify-this-song") {
			spotifyThisSong(query);
		  } else if(command === "movieThis") {
			movieThis(query);
		  } else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		  }
	});
    } else if(command === undefined) { // use case where no command is given
			console.log("Please enter one of the following commands"+'\n' +  "To see Tweets, enter 'node liri.js my-tweets'" +'\n' + "To see a Spotify song, enter 'node liri.js spotify-this-song <song name>'" +'\n' +  "To see a movie, enter 'node liri.js movieThis <movie name>'" +'\n' + "To see default values, enter 'node liri.js <module name>'" +'\n' + "Enjoy!!")
      } else { // use case where command is given but not recognized
			console.log("Command not recognized! Please try again.")
      }
var gamePlayersList ={
	// id, class, image, attack power, health power, name, item referenece, 
	playerData: [
	["player1", "players", "assets/images/player1.png", "5", "100", "R2D2", 0], 
	["player2","players",  "assets/images/player2.png", "6", " 120", "Princess Leia", 1], 
	["player3","players",  "assets/images/player3.png", "7", "105", "Death Star Trooper", 2], 
	["player4", "players", "assets/images/player4.png", "18", "150", "Darth Vader", 3], 
	["player5", "players", "assets/images/player5.png", "5", "100", "Hans Solo", 4],
	["player6", "players", "assets/images/player6.png", "5", "100", "AWing Pilot", 5]],


init: function(){
	for(var i=0; i < this.playerData.length; i++){
		// set variables
		var currentID = this.playerData[i][0];
		var newCurrentID = "";
		var b = '';
		var c = '';

		b = $('<div/>', {
	        id: currentID,
	        class: this.playerData[i][1] + " col-xs-4 col-md-2",
	        value: this.playerData[i][3], 
			name: this.playerData[i][5],
    	});
    	b.attr('data-hp', this.playerData[i][4]); //healthpower
    	b.attr('data-src', this.playerData[i][2]); //healthpower
    	// add to parent div on index.html page
		$('#startofgame').append(b);
    	

    	//  label the image with player name
    	newCurrentID = '#' + currentID;
    	$(newCurrentID).append('<h3>' + this.playerData[i][5] + '</h3>');

		// create the image tag with its attributes
		c = $('<img>', {src: this.playerData[i][2],
			// class: 'img-responsive',
		    alt: this.playerData[i][5]});
		$(newCurrentID).append(c);

		//  label the image 

		// add health and attack power stats
		$(newCurrentID).append('<p class="base-score"> Health Points: ' + this.playerData[i][3] + '</p>');
		$(newCurrentID).append('<p class="base-score"> Attack Power:  ' + this.playerData[i][4] + '</p>');
		newCurrentID = currentID + 'HP';
		$('.base-score-hp').attr('id', newCurrentID );
		newCurrentID = currentID + 'AP';
		$('.base-score-ap').attr('id', newCurrentID );


	}
}  // end of init
}; // end of object

var currentGame = {
	gameStarted: null,
	defenderName: "",
	opponentName: "",
	defender: null,
	opponent: null,
	defenderBaseHp: 0,
	opponentBaseHp: 0,
	defenderCurrentHp: 0,
	opponentCurrentHp: 0,
	defenderBaseAttack: 0,
	defenderCurrentAttack: 0,
	opponentAttack: 0,
	gameWinner: "",
	attackCount: 0,
	countOpponents: 0,
	reloadGame: null,

	gameInit: function(){
		if(!this.gameStarted){
			//set initial data
			var localDefender = '#' + this.defender;
			var localOpponent  = '#' + this.opponent;
			// set base hp data
			this.defenderBaseHp = $(localDefender).data('hp');
			this.opponentBaseHp = $(localOpponent).data('hp');
			// the below values don't change between games
			this.opponentCurrentHp = this.opponentBaseHp;
			this.defenderBaseAttack = $(localDefender).attr('value');
			this.opponentAttack = $(localOpponent).attr('value');
			// the defender (player) Current HP and Attack Points are the base HP for the first opponent only
			// they are carried over for the next games
			if (this.countOpponents === 1) {
				this.defenderCurrentHp = this.defenderBaseHp;
				this.defenderCurrentAttack = this.defenderBaseAttack;
			    this.attackCount = 0; // only reset to 0 for first opponent
			}
			// set initial counters and flags
			this.gameStarted = true;
			//get current players names
			this.defenderName =  $(localDefender).attr('name');
			this.opponentName =  $(localOpponent).attr('name');
		}

	},


	gamePlay: function(){
		if ((this.gameStarted)) {
		// check healthpoints of each player
			if ((this.defenderCurrentHp <= 0) && (this.opponentCurrentHp <= 0)){
				// if both go below 0 at same attack - both dead and no winner
				$('#messages').html('You are have been defeated by your opponent, you have lost the game.<br>');		
				$('#messages').append(' Select "Attack" or "Restart Game" to begin a new game against a new set of Opponents.  Choose wisely! <br>');
				// retart game
				this.reloadGame = true;

			}
			else if (this.opponentCurrentHp <= 0) {
				// figure out who won and send message
				console.log('defender hp' + this.defenderCurrentHp);
				console.log('opponent hp' + this.opponentCurrentHp);
				// winning message
				$('#messages').html('<p>' + this.defenderName + ' has won the game against ' + this.opponentName  + ' congratulations!</p><br>');		
				// find another opponent and reset
				this.opponent = null;
				// reset game
				this.gameStarted = null;
				// remove opponent
				$("#opponent").empty();
				// empty related messages
	   		    $('#opponenthp').empty();
				//message to select a new opponent
				if (this.countOpponents < 4) {
					$('#messages').append('<p>Select a new Opponent to start another game!</p>');
				}
				else
				{
					$('#messages').append('<p>Game Over you have defeated all 3 Opponent, Congratulations!</p>');
				}
			} 
			else if ((this.defenderCurrentHp) <= 0) {
			    console.log('defender hp' + this.defenderCurrentHp);
				console.log('opponent hp' + this.opponentCurrentHp);
				$('#messages').html("<p>" +this.opponentName + " has won the game against " + this.defenderName  + ", too bad sorry!<br></p>");
				$('#messages').append('<p> Select "Attack" or "Restart Game" to begin a new game. </p><br>');
				// reset the game
				this.reloadGame = true;
			}
			else {
				//play the game
				// reduce the HP of Defender by Opponent Base Attack Power
				this.defenderCurrentHp = this.defenderCurrentHp - this.opponentAttack;
				// reduce the HP of Opponent by Defender Current Attack Power
				this.opponentCurrentHp = this.opponentCurrentHp - this.defenderCurrentAttack;
				this.attackCount = this.attackCount + 1;
				// Increase the Defender Attach Power by multiple of baseAttackPower
				this.defenderCurrentAttack = this.defenderBaseAttack * (1 + this.attackCount);

				$('#messages').empty();
	   		    $('#defenderhp').html('Health Points:   ' + currentGame.defenderCurrentHp + '<br>');
	   		    $('#defenderhp').append('Attack Power:   ' + currentGame.defenderCurrentAttack + '<br>');
	   		    $('#opponenthp').html('Health Points:   ' + currentGame.opponentCurrentHp + '<br>');
	   		    $('#opponenthp').append('Attack Power:    ' + currentGame.opponentAttack + '<br>');

			}
		}
	}
}


$('document').ready(function(){
	//loads the players into brower
	gamePlayersList.init();

	// user clicks a player to select it as defender (player) and then opponent
	$('.players').click(function(){
	
		if (!currentGame.defender){
			// remove base health and ap data - this will be moved to another area
			$('#defender').html(this); //moves to defender correct div area
			currentGame.defender = $(this).attr("id");


			 // initial messages
			$('#messages').empty();
		    // clear old HP and AP data
		    $( '#defender > .players > p.base-score').empty();
		    // change the col layout
		    $('#defender > .players').removeClass("col-xs-4 col-md-2");
			$('#defender > .players').addClass("col-xs-12");

		    // health and attack data display
		    $( '#defender > .players > p.base-score').attr("id", "defenderhp");
	   		$('#defenderhp').html('Health Points:   ' + $(this).data("hp") + '<br>');
	   		$('#defenderhp').append('Attack Power:   ' +  $(this).attr("value") +  '<br>');

	   		
	   		
			 
		}
		else if (!currentGame.opponent){
			 $('#opponent').html(this); //moves to opponent to correct div area
			 currentGame.opponent = $(this).attr("id");
			 currentGame.countOpponents = currentGame.countOpponents + 1;
			
			$( '#opponent > .players > p.base-score').empty();
			// change the col layout
			$('#opponent > .players').removeClass("col-xs-4 col-md-2");
			$('#opponent > .players').addClass("col-xs-12");
		    // health and attack data display
		    $( '#opponent > .players > p.base-score').attr("id", "opponenthp");
			 // health and attack data display
			$('#opponenthp').html('Health Points:   ' + $(this).data("hp") + '<br>');
	   		$('#opponenthp').append('Attack Power:    ' + $(this).attr("value") + '<br>');

	   		//reshuffle remaining players initially

	   		$('#startofgame').prepend('<div class="col-md-2" ></div>');
	   		$('#startofgame > .players').removeClass("col-xs-4 col-md-2");
	   		$('#startofgame > .players').addClass("col-xs-6 col-md-2");
		}

		 
	});

    // attack button logic
   $('#attack').click(function(){
	    // make sure both players have been selected to begin playing
	    if (currentGame.reloadGame){
	    	// if true then restart the game - best way i can see is to reload page to reset everything
	    	location.reload();
	    	currentGame.reloadGame = null;
	    }
	   	if ((currentGame.defender !== null ) && (currentGame.opponent !== null)) {
	   		currentGame.gameInit();
	   		currentGame.gamePlay();	
	   	} 
	   	else {
	   		$('#messages').html('<p>Select both a Player and an Opponent to begin game!</p>');
	   	}

   });
   $('#restart').click(function(){
	    /// just reloads the page and everything is refreshed.
           location.reload();

   });
  

})
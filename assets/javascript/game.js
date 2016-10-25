var gamePlayersList ={
	// id, class, image, attack power, health power, name, item referenece, 
	playerData: [["player1", "players", "assets/images/player1.png", "5", "100", "R2D2", 0], ["player2","players",  "assets/images/player2.png", "6", " 120", "Princess Leia", 1], ["player3","players",  "assets/images/player3.png", "7", "105", "Death Star Trooper", 2], ["player4", "players", "assets/images/player4.png", "18", "150", "Darth Vader", 3], ["player5", "players", "assets/images/player5.png", "5", "100", "Hans Solo", 4]],

init: function(){
	console.log("player data length" + this.playerData.length);
	for(var i=0; i < this.playerData.length; i++){
		var b = "";
		b = $('<div/>', {
	        id: this.playerData[i][0],
	        class: this.playerData[i][1],
	        value: this.playerData[i][3], 
			name: this.playerData[i][5],
    	});
    	b.attr("data-hp", this.playerData[i][4]); //healthpower
    	b.attr("data-src", this.playerData[i][2]); //healthpower
		
		$("#startofgame").append(b);

		var c = "";
		c = $('<img>', {src: this.playerData[i][2],
			class: "img-responsive",
		    alt: this.playerData[i][5]});
		var imageID = '#' + this.playerData[i][0];
		$(imageID).append(c);

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
			console.log("count of oppoenents " + this.countOpponents);
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
				$('#messages').html("You are both dead no one has won the game.<br>");		
				$('#messages').append(' Select "Attack" or "Restart Game" to begin a new game. <br>');
				// retart game
				this.reloadGame = true;

			}
			else if (this.opponentCurrentHp <= 0) {
				// figure out who won and send message
				console.log('defender hp' + this.defenderCurrentHp);
				console.log('opponent hp' + this.opponentCurrentHp);
				// winning message
				$('#messages').html('<p>' + this.defenderName + " has won the game against " + this.opponentName  + " congratulations!</p><br>");		
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
			console.log("going in here");
			$('#defender').html(this); //moves to defender correct div area
			currentGame.defender = $(this).attr("id");
			 // initial messages
			$('#messages').empty();
		    // health and attack data display
	   		$('#defenderhp').html('Health Points:   ' + $(this).data("hp") + '<br>');
	   		$('#defenderhp').append('Attack Power:   ' +  $(this).attr("value") +  '<br>');
	   		
			 
		}
		else if (!currentGame.opponent){
			console.log("and in here");
			 $('#opponent').html(this); //moves to opponent to correct div area
			 currentGame.opponent = $(this).attr("id");
			 currentGame.countOpponents = currentGame.countOpponents + 1;
			 console.log("count opponents " + currentGame.countOpponents);
			 // health and attack data display
			$('#opponenthp').html('Health Points:   ' + $(this).data("hp") + '<br>');
	   		$('#opponenthp').append('Attack Power:    ' + $(this).attr("value") + '<br>');
		}

		 
	});

    // attack button logic
   $('#attack').click(function(){
	    // make sure both players have been selected to begin playing
	    if (currentGame.reloadGame){
	    	// if true then restart the game
	    	console.log("eloading game");
	    	location.reload();
	    	currentGame.reloadGame = null;
	    }
	   	if ((currentGame.defender !== null ) && (currentGame.opponent !== null)) {
	   		currentGame.gameInit();
	   		currentGame.gamePlay();	
	   	} 
	   	else {
	   		$('#messages').html('<p>Select both Player and Opponent to begin game!</p>');
	   	}

   });
   $('#restart').click(function(){
	    /// just reloads the page and everything is refreshed.
           location.reload();

   });
  

})
var messageDisplay = false;

var gamePlayersList ={
	// id, class, image, attack power, health power, name, item referenece, 
	playerData: [
	["player1", "players", "assets/images/player1.png", "20", "100", "R2D2"], 
	["player2","players",  "assets/images/player2.png", "6", " 120", "Princess Leia"], 
	["player3","players",  "assets/images/player3.png", "7", "165", "Darth Vader"], 
	["player4", "players", "assets/images/player4.png", "18", "150", "Death Star Trooper"], 
	["player5", "players", "assets/images/player5.png", "15", "90", "Hans Solo"],
	["player6", "players", "assets/images/player6.png", "5", "140", "AWing Pilot"]],


init: function(){
	// before i add anything I just make sure there is nothing left from any previous games
		$('#startofgame').empty();
		$('#defender').empty();
		$('#opponent').empty();

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

				// check health of each player
				if ((this.defenderCurrentHp <= 0) && (this.opponentCurrentHp <= 0)) {
					// if both go below 0 at same attack - both dead and no winner
					messageDisplay = true;
		   			$('.modal').show();
					$('#messages').html('<p>You have both lost all Health Points and died. </p><p>You have lost the game.</p>');		
					$('#messages').append('<p> Select "Restart Game" to begin a new game against a new set of Opponents. </p><p>  Choose wisely! </p>');
					// retart game
					this.reloadGame = true;

				}
				else if (this.opponentCurrentHp <= 0) {
					// figure out who won and send message
					console.log('defender hp' + this.defenderCurrentHp);
					console.log('opponent hp' + this.opponentCurrentHp);
					// winning messagemessageDisplay = true;
					messageDisplay = true;
		   			$('.modal').show();
					$('#messages').html('<p>' + this.defenderName + ' has won the game against ' + this.opponentName  + '. <br>Congratulations!</p>');		
					$('#messages').append('<p>You have ' + this.defenderCurrentAttack + ' attack points for the next game. Well done.</p>');
					// find another opponent and reset
					this.opponent = null;
					// reset game
					this.gameStarted = null;
					// remove opponent
					$("#opponent").empty();
					// empty related messages
		   		    $('#opponenthp').empty();
					//message to select a new opponent
					if (this.countOpponents < 5) {
						messageDisplay = true;
		   				$('.modal').show();
						$('#messages').append('<p>Select a new Opponent to start another game!</p>');
					}
					else
					{
						messageDisplay = true;
		   				$('.modal').show();
						$('#messages').append('<p>Game Over! <br> You have defeated all opponents. Congratulations!</p>');
					}
				} 
				else if ((this.defenderCurrentHp) <= 0) {
				 //    console.log('defender hp' + this.defenderCurrentHp);
					// console.log('opponent hp' + this.opponentCurrentHp);
					messageDisplay = true;
		   			$('.modal').show();
					$('#messages').html("<p> You have been defeated by " +this.opponentName + ". <br> Too bad sorry!<br></p>");
					$('#messages').append('<p> Select "Restart Game" to begin a new game. </p><br>');
					// reset the game
					this.reloadGame = true;
				}

		}  // end of outer if loop
	},  // end of playGame function

	reset: function(){
		// just resets everything without reloading the page
		messageDisplay = false;
		//console.log(this);
		this.gameStarted = null;
		this.defenderName  =  "";
		this.opponentName =  "";
		this.defender =  null;
		this.opponent =  null;
		this.defenderBaseHp =  0;
		this.opponentBaseHp =  0;
		this.defenderCurrentHp =  0;
		this.opponentCurrentHp =  0;
		this.defenderBaseAttack =  0;
		this.defenderCurrentAttack =  0;
		this.opponentAttack  = 0;
		this.gameWinner =  "";
		this.attackCount =  0;
		this.countOpponents =  0;
		this.reloadGame  = null;
        // somehow the onclick detaches from the player class when i reset everything - so I need to reattach it here
		$('.players').click(function(){
			// must pass the current player object to the function
			var player = this; 
		 	selectPlayers(player);

		});

	}

    
} // end of currentGame Object

function selectPlayers(player){
    	
	if (!messageDisplay) {  // making sure user closes any modal message before selecting a player
			
			/// user player object passed instead of this below.

		if (!currentGame.defender){
			// remove base health and ap data - this will be moved to another area
			$('#defender').html(player); //moves to defender correct div area
			currentGame.defender = $(player).attr("id");


			 // initial messages
			$('#messages').empty();
		    // clear old HP and AP data
		    $( '#defender > .players > p.base-score').empty();
		    // change the col layout
		    $('#defender > .players').removeClass("col-xs-4 col-md-2");
			$('#defender > .players').addClass("col-xs-12");

		    // health and attack data display
		    $( '#defender > .players > p.base-score').attr("id", "defenderhp");
	   		$('#defenderhp').html('Health Points:   ' + $(player).data("hp") + '<br>');
	   		$('#defenderhp').append('Attack Power:   ' +  $(player).attr("value") +  '<br>');
		 
		}
		else if (!currentGame.opponent){
			 $('#opponent').html(player); //moves to opponent to correct div area
			 currentGame.opponent = $(player).attr("id");
			 currentGame.countOpponents = currentGame.countOpponents + 1;
			
			$( '#opponent > .players > p.base-score').empty();
			// change the col layout
			$('#opponent > .players').removeClass("col-xs-4 col-md-2");
			$('#opponent > .players').removeClass("col-xs-6 col-md-2");  // need to add for reshuffle below otherwise xs-6 remains.
			$('#opponent > .players').addClass("col-xs-12");
		    // health and attack data display
		    $( '#opponent > .players > p.base-score').attr("id", "opponenthp");
			 // health and attack data display
			$('#opponenthp').html('Health Points:   ' + $(player).data("hp") + '<br>');
	   		$('#opponenthp').append('Attack Power:    ' + $(player).attr("value") + '<br>');

	   		//reshuffle remaining players initially

	   		$('#startofgame').prepend('<div class="col-md-2" ></div>');
	   		$('#startofgame > .players').removeClass("col-xs-4 col-md-2");
	   		$('#startofgame > .players').addClass("col-xs-6 col-md-2");
		}
	}
}

$('document').ready(function(){
	//loads the players into brower
	gamePlayersList.init();
	messageDisplay = true;
	$('.modal').show();
	$('#messages').html('<h3>How to Play!</h3>');
	$('#messages').append('<p>To Play select a Player and an Opponent from the "Remaining Players" at the bottom of the screen.</p>');
	$('#messages').append('<p>When you hit the "Attack" button you will score Attack Points, you will also loose Health Points.</p>');
    $('#messages').append('<p>Attack Points are carried between games so you become stronger between games.</p>');
    $('#messages').append('<p>Once you or your opponent loose all your Health Points you will die and the current game will end.</p>');
	$('#messages').append('<h3>Good Luck!</h3>');
	// user clicks a player to select it as defender (player) and then opponent
	$('.players').click(function(){
		// must pass the current player object to the function
		var player = this; 
	 	selectPlayers(player);

	});

    // attack button logic
   $('#attack').click(function(){
	    // make sure both players have been selected to begin playing
	    if (currentGame.reloadGame){
	    	// if true then restart the game - best way i can see is to reload page to reset everything
	        gamePlayersList.init();
            currentGame.reset();
	    	//currentGame.reloadGame = null;
	    }
	   	if ((currentGame.defender !== null ) && (currentGame.opponent !== null)) {
	   		currentGame.gameInit();
	   		currentGame.gamePlay();	
	   	} 
	   	else {
	   		messageDisplay = true;
	   		$('.modal').show();
	   		$('#messages').html('<p>Select both a Player and an Opponent to begin game!</p>');
	   	}

   });

   $('#restart').click(function(){
	    /// just reloads the page and everything is refreshed.
           // location.reload();
           gamePlayersList.init();
           currentGame.reset();


   });

   // When the user clicks on the modal window close the modal
   $('.modal').on('click',function(){
      $('.modal').hide() ;
      messageDisplay = false;
	});
   // When the user clicks on the  window close the modal
 //   $(document).on('click',function(){
 //      $('.modal').hide() ;
	// });
  

})
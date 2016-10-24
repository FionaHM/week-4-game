var gamePlayersList ={
	// id, class, image, attack power, health power, name, item referenece, 
	playerData: [["player1", "players reset", "assets/images/player1.png", "5", "100", "snow chewbacca", 0], ["player2","players reset",  "assets/images/player2.png", "6", " 120", "hordi", 1], ["player3","players reset",  "assets/images/player3.png", "7", "105", "boba fett", 2], ["player4", "players reset", "assets/images/player4.png", "8", "150", "clone commander cody", 3]],

init: function(){

	for(var i=0; i < this.playerData.length; i++){
		var b = "";
		b = $('<div/>', {
	        id: this.playerData[i][0],
	        class: this.playerData[i][1],
	       // src: this.playerData[i][2],
	        value: this.playerData[i][3], 
			name: this.playerData[i][5],
    	});
    	b.attr("data-hp", this.playerData[i][4]); //healthpower
    	b.attr("data-src", this.playerData[i][2]); //healthpower
		
		$("#startofgame").append(b);

		var c = "";
		c = $('<img>', {src: this.playerData[i][2], 
		    alt: this.playerData[i][5]});
		// console.log(c);
		var imageID = '#' + this.playerData[i][0];
		$(imageID).append(c);

	}
}  // end of init
}; // end of object

var currentGame = {
	gameStarted: null,
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

	restart: function(){
		// // reset currentgame object
		// this.gameStarted = null;
		// this.defender = null;
		// this.opponent =null;
		// this.defenderBaseHp =0;
		// this.opponentBaseHp =0;
		// this.defenderCurrentHp = 0;
		// this.opponentCurrentHp = 0;
		// this.defenderBaseAttack = 0;
		// this.defenderCurrentAttack =0;
		// this.opponentAttack = 0;
		// this.gameWinner = "";
		// this.attackCount = 0;
		// this.countOpponents = 0;


		// // empty messages -- or should do!
		// $('.reset').empty();

		// // set up again
		// gamePlayersList.init();
		// just reloads page?
	   

	
	},

	gameInit: function(){
		if(!this.gameStarted){
			//set initial data
			locaDefender = '#' + this.defender;
			localOpponent  = '#' + this.opponent;
			//console.log("this");
			//console.log($('#defender').attr('value'));
			this.defenderBaseHp = $(locaDefender).data('hp');
			this.opponentBaseHp = $(localOpponent).data('hp');
			this.defenderCurrentHp = this.defenderBaseHp;
			this.opponentCurrentHp = this.opponentBaseHp;
			this.defenderBaseAttack = $(locaDefender).attr('value');
			this.defenderCurrentAttack = this.defenderBaseAttack;
			this.opponentAttack = $(localOpponent).attr('value');
			this.attackCount = 0;
			this.gameStarted = true;
			
		}

	},


	gamePlay: function(){
		if ((this.gameStarted)) {
		// check healthpoints of each player
			if ((this.defenderCurrentHp <= 0) || (this.opponentCurrentHp) <= 0) {
				// find another opponent and reset
				this.opponent = null;
				// reset game
				this.gameStarted = null;
				// empty oppenent
				$("#opponent").empty();
				$('#defenderhp').empty();
	   		    $('#opponenthp').empty();
					//message to select a new opponent
				if (this.countOpponents < 3) {
					$('#messages').html("Select a New Opponent to Start another game!");
				}
				else
				{
					$('#messages').html("Game Over you have defeated all 3 Opponent!!");
				}

			} 
			// else if ((this.opponentCurrentHp) <= 0) {
			// 		// find another opponent and reset
			// 	this.opponent = null;
			// 	// reset game
			// 	this.gameStarted = null;
			// 	// empty oppenent
			// 	$("#opponent").empty();
			// 	//message to select a new opponent
			// 	$('message').html("Select a New Opponent to Start another game!");
			// }
			else {
				//play the game
				// console.log("initialOp HP: " + this.opponentCurrentHp);
				// console.log("initial Def HP: " + this.defenderCurrentHp);
				// console.log("Attack" + this.defenderBaseAttack + " " + this.opponentAttack);
				// reduce the HP of Defender by Opponent Base Attack Power
				this.defenderCurrentHp = this.defenderCurrentHp - this.opponentAttack;
				// reduce the HP of Opponent by Defender Current Attack Power
				this.opponentCurrentHp = this.opponentCurrentHp - this.defenderCurrentAttack;
				this.attackCount = this.attackCount + 1;
				// Increase the Defender Attach Power by multiple of baseAttackPower
				this.defenderCurrentAttack = this.defenderBaseAttack * (1 + this.attackCount);
				// console.log("initial attach count" + this.attackCount);
				
				// console.log("Attack" + this.defenderCurrentAttack + " " + this.opponentAttack);
				// console.log("Op HP: " + this.opponentCurrentHp);
				// console.log("Def HP: " + this.defenderCurrentHp);
				// console.log("new defender attack power " + this.defenderCurrentAttack);
				// console.log("new attack count" + this.attackCount);

				$('#messages').empty();
	   		    $('#defenderhp').html("Defender Health Points" + currentGame.defenderCurrentHp);
	   		    $('#opponenthp').html("Opponent Health Points" + currentGame.opponentCurrentHp);

			}
		}
	}
}


$('document').ready(function(){
	//loads the players into brower
	gamePlayersList.init();

	// user clicks a player to select it as defender and then opponent

	$('.players').click(function(){
	
		if (!currentGame.defender){
			console.log("going in here");
			$('#defender').html(this); //moves to defender correct div area
			 // var c = "";
			 // c = $('<img/>',
			 // 		{src: $(this).data('src')});
			 // var d = '#' + $(this).attr("id");
	
			 // $(d).append(c);
			 currentGame.defender = $(this).attr("id");
			 
		}
		else if (!currentGame.opponent){
			console.log("and in here");
			 $('#opponent').html(this); //moves to opponent to correct div area
			 var e = "";
			 // e = $('<img/>',
			 // 		{src: $(this).data('src')});
			 // var f = '#' + $(this).attr("id");
		
			 // $(f).append(e);
			 currentGame.opponent = $(this).attr("id");
			 // console.log('currentGame.opponent' + currentGame.opponent);
			 currentGame.countOpponents = currentGame.countOpponents + 1;
			 console.log("count opponents " + currentGame.countOpponents);

		}

		 
	});

    // attack button logic
   $('#attack').click(function(){
	    // make sure both players have been selected to begin playing
	   	if ((currentGame.defender !== null ) && (currentGame.opponent !== null)) {
	   		currentGame.gameInit();
	   		currentGame.gamePlay();
	   		
	   	} 
	   	else {
	   		$('#messages').html("Select Players to begin game!");
	   	}

   });
   $('#restart').click(function(){
	    /// just reloads the page and everything is refreshed.
           location.reload();

   });
  

})
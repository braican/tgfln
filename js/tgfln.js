/*
 *  The Girl from Last Night global scripts
 *  Author : braican
 */

var obj, 		// becomes the json data
	storyline,	// becomes the storyline (i.e. nerd/hippie/fratguy)
	env,		// ACTUAL environment the player is in
	envNum,		// NUMBER of environment **ZERO INDEXED** (i.e. 0, 1, or 2)
	score,		// score of the game
	result,		// the resulting 'ending' after the main portion of the game
	ending;		// whether the game is set on an ending

/*
 *  JSON ARRAY HASH FOR 2 OPTIONS
 * ---------------------------------
 *	thought1 = [0]
 *  thought2 = [1]
 *  audio1   = [2]
 *  audio2   = [3]
 *  path1    = [4]
 *  path2    = [5]
 *  counter1 = [6]
 *  counter2 = [7]
 *
 *  JSON ARRAY HASH FOR 3 OPTIONS
 * ---------------------------------
 *	thought1 = [0]
 *  thought2 = [1]
 *  thought3 = [2]
 *  audio1   = [3]
 *  audio2   = [4]
 *  audio3   = [5]
 *  path1    = [6]
 *  path2    = [7]
 *  path3    = [8]
 *  counter1 = [9]
 *  counter2 = [10]
 *  counter3 = [11]
 *  
 */


function replaceText(clicked){
	if(ending){
		if(clicked == 'endingGood' || clicked == 'endingBad'){
			console.log("the true ending");
			console.log(obj[clicked]);
			fadeToBlack(obj[clicked]);
		} else {
			setAll(obj[clicked].length, clicked);
		}
	} else {
		if(clicked == 'end'){
			if(envNum == 2){
				ending = true;
				gotoEnding();
			} else {
				envNum++;
				var newEnv = env[envNum];
				var newStory = "../dialogues/" + storyline + "_" + newEnv + ".txt";
				
				// gets the JSON data, depending on the chosen character
				$.getJSON(newStory, function(data) {
					obj = data;
					fadeBG();
				});
			}
		} else if(clicked == 'booted'){
			$("#action").html('<h1>You got beaten up</h1>');
		}else {
			setAll(obj[clicked].length, clicked);
		}
	}
}


// ------------------  setAll(INTEGER, STRING)
// sets the THOUGHT BUBBLES, as well as the PATHS
function setAll(len, clicked){
	if(len == 12){
		var thought1 = obj[clicked][0];
		var thought2 = obj[clicked][1];
		var thought3 = obj[clicked][2];
		var path1 = obj[clicked][6];
		var path2 = obj[clicked][7];
		var path3 = obj[clicked][8];
		
		$(".thought1").attr("title", path1);
		$(".thought1").html(thought1);
		$(".thought2").attr("title", path2);
		$(".thought2").html(thought2); 
		$(".thought3").attr("title", path3);
		$(".thought3").html(thought3);
		$(".thought3").css("visibility", "visible");
	} else {
		$(".thought3").css("visibility","hidden");
		var thought1 = obj[clicked][0];
		var thought2 = obj[clicked][1];
		var path1 = obj[clicked][4];
		var path2 = obj[clicked][5];
		
		$(".thought1").attr("title", path1);
		$(".thought1").html(thought1);
		$(".thought2").attr("title", path2);
		$(".thought2").html(thought2);
	}
		
	fadeOptions(clicked);
}


// ------------------  fadeToBlack(STRING)
// ends the game, fades to black, gives the user the outcome, and the option to play again
function fadeToBlack(outcome){
	var docHeight = $(document).height();

	$("body").append("<div id='overlay'><h1 id='outcome'>" + outcome + "</h1><h2 id='playAgain' onclick='playAgain()'>play again</h2></div>");

	$("#overlay").height(docHeight).css({
		'opacity' : 1,
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'background-color': 'black',
        'width': '100%',
        'z-index': 100
	}).hide().fadeIn();
}


// ------------------ playAgain()
// resets the game
function playAgain(){
	console.log("play again motherfucker");
	$("#action").hide();
	$("html").css('background-image', 'url(../assets/apartment_poster.jpg)');
	$("#overlay").fadeOut();
	$("#opening").fadeIn();
	$("audio").remove();
}

// ------------------  fadeOptions(STRING)
// fades in the thought bubbles
function fadeOptions(clicked){
	$("#action").attr("title", clicked);
	
	if($("#action").css("display") == "none"){
		$("#action").fadeIn();
	}
	$("blockquote").fadeIn();
	
	$("audio").remove();
}

// ------------------  gotoEnding()
// begins the ending sequence
function gotoEnding(){
	$("#score").css('display', 'none');
	var endingPath;
	if(score < 5){
		result = "bad";
		endingPath = "../dialogues/" + storyline + "_" + result + ".txt";
	} else if(score > 7){
		result = "good";
		endingPath = "../dialogues/" + storyline + "_" + result + ".txt";
	} else {
		result = "special";
		endingPath = "../dialogues/" + storyline + "_" + result + ".txt";
	}
	$.getJSON(endingPath, function(data) {
		obj = data;
		fadeBG();
	});
}

// ------------------  playAudio(STRING, STRING, STRING)
// plays the audio attributed to the clicked object
function playAudio(clicked, thought, parent){
	var sound;
	if(obj[parent].length == 12){
		if(thought == 'thought1'){
			sound = obj[parent][3];
			score = score + obj[parent][9];
		} else if(thought == 'thought2'){
			sound = obj[parent][4];
			score = score + obj[parent][10];
		}else if(thought == 'thought3'){
			sound = obj[parent][5];
			score = score + obj[parent][11];
		} else {
			sound = "error";
		}	
	} else {
		if(thought == 'thought1'){
			sound = obj[parent][2];
			score = score + obj[parent][6];
		} else if(thought == 'thought2'){
			sound = obj[parent][3];
			score = score + obj[parent][7];
		} else {
			sound = "error";
		}
	}
	
	$("#score span").html(score);
	
	var theAudio;
	if(ending){
		theAudio = '../audio/' + storyline + '/' + result + '/' + sound + '.mp3';
	}else {
		theAudio = '../audio/' + storyline + '/' + sound + '.mp3';
	}
	
	// place the audio into the html
	$("<audio></audio>").attr({
		'src':theAudio,
		'autoplay':'autoplay'
	}).bind("ended", function(){replaceText(clicked);}).appendTo("body");
}

// ------------------  openingAudio()
// plays the opening, then fires to replaceText
function openingAudio(){
	$("audio").remove();
	
	if(ending){
		$("#score").css("display", "none");
	} else {
		$("#score").css("display", "block");
	}
	
	$("#score span").html(score);
	
	var introAudio;
	if(ending){
		introAudio = '../audio/' + storyline + '/' + result + '/intro.mp3';
	} else {
		introAudio = '../audio/' + storyline + '/' + storyline + env[envNum] + 'intro.mp3';
	}
	
	$("<audio></audio>").attr({
		'src':introAudio,
		'autoplay':'autoplay'
	}).bind("ended", function(){replaceText("begin");}).appendTo("body");
}

// ------------------  fadeBG()
// fades the background and gets a new one
function fadeBG(){
	var newBG = "url(../assets/" + env[envNum] + "_final.jpg)";
	
	$("html").fadeTo('slow', 0, function(){
		$(this).css('background-image', newBG);
	}).fadeTo('slow', 1, function(){openingAudio();});
}

// once the document is ready:
//  - get the JSON data for whichever environment **ONLY NERD RIGHT NOW**
//  - hide the 'blockquote' elements and play the intro audio
//  - set up the click function
$(document).ready(function(){

	$("#action").hide();
	
	// what happens on the opening click?
	$("#opening img").click(function(){
	
		storyline = $(this).attr("title") + '';
		
		//for testing purposes...
		envNum = 0;
		//envNum = 2;
		
		score = 0;
		ending = false;
		
		// determine the order of the environments, based on the chosen character
		if(storyline == "nerd"){
			env = new Array("bar", "frathouse", "quad");
		} else if(storyline == "frat"){
			env = new Array("frathouse", "quad", "bar");
		} else if(storyline == "hippie"){
			env = new Array("quad", "bar", "frathouse");
		}
		
		// gets the JSON data, depending on the chosen character
		$.getJSON("../dialogues/" + storyline + "_" + env[0] + ".txt", function(data) {
			obj = data;
		});
		
		var head = "assets/" + storyline + "Head.png";
		$(".action-head").attr("src", head);
		
		$("#opening").fadeOut(function(){fadeBG()});
	});
	
	/** records:
	 *  - the CLICKED thought, indicated by the TITLE OF THE BLOCKQUOTE, and points
	 *     to the next block of data, i.e. the PATH
	 *  - the THOUGHT number in this case, indicated by the CLASS OF THE BLOCKQUOTE
	 *  - the PARENT, indicated by the parent div's title
	 *     (points to the last 'block' of data)
	 *  once clicked, the function calls playAudio(clicked, thought, parent)
	 */
	$("blockquote").click(function(){
		var clicked = $(this).attr("title") + '';
		var thought = $(this).attr("class") + '';
		var parent = $("#action").attr("title") + '';
		$(".thought1").fadeOut(function(){playAudio(clicked, thought, parent)});
		$(".thought2").fadeOut();
		$(".thought3").fadeOut();
	});
});  
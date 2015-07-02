var tiles = new Array(),
	flips = new Array('tb', 'bt', 'lr', 'rl' ),
	iFlippedTile = null,
	iTileBeingFlippedId = null,
	tileImages = new Array(1,2,3,4),
	tileAllocation = null,
	iTimer = 0,
	iInterval = 100,
	iPeekTime = 3000;
	numTiles = 10;
	counterT =0;
	counter =0;



// var time = 20000;
// window.setInterval(onPeekStart,time);

 function countDown(mins,elem){
    var element = document.getElementById(elem);
    element.innerHTML = (mins) ;

    if (mins == 0){
         window.location.href = "youlose.html";
        mins = 60;
       }
     mins--;
    var timer = setTimeout('countDown('+mins+',"'+elem+'")',1000);

 }


	function getRandomImageForTile() {

	var iRandomImage = Math.floor((Math.random() * tileAllocation.length)),
		iMaxImageUse = 2;
	
	while(tileAllocation[iRandomImage] >= iMaxImageUse ) {
			
		iRandomImage = iRandomImage + 1;
			
		if(iRandomImage >= tileAllocation.length) {
				
			iRandomImage = 0;
		}
	}
	console.log(iRandomImage);
	return iRandomImage;
}

function createTile(iCounter) {
	
	var curTile =  new tile("tile" + iCounter),
		iRandomImage = getRandomImageForTile();
		
	tileAllocation[iRandomImage] = tileAllocation[iRandomImage] + 1;
		
	curTile.setFrontColor("tileColor" + Math.floor((Math.random() * 5) + 1));
	curTile.setStartAt(500 * Math.floor((Math.random() * 5) + 1));
	curTile.setFlipMethod(flips[Math.floor((Math.random() * 3) + 1)]);
	curTile.setBackContentImage("images/" +  (iRandomImage + 1) + "a.jpg");
	
	return curTile;
}

function initState() {

	/* Reset the tile allocation count array.  This
		is used to ensure each image is only 
		allocated twice.
	*/
	tileAllocation = new Array(0,0,0,0,0);
	
	while(tiles.length > 0) {
		tiles.pop();
	}
	
	$('#board').empty();
	iTimer = 0;
	
}

function initTiles() {

	var iCounter = 0, 
		curTile = null;

	initState();
	
	// Randomly create tiles and render to board
	for(iCounter = 0; iCounter < numTiles; iCounter++) {
		
		curTile = createTile(iCounter);
		
		$('#board').append(curTile.getHTML());
		
		tiles.push(curTile);
	}	
}

function hideTiles(callback) {
	
	var iCounter = 0;

	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		
		tiles[iCounter].revertFlip();
		counterT++;

	}


	
	callback();
}

function revealTiles(callback) {
	
	var iCounter = 0,
		bTileNotFlipped = false;

	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		
		if(tiles[iCounter].getFlipped() === false) {
		
			if(iTimer > tiles[iCounter].getStartAt()) {
				tiles[iCounter].flip();
			}
			else {
				bTileNotFlipped = true;
			}
		}
	}
	
	iTimer = iTimer + iInterval;

	if(bTileNotFlipped === true) {
		setTimeout("revealTiles(" + callback + ")",iInterval);
	} else {
		callback();
	}
}

function playAudio(sAudio) {
	
	var audioElement = document.getElementById('audioEngine');
			
	if(audioElement !== null) {

		audioElement.src = sAudio;
		audioElement.play();
	}	
}

function checkMatch() {

if(iFlippedTile === null) {

    
		  
		iFlippedTile = iTileBeingFlippedId;


	} else {
		
		if( tiles[iFlippedTile].getBackContentImage() !== tiles[iTileBeingFlippedId].getBackContentImage()) { 
			

			setTimeout("tiles[" + iFlippedTile + "].revertFlip()", 1000);
			setTimeout("tiles[" + iTileBeingFlippedId + "].revertFlip()", 1000);
            
			

		} else {
	        counter++;
			var audio = new Audio('applause.mp3');
            audio.play();
            
           if (counter == 5){
		      
	          counter =0;
	          //setTimeout(window.location.href ="youwin.html",5000);
	          //window.setInterval(window.location.href ="youwin.html");
	          // setTimeout(window.location.href ="youwin.html",1000);
	          setTimeout(function () {
   window.location.href = "youwin.html"; //will redirect to your blog page (an ex: blog.html)
}, 2000); //wi
	      }
		}
	
	    iFlippedTile = null;
		iTileBeingFlippedId = null;
		 
		     }

}



function onPeekComplete() {

	$('div.tile').click(function() {
	
		iTileBeingFlippedId = this.id.substring("tile".length);
	
		if(tiles[iTileBeingFlippedId].getFlipped() === false) {  // condition that allows player to fli
			tiles[iTileBeingFlippedId].addFlipCompleteCallback(function() { checkMatch(); });
			tiles[iTileBeingFlippedId].flip();
		}


	  
	});
}

function onPeekStart() {


	setTimeout("hideTiles( function() { onPeekComplete(); })",iPeekTime);


}



$(document).ready(function() {
	
	initTiles();	
	setTimeout("revealTiles(function() { onPeekStart(); })",iInterval);
	
	$('#startGameButton').click(function() {
	
		initTiles();	
		setTimeout("revealTiles(function() { onPeekStart(); })",iInterval);

	});

});
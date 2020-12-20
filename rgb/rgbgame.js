
var n = 6 ;
var colors = generatecolors(n) ; // to be randomised ... checked...
var squares = document.querySelectorAll(".tile") ;
var picked_color = pickcolor() ; // to be randomised .... checked...
var display_color = document.querySelector("#picked_color") ;
var msd = document.querySelector("#message") ;
var h1 = document.querySelector("h2") ;
var reset = document.querySelector("#reset") ;
var easy = document.querySelector("#easy") ;
var hard = document.querySelector("#hard") ;

easy.addEventListener("click" , function(){
	//alert("e") ;
	n = 3 ;
	easy.classList.add("selected") ;
	hard.classList.remove("selected") ;
	colors = generatecolors(3) ;
	picked_color = pickcolor() ;
	display_color.innerHTML = picked_color ;
	for(var i = 0 ; i < 3 ; i++){
		squares[i].style.backgroundColor = colors[i] ;
	}
	for(var i = 3 ; i < 6 ; i++){
		squares[i].style.display = "none" ;
	}
	h1.style.backgroundColor = "steelblue" ;
	msd.innerHTML ="" ;
})
hard.addEventListener("click" , function(){
	//alert("h") ;
	n = 6 ;
	hard.classList.add("selected") ;
	easy.classList.remove("selected") ;
	colors = generatecolors(6) ;
	picked_color = pickcolor() ;
	display_color.innerHTML = picked_color ;
	for(var i = 0 ; i < 6 ; i++){
		squares[i].style.backgroundColor = colors[i] ;
		squares[i].style.display = "block" ;
		h1.style.backgroundColor = "steelblue" ;
		msd.innerHTML ="" ;

	}
})
reset.addEventListener("click" , function(){
	colors = generatecolors(n) ;

	picked_color = pickcolor() ;

	display_color.innerHTML = picked_color ;


	for(var i = 0 ; i < squares.length ;i++){
		squares[i].style.backgroundColor = colors[i] ;
	}


	h1.style.backgroundColor = "steelblue" ;

	reset.innerHTML = "New colors" ;
	msd.innerHTML ="" ;
} ) ;


display_color.innerHTML = (picked_color) ;

for(var i = 0 ; i < squares.length ;i++){
	// adding colors to square...
	squares[i].style.backgroundColor = colors[i] ;

	//add click listner.....
	squares[i].addEventListener("click" , function(){
		//alert("clicked a square...")
		//find the clicked square...
		var clicked = this.style.backgroundColor;

		//compare it....
		//console.log(clicked) ;
		if(picked_color === clicked){
			msd.innerHTML = "Correct..!!" ;
			changecolors(picked_color) ;
			h1.style.backgroundColor = clicked ;
			reset.innerHTML = "Play Again ?" ;
		}
		else{
			this.style.backgroundColor = "#232323"	;
			msd.innerHTML = "Try again..!";	}
	}) ;
}



// function for changing colors on winning....
function changecolors(color) {
	for(var i = 0 ; i < squares.length ; i++){
		squares[i].style.backgroundColor = color ;
	}
}

// random color picker from the array ....
function pickcolor(){
	return colors[Math.floor(Math.random()*(colors.length))] ;
}

//colors array;;;
function generatecolors(num){

	var arr = [] ;
	for(var i = 0 ; i < num ; i++){
		arr.push(randomcolor()) ;
	}

	return arr ;
}

function randomcolor(){
	//pick a rgb color ...
	return "rgb("+Math.floor(Math.random()*256)+", "+Math.floor(Math.random()*256)+", "+Math.floor(Math.random()*256)+")" ;
}



var ctx = document.getElementById("canvas").getContext("2d") ;
var x = 60 ;
var y = 60 ;
var dy = 15 ;
var dx = 50 ;
var bombY ;
function bomb(){
	ctx.clearRect(1270 , 0 ,200 , 720 ) ;
	ctx.strokeStyle = "green" ;
	bombY = 50 + Math.random()*600 ;
	ctx.lineWidth = "15" ;
	ctx.beginPath() ;
	ctx.arc(1300, bombY , 15 , 0 , 2*Math.PI ) ;
	ctx.stroke() ;
}
bomb() ;

document.addEventListener('keydown' , function(event){
	if(event.keyCode === 40 && (y < 650 && y > 0)){
		if(y < 620)
		y+=dy ;
	}
	else if(event.keyCode === 38 && (y < 650 && y > 0)){
		if(y > 60)
		y-=dy ;
	}
	else if(event.keyCode === 32){
		laser(x+60,y) ;
		if(bombY > y-23 && bombY < y+23){
			bomb() ;
		}
	}
})
function ball(){
	ctx.strokeStyle = 'black' ;
	ctx.clearRect(0,0,125,720) ;
	ctx.beginPath() ;
	ctx.lineWidth = "8" ;
	ctx.arc(x,y,50,0,2*Math.PI) ;
	ctx.arc(x,y,20,0,2*Math.PI) ;
	ctx.moveTo(x+15,y-15) ;
	ctx.lineTo(x+50+13 , y-10) ;
	ctx.moveTo(x+15,y+15) ;
	ctx.lineTo(x+50+13 , y+10) ;
	ctx.stroke() ;
}
function laser (inix ,iniy){
	ctx.strokeStyle = "red" ;
	ctx.lineWidth = "6" ; 
	ctx.beginPath();
	ctx.moveTo(inix,iniy) ;
	ctx.lineTo(inix + 1160 , iniy)  ;
	ctx.stroke() ;
	setTimeout(function(){
		ctx.clearRect(inix,iniy-3,1160,6) ;
	},100) ;
	
}
setInterval(ball , 1) ;
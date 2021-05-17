// checking the completed tasks....
$("#itemList").on("click" , "li" , (function(){
	$(this).toggleClass("completed") ;
})) ;
// click on x to delete the todo...

$("ul").on("click" , "span" , (function(event){
	$(this).parent().fadeOut(500 , function(){
		$(this).remove() ;
	}) ;
	event.stopPropagation() ;
})) ;
$("input[type='text']").keypress(function(event){
	if(event.which === 13){
		console.log("enter") ;
		//text input ...
		var text = $(this).val() ;
		//create a new li....
		if(text.length > 0 ){
		$("#itemList").append("<li>"+"<span><i class='fa fa-trash'></i></span> "+text+"</li>") ;
		$(this).val("") ;
	}

	}
})

$(".fa-plus").click(function(){
	$("input[type='text']").fadeToggle() ;
})
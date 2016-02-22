
var BG
var script
var context
var elem
function loadWindow(file,id){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "json/"+file+"?t="+ (new Date().getTime()), false);
	xhttp.send();
	script = JSON.parse(xhttp.responseText);
	
	BG=script.meta.bg

	elem = document.getElementById(id),
    context = elem.getContext('2d');
	if(elem == undefined)
	{
		console.log("no canvas")
	return;
	}
	
	addMouseListener(elem)
	
	window.requestAnimationFrame(renderWindow);
}
function clear(){
	context.fillStyle="grey";
	context.fillRect(0, 0, elem.width, elem.height);
	context.fill();
}

var start = null
function renderWindow(timestamp){
	//if (!start && mouse.isOver && mouse.target==elem){ start = timestamp;}
	if(!start) {start = timestamp; window.requestAnimationFrame(renderWindow); return}
	var progress = Math.round(timestamp - start);
	clear();
	//draw BG
	context.drawImage(Assets.img[BG],		
		0,0,		
		elem.width,Assets.img[BG].height/Assets.img[BG].width*elem.width);
	//draw personalbar
	context.drawImage(Assets.img["arystotle"],(elem.width-Assets.img["arystotle"].width)/2,10);
	
	//drawGUIBack
	context.drawImage(Assets.img["GUIback"],0,elem.height-150);

	
	window.requestAnimationFrame(renderWindow);
}

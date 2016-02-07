


var menu;
var elem,elemLeft,elemTop,context;
var mouse;
var scenes, currentscene, currentevent;
var started=false,ready=false;

function loadCanvas(){
	
	elem = document.getElementById('mainCanvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop;
    context = elem.getContext('2d');
	mouse = {x:0,y:0,isHold:false};
	if(elem == undefined)
	{
		console.log("no canvas")
	return;
	}
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		var arr = JSON.parse(xmlhttp.responseText);
        loadWindow(arr);
    }
	};
	xmlhttp.open("GET", "json/window.json", true);
	xmlhttp.send();

	
	

	elem.addEventListener("mousemove",  function(e) {
		hover(e)
	},false);
	elem.addEventListener("mousedown",  function(e) {
		click(e,true)
	},false);
	
	elem.addEventListener("mouseup",  function(e) {
		click(e,false)
	},false);
	
	elem.addEventListener("mouseout",  function(e) {
		click(e,false)
	},false);
	
	elem.addEventListener("mouseover",  function(e) {
		onmouseover(e)
	},false);
}

function onmouseover(event)
{
	if(!ready || started)
		return;
	started=true;
	playScene()
}

function loadText(text){

	menu.nametag.text=mouse.isHold? text:text.substring(0,menu.nametag.text.length+1)
	menu.nametag.isScrolling=true;
	renderName();
	if(menu.nametag.text.length<text.length)
	{
		setTimeout(loadText,menu.nametag.scrollspeed,text)
	}
	else{
	mouse.isHold=false;
	menu.nametag.isScrolling=false;
	setTimeout(render,menu.nametag.scrollspeed);
	}
}

function loadWindow(arr){
	menu = arr.menu;
	canvasLoaded();
}

function loadScenes(d){
	scenes=d;
	console.log(scenes.meta.current)
	setScene(scenes.meta.current);
	scenesLoaded();
}
function setScene(id){
	scenes.meta.current=id
	currentscene=scenes.scenes[id]
	currentevent=0;
	for(var i=0;i<4;i++)
	{
		menu.options[i].isVisible=(currentscene.options[i]!=undefined)
		if(menu.options[i].isVisible)
		{
			menu.options[i].text = currentscene.options[i].text;
			menu.options[i].isViewed=false;
		}
	}
}

function playScene(){
	playEvent(currentscene.events[currentevent]);
}

function playEvent(event){
	if(menu.nametag.isScrolling ||!menu.acknowledged){
	setTimeout(playEvent,20,event)
	return;}
	
	if(event ==undefined)
		return
	var timeout = 0;
	switch(event.type)
	{
		case "hideoptions":
		menu.optionsV=false;
		render();
		break;
		
		case "showoptions":
		menu.optionsV=true;
		render();
		break;
		
		case "pause":
		timeout=event.time
		break;
		
		case "dialog":
		
			menu.acknowledged=event.acknowledged!=undefined;
			if(menu.acknowledged)
			menu.acknowledged=event.acknowledged;
		
			menu.nametag.name=event.name;
			menu.nametag.nametag.isVisible=event.name.length>0;
			menu.nametag.nametag.align=event.align;
			menu.nametag.scrollspeed=event.scrollspeed;
			menu.nametag.text="";
			render();
			sayText(event.text);
		break;
		
		default:
		console.log("unsuported event")
		console.log(event)
		break;

	}
	setTimeout(playEvent,timeout,currentscene.events[++currentevent])
}
function processOption()
{
	if(!menu.acknowledged)
		return
	mouse.isHold=false;
	setScene(currentscene.options[menu.selected].target);
	playScene();
}
function sayText(text){
	menu.nametag.text="";
	loadText(text)
}
function hover(event){
	if(menu==undefined)
		return;
	mouse.x=(event.pageX-elem.documentOffsetLeft);
	mouse.y=(event.pageY-elem.documentOffsetTop);
	render(context);
}

function click(event,hold){
		if(menu==undefined)
		return;
	mouse.x=(event.pageX-elem.documentOffsetLeft);
	mouse.y=(event.pageY-elem.documentOffsetTop);
	mouse.isHold=hold;
	
	if(hold && !menu.nametag.isScrolling && !menu.acknowledged)
	{
		menu.acknowledged=true;
		mouse.isHold=false
		hold=false;
	}
	
	render(context);
}


function render(){
	
	renderMain()
	if(menu.optionsV)
	renderOptions()

	renderName();
}
function renderMain(){
	//main
	menu.elements.forEach(function(element) {
	switch(element.type)
	{
		case "square":
			context.fillStyle = element.colour;
			context.fillRect(element.x, element.y, element.width, element.height);
			context.fill();
		break;
		/*case 'text':
			context.fillStyle = "#ffffff";
			context.fillRect(element.left, element.top-element.height, element.width, element.height);
			context.fill();
			context.fillStyle = element.colour;
			context.font = element.height+"px Arial";
			context.fillText(element.data, element.left, element.top);		
			context.fill();
		break;	*/
	}
	});	
}
function renderOptions(){
	for(var i=0,option=menu.options[i];i<menu.options.length;i+=1,option=menu.options[i]){
		if(option.isVisible)
		{
			if(menu.selected==i||(inBounds(option.x+10, option.y+menu.optiony+i*(2*menu.borderwidth+menu.gap+option.height), option.width, option.height))&&!(mouse.isHold))
			{				context.fillStyle = mouse.isHold ? menu.colourH : menu.colourA;
							if(!mouse.isHold)
							menu.selected=i
							else
								processOption()

			}else
			context.fillStyle = option.isViewed ? menu.colourIV :menu.colourI;
		
			context.strokeStyle = menu.colourB;
			context.lineWidth= menu.borderwidth;
			context.fillRect(option.x+10, option.y+menu.optiony+i*(2*menu.borderwidth+menu.gap+option.height), option.width, option.height);
			context.strokeRect(option.x+10, option.y+menu.optiony+i*(2*menu.borderwidth+menu.gap+option.height), option.width, option.height);
			context.fill();
			context.stroke();
			context.fillStyle = option.isViewed && menu.selected!=i ? menu.colourFV : menu.colourF;
			context.font = Math.round(option.height/3)+"px Arial";
			context.textBaseline = "top";
			context.wrapText(option.text, option.x+2*menu.borderwidth+10, option.y+menu.optiony+i*(2*menu.borderwidth+menu.gap+option.height)+menu.borderwidth,option.width-4*menu.borderwidth, Math.round(option.height/3)+4);
			context.fill();
		}
	}
}
function renderName(){
	context.fillStyle = menu.nametag.background.colour;
	context.fillRect(menu.nametag.background.x, menu.nametag.background.y, menu.nametag.background.width, (menu.optionsV ? menu.nametag.background.height : 285));
	context.fill();
	
	//context.fillStyle = option.isViewed && menu.selected!=i ? menu.colourFV : menu.colourF;
	context.textBaseline = "top";
	context.fillStyle = menu.colourF;
	context.wrapText(menu.nametag.text, menu.nametag.background.x+menu.borderwidth,menu.nametag.background.y+menu.borderwidth + (menu.nametag.nametag.isVisible ? menu.nametag.size+8 : 0 ), menu.nametag.background.width-2*menu.borderwidth, menu.nametag.size+4);
	context.fill();
	
	if(menu.nametag.nametag.isVisible)
	{
		context.fillStyle = menu.nametag.nametag.colour;
		context.fillRect((menu.nametag.nametag.align ? 10+ 3*menu.borderwidth: menu.nametag.background.width-context.measureText(menu.nametag.name).width-menu.borderwidth), menu.nametag.background.y+2*menu.borderwidth, context.measureText(menu.nametag.name).width+2*menu.borderwidth, menu.nametag.size+4);
		context.fill();	


		context.strokeStyle = menu.colourB;
		context.lineWidth= menu.borderwidth;
		context.strokeRect((menu.nametag.nametag.align ? 10+ 3*menu.borderwidth: menu.nametag.background.width-context.measureText(menu.nametag.name).width-menu.borderwidth), menu.nametag.background.y+2*menu.borderwidth, context.measureText(menu.nametag.name).width+2*menu.borderwidth, menu.nametag.size+4);
		context.stroke();				
		
		context.font = menu.nametag.size+"px Arial";
		context.textBaseline = "top";
		context.fillStyle = menu.colourF;
		context.wrapText(menu.nametag.name, (menu.nametag.nametag.align ? 10+ 4*menu.borderwidth: menu.nametag.background.width-context.measureText(menu.nametag.name).width),menu.nametag.background.y+3*menu.borderwidth, context.measureText(menu.nametag.name).width+2*menu.borderwidth, menu.nametag.size+4);
		context.fill();
	}
}
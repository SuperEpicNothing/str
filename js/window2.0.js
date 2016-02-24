
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
	currentscene=script.meta.current;
	elem = document.getElementById(id),
    context = elem.getContext('2d');
	if(elem == undefined)
	{
		console.log("no canvas")
	return;
	}
	
	addMouseListener(elem)
	renderWindow(0)
	window.requestAnimationFrame(renderWindow);
}
function clear(){
	context.fillStyle="grey";
	context.fillRect(0, 0, elem.width, elem.height);
	context.fill();
}

var currentscene;
var change = -1;
var currentEvt=0;
var EntTime=null;
var renderData = {type:"none",progress:0,time:0,override:false}
function processEvent(progress){
	if(!EntTime){EntTime=progress}
		
	if(change>=0)
	{

		currentscene= change>=0? change :currentscene;
		if(change>=0){change=-1}
		
		EntTime=null
		currentEvt= 0
		renderData = {type:"none",progress:0,time:0,override:false}
		return;
	}
	
	if(currentEvt>=script.scenes[currentscene].events.length)
	return;
	
	var evt =script.scenes[currentscene].events[currentEvt]

	if(progress-EntTime>evt.time && !renderData.override || !checkReq(currentEvt.req))
	{
	currentEvt++
	EntTime=null
	renderData = {type:"none",progress:0,time:0,override:false}
	return;
	}
	switch(evt.type)
	{			
		case "change":
			change=evt.target;
		break;	
		case "dialog":
			renderData.type="dialog"
			renderData.name=handleText(evt.name);
			renderData.progress=progress-EntTime;
			renderData.text=handleText(evt.text)
			renderData.time=evt.time-evt.timepadding
			renderData.timepadding=evt.timepadding
			renderData.color=evt.color
			renderData.override=progress-EntTime<evt.time+evt.timepadding
		break;
		case "give":
			renderData.type="give"
			renderData.item=evt.item
			renderData.progress=progress-EntTime;
			renderData.time=evt.time
			addItem(renderData.item);
		break;
		case "question":
			renderData.type="question"
			renderData.name=handleText(evt.name);
			renderData.progress=progress-EntTime;
			renderData.text=handleText(evt.text)
			renderData.time=evt.time
			renderData.color=evt.color
			renderData.override=true
		break;
	}
	
}

var startWin = null
function renderWindow(timestamp){
	if(!Assets.loaded){window.requestAnimationFrame(renderWindow);return}
	if (!startWin && mouse.isOver && mouse.target==elem){ startWin = timestamp;}
	//if(!startWin) {window.requestAnimationFrame(renderWindow); return}
	var progress = Math.round(timestamp - startWin);
	clear();
	if(startWin)
	processEvent(progress);
	//draw BG
	context.drawImage(Assets.img[BG],		
		0,0,		
		elem.width,Assets.img[BG].height/Assets.img[BG].width*elem.width);
	//draw personalbar
	context.drawImage(Assets.img["arystotle"],(elem.width-Assets.img["arystotle"].width)/2,10);
	
	if(renderData.type=="dialog"||renderData.type=="question"){
	drawDialog(renderData.name,renderData.text,renderData.time,renderData.progress)

	}
	
	
	
	if(renderData.type=="give"){
		if(renderData.progress<1000)
		context.drawImage(Assets.img["GUIclosedchest"],elem.width-68-20,renderData.progress/1000*68-68);
		else if(renderData.progress<3000){
		context.drawImage(Assets.img["GUIopenchest"],elem.width-68-20,0);

		var scale = Math.sin((renderData.progress-1000)/750)
		context.drawImage(Assets.img[Assets.items[renderData.item].icon],
		elem.width/2-34*scale + ((renderData.progress-1000)/2000*(elem.width/2-68)), 34-34*scale+(elem.height-150)-((renderData.progress-1000)/2000*elem.height-150),
		68*scale,68*scale);
		}
		else if(renderData.progress<4500)
		context.drawImage(Assets.img["GUIclosedchest"],elem.width-68-20,-((renderData.progress-3000)/1500*68));

	}
	
	
	//drawGUIBack
	context.drawImage(Assets.img["GUIback"],0,elem.height-150);

	//drawButtons
	context.font = "16px Aclonica"
	context.textBaseline = "top";
	context.textAlign="left"; 
		
	for(var i=0;i<4;i++)
	{
		if(script.scenes[currentscene].options[i]!= undefined){
		var req =  checkReq(script.scenes[currentscene].options[i].req);		
		var color = script.scenes[currentscene].options[i].color &&renderData.type=="question"? 
			req.enabled ? script.scenes[currentscene].options[i].color.active : script.scenes[currentscene].options[i].color.inactive 
			: req.enabled?"white":"gray";
		}	
		drawButtonBG(30,elem.height-140+35*i,640,30,req.enabled && renderData.progress>=renderData.time+i*150 && renderData.type=="question" &&i<script.scenes[currentscene].options.length,choice,i)
		
		if(renderData.progress>=renderData.time+i*150 && renderData.type=="question" && script.scenes[currentscene].options[i]!= undefined)
		{
			context.fillStyle=color
			context.fillText( req.prefix + (req.enabled? (handleText(script.scenes[currentscene].options[i].text)):"???"),35,elem.height-140+35*i+9)
		}		
	}
	context.fill();
	
	window.requestAnimationFrame(renderWindow);
}


function choice(id){
	change=script.scenes[currentscene].options[id].target
}
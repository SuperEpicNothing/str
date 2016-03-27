
var BG,Actor
var script
var context
var elem
function loadWindow(file,id){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "json/"+file+"?t="+ (new Date().getTime()), false);
	xhttp.send();
		elem = document.getElementById(id);

	if (xhttp.readyState == 4 && xhttp.status == 200)
	{
		try{
			script = JSON.parse(xhttp.responseText);
		}catch(e)
		{
			script = {
			meta:{bg:"blackboard",current:0,actor:"planet0"},
			scenes:[
			{
				events:[
				{	type:"question",
					name:"I AM JSON ERROR",time:1000,timepadding:0,
					text:"You Dun guffed.File is broken."
				}],
				options:[{target:0,text:"HTTP STATUS: "+xhttp.status+"HTTP readystate"+xhttp.readyState},
				{target:0,text:"Error: "+e,height:3}]
			}
			]
			}
		}
	}
	
	BG=script.meta.bg
	Actor=script.meta.actor;
	currentscene=script.meta.current;
    context = elem.getContext('2d');
	context.mozImageSmoothingEnabled = true;
	context.webkitImageSmoothingEnabled = true;
	context.msImageSmoothingEnabled = true;
	context.imageSmoothingEnabled = true;
	if(elem == undefined)
	{
		console.log("no canvas")
	return;
	}
		var music
		if(script.meta.music)
		music = script.meta.music[ Math.round((script.meta.music.length-1)*Math.random())] 
		if(!music)
			music="Harp.mp3";
		audio = new Audio('music/'+music);
		audio.loop = true;	
		
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
var changeEvt=-1;
var currentEvt=0;
var EntTime=null;
var renderData = {type:"none",progress:0,skipmode:0,time:0,override:false}
function processEvent(progress){
	//start
	if(!EntTime){EntTime=progress}
		


	//anti break
	if(currentEvt>=script.scenes[currentscene].events.length)
	return;
	
	var evt =script.scenes[currentscene].events[currentEvt]
	var isOver = progress-EntTime>evt.time&&!(change>=0)
	
	if(evt.type =="dialog")
	{
		isOver = progress-EntTime>(evt.time-evt.timepadding)/option.speed + evt.timepadding*option.wait && option.autoskip
	}
		
	//skip to next
	if((isOver && !renderData.override || (renderData.skipmode==2 && (evt.type =="dialog")) ) || !checkReq(evt.req).enabled)
	{
				if(renderData.skipmode==2){renderData.skipmode=0}

	change = currentscene;
	changeEvt = currentEvt+1;

	}
	//backskip
	if(renderData.skipmode==-1)
	{
		change=script.meta.current;
		audio.loop=false;
		audio.currentTime=audio.duration
		audio.pause();
		var music
		if(script.meta.music)
		music = script.meta.music[ Math.round((script.meta.music.length-1)*Math.random())] 
		
		if(!music)
			music="Harp.mp3";
		audio = new Audio('music/'+music);		audio.loop = true;	
		audio.play();
	}
	
	//general change
	if(change>=0)
	{

		currentscene= change>=0? change :currentscene;
		if(change>=0){change=-1}
		currentEvt= changeEvt>=0? changeEvt: 0;
		if(changeEvt>=0){changeEvt=-1}
		EntTime=null
		renderData = {type:"none",progress:0,skipmode:0,time:0,override:false}
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
			renderData.time=(evt.time-evt.timepadding)*option.speed
			renderData.timepadding=evt.timepadding*option.wait
			renderData.color=evt.color
			renderData.override=progress-EntTime<(evt.time-evt.timepadding)/option.speed+evt.timepadding*option.wait
			if(renderData.progress>=renderData.time)
				renderData.skipmode=1;
		break;
		case "give":
			renderData.type="give"
			renderData.item=evt.item
			renderData.book=evt.book
			renderData.xp=evt.xp

			renderData.progress=progress-EntTime;
			renderData.time=evt.time
			
			if(renderData.item)
			addItem(renderData.item);
		
			if(renderData.book)
			addBook(renderData.book);
		
			if(renderData.xp)
			playerxp(renderData.xp);

		break;
		case "question":
			renderData.type="question"
			renderData.name=handleText(evt.name);
			renderData.progress=progress-EntTime;
			renderData.text=handleText(evt.text)
			renderData.time=evt.time*option.speed
			renderData.color=evt.color
			renderData.override=true
			if(renderData.progress>=renderData.time)
				renderData.skipmode=1;
		break;
		
		case "changeActor":
			renderData.type="changeActor"
			renderData.progress=progress-EntTime;
			renderData.time=evt.time
			Actor=evt.actor
		break;
		
		case "unlockAch":
			renderData.type="unlockAch"
			renderData.progress=progress-EntTime;
			renderData.time=4200;
			renderData.ach= evt.ach;
			if(player.achievements.indexOf(evt.ach)>=0 && renderData.progress==0)
				EntTime-=(4200-(progress-EntTime))
		break;
	}
	
}
var audio
var startWin = null
function renderWindow(timestamp){
	if(!Assets.loaded ||!script){window.requestAnimationFrame(renderWindow);return}
	if (!startWin && mouse.isOver && mouse.target==elem){ startWin = timestamp;}
	
	audio.volume = option.volume / 100;
	if(mouse.target==elem && mouse.isOver)
		audio.play()
	else
		audio.pause();
	
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
	context.drawImage(Assets.img[Actor],(elem.width-Assets.img[Actor].width)/2,10);
	

	if(renderData.type=="dialog"||renderData.type=="question"){
	drawDialog(renderData.name,renderData.text,renderData.time,renderData.progress,renderData.skipmode)

	}
	

	
	if(renderData.type=="give"){
		if(renderData.progress<1000)
		context.drawImage(Assets.img["GUIclosedchest"],elem.width-68-20,renderData.progress/1000*68-68);
		else if(renderData.progress<3000){
		context.drawImage(Assets.img["GUIopenchest"],elem.width-68-20,0);

		var scale = Math.abs(Math.sin((renderData.progress-1000-300)/2000*Math.PI))
		if(Assets.items[renderData.item]){
		context.drawImage(Assets.img[Assets.items[renderData.item].icon],
		elem.width/2-34*scale + ((renderData.progress-1000)/2000*(elem.width/2-68)), 34-34*scale+(elem.height-150)-((renderData.progress-1000)/2000*elem.height-150),
		68*scale,68*scale);
		}else if(Assets.books[renderData.book]){
			var rng = new Math.seedrandom(Assets.books[renderData.book].name+Assets.books[renderData.book].fullname);
			var Ibook = new Image();
			Ibook.src="images/gui/icons/books/W_Book0"+Math.floor(1+rng()*7)+".png";
		context.drawImage(Ibook,
		elem.width/2-34*scale + ((renderData.progress-1000)/2000*(elem.width/2-68)), 34-34*scale+(elem.height-150)-((renderData.progress-1000)/2000*elem.height-150),
		68*scale,68*scale);}
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

	var x = 0;
	for(var i=0;i<script.scenes[currentscene].options.length;i++)
	{
		
		if(script.scenes[currentscene].options[i]!= undefined){
		var req =  checkReq(script.scenes[currentscene].options[i].req);	
		
		var color = script.scenes[currentscene].options[i].color &&renderData.type=="question"? 
			req.enabled ? script.scenes[currentscene].options[i].color.active : script.scenes[currentscene].options[i].color.inactive 
			: req.enabled?"white":"gray";
			
		var height = script.scenes[currentscene].options[i].height
		height=height?height:1;
		height=x+height>4?4-x:height;
		
		}	
		
		drawButtonBG(30,elem.height-140+35*x,640,30*height+5*(height-1),
		
		req.enabled && (renderData.progress>=renderData.time+x*150+600 || (renderData.skipmode>0 && renderData.progress-renderData.skipTime>200+x*150+600))
		&& renderData.type=="question" && script.scenes[currentscene].options[i]!= undefined
		,choice,i)
		
		if((renderData.progress>=renderData.time+x*150 || (renderData.skipmode>0 && renderData.progress-renderData.skipTime>200+x*150)) && renderData.type=="question" && script.scenes[currentscene].options[i]!= undefined)
		{
			context.fillStyle=color
			context.wrapText( req.prefix + (req.enabled? (handleText(script.scenes[currentscene].options[i].text)):"???"),35,elem.height-140+35*x+9,630,16)
		}	
		x+=height;		
	}
	for(;x<4;x++)
	{				
		drawButtonBG(30,elem.height-140+35*x,640,30,false)

	}
	context.fill();
	
	if(renderData.type=="unlockAch")
	unlockAchievment(renderData.ach);
	
	window.requestAnimationFrame(renderWindow);
	
}


function choice(id){
	change=script.scenes[currentscene].options[id].target
}
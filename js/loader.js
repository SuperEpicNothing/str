window.onload=loader;
window.Object.defineProperty( Element.prototype, 'documentOffsetTop', {
    get: function () { 
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop : 0 ) ;
    }
} );
window.Object.defineProperty( Element.prototype, 'documentOffsetLeft', {
    get: function () { 
        return this.offsetLeft + ( this.offsetParent ? this.offsetParent.documentOffsetLeft : 0 );
    }
} );
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {

        var words = lines[i].split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        this.fillText(line, x, y);
        y += lineHeight;
    }
}

function makeID(length){
    var text = "";
    var possible = "?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//Cookie Helper
{
function setCookie(name, value) {
	var d = new Date();
	d.setTime(d.getTime() + (31*24*60*60*1000));
	var cookie = [name, '=', JSON.stringify(value),';expires='+d.toUTCString(), '; domain=', window.location.host.toString(), '; path=/'].join('');
	document.cookie = cookie;
}
function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? JSON.parse(match[1]) : null;
}
/*function getCookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}*/
function deleteCookie(name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}
}
//var scrollValue = {top:0,left:0};

var mouse ={}
var Assets ={loaded:false,img:[],books:[],items:[],achievments:[]};
var option={volume:80,speed:0,wait:1,teach:false}
var player;
function loader(){

	if(Assets.loaded){
	loadPlayer();
	loadItemMenu();
	updateChapters();
	
	  // Create canvas to convert the image to base64
    var favicon = document.getElementById("favicon" )
        favicon.width = 32;
        favicon.height = 32;
    
    var fctx = favicon.getContext('2d');
	    
    // draw the image on the canvas (the user can't see it).
    fctx.drawImage(Assets.img["players"],	
	24*(player.appearance+(player.gender?0:3)), 0,
	24,32,
	4,0,24,32);
    fctx.restore();
      
    // set the link's attribute to replace the icon
    document.querySelector('#icon').setAttribute('href', favicon.toDataURL());
	
	window.requestAnimationFrame(animateNotifcations);
	return
	}
	 
	
	console.log(document.cookie);
	loadAssets();
}
function loadPlayer(){

	
	//LOAD 
	if(document.cookie.indexOf("player") >= 0){
		player=getCookie("player");
		console.log("readCookie")
	}
	else{
			//create DEFAULT
	player = {
		name: "IAmError",
		gender:false,
		age:666,
		appearance:1,
		classType:"Vampire",
		//Temp: S P E C I A L 1-10
		statFullNames:["Przeznaczenie","Inteligencja","Siła Woli","Zręczność","Mądrość","Ogłada"],
		statColors:["#8bca17","#9dffff","#7373ff","#a3d900","#6c00d9","#ffd24c"],
		statNames:"PISZMO",
		stats:[1,2,3,6,8,4],
		progress:{
			lvl:0,
			xp:0.5,
			skillp:3,
			chapters: [0,1]
			},
		books:[],
		items:[],
		seen:[],
		notificationsBooks:0,
		notificationsItems:0,
		achievements:[0,1,2]
		};
		
		//library trip
		for(var book in Assets.books)
		{
			player.books.push(book);
			player.notificationsBooks++
		}
		/*//raid nearby village
		for(var item in Assets.items)
		{
			player.items.push(item);
		}
		*/
		console.log("setCookie")
		setCookie("player",player);
	}
	savePlayer();
	
}
function animateNotifcations(time){
	document.getElementById("guiSkillPNew" ).style.backgroundColor='rgba(147,180,38,'+(0.6+0.4*Math.sin(time/(250)))+')';
	document.getElementById("guiSkillPNew" ).style.color='rgba(255,255,255,'+(0.6+0.4*Math.sin(time/250))+')';
	document.getElementById("guiSkillPNew" ).innerHTML=player.progress.skillp;
	document.getElementById("guiSkillPNew" ).style.visibility = player.progress.skillp<=0?"hidden":"visible";

	document.getElementById("guiPlayerLevel" ).innerHTML=player.progress.lvl;
	
	player.appearance=Math.abs(Math.round(time/10000*3))%3;
	player.gender=Math.abs(Math.round(time/30000*2))%2;

	var img = document.getElementById("guiPlayerVisage" )

	img.style.clip="rect(0px, "+24*(player.appearance+(player.gender?0:3)+1)+"px, 32px, "+24*(player.appearance+(player.gender?0:3))+"px)";
	img.style.left=(-24*(player.appearance+(player.gender?0:3))+15)+"px";

 

	var newItems=document.getElementById('guiItemsNew');
	newItems.style.backgroundColor='rgba(197,180,38,'+(0.6+0.4*Math.sin(time/250))+')';
	newItems.style.color='rgba(255,255,255,'+(0.6+0.4*Math.sin(time/250))+')';
	newItems.innerHTML=(player.notificationsBooks+player.notificationsItems)
	newItems.style.visibility = (player.notificationsBooks+player.notificationsItems)<=0?"hidden":"visible";
	window.requestAnimationFrame(animateNotifcations);
}
function skillpoints(n){
	player.progress.skillp+=n;
	savePlayer()
}
function playerxp(n){
	player.progress.xp+=xp;
	if(player.progress.xp>=1){
		player.lvl++;
		player.progress.xp--;
		player.progress.skillp++;
		playerxp(0);
	}
	savePlayer();
}

function removeNotification(type,name){

		player.seen.push(type+name);
		
		if(type.toLowerCase()=="book")
		player.notificationsBooks--
		else
		player.notificationsItems--
	
		savePlayer();
}
function addBook(name){

	if(player.books.indexOf(name)<0){
		player.books.push(name);
		player.notificationsBooks++
		savePlayer();
	}
}
function addItem(name){
	if(player.items.indexOf(name)<0){
		player.items.push(name);
		player.notificationsItems++
		savePlayer();
	}
}
function unlockChapter(id){
	console.log(id)
	if(player.progress.chapters.indexOf(id)<0){
			console.log(id)
		player.progress.chapters.push(id);
		updateChapters()
		savePlayer();
	}
}
function savePlayer(){
	player.books.sort(function(a, b){return Assets.books[a].fullname.localeCompare(Assets.books[b].fullname)});
	player.items.sort(function(a, b)
	{
		if(Assets.items[a].type.localeCompare(Assets.items[b].type)==0)
			{ return Assets.items[a].fullname.localeCompare(Assets.items[b].fullname)}
		else 
			{return Assets.items[a].type.localeCompare(Assets.items[b].type)}
	});
	setCookie("player",player);
	repolulateItemMenu()
}
function updateChapters(){
	for(var i =0;i<4;i++){
		if(player.progress.chapters.indexOf(i)<0 && !option.teach){
		document.getElementById("pageButton"+i).className = "disabledLink";
		//~ document.getElementById("pageButton"+i).style.color = "#353526";	//przeniesione do CSS
		console.log(document.getElementById("pageButton"+i))
		}
		else{
		document.getElementById("pageButton"+i).className = "hvr-underline-from-center enabledLink";
		//~ document.getElementById("pageButton"+i).style.color = "#e7f8f8";	//przeniesione do CSS
		}
	}
}
function loadAssets(){
	var xmlhttp0 = new XMLHttpRequest();
	xmlhttp0.onreadystatechange = function() {
    if (xmlhttp0.readyState == 4 && xmlhttp0.status == 200) {
		var arr = JSON.parse(xmlhttp0.responseText);
		var imageArray = arr.img;
		Assets.img = [];
		for(var i=0;i<imageArray.length;i++)
		{
			var img = new Image(imageArray[i].x,imageArray[i].y);
			img.src=imageArray[i].src;
			Assets.img[imageArray[i].name]= img;
		}
		
		var books = arr.scrolls;
		for(var i=0;i<books.length;i++){
			Assets.books[books[i].name]=books[i];
		}
		
		var items = arr.items;
		for(var i=0;i<items.length;i++){
			Assets.items[items[i].name]=items[i];
		}
		var achievments = arr.achievments;
		for(var i=0;i<achievments.length;i++){
			Assets.achievments[i]=achievments[i];
		}

		Assets.loaded=true
		loader()
    }
	};
	xmlhttp0.open("GET", "json/assets.json?t="+ (new Date().getTime()), true);
	xmlhttp0.send();
}
function unlockAchievment(ach)
{
	var time = renderData.progress%4000

	if(time>1000 && time<=2000)
		time=1000;
	else if(time>2000)
		time=time-1000;

	var offset= Math.sin(time/2000*Math.PI)*40-38;
	//AchievmentNotify
	context.drawImage(Assets.img["GUIachievmentNotify"],0,offset);
	
	context.font = "14px Aclonica"
	context.textBaseline = "top";
	context.textAlign="left"; 
	context.fillStyle="white";
	context.fillText("Osiągnięcie Odblokowane!",elem.width-256+38,5+offset);
	
	context.font = "10px Aclonica"
	context.textBaseline = "top";
	context.textAlign="left"; 
	context.fillStyle="#d9d9d9";
	context.fillText(Assets.achievments[ach].fullname,elem.width-256+38,22+offset);
	context.drawImage(Assets.img["GUIachievments"],32*Assets.achievments[ach].level,0,32,32,elem.width-256+1,3+offset,32,32);
	if(Assets.achievments[ach].icon)
	context.drawImage(Assets.img[Assets.achievments[ach].icon],elem.width-256+8,10+offset,18,18);
	if(player.achievements.indexOf(ach)<0)
		player.achievements.push(ach);
	savePlayer();
}
// logic helper
{
function addMouseListener(elem,f){
	elem.addEventListener("mousemove",  function(e) {
		mouseChange(e,"mousemove")
		if(f)
		f();
	},false);
	elem.addEventListener("mousedown",  function(e) {
		mouseChange(e,"mousedown")
		if(f)
	f();
	},false);
	
	elem.addEventListener("mouseup",  function(e) {
		mouseChange(e,"mouseup")
		if(f)
		f();
	},false);
	
	elem.addEventListener("mouseout",  function(e) {
		mouseChange(e,"mouseout")
		if(f)
		f();
	},false);
	
	elem.addEventListener("mouseover",  function(e) {
		mouseChange(e,"mouseover")
		if(f)
		f();
	},false);
	console.log(f)
	
}
function mouseChange(event,evtname){
	mouse.target=(event.target);
	if(evtname=="mouseup" || evtname=="mousedown")
	{
	mouse.targetup=mouse.target;
	mouse.up= evtname=="mouseup"
	}
	if(mouse.targetup!=mouse.target)
		mouse.up=false;
	mouse.isOver= evtname=="mouseover"? true: evtname=="mouseout"? false :mouse.isOver;
	mouse.x=event.offsetX//(event.pageX - event.target.documentOffsetLeft - scrollValue.left);
	mouse.y=event.offsetY//(event.pageY - event.target.documentOffsetTop - scrollValue.top);
	mouse.buttons=(event.buttons);
	//mouse.detail=(event.detail);
	mouse.event=evtname;
	console.log(mouse.event)

}
function checkReq(req){
	var result = {prefix:"",enabled:true};
	
	if(req != undefined)
		switch(req.type)
		{
			case "skill":		
						switch(req.mode)
						{
							default:
							case ">":
							result.enabled = player.stats[req.skill]>=req.amt;
							result.prefix = "[ "+(player.statNames.charAt(req.skill))+": "+player.stats[req.skill]+"/"+req.amt+" ] ";
							break;
							
							case "<":
							result.enabled = player.stats[req.skill]<=req.amt;
							break;
						}
			break;
			
			case "hp":
					result.enabled = boss.heroHp>=req.amt;
					result.prefix = "[ HP : "+ boss.heroHp+"/"+req.amt+" ] ";
			break;
				
			case "item":
					result.enabled = player.items.indexOf(req.item)>-1;
					result.prefix = "[ "+Assets.items[req.item].fullname+" ] ";
			break;
		}
	return result;
}
function handleText(text,index){
	
	var start = text.indexOf('[',index)
	
	var end = text.indexOf(']',start)
	if(start<0 || end<0)
		return text;
	var value ="";
	var stuff = text.substring(start+1,end).split(" ")
	switch(stuff[0])
	{
		case "playerName":
		{
			value=player.name;
		}break;
		case "playerGender":
		{
			if(stuff.length <=1)
			value=player.gender?"♂":"♀";
			else
			{
				var ts =  text.indexOf('{',start+1+"playerGender ".length);
				var te =  text.indexOf('}',ts);
				var t = text.substring(ts+1,te);
				value = t.split("|")[player.gender?0:1];
			}
		}break;
		case "playerAge":
		{
			value=player.age;
		}break;
		case "playerLvl":
		{
			value=player.progress.lvl;
		}break;
		case "playerSkill":
		{
			value=player.stats[parseInt(stuff[1])];
			if(!value){value="playerSkill"}
		}break;
		case "'":
		{
			value='"';
		}break;

		default:
		value="["+text.substring(start+1,end)+"]";
		break;
	}
	
	return  handleText(text.substring(0,start)+value+text.substring(end+1,text.length),start+value.length);
}

function inBounds(x,y,w,h){
	if(mouse.x>x&& mouse.x<x+w && mouse.y>y && mouse.y<y+h)
	return true;

	else 
	return false;
}
}
// graphic helper
{

function drawDialog(speaker,text,time,progress,mode){
	context.fillStyle= renderData.color == undefined ?"white":renderData.color;
	context.font = "16px Aclonica"
	context.textBaseline = "top";
	context.textAlign="left"; 
	
    var metrics = context.measureText(text);
	var charspeed = (time/text.length);
	var linecount = Math.round(metrics.width/(elem.width-20))+1;
	linecount= linecount<=2? 3 : linecount;
	if(mode>=1){
		charspeed=0;
		progress=text.length;
	}
	context.drawImage(Assets.img["textbar"],0,70, 700,10, 0,elem.height-184, 700,10);

	for(var i=0;i<linecount;i++)
	context.drawImage(Assets.img["textbar"],0,54, 700,16, 0,elem.height-200-16*i, 700,16);
	
	
	context.drawImage(Assets.img["textbar"],0,25, 700,5, 0,elem.height-184-16*linecount-5, 700,5);
	context.drawImage(Assets.img["textbar"],0,4, 10,20, 0,elem.height-184-16*linecount-28, 10,20);
	
	metrics = context.measureText(speaker);
	for(var i=0;i<metrics.width/4;i++)
	context.drawImage(Assets.img["textbar"],10,4, 1,20, 10+i*4,elem.height-184-16*linecount-28, 4,20);
	
	context.drawImage(Assets.img["textbar"],113,4, 4,20, 10+i*4,elem.height-184-16*linecount-28, 4,20);

	context.wrapText(text.substring(0,progress/charspeed)+(text.length>progress/charspeed?"|":" "),10,elem.height-184-16*linecount,elem.width-20,16)
	context.fillStyle= "white";
	context.wrapText(speaker,10,elem.height-184-16*linecount-24,elem.width-20,16)

	context.fill();
	drawButtonskip(elem.width-85, elem.height-175,mode,!(renderData.type=="question"&&mode==1));
	drawButtonback(5, elem.height-175);

}
function drawButtonback(x, y){
	var type =0


	if(inBounds(x,y,80,20)){
		type=40;
		if(mouse.up && mouse.target==elem)
		skip(-1)
	
		if(mouse.buttons>0)
		type=20;
		
	}
	
	context.drawImage( Assets.img["GUIbuttonskip"],
		160,type,
		80,20,
		x,y,
		80,20);
}
function drawButtonskip(x, y,mode,enabled){

	var type =0
	if(!enabled)
	{type=20;}

	else if(inBounds(90,y,elem.width-90,25)||inBounds(0,0,elem.width, elem.height-180)){
		type=40;
		if(mouse.up && mouse.target==elem && enabled)
		skip(mode)
		if(mouse.buttons>0)
		type=20;
	}
	if(mode==2)
		mode=1
	context.drawImage( Assets.img["GUIbuttonskip"],
		80*mode,type,
		80,20,
		x,y,
		80,20);
	
}
function skip(mode)
{
	if(mode == -1)
		renderData.skipmode=-1;
	if(mode == 0){
		renderData.skipmode=1;
		renderData.skipTime=renderData.progress;
	}
	if(mode == 1){
		renderData.skipmode=2;
		console.log(renderData)
	}
	mouse.up=false;
}

function drawButtonBG(x, y, width,height,enabled,f,id){

	var type =0
	if(!enabled)
	{type=52;}
	else if(inBounds(x,y,width,height)){
		type=104;
		if(mouse.up && mouse.target==elem&&enabled){
		f(id)
		mouse.up=false;
		}
		
		if(mouse.buttons>0)
		type=52;
	}
	
	context.drawImage(Assets.img["GUIbutton"],0,type    ,10,5   ,x,y				 ,10,5);
	context.drawImage(Assets.img["GUIbutton"],0,type+5  ,10,42  ,x,y+5  ,10,height-10);
	context.drawImage(Assets.img["GUIbutton"],0,type+47 ,10,5   ,x,y+height-5 ,10,5);

	
	for(var i =0;i<(width-20)/80-1;i++){
		
	//context.drawImage(Assets.img["GUIbutton"],10,type,80,52,x+10+i*80,y,80,height);
	
	context.drawImage(Assets.img["GUIbutton"],10,type    ,80,5   ,x+10+i*80,y				 ,80,5);
	context.drawImage(Assets.img["GUIbutton"],10,type+5  ,80,42  ,x+10+i*80,y+5  ,80,height-10);
	context.drawImage(Assets.img["GUIbutton"],10,type+47 ,80,5   ,x+10+i*80,y+height-5 ,80,5);
	
	}
	
	context.drawImage(Assets.img["GUIbutton"],10,type    ,(width-20)%80,5   ,x+10+(Math.round(((width-20)/80)-1)*80),y					 ,(width-20)%80	,5);
	context.drawImage(Assets.img["GUIbutton"],10,type+5  ,(width-20)%80,42  ,x+10+(Math.round(((width-20)/80)-1)*80),y+5  	,(width-20)%80	,height-10);
	context.drawImage(Assets.img["GUIbutton"],10,type+47 ,(width-20)%80,5   ,x+10+(Math.round(((width-20)/80)-1)*80),y+height-5 	,(width-20)%80	,5);
	
	//context.drawImage(Assets.img["GUIbutton"],10,type,(width-20)%80,52,x+10+(Math.round(((width-20)/80)-1)*80),y,(width-20)%80,height);
	
	context.drawImage(Assets.img["GUIbutton"],90,type    ,10,5   ,x+width-10,y				 	,10,5);
	context.drawImage(Assets.img["GUIbutton"],90,type+5  ,10,42  ,x+width-10,y+5  	,10,height-10);
	context.drawImage(Assets.img["GUIbutton"],90,type+47 ,10,5   ,x+width-10,y+height-5 	,10,5);
}

}


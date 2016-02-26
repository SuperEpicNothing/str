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
    var possible = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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
var scrollValue = {top:0,left:0};

var mouse ={}
var Assets ={loaded:false,img:[],books:[],items:[],achievments:[]};
var player;
function loader(){

	if(Assets.loaded){
	loadPlayer();
	loadItemMenu();
	return
	}
	window.requestAnimationFrame(animateNotifcations);
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
		gender:true,
		age:666,
		appearance:1,
		classType:"Vampire",
		//Temp: S P E C I A L 1-10
		statFullNames:["Strength","Perception","Endurance","Charisma","Intelligence","Agility","Luck"],
		statColors:["red","green","blue","cyan","orange","violet","purple"],
		statNames:"SPECIAL",
		stats:[1,2,3,6,8,9,10],
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
	
	document.getElementById("guiPlayerVisage" ).style.clip="rect(0px, "+24*(player.appearance+1)+"px, 32px, "+24*player.appearance+"px)";
	document.getElementById("guiPlayerVisage" ).style.left=(-24*player.appearance+15)+"px";

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
	xmlhttp0.open("GET", "json/assets.json?t="+ (new Date().getTime()), false);
	xmlhttp0.send();
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
	mouse.isOver= evtname=="mouseover"? true: evtname=="mouseout"? false :mouse.isOver;
	mouse.x=event.offsetX//(event.pageX - event.target.documentOffsetLeft - scrollValue.left);
	mouse.y=event.offsetY//(event.pageY - event.target.documentOffsetTop - scrollValue.top);
	mouse.buttons=(event.buttons);
	//mouse.detail=(event.detail);
	mouse.event=evtname;
	
}
function checkReq(req){
	var result = {prefix:"",enabled:true};
			
	if(req != undefined)
		switch(req.type)
		{
			case "skill":
					result.enabled = player.stats[req.skill]>=req.amt;
					result.prefix = "[ "+(player.statNames.charAt(req.skill))+": "+player.stats[req.skill]+"/"+req.amt+" ] ";
			break;
			
			case "hp":
					result.enabled = boss.heroHp>=req.amt;
					result.prefix = "[ HP : "+ boss.heroHp+"/"+req.amt+" ] ";
			break;
				
			case "item":
					result.enabled = player.items.indexOf(req.item>-1);
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
			value=player.gender?"♂":"♀";
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

function drawDialog(speaker,text,time,progress){

	var charspeed = (time/text.length);
	context.drawImage(Assets.img["textbar"],0,elem.height-255);

	context.fillStyle= renderData.color == undefined ?"white":renderData.color;
	context.font = "16px Aclonica"
	context.textBaseline = "top";
	context.textAlign="left"; 
	context.wrapText(text.substring(0,progress/charspeed)+(text.length>progress/charspeed?"|":" "),10,elem.height-225,elem.width-20,16)
	context.fillStyle= "white";
	context.wrapText(speaker,10,elem.height-247,elem.width-20,16)

	context.fill();
	
	drawButtonskip(elem.width-85, elem.height-179,(progress-EntTime<renderData.time-200)?0:1,renderData.type!="question")
}
function skip(mode)
{
	if(mode==0)
		EntTime-=renderData.time
	
	if(mode==1){
		EntTime-=renderData.timepadding
		renderData.override=false
	}
	
	mouse.event=""
}
function drawButtonskip(x, y,mode,enabled){

	
	var type =0
	if(!enabled)
	{type=20;}
	else if(inBounds(x,y,80,20)){
		type=40;
		if(mouse.event =="mouseup" && mouse.target==elem)
		skip(mode)
	
		if(mouse.buttons>0)
		type=20;
		
	}
	
	context.drawImage( Assets.img["GUIbuttonskip"],
		80*mode,type,
		80,20,
		x,y,
		80,20);
	
}

function drawButtonBG(x, y, width,height,enabled,f,id){

	var type =0
	if(!enabled || renderData.progress<renderData.time+id*150)
	{type=52;}
	else if(inBounds(x,y,width,height)){
		type=104;
		if(mouse.event =="mouseup" && mouse.target==elem){
		f(id)
		mouse.event="";
		}
		
		if(mouse.buttons>0)
		type=52;
	}
	
	context.drawImage(Assets.img["GUIbutton"],0,type,10,52,x,y,10,height);
	
	for(var i =0;i<(width-20)/80-1;i++)
	context.drawImage(Assets.img["GUIbutton"],10,type,80,52,x+10+i*80,y,80,height);
	
	context.drawImage(Assets.img["GUIbutton"],10,type,(width-20)%80,52,x+10+(Math.round(((width-20)/80)-1)*80),y,(width-20)%80,height);

	context.drawImage(Assets.img["GUIbutton"],90,type,10,52,x+width-10,y,10,height);
}

}


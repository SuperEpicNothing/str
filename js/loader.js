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
if(Assets == undefined)
var Assets ={loaded:false,img:[],books:[],items:[],achievments:[]};
var option={volume:80,speed:0,wait:1,teach:false}
var player;
var skills = {
	fullNames:["Wiedza","Inteligencja","Empatia","Dowcip","Zręczność","Asertywność"],
	colors:["#8bca17","#9dffff","#7373ff","#a3d900","#6c00d9","#ffd24c"],
	names:"WIEDZA"
	}
	
var menu = [false,false];
function openGUI(id)
{
	console.log(id)
	console.log(menu)
	
	//$('#guiPlayer').collapse()
	//$('#guiItems').collapse();


	
	$('#guiPlayer').collapse("hide");
	$('#guiItems').collapse("hide");
	
	menu = [false,false]

	menu[id]=true;
	switch(id){
		case 0:	$('#guiPlayer').collapse("show"); break;
		case 1:	$('#guiItems').collapse("show"); break;
	}
	
}
function loader(){
	

	
	if(Assets.loaded){
	loadPlayer();
	if(player==undefined){
		Assets.loaded=false;
		return;
	}
	loadItemMenu();
	updateChapters();
	updateHTMLText();
	var pl = btoa(encodeURIComponent(JSON.stringify(player)).replace(/%([0-9A-F]{2})/g, function(match, p1) {
	return String.fromCharCode('0x' + p1);}))
	console.log(player)
	console.log(pl)
	console.log(atob(pl))

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
		console.log("playerLoad")
		player=getCookie("player");
		savePlayer();

	}else{
			//create DEFAULT
	/*player = {
		name: "IAmError",
		gender:false,
		age:666,
		appearance:1,
		stats:[2,2,2,2,2,2],
		noftifications:[],
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
		achievements:[]
		};
		
		//library trip
		for(var book in Assets.books)
		{
			player.books.push(book);
			player.notificationsBooks++
		}
		//raid nearby village
		for(var item in Assets.items)
		{
			player.items.push(item);
			player.notificationsItems++
		}
		*/
		console.log(document.cookie.indexOf("player"));
			var url = (document.location+"");
	if(!url.contains("noplayer=0")){
		var begin=url.split("?")[0];
		if(document.cookie.indexOf("player") < 0)
			begin+="?noplayer=0";
		document.location=begin;
	}
	}
}
function createPlayer()
{
	var data = document.getElementById("playercreation").elements;
	console.log(data.namedItem("name").value);
	console.log(data.namedItem("gender").checked);
	console.log(data.namedItem("apperance").value);
	console.log(data.namedItem("teachmode").checked);
	
	player = {
		name: data.namedItem("name").value,
		gender:  data.namedItem("gender").checked,
		age:666,
		appearance: parseInt(data.namedItem("apperance").value),
		stats:[2,2,2,2,2,2],
		noftifications:[],
		progress:{
			lvl:0,
			xp:0.5,
			skillp:3,
			chapters: [0,1]
			},
		books:[],
		items:[],
		seen:[],
		notificationsBooks:1,
		notificationsItems:0,
		achievements:[]
		};
	option.teach=data.namedItem("teachmode").checked;
	setCookie("options",option);
	setCookie("player",player);
	
	var url = (document.location+"");
	var begin=url.split("?")[0];
	document.location=begin+"?p=0&pp=0";
	
}
function animateNotifcations(time){
	document.getElementById("guiSkillPNew" ).style.backgroundColor='rgba(147,180,38,'+(0.6+0.4*Math.sin(time/(250)))+')';
	document.getElementById("guiSkillPNew" ).style.color='rgba(255,255,255,'+(0.6+0.4*Math.sin(time/250))+')';
	document.getElementById("guiSkillPNew" ).innerHTML=player.progress.skillp;
	document.getElementById("guiSkillPNew" ).style.visibility = player.progress.skillp<=0?"hidden":"visible";

	document.getElementById("guiPlayerLevel" ).innerHTML=player.progress.lvl;
	
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
		return;
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
		notif.addNotif("book",name);
		savePlayer();
	}
}
function addItem(name){
	if(player.items.indexOf(name)<0){
		player.items.push(name);
		player.notificationsItems++;
		notif.addNotif("item",name);
		savePlayer();
	}
}
function unlockChapter(id){
	console.log(id)
	if(player.progress.chapters.indexOf(id)<0){
			console.log(id)
		player.progress.chapters.push(id);
		notif.addNotif("chapter",id);
		updateChapters()
		savePlayer();
	}
}
function savePlayer(){
	console.log(savePlayer.caller)
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
		document.getElementById("pageButton"+i).className = ""+document.getElementById("disabledhyperlink").className;
		}
		else{
		document.getElementById("pageButton"+i).className = ""+document.getElementById("enabledhyperlink").className;
		}
	}
}
function updateHTMLText(){
	var textNodes = document.getElementsByClassName("texthandler")
	for(var i=0;i<textNodes.length;i++)
	{
		textNodes[i].innerHTML=handleText(textNodes[i].innerHTML);
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
	if(player.achievements.indexOf(ach)<0){
		player.achievements.push(ach);
		notif.addNotif("achievment",ach);	
		savePlayer();
	}
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
	
}
function mouseChange(event,evtname){
	mouse.target=(event.target);
	var comstyle = window.getComputedStyle(event.target, null);
	if(evtname=="mouseup" || evtname=="mousedown")
	{
	mouse.targetup=mouse.target;
	mouse.up= evtname=="mouseup"
	}
	if(mouse.targetup!=mouse.target)
		mouse.up=false;
	mouse.isOver= evtname=="mouseover"? true: evtname=="mouseout"? false :mouse.isOver;
	mouse.x=event.target.width*event.offsetX/parseFloat(comstyle.width);//(event.pageX - event.target.documentOffsetLeft - scrollValue.left);
	mouse.y=event.target.height*event.offsetY/parseFloat(comstyle.height);//(event.pageY - event.target.documentOffsetTop - scrollValue.top);
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
						switch(req.mode)
						{
							default:
							case ">":
							result.enabled = player.stats[req.skill]>=req.amt;
							result.prefix = "[ Test "+(skills.fullNames[req.skill])+": "+player.stats[req.skill]+"/"+req.amt+" ] ";
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
	
	var end = text.indexOf(']',index)
	var start = text.lastIndexOf('[',end)
	
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
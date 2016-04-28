
var itemManuTab=0
var item_menu;
var GUIimg
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function loadItemMenu(){
	changeTab(0)
	setItemPreview("book","intro")
	GUIimg=document.getElementById("GUIItemsImage").getContext('2d');
	window.requestAnimationFrame(renderItem);
}	


function changeTab(t)
{
	itemManuTab=t
	var scrolldata=document.getElementById('GUIItemsScrolls');
	var itemdata=document.getElementById('GUIItemsItems');
	
	scrolldata.style.display = (t!=0)?"none":"block";
	itemdata.style.display = (t==0)?"none":"block";

}
	//var x= { cla:"i", items:[{type:"Scroll",text:"Lorem"},{type:"Scroll",text:"ipsum"},{type:"Scroll",text:"et dolores"}]};

	//if(document.cookie.indexOf("item") >= 0)
	//	x=getCookie("item")
	//else
	//setCookie("item",x)
	
	//for(var s=0;s<x.items.length;s++)
	//elem.innerHTML+=x.items[s]+"<br>"

	//x.items.push({type:makeid(2),text:makeid(15)})
	//player.books=x.items;
	//setCookie("item", x)
	//renderItemMenu()
function setItemPreview(type,name)
{
	var seen = player.seen.indexOf(type+name)>=0;
	if(!seen){removeNotification(type,name)};

	if(Assets.books[name]==undefined && Assets.items[name]==undefined)
		return;
	
	var itempreview=document.getElementById('GUIItemsData');
	var itemdesc=document.getElementById('GUIItemsDescription');
	
	//while(	itempreview.firstChild != undefined)
	//		itempreview.removeChild(itempreview.firstChild);
		
	var item =  undefined;
	if(type.toLowerCase()=="book"&&Assets.books[name]!=undefined)
	{
		item = Assets.books[name];
	}
	else
	{
		item = Assets.items[name];
	}
		 
		itempreview.innerHTML = "<ul>";
		itempreview.innerHTML += "<li>Nazwa:<br>-"+item.fullname+"</li>";
		itempreview.innerHTML += "<li>Autor:<br>-"+item.autor+"</li>";
		itempreview.innerHTML += "</ul>";

		
		
		
		itemdesc.innerHTML = "<p>"+item.desc+"<\p>";
		if(type.toLowerCase()=="book"){
		var button = document.getElementById("GUIItemsButton")
		button.style.visibility = (item.url==null)?"hidden":"visible";
		
		var opener = function(item) {
		return function(){ window.open(item.url)};
		}
		
		button.onclick=opener(item);
		}
		
		//image
		currentitem.type=type.toLowerCase()
		currentitem.name=name
		return;
	
	console.log(type)
	console.log(name)
}
var currentitem = {particles:[]};
function renderItem(timestamp){
	if(!currentitem.name||!currentitem.type){
		window.requestAnimationFrame(renderItem);
		return;
	}
	var img = null;
	if(currentitem.type=="item"){
		img=Assets.img[Assets.items[currentitem.name].icon]
		if(Math.random()<0.01&&currentitem.particles.length<2)
		for(var i=0;i<5*Math.random();i++){
			var arc=2*Math.PI*Math.random();
			var rad=20*Math.random();

			var particle = {
				type:"spark",
				x:50+Math.cos(arc)*rad+5*Math.cos(timestamp/8100*2*Math.PI),						
				y:30+Math.sin(arc)*rad+5*Math.sin(timestamp/4000*2*Math.PI),
				start:timestamp,
				end:400,
				life:0,
				size:8*Math.random()+2
			};

			currentitem.particles.push(particle);
		}
	}
	if(currentitem.type=="book"){
		var rng = new Math.seedrandom(Assets.books[currentitem.name].name+Assets.books[currentitem.name].fullname);
		img = new Image();
		img.src="images/gui/icons/books/W_Book0"+Math.floor(1+rng()*7)+".png";
		
		if(Math.random()<0.01&&currentitem.particles.length<2)
		for(var i=0;i<5*Math.random();i++){
			var arc=2*Math.PI*Math.random();
			var radX=27*Math.random();
			var radY=30*Math.random();

			var particle = {
				type:"spark",
				x:50+Math.cos(arc)*radX+5*Math.cos(timestamp/8100*2*Math.PI),						
				y:40+Math.sin(arc)*radY+5*Math.sin(timestamp/4000*2*Math.PI),
				start:timestamp,
				end:400,
				life:0,
				size:8*Math.random()+2
			};

			currentitem.particles.push(particle);
		}
	}
	if(!img){
		window.requestAnimationFrame(renderItem);
		return;
	}
	GUIimg.clearRect(0, 0, 100, 100);							
	cUtils.imageSmoothing(GUIimg,false);
	GUIimg.drawImage(img,50-32+5*Math.cos(timestamp/8100*2*Math.PI),40-32 +5*Math.sin(timestamp/4000*2*Math.PI),64,64);
	cUtils.imageSmoothing(GUIimg,true);
	//tODO: particleeffects
	
	
	for(var i =0;i<currentitem.particles.length;i++)
		{
					var particle = currentitem.particles[i];
					
					if(particle.end<0 || !particle){
					continue;
					}
					if(particle.life>particle.end){
						particle.end=-1
						currentitem.particles[i]=particle;
							
						currentitem.particles.splice( i, 1)
						continue;
					}
					var lifestage= particle.life/particle.end;
					
					switch(particle.type){
						case "spark":
						
						
							GUIimg.fillStyle="rgba(255,255,255,"+0.8*Math.sin(lifestage*Math.PI)+")";
							var scale = Math.sin(lifestage*Math.PI)
							GUIimg.setTransform(1, 0, 0, 1, particle.x,particle.y );
							GUIimg.rotate(2*Math.PI*(lifestage*0.4));
							GUIimg.fillRect(-(particle.size/2)*scale,-(particle.size/2)*scale,particle.size*scale,particle.size*scale);
							GUIimg.setTransform(1,0,0,1,0,0);
							//context.fill();
							//context.beginPath();
							
						break;
					}
					particle.life=timestamp-particle.start;
					currentitem.particles[i]=particle;
		}
	
	window.requestAnimationFrame(renderItem);
}

function repolulateItemMenu()
{
	var scrolldata=document.getElementById('GUIItemsScrolls');
	var itemdata=document.getElementById('GUIItemsItems');
	
	var scrollbutton=document.getElementById('GUIItemsScrollsButton');
	scrollbutton.innerHTML="<span>Zwoje"+((player.notificationsBooks>0)?" <span class='badge'> ? </span>":"")+"</span>"
	var itembutton=document.getElementById('GUIItemsItemsButton');
	  itembutton.innerHTML="<span>Przedmioty"+((player.notificationsItems>0)?" <span class='badge'> ? </span>":"")+"</span>"
	

	
	while(	scrolldata.firstChild != undefined)
	scrolldata.removeChild(scrolldata.firstChild);

	while(	itemdata.firstChild != undefined)
	itemdata.removeChild(itemdata.firstChild);
	
	//create Library
	for(var i =0 ;i<player.books.length;i++)
	{
	var li = document.createElement("LI");
	var book = Assets.books[player.books[i]];
	var rng = new Math.seedrandom(book.name+book.fullname);
	li.innerHTML = "<span><img src='images/gui/icons/books/W_Book0"+Math.floor(1+rng()*7)+".png' alt=' [book] '></img>"+book.fullname.capitalizeFirstLetter()+(player.seen.indexOf("book"+book.name)>=0?"":" <span class='badge'> ? </span>")+"</span>";
	li.className="item"
	//item.style="font-size:"+(20*30)/(book.fullname.length+4+5)+"px;";
	scrolldata.appendChild(li)
	var bookbinder = function(book) {
		return function(){ setItemPreview("book",book.name)};
	}
	li.addEventListener('click',bookbinder(book));
	}
	
	//create item pile
	for(var i =0 ;i<player.items.length;i++)
	{
	var li = document.createElement("LI");
	var item = Assets.items[player.items[i]];
	
	li.innerHTML = "<span><img src='"+ Assets.img[item.icon].src+"' alt=' [item] '></img>- "+item.type.capitalizeFirstLetter()+" - "+item.fullname.capitalizeFirstLetter()+(player.seen.indexOf("item"+item.name)>=0?"":" <span class='badge'> ? </span>")+"</span>";
	li.className="item"
	//item.style="font-size:"+(20*30)/(book.fullname.length+4+5)+"px;";
	itemdata.appendChild(li)
	var itemtagger = function(item) {
		return function(){ setItemPreview("item",item.name)};
	}
	li.addEventListener('click',itemtagger(item));
	}
}
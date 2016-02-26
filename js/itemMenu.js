
var itemManuTab=0
var item_menu;
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function loadItemMenu(){
	changeTab(0)
	setItemPreview("book","intro")

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
	
	while(	itempreview.firstChild != undefined)
			itempreview.removeChild(itempreview.firstChild);
		
	var item =  undefined;
	if(type.toLowerCase()=="book"&&Assets.books[name]!=undefined)
	{
		item = Assets.books[name];
	}
	else
	{
		item = Assets.items[name];
	}
		 
		
		var li = document.createElement("LI");
		li.innerHTML = "Name:<br>-"+item.fullname;
		itempreview.appendChild(li);
		
		li = document.createElement("LI");
		li.innerHTML = "Type:<br>-"+item.type;
		itempreview.appendChild(li);
		
		li = document.createElement("LI");
		li.innerHTML = "Autor:<br>-"+item.autor;
		itempreview.appendChild(li);
		
		itemdesc.innerHTML = item.desc;
		
		if(type.toLowerCase()=="book"){
		var button = document.getElementById("GUIItemsButton")
		button.style.visibility = (item.url==null)?"hidden":"visible";
		
		var opener = function(item) {
		return function(){ window.open(item.url)};
		}
		
		button.onclick=opener(item);
		}
		//image
		document.getElementById("GUIItemsImage").src=item.img;
		
		return
	
	console.log(type)
	console.log(name)
}
function repolulateItemMenu()
{
	var scrolldata=document.getElementById('GUIItemsScrolls');
	var itemdata=document.getElementById('GUIItemsItems');
	
	var scrollbutton=document.getElementById('GUIItemsScrollsButton');
	scrollbutton.innerHTML="<span>Scrolls"+((player.notificationsBooks>0)?" <span class='badge'> ? </span>":"")+"</span>"
	var itembutton=document.getElementById('GUIItemsItemsButton');
	itembutton.innerHTML="<span>Items"+((player.notificationsItems>0)?" <span class='badge'> ? </span>":"")+"</span>"
	

	
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
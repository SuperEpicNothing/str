
var item_context;
var item_menu;
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
function loadItemMenu(){
	item_context = document.getElementById('canvasItems').getContext("2d")
	repolulateItemMenu()
}	

function makeid(length)
{
    var text = "";
    var possible = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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
	var itempreview=document.getElementById('GUIItemsScrollData');
	var itemdesc=document.getElementById('GUIItemsScrollDescription');
	if(type.toLowerCase()=="book"&&Assets.books[name]!=undefined)
	{
		while(	itempreview.firstChild != undefined)
			itempreview.removeChild(itempreview.firstChild);

		var book = Assets.books[name];
		var item = document.createElement("LI");
		var button = document.getElementById("GUIItemsScrollButton")
		item.innerHTML = "Name:<br>-"+book.fullname;
		itempreview.appendChild(item);
		
		item = document.createElement("LI");
		item.innerHTML = "Type:<br>-"+book.type;
		itempreview.appendChild(item);
		
		item = document.createElement("LI");
		item.innerHTML = "Autor:<br>-"+book.autor;
		itempreview.appendChild(item);
		
		itemdesc.innerHTML = book.desc;
		button.style.visibility = (book.url==null)?"hidden":"visible";
		var opener = function(book) {
		return function(){ window.open(book.url)};
	}
		button.onclick=opener(book);
		return
	}
	console.log(type)
	console.log(name)
}

function repolulateItemMenu()
{
	var scrolldata=document.getElementById('GUIItemsScrolls');

	while(	scrolldata.firstChild != undefined)
	scrolldata.removeChild(scrolldata.firstChild);
	
	for(var i =0 ;i<player.books.length;i++)
	{
	var item = document.createElement("LI");
	var book = Assets.books[player.books[i]];
	var rng = new Math.seedrandom(book.name+book.fullname);
	item.innerHTML = "<span><img src='images/gui/icons/books/W_Book0"+Math.floor(1+rng()*7)+".png' alt=' [book] '></img>"+book.fullname.capitalizeFirstLetter()+"</span>";
	item.className="item"
	//item.style="font-size:"+(20*30)/(book.fullname.length+4+5)+"px;";
	scrolldata.appendChild(item)
	var bookbinder = function(book) {
		return function(){ setItemPreview("book",book.name)};
	}
	item.addEventListener('click',bookbinder(book));
	}
	setItemPreview("book",player.books[0])
}
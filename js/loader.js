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



function setCookie(name, value) {
	console.log(name)
  var cookie = [name, '=', JSON.stringify(value), '; domain=', window.location.host.toString(), '; path=/'].join('');
  document.cookie = cookie;
  console.log(cookie)
}
function getCookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}
function deleteCookie(name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}

var scrollValue = {top:0,left:0};

var mouse ={}
var Assets ={img:[],books:[],items:[]};
var player;
function loader(first){
	console.log(first)

	if(first==1 ){
	loadPlayer();
	loadItemMenu();
	loadCanvas();
	return
	}
	window.addEventListener("scroll", function(event) {
    scrollValue.top = this.scrollY;
    scrollValue.left =this.scrollX;
	}, false);
	console.log(document.cookie);
	loadAssets();
}
function loadPlayer()
{
	//create DEFAULT
	player = {
		name: "IAmError",
		gender:true,
		age:666,
		appearance:[],
		classType:"Vampire",
		//Temp: S P E C I A L 1-10
		stats:[2,6,3,7,9,8,3],
		progress:{
			lvl:0,
			chapters: [0,1]
			},
		books:[],
		items:[],
		achievements:["newbie"]
		};
		
	//library trip
	for(var book in Assets.books)
	{
		player.books.push(book);
	}
	//raid nearby village
	for(var item in Assets.items)
	{
		player.items.push(item);
	}
	//LOAD 
	/*
	if(document.cookie.indexOf("player") >= 0){
		player=getCookie("player");
	}
	else{*/
		setCookie("player",player);
	//}
	savePlayer();
}
function savePlayer()
{
	player.books.sort(function(a, b){console.log(player.books);return Assets.books[a].fullname.localeCompare(Assets.books[b].fullname)});
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
		loader(1)
    }
	};
	xmlhttp0.open("GET", "json/assets.json?t="+ (new Date().getTime()), false);
	xmlhttp0.send();
}

function mouseChange(event,evtname){
	mouse.target=(event.target);
	mouse.x=(event.pageX - event.target.documentOffsetLeft - scrollValue.left);
	mouse.y=(event.pageY - event.target.documentOffsetTop - scrollValue.top);
	mouse.buttons=(event.buttons);
	mouse.detail=(event.detail);
	mouse.event=evtname;
	//window.requestAnimationFrame(renderItemMenu);
}



function inBounds(x,y,w,h){
	if(mouse.x>x&& mouse.x<x+w && mouse.y>y && mouse.y<y+h)
	return true;

	else 
	return false;
}

// graphic helper
function drawButtonBG(ctx, x, y, width,height){

	var type =0
	if(inBounds(x,y,width,height))
	{
		type=104;
		if(mouse.buttons==1)
			type=52;
	}
	
	ctx.drawImage(Assets.img["button"],0,type,10,52,x,y,10,height);
	
	for(var i =0;i<(width-20)/80-1;i++)
	ctx.drawImage(Assets.img["button"],10,type,80,52,x+10+i*80,y,80,height);
	
	ctx.drawImage(Assets.img["button"],10,type,(width-20)%80,52,x+10+(Math.round(((width-20)/80)-1)*80),y,(width-20)%80,height);

	ctx.drawImage(Assets.img["button"],90,type,10,52,x+width-10,y,10,height);
}

function drawScroll(ctx, x, y, width,height,scroll){
	var rng = new Math.seedrandom(scroll.text);
	
	drawButtonBG(ctx, x, y, width,height)
	ctx.fillStyle = "6f6f6a";
	ctx.font = Math.round(height-10)+"px Arial";
	ctx.textBaseline = "top";
	ctx.wrapText(scroll.text.toLowerCase()+" : "+Math.floor(rng()*10),x+55,y+5,width-60,Math.round(height-10));
	ctx.fill();
	
}


function renderItemMenu(){
	var ctx = item_context;
	ctx.fillStyle="#222222"
	ctx.fillRect(0,0,ctx.canvas.width ,ctx.canvas.height );
	ctx.fill();
	renderScrolls(ctx)
}

function renderScrolls(ctx){
	//title card
	ctx.fillStyle="#666666"
	ctx.fillRect(0,0,ctx.canvas.width ,60 );
	ctx.fill();
	
	ctx.font = 50+"px Aclonica";
	ctx.fillStyle = "#fff";
	ctx.textBaseline = "top";
	ctx.wrapText("Scrolls:", 15,10, ctx.canvas.width,40);
	
	
	for(var i=0;i<player.books.length;i++)
	{
		drawScroll(ctx,0,60+i*55,ctx.canvas.width-50,55,player.books[i]);
	}
	
	//scroll
	ctx.fillStyle="#333333"
	ctx.fillRect(ctx.canvas.width-50,60,50,ctx.canvas.height/2-60 );
	ctx.fill();
	
	ctx.fillStyle="#444444"
	ctx.fillRect(ctx.canvas.width-50,60,50,60 );
	ctx.fill();
}

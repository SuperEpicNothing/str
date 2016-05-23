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

var cUtils = {};
cUtils.imageSmoothing = function(ctx,bool){
	ctx.mozImageSmoothingEnabled = bool;
	ctx.webkitImageSmoothingEnabled = bool;
	ctx.msImageSmoothingEnabled = bool;
	ctx.imageSmoothingEnabled = bool;
}

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

}

function drawButtonskip(x, y,mode,enabled){

	var type =0
	if(!enabled)
		return

	else if(inBounds(0,40,elem.width, elem.height-40)){
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
function skip(mode){
		mouse.up=false;

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

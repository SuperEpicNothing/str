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

cUtils.drawLBolt = function(ctx,origin,end,length,colors,clengths,cdispl,splits){
	var cscale = cdispl<0? 1 : 1 - cdispl;
	var lengths=[]
	lengths[0]=0;
	for(var i=1;i<length-1;i++)
		lengths.push(Math.random());
	lengths.push(1);
	lengths.sort();
	
	
	
	var x = end[0]-origin[0];
	var y = end[1]-origin[1];
	
	var sway = 80;
	var jaggedness  = 1/sway;
	var distance = Math.sqrt(x*x+y*y);
	var angl = Math.atan(y/x);
	var pdispl =0;
	
	for(var i=1;i<length;i++){
		var colorgrad = (cdispl+cscale*lengths[i-1]);
		if(colorgrad<0)
		colorgrad=1;
	
		var scale = (distance * jaggedness) * (lengths[i] - lengths[i - 1]);
		var envelope = lengths[i] > 0.95 ? 20 * (1 - lengths[i]) : 1;
		var displ = sway*(1-2*Math.random());
		displ -= (displ - pdispl) * (1 - scale);
		displ *= envelope;
		
		if(colors != undefined && clengths!= undefined)
		{
		var colorgrad1 = (cdispl+cscale*lengths[i-1]);
		if(colorgrad1<0)
		colorgrad1=1;
	
		var colorgrad2 = (cdispl+cscale*lengths[i]);
		if(colorgrad2<0)
		colorgrad2=1;
	
		var color1  = cUtils.colorGradients(colors, clengths,colorgrad1);	
		var color2  = cUtils.colorGradients(colors, clengths,colorgrad2);		
		
		
		var grd = context.createLinearGradient(0, 0, 5, lengths[i]-lengths[i-1]);
			grd.addColorStop(0, "rgba("+color1[0]+","+color1[1]+","+color1[2]+","+color1[3]+")");
			grd.addColorStop(1, "rgba("+color2[0]+","+color2[1]+","+color2[2]+","+color2[3]+")");
			
		ctx.strokeStyle=grd;
		}
		ctx.beginPath();
		ctx.moveTo( origin[0]+x*lengths[i-1]+pdispl*Math.cos(Math.PI/2+angl),
					origin[1]+y*lengths[i-1]+pdispl*Math.sin(Math.PI/2+angl));
		ctx.lineTo( origin[0]+x*lengths[i]+displ*Math.cos(Math.PI/2+angl),
					origin[1]+y*lengths[i]+displ*Math.sin(Math.PI/2+angl));
		ctx.stroke();		
		pdispl=displ;
	}
			
	ctx.beginPath();	
}

cUtils.imageSmoothing = function(ctx,bool){
	ctx.mozImageSmoothingEnabled = bool;
	ctx.webkitImageSmoothingEnabled = bool;
	ctx.msImageSmoothingEnabled = bool;
	ctx.imageSmoothingEnabled = bool;
}
cUtils.colorGradients = function(colors,lengths,stage){
	
	var i =0;
	
	while(lengths[i]<=stage && i<lengths.length-1)
		i++;
	
	return cUtils.colorGradient(colors[i],colors[i+1],
	1-(lengths[i]-stage)/(lengths[i]-(i-1<0?0:lengths[i-1]))
	);
	
	
}
cUtils.colorGradient = function(colorA,colorB,stage){
	var colorC = colorA;
	for(var i=0;i<colorA.length;i++){
	colorC[i]+= (colorB[i]-colorA[i])*stage;
	if(i<3)
	colorC[i]=Math.round(colorC[i])}
	return colorC;
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
		if(mouse.up && mouse.target==elem && enabled && mouse.prepare)
		skip(mode)
		if(mouse.buttons>0){
			type=20;
			mouse.prepare=true;
		}
		else 
			mouse.prepare=false;
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
		mouse.prepare=false;
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
cUtils.drawButtonImg = function(context,elem,ix,iy, img,x, y, width,height,f,id,disabled){
	var type =0;
	if(inBounds(x,y,width,height)){
		type=1;

		if(mouse.up && mouse.target==elem && mouse.prepare){
			if(f != undefined && !disabled)
			f(id)
		mouse.up=false;
		mouse.prepare=false;
		}
		
		

		if(mouse.buttons>0)
		{
		mouse.prepare=true;
		type=2;
		}
		else
		mouse.prepare=false;
	}
	if(disabled)
		type=2;
		
	context.drawImage(img,
	ix,iy + type*height,
	width,height,
	
	x,y,width,height);
}
cUtils.drawButton = function(context,elem, text,x, y, width,height,enabled,f,id){
	cUtils.drawButtonBG(context,elem,x, y, width,height,enabled,f,id);
	context.fillStyle = "white";
	context.font = (height-4)+"px Aclonica"
	context.textBaseline = "top";
	context.textAlign= "center"; 
	context.fillText(text,x+width/2, y+2);
}
cUtils.drawButtonBG = function(context,elem,x, y, width,height,enabled,f,id){
	var type =0
	if(!enabled)
	{type=52;}
	else if(inBounds(x,y,width,height)){
		type=104;
		if(mouse.up && mouse.target==elem&&enabled && mouse.prepare){
			if(f != undefined)
			f(id)
		mouse.up=false;
		mouse.prepare=false;
		}
		
		if(mouse.buttons>0)
		{
		mouse.prepare=true;
		type=52;
		}
		else
		mouse.prepare=false;
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
function drawButtonBG(x, y, width,height,enabled,f,id){
	cUtils.drawButtonBG(context,elem,x, y, width,height,enabled,f,id);
}

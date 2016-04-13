var notif = {};
notif.noftifications = [{type:"xp",isOver:false,amt:2.1,startamt:0,posttime:null},{type:"item",isOver:false,id:"demon",posttime:null},{type:"book",isOver:false,id:"intro",posttime:null},{type:"achievment",isOver:false,ach:0,posttime:null}];
notif.draw = function(ctx,time){
	if(!this.noftifications[0])
		return;
	if(!this.noftifications[0].posttime)
	{
		this.noftifications[0].posttime=time;
	}
	var progress = time-this.noftifications[0].posttime
	switch(this.noftifications[0].type)
	{
		case "achievment":
			this.achievment(ctx,progress,this.noftifications[0].ach);
		break;
		case "item":
			this.item(ctx,progress,this.noftifications[0].id);
		break;
		case "book":
			this.book(ctx,progress,this.noftifications[0].id);
		break;
		case "xp":
			this.xp(ctx,progress,this.noftifications[0].amt,this.noftifications[0].startamt);
		break;
	}
	
	if(this.noftifications[0].isOver)
	{
		this.noftifications.splice(0,1);
	}
};
notif.swing = function(progress,mode,time){
	if(mode==undefined)
		mode= progress<=2000&&progress>1000?1:progress>2000?-1:0;
	var offset= Math.sin(progress/2000*Math.PI)*40-38;
	if(mode==1)
		offset= 2;
	
	if(mode==-1)
		offset= Math.sin((progress-(time!=undefined?time:1000))/2000*Math.PI)*40-38;
	return offset;
}
notif.addNotif = function(type,data){
	switch(type)
	{
		case "achievment":
			this.noftifications.push({type:"achievment",isOver:false,ach:data,posttime:null});
		break;
		case "item":
			this.noftifications.push({type:"item",isOver:false,id:data,posttime:null});
		break;
		case "book":
			this.noftifications.push({type:"book",isOver:false,id:data,posttime:null});
		break;
		case "xp":
			this.noftifications.push({type:"xp",isOver:false,amt:data,startamt:player.progress.xp,posttime:null});
		break;
	}
}
notif.unwrapBand= function(ctx,progress,width,offset,start,time,mode){
	
	var dio = mode==1?Math.round((257-start)/time*progress):mode==-1?257:0;
	//AchievmentNotifyBand
	ctx.drawImage(Assets.img["GUIachievmentNotify"],
	700-dio-start,0,
	dio+start,38,
	width-dio-start,offset,
	dio+start,38);
	
}
notif.xp = function(ctx,progress,xp,startamt){
	var width = ctx.canvas.width
	var mode = progress<=4000&&progress>1000?1:progress>4000?-1:0;
	
				
	if(progress>5000)
		this.noftifications[0].isOver=true;
	var offset = this.swing(progress,mode,3000);
	this.unwrapBand(ctx,progress-1000,width,offset,25,250,mode)	
	ctx.drawImage(Assets.img["players"],
	24*(player.appearance+(player.gender?0:3)), 0,
	24,32,width-32,offset-4,32,48);

	if(progress-1000>250){
	ctx.fillStyle="#00ffaa";
	var barfill = (startamt+xp)*((progress-1000)/3000);
	if(mode==-1)
	{
		barfill=(startamt+xp)
	}
	ctx.fillRect(width-256/2-192/2+22.5,12+offset+3.75,(147)*(barfill*1000%1000/1000),15.5);
	ctx.fill();
	
	ctx.drawImage(Assets.img["GUIxpbar"],width-256/2-192/2,12+offset,192,24)
	ctx.font = "14px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="center"; 
	ctx.strokeStyle="black";
	ctx.fillStyle="white";
	ctx.fillText("+"+Math.floor(barfill),width-256/2,12+offset+6);
	ctx.strokeText("+"+Math.floor(barfill),width-256/2,12+offset+6);

	ctx.font = "12px Aclonica"
	ctx.textAlign="left"; 
	ctx.fillText("Zdobyto doświadczenie!",width-256+5,5+offset);
	
	}
}
notif.item = function(ctx,progress,item){
	var width = ctx.canvas.width
	var mode = progress<=2000&&progress>1000?1:progress>2000?-1:0;
	if(progress>4000)
		this.noftifications[0].isOver=true;
	
	var offset = this.swing(progress);
	this.unwrapBand(ctx,progress-1000,width,offset,50,250,mode)	
	ctx.drawImage(Assets.img[mode==1?"GUIopenchest":"GUIclosedchest"],width-50,offset-4,50,50);

	if(progress-1000>250){
	ctx.font = "14px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="left"; 
	ctx.fillStyle="white";
	ctx.fillText("Argument Zdobyty!",width-256+38,5+offset);
	
	ctx.font = "10px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="left"; 
	ctx.fillStyle="#d9d9d9";
	ctx.fillText(Assets.items[item].fullname,width-256+38,22+offset);
	if(Assets.items[item].icon)
	ctx.drawImage(Assets.img[Assets.items[item].icon],width-255,offset+2,36,36);	
	}
}
notif.book = function(ctx,progress,book){
	var width = ctx.canvas.width
	var mode = progress<=2000&&progress>1000?1:progress>2000?-1:0;
	
	var rng = new Math.seedrandom(Assets.books[book].name+Assets.books[book].fullname);
			var Ibook = new Image();
			Ibook.src="images/gui/icons/books/W_Book0"+Math.floor(1+rng()*7)+".png";
			
	if(progress>4000)
		this.noftifications[0].isOver=true;
	var offset = this.swing(progress);
	this.unwrapBand(ctx,progress-1000,width,offset,50,250,mode)	
	ctx.drawImage(Assets.img[mode==1?"GUIopenchest":"GUIclosedchest"],width-50,offset-4,50,50);

	if(progress-1000>250){
	ctx.font = "14px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="left"; 
	ctx.fillStyle="white";
	ctx.fillText("Znaleziono Książkę!",width-256+38,5+offset);
	
	ctx.font = "10px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="left"; 
	ctx.fillStyle="#d9d9d9";
	ctx.fillText(Assets.books[book].fullname,width-256+38,22+offset);
	ctx.drawImage(Ibook,width-255,offset+2,36,36);	
	}
}
notif.achievment = function(ctx,progress,ach){
	var width = ctx.canvas.width
	var offset = this.swing(progress);
	if(progress>4000)
		this.noftifications[0].isOver=true;
	
	//AchievmentNotify
	ctx.drawImage(Assets.img["GUIachievmentNotify"],0,offset);
	
	ctx.font = "14px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="left"; 
	ctx.fillStyle="white";
	ctx.fillText("Osiągnięcie Odblokowane!",width-256+38,5+offset);
	
	ctx.font = "10px Aclonica"
	ctx.textBaseline = "top";
	ctx.textAlign="left"; 
	ctx.fillStyle="#d9d9d9";
	ctx.fillText(Assets.achievments[ach].fullname,width-256+38,22+offset);
	ctx.drawImage(Assets.img["GUIachievments"],32*Assets.achievments[ach].level,0,32,32,width-256+1,3+offset,32,32);
	if(Assets.achievments[ach].icon)
	ctx.drawImage(Assets.img[Assets.achievments[ach].icon],width-256+8,10+offset,18,18);	
};
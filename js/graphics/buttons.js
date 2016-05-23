var buttons = {};

buttons.mute = function(b){
	
	var i = 1;
	if(mouse.buttons>0)
		i = 2;		
	
	if(mouse.up){
		option.mute=!option.mute;
		mouse.up=false;
		audio.update();
	}
	buttons.btn[b].type = option.mute? 2:1;
	return i;
}
buttons.skip = function(b){
	var i = 1;
	if(mouse.buttons>0)
		i = 2;
	
	if(mouse.up){
		renderData.skipmode=-1;
		mouse.up=false;

	}
	return i;
}

buttons.btn = [{type:0,f: buttons.skip },{type:1,f:buttons.mute}];

buttons.drawMenubar=function(ctx,time){
	for(var i =0 ;i<buttons.btn.length;i++)
	buttons.drawButton(ctx,time,i);

}
buttons.drawButton=function(ctx,time,b){
	var t=0;
	
	if(inBounds(b*35+2,2,35,35))
		t=buttons.btn[b].f(b);
		
	ctx.drawImage(Assets.img["GUIbuttonmenu"],buttons.btn[b].type*50,t*50
	,50,50,
	b*35+2,2,35,35);
}

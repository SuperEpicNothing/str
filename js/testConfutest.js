var menu;
var elem,context;
var boss = {health:1,healthMax:9,state:"idle",heroHp:1,heroHpMax:4}
var battlescript
var currentscene=0;
function loadConfu(file,id){
	console.log("konfu"+id+":"+file);
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "json/"+file+"?t="+ (new Date().getTime()), true);
	xhttp.send();
	elem = document.getElementById(id);
	xhttp.onreadystatechange = function() {
		
	if (xhttp.readyState == 4 && xhttp.status == 200)
	{
		try{
	battlescript = JSON.parse(xhttp.responseText);
		}catch(e)
		{
			battlescript = {
			meta:{bg:"blackboard",current:0,actor:"planet0", music:[]},
			scenes:[
			{
				events:[
				{	type:"question",
					time:1000,timepadding:0,
					text:"You Dun guffed.File is broken."
				}],
				options:[{target:0,text:"HTTP STATUS: "+xhttp.status+"HTTP readystate"+xhttp.readyState},
				{target:0,text:"Error: "+e,height:3}]
			}
			]
			}
		}
				
		boss.health=battlescript.meta.bossmaxhp
		boss.healthMax=battlescript.meta.bossmaxhp
		boss.heroHp=battlescript.meta.heromaxhp
		boss.heroHpMax=battlescript.meta.heromaxhp
	
		audio.setTrack(battlescript.meta.music[ Math.round((battlescript.meta.music.length-1)*Math.random())] );
	}
	else if(xhttp.readyState == 4)
	{
		elem.parentNode.innerHTML=xhttp.responseText
	}

	}
	


    context = elem.getContext('2d');

	if(elem == undefined)
	{
		console.log("no canvas")
	return;
	}

	
	addMouseListener(elem)
	
	window.requestAnimationFrame(renderConfu);
}

function clear(){
	context.fillStyle="grey";
	context.fillRect(0, 0, elem.width, elem.height);
	context.fill();
}

var start = undefined;
var begin = false;
var change,changeEvt;
var timeflow =false;
var timeflowtimestamp;
function renderConfu(timestamp){

	if (!begin && mouse.isOver && mouse.target==elem){start = timestamp; begin =true; timeflow=true; timeflowtimestamp=undefined;}
	if(!Assets.loaded ||!battlescript) {window.requestAnimationFrame(renderConfu); return}
	if (begin)
		var progress = Math.round(timestamp - start);
	else
		var progress =0;
	clear();
	
	if(!timeflow && timeflowtimestamp==undefined)
		timeflowtimestamp=timestamp;

	if(timeflow &&timeflowtimestamp!=undefined)
	{
		start+=(timestamp-timeflowtimestamp);
		timeflowtimestamp=undefined;
		timeflow=true;
	}

	audio.play(mouse.target==elem && mouse.isOver)

	processEvent(progress);
	drawBackground(timeflow?progress:(timeflowtimestamp-start));
	
	drawConfutest(timeflow?progress:(timeflowtimestamp-start));

	for(var i =0;i<renderData.particles.length;i++)
		{
					var particle = renderData.particles[i];
					
					if(particle.end<0 || !particle){
					continue;
					}
					if(particle.life>particle.end){
						particle.end=-1
						renderData.particles[i]=particle;
							
						renderData.particles.splice( i, 1)
						continue;
					}
					var lifestage= particle.life/particle.end;
					switch(particle.type){
						default:console.log(particle.type);break;
						case "explosion":
							
							
							for(var p =0;p<150;p++)
							{
								var smk = {
											
											type:particle.smoketype,
											x:particle.x+particle.size*(1-2*Math.random()),						
											y:particle.y+particle.size*(1-2*Math.random()),
											start:particle.start,
											end:200+200*Math.random(),
											life:160*Math.random(),
											color:particle.color,
											size:2+5*Math.random(),
											movX:(1-2*Math.random()),
											movY:(1-2*Math.random())};
									
								renderData.particles.push(smk);
							}
							particle.end=-1;
						break;
						case "spacetimefabric":
								var potionColor = [144,144,144,1]				
								var color  = [0,0,0,1]
								color = cUtils.colorGradients([potionColor,[potionColor[0]*0.5,potionColor[1]*0.5,potionColor[2]*0.3,0.2],[0,0,0,0.01]], [0.7,1],lifestage)		
								context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
								


							context.fillRect(particle.x-(particle.size/2+5)*lifestage,particle.y-(particle.size/2+5)*lifestage,(particle.size+10)*lifestage,(particle.size+10)*lifestage);

							if(!timeflow)
								continue;
							
								particle.x+=particle.movX;
								particle.y+=particle.movY;
								particle.movX=particle.movX+0.05*(1-2*Math.random());
								particle.movY=particle.movY+0.05*(1-2*Math.random());						
						break;
						case "hpcontainer":
							context.setTransform(1, 0, 0, 1, particle.x,particle.y);
							context.rotate(-Math.PI/2+particle.currentRot);													
							context.drawImage(Assets.img["hpcontiner"],
							60.5-particle.ydispl - particle.size/2,
							16 +particle.xdispl- particle.size/2,
							particle.size,particle.size,
							- particle.size/2,- particle.size/2,
							particle.size,particle.size);
							context.setTransform(1, 0, 0, 1, 0,0);
							if(!timeflow)
								continue;
							if(particle.currentRot==undefined)
								particle.currentRot=0;
							particle.currentRot+=0.01*Math.PI*(1-2*Math.random());
								particle.x+=2*particle.movX;
								particle.y+=2*particle.movY;
								particle.movX=particle.movX+0.05*(1-2*Math.random());
								particle.movY=particle.movY+0.05*(1-2*Math.random());			
							/*var p = {
									type:"hpcontainer",
									x:parX+xdispl,						
									y:parY+ydispl,
									xdispl:xdispl,
									ydispl:ydispl,
									start:renderData.progress,
									end:1000,
									life:0,
									size:2*Math.random(),
									movX:0.1*(1-2*Math.random())+xdispl/16,
									movY:0.1*(1-2*Math.random())+ydispl/60.5};	*/
									
						break;
						case "potionsmoke":
							var potionColor = [0,0,0,0]
							switch(particle.color)
							{
								case 0:
								potionColor =[52,113,255,0.9];								
								break;
								
								case 1:
								potionColor =[103,181,83,0.9];								
								break;
								
								case 2:
								potionColor =[193,73,239,0.9];								
								break;
								
								case 3:
									potionColor =[255,52,63,0.9];							
								break;
								
								case 4:
								default:
								potionColor =[255,210,52,0.9];
								break;
							}
							var color  = [0,0,0,1]
							color = cUtils.colorGradients([potionColor,[potionColor[0]*0.5,potionColor[1]*0.5,potionColor[2]*0.3,0.2],[0,0,0,0.01]], [0.7,1],lifestage)		
							context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
							


						context.fillRect(particle.x-(particle.size/2+5)*lifestage,particle.y-(particle.size/2+5)*lifestage,(particle.size+10)*lifestage,(particle.size+10)*lifestage);

						if(!timeflow)
							continue;
						
							particle.x+=particle.movX;
							particle.y+=particle.movY;
							particle.movX=particle.movX+0.05*(1-2*Math.random());
							particle.movY=particle.movY+0.05*(1-2*Math.random());
						break
						case "explosionsmoke":
						var color =[0,0,0]; 
						color = cUtils.colorGradients([[249,247,212,1],[248,239,19,1],[255,139,50,1],[186,0,0,0.5],[0,0,0,0.3]], [0.11,0.2,0.41,1],lifestage)		
						context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
							
						//context.beginPath();
						//context.arc(particle.x, particle.y, (particle.size+5)*lifestage, 2 * Math.PI, false);
						//context.closePath();;

						context.fillRect(particle.x-(particle.size/2+5)*lifestage,particle.y-(particle.size/2+5)*lifestage,(particle.size+10)*lifestage,(particle.size+10)*lifestage);
						//context.fill();
						//context.beginPath();
						if(!timeflow)
							continue;
						particle.x+=particle.movX;
						particle.y+=particle.movY;
						particle.movX=particle.movX+0.05*(1-2*Math.random());
						particle.movY=particle.movY+0.05*(1-2*Math.random());
						
						break;
						
						case "shieldsmoke":
						var color =[0,0,0]; 
						color = cUtils.colorGradients(
						[[50,159,251,0.7],[118,210,225,0.6],[100,110,125,0.3]], 
						[0.5,1],Math.sin(2*Math.PI*lifestage/4))		
						context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
							
						//context.beginPath();
						//context.arc(particle.x, particle.y, (particle.size+5)*lifestage, 2 * Math.PI, false);
						//context.closePath();;

						context.fillRect(particle.x-(particle.size/2+5)*lifestage,particle.y-(particle.size/2+5)*lifestage,(particle.size+10)*lifestage,(particle.size+10)*lifestage);
						//context.fill();
						//context.beginPath();
						if(!timeflow)
							continue;
						particle.x+=particle.movX;
						particle.y+=particle.movY;
						particle.movX=particle.movX+0.05*(1-2*Math.random());
						particle.movY=particle.movY+0.05*(1-2*Math.random());
						
						break;
						
						case "magicsmoke":
						
						var color = cUtils.colorGradients([[63,0,206,0],[206,206,206,0.5]], [1],1-lifestage);		
						context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
						//context.fillStyle="rgba("+Math.round(63+143*(1-lifestage))+","+Math.round(206*(1-lifestage))+",206,"+0.5*(1-lifestage)+")";
						
						//context.beginPath();
						//context.arc(particle.x, particle.y, (particle.size+5)*lifestage, 2 * Math.PI, false);
						//context.closePath();;

						context.fillRect(particle.x-(particle.size/2+5)*lifestage,particle.y-(particle.size/2+5)*lifestage,(particle.size+10)*lifestage,(particle.size+10)*lifestage);
						//context.fill();
						//context.beginPath();
						if(!timeflow)
							continue;
						particle.x+=particle.movX;
						particle.y+=particle.movY;
						particle.movX=particle.movX+0.05*(1-2*Math.random());
						particle.movY=particle.movY-0.3*Math.random();
						
						break;
						
						case "healthsmoke":
						context.fillStyle="rgba("+Math.round(100+105*(particle.lifepercent)+(Math.sin((timeflow?progress:(timeflowtimestamp-start))/(2000*particle.lifepercent)*2*Math.PI)*40))+",0,"+Math.round(70*particle.lifepercent)+","+
						0.7*(1-lifestage)+")";
						context.fillRect(particle.x-(particle.size*lifestage/2)-5,particle.y-(particle.size*lifestage/2)-5,10+(particle.size)*lifestage,10+(particle.size)*lifestage);
						if(!timeflow)
							continue;
						particle.x+=particle.movX;
						particle.y+=particle.movY;
						particle.movX=particle.movX+0.1*(1-2*Math.random());
						particle.movY=particle.movY+0.1*(1-2*Math.random());
						break;
						
						case "orbbot":
							var pos = [350,140];
							var positions = [[253,100],[446,100],[350,233],[446,100],[350,233],[350,233],[350,233],[350,140]];
							var dist = 60+10*Math.cos(Math.PI*2*(timeflow?progress:(timeflowtimestamp-start))/4000);
							var arc = (timeflow?progress:(timeflowtimestamp-start))/4000*Math.PI*2
							positions[positions.length-1]=pos;
							for(var p = 0 ; p<positions.length-1;p++){
								positions[p][0]=pos[0] + dist*Math.cos(arc+(p)*(Math.PI*2/(positions.length-1)));
								positions[p][1]=pos[1] + dist*Math.sin(arc+(p)*(Math.PI*2/(positions.length-1)));
							}
							
							var frame = Math.round(lifestage*8*particle.end/700)%8
							
							var distsq = Math.pow(particle.x-positions[particle.id][0],2)+Math.pow(particle.y-positions[particle.id][1],2)
						
									
							//particle.x=positions[particle.id][0];
							//particle.y=positions[particle.id][1];	

							if(!renderData.botsinPos)
								renderData.botsinPos=[]							
							
							if(!renderData.botsFinished)
								renderData.botsFinished=[]
							
							if(particle.x>positions[particle.id][0]-6 && particle.x<positions[particle.id][0]+6 
							&& particle.y>positions[particle.id][1]-6 && particle.y<positions[particle.id][1]+6)
								renderData.botsinPos[particle.id]=true;
							else
								renderData.botsinPos[particle.id]=false;
							
							if(renderData.stoptime){
							var ready = false;
							for(var p=0;p<positions.length;p++)
							{
								if(!renderData.botsinPos[p])
								{
									ready = false;
									break;
								}
								else
								ready=true;
							}
							timeflow=!ready;
							}
							
							if(!renderData.botsFinished[particle.id])
							particle.end+=100;

							if(renderData.botsinPos[particle.id] && (particle.id+1)!=positions.length)
							{
								context.strokeStyle="red";
								context.lineWidth=1+0.5*Math.cos(frame/8*2*Math.PI);
								
								for(var p = particle.id+1; p<positions.length-1; p++)
								if(renderData.botsinPos[p]){								
								context.beginPath();
								context.moveTo(positions[particle.id][0],positions[particle.id][1]);
								context.lineTo(positions[p][0],positions[p][1]);
								context.closePath();
								context.stroke();
								}
								
								if(renderData.botsinPos[positions.length-1]){
									context.beginPath();
									context.moveTo(positions[particle.id][0],positions[particle.id][1]);
									context.lineTo(positions[positions.length-1][0],positions[positions.length-1][1]);
									context.closePath();
									context.stroke();
								}
								context.beginPath();
							}
							
							if(renderData.beginFinish){
								
								if(renderData.success && Math.random()<0.05)
								{
									var smk = {
											
											type:"explosion",
											smoketype:"explosionsmoke",
											x:particle.x,						
											y:particle.y,
											start:renderData.progress,
											end:200+200*Math.random(),
											life:0,
											size:2
											};
									
									renderData.particles.push(smk);
									
									renderData.botsinPos[particle.id]=false;
									renderData.botsFinished[particle.id]=true;
									particle.end=-1;
								}
								else if(!renderData.success)
								{
									if(particle.id == (positions.length-1) )
									{
										if(!renderData.timestampFinish)
											renderData.timestampFinish = renderData.progress;
										
										var pro = renderData.progress-renderData.timestampFinish;
										
										if(pro > 200 && pro < 950){
											var color = cUtils.colorGradient([255,0,0],[244,0,0],Math.sin(pro/750*2*Math.PI))
											context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+1+")";
											context.beginPath();
											context.moveTo(pos[0],pos[1]);
											context.lineTo(pos[0]+100*Math.cos(pro/750*2*Math.PI)-100,elem.height-180);
											context.lineTo(pos[0]-100*Math.cos(pro/750*2*Math.PI)+100,elem.height-180);
											context.closePath();
											context.fill();
											context.beginPath();
											
											for(var p=0;p<40;p++){
											var smk = {
											
											type:"explosionsmoke",
											x:pos[0]-100*(1-Math.cos(pro/750*2*Math.PI)) + Math.random()*200*(1-Math.cos(pro/750*2*Math.PI)),						
											y:elem.height-180,
											start:renderData.progress,
											end:200+200*Math.random(),
											life:0,
											size:2,
											movX:(1-2*Math.random()),
											movY:(1-2*Math.random())
											};
									
											renderData.particles.push(smk);
											}
										}else if(pro>950)
										{
											renderData.botsfinished=true;
											renderData.botsinPos[particle.id]=false;
											renderData.botsFinished[particle.id]=true;
											particle.end=-1;
										}
										
											
									}
									
									if(renderData.botsfinished && Math.random()<0.05){
											var smk = {
											
												type:"explosion",
												smoketype:"magicsmoke",
												x:particle.x,						
												y:particle.y,
												start:renderData.progress,
												end:200+200*Math.random(),
												life:0,
												size:2
											};
									
											renderData.particles.push(smk);
									
											renderData.botsinPos[particle.id]=false;
											renderData.botsFinished[particle.id]=true;
											particle.end=-1;
									}
								}
							}
							
							context.drawImage(Assets.img["orbbot"],
								0, frame*17,
								17,17,		
								(renderData.botsinPos[particle.id]?positions[particle.id][0]:particle.x)-(17*2/3),
								(renderData.botsinPos[particle.id]?positions[particle.id][1]:particle.y)-(17*2/3),		
								17*4/3,17*4/3);
							if(!timeflow)
								continue;
							
														
							var str = Math.min(2,distsq/10 * 1);
							if(distsq<225)
							{
								particle.movX=0.2*particle.movX;
								particle.movY=0.2*particle.movY;
							}
							else if(distsq>1024)
							{
								particle.movX=0.9*particle.movX;
								particle.movY=0.9*particle.movY;
							}
							if(Math.abs(particle.movX)>20)
								particle.movX=particle.movX*0.9
							if(Math.abs(particle.movY)>20)
								particle.movY=particle.movY*0.9

							particle.movX+= particle.x>positions[particle.id][0]? -str: particle.x<positions[particle.id][0]? str: 0;
							particle.movY+= particle.y>positions[particle.id][1]? -str: particle.y<positions[particle.id][1]? str: 0;
								
							
							particle.x+=particle.movX;
							particle.y+=particle.movY;						
						
						break;
						
						case "magicboltt":
							particle.x+=particle.movX;
							particle.y+=particle.movY;
							
							var str = 2;
							
							particle.movX+= particle.x>particle.tx? -str: particle.x<particle.tx? str: 0;
							particle.movY+= particle.y>particle.ty? -str: particle.x<particle.ty? str: 0;

							for(var p =0;p<15;p++){
							var smk = {
								type:"magicsmoke",
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:600*Math.random(),
								life:0,
								size:4*Math.random(),
								movX:(1-2*Math.random()),
								movY:(1-2*Math.random())};
								
							renderData.particles.push(smk);
							}
							
							if( particle.x>particle.tx - 10 && particle.x<particle.tx + 10 &&
								particle.y>particle.ty - 10 && particle.y<particle.ty + 10){
							var smk = {
								type:"explosion",
								smoketype:"magicsmoke",
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:200+200*Math.random(),
								life:0,
								size:5*Math.random()};
								
							renderData.particles.push(smk);
							
							particle.end=-1;
							}
							else
								particle.end+=100;
							
						break;
						
						case "magicbolt":
							particle.x+=particle.movX;
							particle.y+=particle.movY;
							
							var str = 2;
							
							particle.movX+= particle.x>elem.width/2? -str: particle.x<elem.width/2? str: 0;
							particle.movY+= particle.y>elem.height-180? -str: particle.x<elem.height-180? str: 0;

							for(var p =0;p<15;p++){
							var smk = {
								type:"magicsmoke",
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:600*Math.random(),
								life:0,
								size:4*Math.random(),
								movX:(1-2*Math.random()),
								movY:(1-2*Math.random())};
								
							renderData.particles.push(smk);
							}
							
							if( particle.x>elem.width/2-(2*28+boss.heroHpMax*67-4)/2 &&  particle.x<elem.width/2+(2*28+boss.heroHpMax*67-4)/2 &&
								particle.y>elem.height-190){
							var smk = {
								type:"explosion",
								smoketype:"magicsmoke",
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:200+200*Math.random(),
								life:0,
								size:5*Math.random()};
								
							renderData.particles.push(smk);
							
							particle.end=-1;
							}
							else
								particle.end+=100;
							
						break;
						
						case "missile":
							particle.x+=particle.movX;
							particle.y+=particle.movY;
							var frame = Math.round(lifestage*8*particle.end/700)%8

							context.drawImage(Assets.img["orbbot"],
								0, frame*17,
								17,17,		
								particle.x-(8.5*4/3),particle.y-(8.5*4/3),		
								17*4/3,17*4/3);
								
							var dist =  Math.sqrt(Math.pow(particle.x- particle.tx,2)+Math.pow(particle.y- particle.ty,2));
							var V = Math.sqrt(Math.pow(particle.movX,2)+Math.pow(particle.movY,2));
							
							var str = Math.min(dist/40*5,5);

							if(V > 5 && particle.movY>0)
							{
								particle.movX*=0.3;
								particle.movY*=0.3;
							}
							particle.movX-= (particle.x- particle.tx)/dist*str;
							particle.movY-= (particle.y- particle.ty)/dist*str;
							particle.movX+= 2*(1-Math.random()*2);
							particle.movY+= 2*(1-Math.random()*2);

				

							for(var p =0;p<5;p++){
							var smk = {
								type:"explosionsmoke",
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:600*Math.random(),
								life:0,
								size:4*Math.random(),
								movX:(1-2*Math.random()),
								movY:(1-2*Math.random())};
								
							renderData.particles.push(smk);
							}
							
							if( particle.x>particle.tx-8.5*4/3 &&  particle.x<particle.tx+8.5*4/3 &&
								particle.y>particle.ty-8.5*4/3 &&  particle.y<particle.ty+8.5*4/3 
								|| (renderData.success && dist <170 && Math.random()<0.5) 
								|| (renderData.success && dist < 100 && Math.random()<0.9)
								|| (renderData.success && dist < 90 )){
							var smk = {
								type:"explosion",
								smoketype:"explosionsmoke",
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:200+200*Math.random(),
								life:0,
								size:5};
							console.log("explode")	
							renderData.particles.push(smk);
							
							particle.end=-1;
							}
							else
								particle.end+=100;
							
						break;
						
						case "bottle":
							if(particle.timestamp == undefined)
								particle.timestamp = renderData.progress;
							var dist =  Math.sqrt(Math.pow(particle.x - particle.tx,2)+Math.pow(particle.y- particle.ty,2));
							if(particle.movY>0 && (dist<40 || particle.y>particle.ty+100)){
								var smk = {
								type:"explosion",
								smoketype:"potionsmoke",
								color:particle.color,
								x:particle.x,						
								y:particle.y,
								start:renderData.progress,
								end:1200+200*Math.random(),
								life:0,
								size:5};
								particle.end=-1
							console.log("explode")	
							renderData.particles.push(smk);
							}
							
							context.setTransform(1, 0, 0, 1, particle.x,particle.y);
							context.rotate((Math.PI*2) * (renderData.progress)/1000 * particle.rotSpeed );
							context.drawImage(Assets.img["russelbot"+particle.color],
								0, 0,
								34,34,		
								-(34*2/3),
								-(34*2/3),		
								34*4/3,34*4/3);
							context.setTransform(1, 0, 0, 1, 0, 0);
	
								
							particle.x+=particle.movX*(renderData.progress-particle.timestamp)/1000;
							particle.y+=particle.movY*(renderData.progress-particle.timestamp)/1000;
							particle.start+=100;
							//particle.movX+= ((particle.x>particle.tx)?-Math.random()*0.3:Math.random()*0.3);
							particle.movY+= 2000*(renderData.progress-particle.timestamp)/1000//2*(1-Math.random()*2);
							particle.timestamp = renderData.progress;
						break;
					}
					if(!timeflow)
						continue;
					particle.life=renderData.progress-particle.start;
					renderData.particles[i]=particle;
		}
	

	if(!timeflow){
		var l =Math.round(20*(timestamp-timeflowtimestamp)/5000);
		l=Math.min(l,20)
		for(var i=0;i<l;i++){
		context.fillStyle = "rgba(0,0,0,"+(0.3*Math.sin( ((timestamp-timeflowtimestamp)/2000*2*Math.PI) +(i%2==0?Math.PI/2:0))+0.4)+")";
	
		var arc = (timestamp-timeflowtimestamp)/2000 * 2 * Math.PI/l;
		//arc = Math.min(2 *i* Math.PI/l,arc);
		context.beginPath();
		context.moveTo(elem.width/2,elem.height/2-100);
		context.arc(elem.width/2, elem.height/2-100, (timestamp-timeflowtimestamp)/500*300, arc+(2*i*Math.PI)/l,arc+(2*(i+1)*Math.PI)/l, false);
		context.closePath();
		context.fill();
		}

		context.beginPath();


	}
	if(renderData.type=="question" && renderData.arm=="robot")
		drawAttackInfo(progress,"Konfuzjusz","Mroczne Automatony","Promień Dezinformujący");

	if(renderData.type=="dialog"||renderData.type=="question")
		drawDialog("Konfuzjusz",renderData.text,renderData.time,renderData.progress,renderData.skipmode)

	//drawGUIBAck
	context.drawImage(Assets.img["GUIback"],0,elem.height-150);
	

		
	
	//drawButtons
	context.font = "16px Aclonica"
	context.textBaseline = "top";
	context.textAlign="left"; 

	var x = 0;
	for(var i=0;i<battlescript.scenes[currentscene].options.length;i++)
	{
		
		if(battlescript.scenes[currentscene].options[i]!= undefined){
		var req =  checkReq(battlescript.scenes[currentscene].options[i].req);	
		
		var color = battlescript.scenes[currentscene].options[i].color &&renderData.type=="question"? 
			req.enabled ? battlescript.scenes[currentscene].options[i].color.active : battlescript.scenes[currentscene].options[i].color.inactive 
			: req.enabled?"white":"gray";
			
		var height = battlescript.scenes[currentscene].options[i].height
		height=height?height:1;
		height=x+height>4?4-x:height;
		
		}	
		
		drawButtonBG(30,elem.height-140+35*x,640,30*height+5*(height-1),
		
		req.enabled && (renderData.progress>=renderData.time+x*150+600 || (renderData.skipmode>0 && renderData.progress-renderData.skipTime>200+x*150+600))
		&& renderData.type=="question" && battlescript.scenes[currentscene].options[i]!= undefined
		,select,i)
		
		if((renderData.progress>=renderData.time+x*150 || (renderData.skipmode>0 && renderData.progress-renderData.skipTime>200+x*150)) && renderData.type=="question" && battlescript.scenes[currentscene].options[i]!= undefined)
		{
			context.fillStyle=color
			context.wrapText( req.prefix + (req.enabled? (handleText(battlescript.scenes[currentscene].options[i].text)):"???"),35,elem.height-140+35*x+9,630,16)
		}	
		x+=height;		
	}
	for(;x<4;x++)
	{				
		drawButtonBG(30,elem.height-140+35*x,640,30,false)

	}
	context.fill();

	
	
	//todo: wrap name into this function
	drawHPBar((elem.width-(2*28+boss.healthMax*67-4))/2,20,boss.health,boss.healthMax,progress);
	
	context.fillStyle="white"
	context.font = "16px Aclonica"
	context.textBaseline = "top";
	context.textAlign="center"; 
	context.fillText("Konfuzjusz lv.999",elem.width/2,30)
	
	drawHPBar((elem.width-(2*28+boss.heroHpMax*67-4))/2,elem.height-180,boss.heroHp,boss.heroHpMax,progress);
	context.fillStyle="white"
	context.font = "16px Aclonica"
	context.textBaseline = "top";
	context.textAlign="center"; 
	context.fillText(handleText("[playerName] lv.[playerLvl]"),elem.width/2,elem.height-170)
	context.fill();
	
	if(renderData.type=="showBoss")
	{
		context.fillStyle="rgba(255,255,255,"+(1-(renderData.progress/renderData.time))+")"
		context.fillRect(0, 0, elem.width, elem.height);
		context.fill();
	}
	
	if(renderData.type=="hideBoss")
	{
		context.fillStyle="rgba(255,255,255,"+(renderData.progress/renderData.time)+")"
		context.fillRect(0, 0, elem.width, elem.height);
		context.fill();
		
		if(renderData.progress/renderData.time>0.9)
		{
		audio.play(false);
		}
	}
	
	notif.draw(context,timestamp);
	buttons.drawMenubar(context,timestamp);


	window.requestAnimationFrame(renderConfu);
	
}
var currentEvt=0;
var EntTime=null;
var renderData = {type:"none",progress:0,time:0,skipmode:0,particles:[],override:false}
function processEvent(progress){

	if(!EntTime){EntTime=progress}
	
	if(boss.health<=0 && currentscene!=1)
	change= 1;
	if( boss.heroHp<=0 && currentscene!=2)
	change= 2;	
	

	//anti break
	if(currentEvt>=battlescript.scenes[currentscene].events.length)
	return;
	
	var evt =battlescript.scenes[currentscene].events[currentEvt]
	var isOver = progress-EntTime>evt.time && !(change>=0) 
	
	if(evt.type =="dialog")
	{
		isOver = progress-EntTime>(evt.time-evt.timepadding)/option.speed + evt.timepadding*option.wait && option.autoskip
	}
		
	//skip to next
	if((isOver && !renderData.override || (renderData.skipmode==2 && (evt.type =="dialog")) ) || !checkReq(evt.req).enabled)
	{
		if(renderData.skipmode==2){renderData.skipmode=0}
	change = currentscene
	changeEvt=currentEvt+1;

	}
	//backskip
	if(renderData.skipmode==-1)
	{
		begin=false;
		change=0;
		boss.health=battlescript.meta.bossmaxhp
		boss.healthMax=battlescript.meta.bossmaxhp
		boss.heroHp=battlescript.meta.heromaxhp
		boss.heroHpMax=battlescript.meta.heromaxhp
		timeflow=true;
		audio.setTrack(battlescript.meta.music[ Math.round((battlescript.meta.music.length-1)*Math.random())] );

	}
	
	//general change
	if(change>=0)
	{
		currentscene= change>=0? change :currentscene;
		if(change>=0){change=-1}
		
		infots = undefined
		EntTime=null
		currentEvt= changeEvt>=0? changeEvt: 0;
		if(changeEvt>=0){changeEvt=-1}
		var oldparticles = renderData.particles;
		renderData = {type:"none",progress:0,time:0,skipmode:0,particles:[],override:false}
		for(var i=0;i<oldparticles.length;i++)
			if(oldparticles[i] && oldparticles[i].end>0){
				oldparticles[i].start=-oldparticles[i].life;
				renderData.particles.push(oldparticles[i]);
			}
		return;
	}
	if(evt.timeflow != undefined)
	timeflow=evt.timeflow;

	
	switch(evt.type)
	{
		case "showBoss":
			renderData.type="showBoss"
			renderData.progress=progress-EntTime;
			renderData.time=evt.time
		break;
		
		case "clearParticles":
			renderData.particles=[];
		break;
		
		case "hideBoss":
			renderData.type="hideBoss"
			renderData.progress=progress-EntTime;
			renderData.time=evt.time
			renderData.override=true
		break;
		
		case "change":
			change=evt.target;
			changeEvt=0;
		break;
		
		case "isWin":
			if(boss.heroHp<=boss.health)
			change=battlescript.meta.lose;
			else{
			change=battlescript.meta.win;
			addConfuWin(battlescript.meta.ID);
			}
			changeEvt=0;
		break;
		
		case "pause":
		break;
		
		case "audio":
			renderData.type="audio";
			renderData.command=evt.command;
		break;
		
		case "dialog":
			renderData.type="dialog"
			renderData.progress=progress-EntTime;
			renderData.time=(evt.time-evt.timepadding)/option.speed
			renderData.timepadding=evt.timepadding*option.wait
			renderData.text=handleText(evt.text)
			renderData.color=evt.color
			renderData.override=progress-EntTime<(evt.time-evt.timepadding)/option.speed+evt.timepadding*option.wait
			if(renderData.progress>=renderData.time)
				renderData.skipmode=1;
		break;
		
		case "question":
			renderData.type="question"
			renderData.progress=progress-EntTime;
			renderData.time=evt.time*option.speed
			renderData.arm=evt.arm
			renderData.text=handleText(evt.text)
			renderData.color=evt.color
			renderData.override=true
			if(renderData.progress>=renderData.time)
				renderData.skipmode=1;
		break;
		
		case "resolve":
			renderData.type="resolve"
			renderData.progress=progress-EntTime;
			renderData.time=evt.time*option.speed;
			renderData.arm=evt.arm;
			renderData.player=evt.player;
			renderData.success=evt.success;

		break;
		
		case "unlockAch":
			renderData.type="unlockAch"
			renderData.progress=progress-EntTime;
			renderData.time=4200;
			renderData.ach= evt.ach;
			if(player.achievements.indexOf(evt.ach)>=0 && renderData.progress==0)
				EntTime-=(4200-(progress-EntTime))
			else
			unlockAchievment(evt.ach);
		break;
		
		case "unlockChap":
			renderData.type="unlockChap"			
			unlockChapter(evt.chapter,evt.lesson);
		break;
		
	}
}


function drawHPBar(x,y,current,max,progress){
	context.fillStyle="rgb("+Math.round(100+105*(current/max)+(Math.sin(progress/(2000*(current/max))*2*Math.PI)*40))+",0,"+Math.round(70*(current/max))+")"
	context.fillRect(x+29,y+8,current*67,16)	
	context.fill()
	
	context.drawImage(Assets.img["GUIhpBar"],
		0, 0,
		30,Assets.img["GUIhpBar"].height,		
		x,y,		
		30,Assets.img["GUIhpBar"].height);
	for(var i=0;i<max-1;i++){	
	context.drawImage(Assets.img["GUIhpBar"],
		30, 0,
		68,Assets.img["GUIhpBar"].height,		
		x+30+i*68,y,		
		68,Assets.img["GUIhpBar"].height);
	}
	context.drawImage(Assets.img["GUIhpBar"],
		Assets.img["GUIhpBar"].width-89, 0,
		89,Assets.img["GUIhpBar"].height,		
		x+30+(max-1)*68,y,		
		89,Assets.img["GUIhpBar"].height);
}
function drawBackground(progress){
	

    context.drawImage(Assets.img["background-parallax"],		
		0,0,		
		elem.width,Assets.img["background-parallax"].height/Assets.img["background-parallax"].width*elem.width);
		
	context.drawImage(Assets.img["stars-parallax"],	
		-(progress/45)%elem.width,0,		
		elem.width,Assets.img["background-parallax"].height/Assets.img["background-parallax"].width*elem.width);	
	context.drawImage(Assets.img["stars-parallax"],	
		-(progress/45)%elem.width+elem.width,0,		
		elem.width,Assets.img["background-parallax"].height/Assets.img["background-parallax"].width*elem.width);	
	
	context.drawImage(Assets.img["planets-parallax"],	
		-(progress/33)%elem.width,0,		
		elem.width,Assets.img["background-parallax"].height/Assets.img["background-parallax"].width*elem.width);	
	context.drawImage(Assets.img["planets-parallax"],	
		-(progress/33)%elem.width+elem.width,0,		
		elem.width,Assets.img["background-parallax"].height/Assets.img["background-parallax"].width*elem.width);	

	if(!showplanet)
		{
		showplanet=Math.random()*10000<20;
		scale = Math.random()*2+2;
		position = Math.random();
		variant = Math.round(Math.random()*3)
		}
		
		if(showplanet)
		drawplanet(progress,Assets.img["background-parallax"].height/Assets.img["background-parallax"].width*elem.width)
}

var infots = undefined;
function drawAttackInfo(progress,casterName,attackCategory,attackName){
	var length = 4000;
	if(infots == undefined)
		infots=progress;
	if((progress-infots)/length>1)
		return;
	context.lineWidth=1;
	context.fillStyle="rgba(255,255,255,"+Math.sin((progress-infots)/length*Math.PI)+")";
	context.strokeStyle="rgba(200,200,200,"+0.8*Math.sin((progress-infots)/length*Math.PI)+")";

	context.textBaseline = "top";
	context.textAlign="center"; 
	context.font = "12px Aclonica"
	var scale = Math.sin((progress-infots)/length*Math.PI);
	scale = scale<Math.sin((progress-infots-100)/length*Math.PI)?1:scale;
	
	context.fillText(casterName,elem.width/2,elem.height/2-133);	
	context.strokeText(casterName,elem.width/2,elem.height/2-133);	


	context.fillRect(elem.width/2-scale*elem.width/8, elem.height/2-121,scale*elem.width/4,1.5);
	
	context.font = "14px Aclonica"
	context.fillText(attackCategory,elem.width/2,elem.height/2-117);
	context.strokeText(attackCategory,elem.width/2,elem.height/2-117);

	context.fillText(attackName,elem.width/2,elem.height/2-95);	
	context.strokeText(attackName,elem.width/2,elem.height/2-95);	
	
	context.fillRect(elem.width/2-scale*elem.width/3, elem.height/2-100,scale*elem.width/1.5,1.5);
}
function drawConfutest(progress){
	var frame = Math.floor(progress/90);
	var i = Math.abs(Math.round(Math.sin(frame/16)*9))

	var confY=50+Math.sin(progress/500)*15;
	var confX=(elem.width-(Assets.img["confu"].width/4))/2+Math.cos(progress/290)*4;
	context.lineWidth=1;

    context.drawImage(Assets.img["confu"],
		(frame%4)*Assets.img["confu"].width/4, (Math.floor(frame/4)%2)*Assets.img["confu"].height/2,
		Assets.img["confu"].width/4,Assets.img["confu"].height/2,		
		confX,confY,		
		Assets.img["confu"].width/4,Assets.img["confu"].height/2);
	
	cUtils.imageSmoothing(context,false);
	
	context.drawImage(Assets.img["book"],
		confX+150+Math.cos(progress/270)*9,confY+60-Math.sin(progress/300)*8,
		51,51);
	if(renderData.type=="question")
		switch(renderData.arm){
			default:
			if(renderData.arm != undefined)				
			drawAttackInfo(progress,"Konfuzjusz","AttackCategory",renderData.arm.toUpperCase());
			break;
			
			case "swordspear":
			
				if(renderData.progress<=2000){
					context.setTransform(1, 0, 0, 1, confX+50,confY+100);
					context.rotate(Math.PI*135/180);
					var h =42*renderData.progress/2000;
					context.drawImage(Assets.img["sword"],
					0,42-h,
					86,2+2*h,
					
					-43,-1-h,86,2+2*h);
					context.setTransform(1, 0, 0, 1, 0, 0);
					
					for(var i=0;i<20;i++)
						{
							var parX= confX+50+(Math.random()>0.5?-h-15:h+15)+(1-2*Math.random())
							var parY = confY+100 +10*(1-2*Math.random())
						
							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:400*Math.random(),
								life:0,
								size:15*Math.random(),
								movX:(1-2*Math.random()),
								movY:(-4*Math.random())};
								
							renderData.particles.push(particle);
					}
					
				}else if(renderData.progress<=3000){
					
					context.setTransform(1, 0, 0, 1, confX+50+40*(renderData.progress-2000)/1000,confY+100 -100*(renderData.progress-2000)/1000);
					context.rotate(Math.PI*135/180 + Math.PI/2*(renderData.progress-2000)/1000);
					context.drawImage(Assets.img["sword"],-43,-43,86,86);
					context.setTransform(1, 0, 0, 1, 0, 0);
				}else if(renderData.progress<=3000){
					
					
					context.setTransform(1, 0, 0, 1, confX+90,elem.height-180);
					//context.rotate((Math.PI*20*i/180)*(renderData.progress-3000)/1000);
					context.translate(0 , (confY-(elem.height-180))+15*Math.sin(renderData.progress/250));
					context.rotate((Math.PI*225/180));
					
					context.drawImage(Assets.img["sword"],
						-43,-43,
					86,86);
					context.setTransform(1, 0, 0, 1, 0, 0);
					
				}else if(renderData.progress<=5000){
					
					var h =42-42*(renderData.progress-3000)/2000;
		
					
					context.setTransform(1, 0, 0, 1, confX+90,elem.height-180);
					//context.rotate((Math.PI*20*i/180)*(renderData.progress-3000)/1000);
					context.translate(0 , (confY-(elem.height-180))+15*Math.sin(renderData.progress/250));
					context.rotate((Math.PI*225/180));
					
					context.drawImage(Assets.img["sword"],
					0,86-2*h-2,
					86,2+2*h,
					
					-43,-h,86,2*h);
					context.setTransform(1, 0, 0, 1, 0, 0);
					
					for(var i=0;i<40;i++){
							var parX= confX+90+(15+5*Math.sin(renderData.progress/250))*(1-2*Math.random());
							var parY = confY-20+2*h +(1-2*Math.random())+15*Math.sin(renderData.progress/250);
						
							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:400*Math.random(),
								life:0,
								size:15*Math.random(),
								movX:(1-2*Math.random()),
								movY:(1-2*Math.random())};
								
							renderData.particles.push(particle);
					}
					
				} 
				drawAttackInfo(progress,"Konfuzjusz","Kwantowe Ostrze","Cięcie Plancka");
			break;

			case "sword":
				
				if(renderData.progress<=2000){
					context.setTransform(1, 0, 0, 1, confX+50,confY+100);
					context.rotate(Math.PI*135/180);
					var h =42*renderData.progress/2000;
					context.drawImage(Assets.img["sword"],
					0,42-h,
					86,2+2*h,
					
					-43,-1-h,86,2+2*h);
					context.setTransform(1, 0, 0, 1, 0, 0);
					
					for(var i=0;i<20;i++)
						{
							var parX= confX+50+(Math.random()>0.5?-h-15:h+15)+(1-2*Math.random())
							var parY = confY+100 +10*(1-2*Math.random())
						
							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:400*Math.random(),
								life:0,
								size:15*Math.random(),
								movX:(1-2*Math.random()),
								movY:(-4*Math.random())};
								
							renderData.particles.push(particle);
					}
					
				}else if(renderData.progress<=3000){
					
					context.setTransform(1, 0, 0, 1, confX+50+40*(renderData.progress-2000)/1000,confY+100 -100*(renderData.progress-2000)/1000);
					context.rotate(Math.PI*135/180 + Math.PI/2*(renderData.progress-2000)/1000);
					context.drawImage(Assets.img["sword"],-43,-43,86,86);
					context.setTransform(1, 0, 0, 1, 0, 0);
				}
				else if(renderData.progress<=4000){
					
					for(var i=-2;i<=2;i++){
					
					context.setTransform(1, 0, 0, 1, confX+90,elem.height-180);
					context.rotate((Math.PI*20*i/180)*(renderData.progress-3000)/1000);
					context.translate(0 , (confY-(elem.height-180))+15*Math.sin(renderData.progress/250));
					context.rotate((Math.PI*225/180));
					
					context.drawImage(Assets.img["sword"],
						-43,-43,
					86,86);
					context.setTransform(1, 0, 0, 1, 0, 0);
					}
				} 
				else{
					for(var i=-2;i<=2;i++){
					
					context.setTransform(1, 0, 0, 1, confX+90,elem.height-180);
					context.rotate(Math.PI*20*i/180);
					context.translate(0 , (confY-(elem.height-180)));
					context.rotate((Math.PI*225/180));
					
					context.drawImage(Assets.img["sword"],
						-43,-43,
					86,86);
					context.setTransform(1, 0, 0, 1, 0, 0);
					}
					timeflow=false;
				}
				
				drawAttackInfo(progress,"Konfuzjusz","Kwantowe Ostrze","Pchnięcie Schrödingera");
			break;
			
			case "book":
				if(renderData.progress<=2000){
					for(var i=0;i<10+(20*(renderData.progress/2000));i++)
						{
							var parX =  confX+150+51/2+Math.cos(progress/270)*9+(5+10*(renderData.progress/2000))*(1-2*Math.random());
							var parY = confY+60+51/2-Math.sin(progress/300)*8 + (5+10*(renderData.progress/2000))*(1-2*Math.random()) -50*(renderData.progress/2000);
						
							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:400*Math.random(),
								life:0,
								size:15*Math.random(),
								movX:(1-2*Math.random()),
								movY:(-4*Math.random())};
								
							renderData.particles.push(particle);
					}
				}
				else{
					if(timeflow)
						timeflow=false;					
				}

				drawAttackInfo(progress,"Konfuzjusz","Ukryte Arkana","Zwodzący Płonień");
			break;
			
			case "laser":
				if(renderData.progress<=3000){}
				else if(renderData.progress<=4000){
						var fill = (renderData.progress-3000)/1000;
						context.fillStyle="rgba(255,0,0,"+fill+")";
						context.fillRect(confX+82+(4-(4*fill)),confY+40+(1-fill),6*fill,2*fill);
				
				}
				else
				{
					var fill = 1;
						context.fillStyle="rgba(255,0,0,"+fill+")";
						context.fillRect(confX+82+(4-(4*fill)),confY+40+(1-fill),6*fill,2*fill);
					timeflow=false;
				}

				drawAttackInfo(progress,"Konfuzjusz","Ukryte Arkana","Dezintegrujące  Spojrzenie");
			break;
			
			case "lifesteal":
				
				if(renderData.progress<=2000){
					var scale =renderData.progress/2000;
					for(var i=0;i<10+(60*scale);i++)
						{
							var parX = confX+180+Math.cos(progress/270)*9+Math.cos((progress+50)/450)*3+scale*16*(1-2*Math.random());
							var parY = confY-50+60-Math.sin(progress/300)*8+Math.sin((progress+20)/400)*4+scale*60.5*(1-2*Math.random());							 					
							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:400*Math.random(),
								life:0,
								size:15*Math.random(),
								movX:(1-2*Math.random()),
								movY:(-4*Math.random())};
								
							renderData.particles.push(particle);
					}
					
					for(var i=0;i<10+(60*scale);i++)
					{
						if(Math.random()<0.1){
							var ydispl = scale*16*(1-2*Math.random());
							var xdispl = scale*60.5*(1-2*Math.random());
							var parX = confX+180+Math.cos(progress/270)*9+Math.cos((progress+50)/450)*3;
							var parY = confY-50+60-Math.sin(progress/300)*8+Math.sin((progress+20)/400)*4;							 					
								
							var particle = {
									type:"hpcontainer",
									x:parX+(xdispl)*3,						
									y:parY+(ydispl)*3,
									xdispl:xdispl,
									ydispl:ydispl,
									start:renderData.progress,
									end:200,
									life:0,
									size:Math.round(3+12*Math.random()),
									movX:0.1*(1-2*Math.random())-xdispl/16,
									movY:0.1*(1-2*Math.random())-ydispl/60.5};								
							renderData.particles.push(particle);}
					}
				}
				
				if(renderData.progress>1500){
				if(!renderData.seedTS)
					renderData.seedTS=renderData.progress;
				if(!renderData.seed || (renderData.progress-renderData.seedTS)>250){
					renderData.seed=Math.random();
					renderData.seedTS=renderData.progress;
				}
				Math.seedrandom(renderData.seed);

				context.setTransform(1, 0, 0, 1, confX+180+Math.cos(progress/270)*9+Math.cos((progress+50)/450)*3,confY-50+60-Math.sin(progress/300)*8+Math.sin((progress+20)/400)*4);
				context.rotate(Math.PI/2+Math.PI/24*Math.sin(2*Math.PI/4000*renderData.progress));
				context.drawImage(Assets.img["hpcontiner"],
				-60.5,-16,
				121,32);
				var lb = 2+3*Math.random()
				for(var l=0;l<lb && renderData.progress-1500<6000;l++){
				cUtils.drawLBolt(context,[280,120*(1-2*Math.random())],[60.5,0],15,
				[[230,230,255,1],[130,130,255,1],[80,80,100,0.1],[0,0,0,0]], [0.1,0.95,1],-(renderData.progress-renderData.seedTS)/250,4);
				}
				context.fillStyle="rgb("+
				Math.round(100+105*(boss.health/boss.healthMax)+(Math.sin(progress/(2000*(boss.health/boss.healthMax))*2*Math.PI)*40))
				+",0,"+Math.round(70*(boss.health/boss.healthMax))+")";
				
				context.fillRect(29+3-63*(renderData.progress-1500<6000?((renderData.progress-1500)/6000):1),-16+8,63*((renderData.progress-1500)<6000?((renderData.progress-1500)/6000):1),16);
				context.setTransform(1, 0, 0, 1, 0, 0);
				}
				drawAttackInfo(progress,"Konfuzjusz","Ukryte Arkana","Wampiryczny Piorun");
			break;
			
			case "robot":
				if(!renderData.released)
				{
					console.log("release the bots");
					//orbbot 1
					var parX = confX+56;
					var parY = confY+62;
					
					var particle = {
						type:"orbbot",
						id:0,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:-5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 2
					var parX = confX+100;
					var parY = confY+62;
					
					var particle = {
						type:"orbbot",
						id:1,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 3
					var parX = confX+90;
					var parY = confY+42;
					
					var particle = {
						type:"orbbot",
						id:2,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 4
					var parX = confX+66;
					var parY = confY+42;
					
					var particle = {
						type:"orbbot",
						id:3,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:-5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 5
					var parX = confX+90;
					var parY = confY+42;
					
					var particle = {
						type:"orbbot",
						id:4,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 6
					var parX = confX+66;
					var parY = confY+42;
					
					var particle = {
						type:"orbbot",
						id:5,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:-5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 7
					var parX = confX+90;
					var parY = confY+42;
					
					var particle = {
						type:"orbbot",
						id:6,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					//orbbot 8
					var parX = confX+66;
					var parY = confY+42;
					
					var particle = {
						type:"orbbot",
						id:7,
						x:parX,						
						y:parY,
						start:renderData.progress,
						end:1000,
						life:0,
						movX:-5*Math.random(),
						movY:-20*Math.random()};
						
					renderData.particles.push(particle);
					
					renderData.released=true;
				}
				if(renderData.progress>5000)
					renderData.stoptime=true;
			break;
			
			case "bombardment":
				drawAttackInfo(progress,"Konfuzjusz","Mroczne Automatony","Bombardowanie Orbitalne");
				if(renderData.progress>5000)
					timeflow=false;

			break;
		}
	
	if(renderData.type=="resolve")
	{	
		switch(renderData.arm){

			case "sword":

				if(renderData.success){
					if(renderData.progress<=200){
						timeflow=true;
						timeflowtimestamp=undefined;

					for(var i=-2;i<=2;i++){
							context.setTransform(1, 0, 0, 1, confX+90,elem.height-180);
							context.rotate(Math.PI*20*i/180);
							context.translate(0 , (confY-(elem.height-180))*(1-(renderData.progress/700)));
							context.rotate((Math.PI*225/180));
						
							context.drawImage(Assets.img["sword"],
								-43,-43,
							86,86);
							context.setTransform(1, 0, 0, 1, 0, 0);
					}
					}
					if(renderData.progress<=300){
					
					for(var i=0;i<50;i++)
					{
							var sword = Math.round(-2+5*Math.random());
							
							var dist = (confY-(elem.height-180))*(1-(200/700));
							var arc = Math.PI/2+(Math.PI*20*sword/180)
							var parX = confX + 90 +Math.cos(arc)*dist + 30*(1-2*Math.random());
							var parY = elem.height-180+Math.sin(arc)*dist  +30*(1-2*Math.random());

							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:600*Math.random(),
								life:0,
								size:15*Math.random(),
								movX: 3*(confX + 90 +Math.cos(arc)*dist -parX)/30,
								movY: 3*(elem.height-180+Math.sin(arc)*dist -parY)/30};
								
							renderData.particles.push(particle);
					}
					
					}
				}
				
				else{
				
					if(renderData.progress<=700){
						timeflow=true;
						timeflowtimestamp=undefined;

						for(var i=-2;i<=2;i++){
							context.setTransform(1, 0, 0, 1, confX+90,elem.height-180);
							context.rotate(Math.PI*20*i/180);
							context.translate(0 , (confY-(elem.height-180))*(1-(renderData.progress/700)));
							context.rotate((Math.PI*225/180));
						
							context.drawImage(Assets.img["sword"],
								-43,-43,
							86,86);
							context.setTransform(1, 0, 0, 1, 0, 0);
						}
					}else if(renderData.progress<=1000)
					{
						for(var i=0;i<50;i++)
						{
							var parX = confX + 90 + 30*(1-2*Math.random());
							var parY = elem.height-180 +30*(1-2*Math.random());

							var particle = {
								type:"magicsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:600*Math.random(),
								life:0,
								size:15*Math.random(),
								movX: 3*((confX + 90)- parX)/30,
								movY: 3*((elem.height-180)- parY)/30};
								
							renderData.particles.push(particle);
						}
					}
				}
			break;
			
			case "book":
			if(renderData.success){
				if(renderData.progress<=200){
						timeflow=true;
						timeflowtimestamp=undefined;
				}
			}
			else{
				if(renderData.progress<=200){
						timeflow=true;
						timeflowtimestamp=undefined;
						if(!renderData.released)
						{
							for(var i=0;i<5+3*Math.random();i++)
							{
							
							var parX =  confX+150+51/2+Math.cos(progress/270)*9;
							var parY = confY+60+51/2-Math.sin(progress/300)*8;
						
							var particle = {
								type:"magicbolt",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:1000,
								life:0,
								movX:10*(1-3*Math.random()),
								movY:(-20*Math.random())};
								
							renderData.particles.push(particle);
							}
							renderData.released=true;
						}

				}
			}
			break;
			case "robot":
				if(renderData.progress<=500){
					timeflow=true;
					timeflowtimestamp=undefined;
				}else if(!renderData.beginFinish)
					renderData.beginFinish=true;
			break;
			case "laser":								
				if(!renderData.success){
					timeflow=true;
					timeflowtimestamp=undefined;
					
					context.fillStyle="rgba(255,0,0,1)";
					if(renderData.progress<=1500)
					{		
						var fill = (renderData.progress)/1500;			
						context.fillRect(confX+82,confY+40,6,2);
						
						context.setTransform(1, 0, 0, 1, confX+82+4,confY+40+1);
						context.rotate((Math.PI*fill));
						context.fillRect(0,-4/3,600,2);
						context.setTransform(1, 0, 0, 1, 0, 0);
						
							var parY = elem.height-180+3*(1-2*Math.random())
							var dist = parY-(confY+40*4/3);
				
							var xoffset = Math.sin(Math.PI/2-Math.PI*fill)*dist;
							var parX=confX+82*4/3+xoffset+(1-2*Math.random())
						for(var p=0;p<3;p++)	
						if(parX>=((elem.width-(2*28+boss.heroHpMax*67-4))/2) && parX<=((elem.width+(2*28+boss.heroHpMax*67-4))/2)){	
						var particle = {
							type:"magicsmoke",
							x:parX,
							
							y:parY,
							start:renderData.progress,
							end:1200*Math.random(),
							life:0,
							size:20,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())}
						renderData.particles.push(particle);}

					}
				}
				else if(!renderData.exploded)
				{
					timeflow=true;
					timeflowtimestamp=undefined;
					renderData.exploded=true
					var smk = {
						
						type:"explosion",
						smoketype:"magicsmoke",
						x:confX+82+3,						
						y:confY+40+1,
						start:renderData.progress,
						end:200+200*Math.random(),
						life:0,
						size:2
					};

					renderData.particles.push(smk);
				}
			break;
			case "lifesteal":	
				if(renderData.progress<=500){
					timeflow=true;
					timeflowtimestamp=undefined;
				}	
				if(renderData.success){
					if(renderData.progress<=1700)
					{
					context.setTransform(1, 0, 0, 1, confX+180+Math.cos(progress/270)*9+Math.cos((progress+50)/450)*3,confY-50+60-Math.sin(progress/300)*8+Math.sin((progress+20)/400)*4);
					context.rotate(Math.PI/2+Math.PI/24*Math.sin(2*Math.PI/4000*renderData.progress));
					context.drawImage(Assets.img["hpcontiner"],
					-60.5,-16,
					121,32);				
					context.fillStyle="rgb("+
					Math.round(100+105*(boss.health/boss.healthMax)+(Math.sin(progress/(2000*(boss.health/boss.healthMax))*2*Math.PI)*40))
					+",0,"+Math.round(70*(boss.health/boss.healthMax))+")";
					
					context.fillRect(29+3-63,-16+8,63,16);
					context.setTransform(1, 0, 0, 1, 0, 0);
					}
					
					if(renderData.progress>=1500 && renderData.progress<=2000){
						var scale =(renderData.progress-1500)/500;
						for(var i=0;i<10+(60*scale);i++)
							{
								var xdispl = scale*16*(1-2*Math.random());
								var ydispl = scale*60.5*(1-2*Math.random());
								var parX = confX+180+Math.cos(progress/270)*9+Math.cos((progress+50)/450)*3;
								var parY = confY-50+60-Math.sin(progress/300)*8+Math.sin((progress+20)/400)*4;							 					
								var particle = {
									type:"healthsmoke",
									x:parX+xdispl,						
									y:parY+ydispl,
									start:renderData.progress,
									end:1000,
									life:0,
									lifepercent:(boss.health/boss.healthMax)+0.1*(1-2*Math.random()),
									size:2*Math.random(),
									movX:0.1*(1-2*Math.random())+xdispl/16,
									movY:0.1*(1-2*Math.random())+ydispl/60.5};								
							renderData.particles.push(particle);
							if(Math.random()<0.1){
							var particle = {
									type:"hpcontainer",
									x:parX+xdispl,						
									y:parY+ydispl,
									xdispl:xdispl,
									ydispl:ydispl,
									start:renderData.progress,
									end:2000,
									life:0,
									size:Math.round(3+12*Math.random()),
									movX:0.1*(1-2*Math.random())+xdispl/16,
									movY:0.1*(1-2*Math.random())+ydispl/60.5};								
							renderData.particles.push(particle);}
						}
					}
				}
				else{
					context.setTransform(1, 0, 0, 1, confX+180+Math.cos(progress/270)*9+Math.cos((progress+50)/450)*3,confY-50+60-Math.sin(progress/300)*8+Math.sin((progress+20)/400)*4);
					context.rotate(Math.PI/2+Math.PI/24*Math.sin(2*Math.PI/4000*renderData.progress));
					context.drawImage(Assets.img["hpcontiner"],
					-60.5,-16,
					121,32);				
					context.fillStyle="rgb("+
					Math.round(100+105*(boss.health/boss.healthMax)+(Math.sin(progress/(2000*(boss.health/boss.healthMax))*2*Math.PI)*40))
					+",0,"+Math.round(70*(boss.health/boss.healthMax))+")";
					if(renderData.progress<2000){
					var l = Math.max(0,63-renderData.progress/2000*63);
					context.fillRect(29+3-l,-16+8,l,16);
					if(!renderData.seedTS)
					renderData.seedTS=renderData.progress;
					if(!renderData.seed || (renderData.progress-renderData.seedTS)>250){
						renderData.seed=Math.random();
						renderData.seedTS=renderData.progress;
					}
					Math.seedrandom(renderData.seed);

			
					var lb = 2+3*Math.random()
					for(var l=0;l<lb && renderData.progress-1500<6000;l++){
					cUtils.drawLBolt(context,[60.5,0],[-40,100+120*(1-2*Math.random())],15,
					[[230,230,255,1],[130,130,255,1],[80,80,100,0.1],[0,0,0,0]], [0.1,0.95,1],-(renderData.progress-renderData.seedTS)/250,4);
					}
					}	
					
					context.setTransform(1, 0, 0, 1, 0, 0);
				}
			
			break;
			case "bombardment":
				if(renderData.progress<=500){
					timeflow=true;
					timeflowtimestamp=undefined;
				}
				var l = 8;
				if(renderData.bomb == undefined)
					renderData.bomb = -1;
				for(var i=0;i<l;i++)
				{					
					if(renderData.progress>(4000/l)*i && renderData.bomb == (i-1))
					{
						renderData.bomb++;
						console.log("Bombs"+i);

						var particle = {
						x:confX+100,
						y:confY+62,
						type:"missile",
						tx :elem.width/2 -   ((2*28+boss.heroHpMax*67-4)/2)/l*(l-(i+1)),						
						ty: elem.height-165,
						start:renderData.progress,
						end:200,
						life:0,
						movX:6*Math.random(),
						movY:-20-20*Math.random()};
						
						renderData.particles.push(particle);
						
						var particle = {
						x:confX+56,
						y:confY+62,
						type:"missile",
						tx:(elem.width/2) + ((2*28+boss.heroHpMax*67-4)/2)/l*(l-(i+1)),						
						ty:elem.height-165,
						start:renderData.progress,
						end:200,
						life:0,
						movX:-6*Math.random(),
						movY:-20-20*Math.random()};
						
						renderData.particles.push(particle);
					}
				}
			break;
			case "swordspear":
				
				if(renderData.progress<=500){
					timeflow=true;
					timeflowtimestamp=undefined;
				}
				if(renderData.swordNumber== undefined)
					renderData.swordNumber=Math.floor(2+4*Math.random());
				if(renderData.swordRot == undefined)
				{
					renderData.swordRot=[];
					renderData.swordRot[0]=Math.PI/4*(1-2*Math.random());
					for(var i=1;i<renderData.swordNumber;i++){
						renderData.swordRot[i]=renderData.swordRot[i-1]+Math.PI/6*(1-0.8*Math.random())*(Math.random()>0.5?-1:1);
						
						if(renderData.swordRot[i]<-Math.PI/3)
							renderData.swordRot[i]=renderData.swordRot[i-1]+Math.PI/6*(1-0.8*Math.random());
					
						if(renderData.swordRot[i]>Math.PI/3)
							renderData.swordRot[i]=renderData.swordRot[i-1]-Math.PI/6*(1-0.8*Math.random());
	
					}
					renderData.swordRot.sort();
					for(var i=1;i<renderData.swordNumber;i++){
						if(renderData.swordRot[i]==renderData.swordRot[i-1])
							renderData.swordRot[i]+=Math.PI/12*(1-2*Math.random())
					}
					var n = 4+5*Math.random();
					for(var i=0;i<n;i++)
					{
						var a1 = Math.round((renderData.swordRot.length-1)*Math.random());
						var a2 = Math.round((renderData.swordRot.length-1)*Math.random());
						var t = renderData.swordRot[a1];
						renderData.swordRot[a1] = renderData.swordRot[a2];
						renderData.swordRot[a2] = t;
					}
				}
				
				for(var i=0;i<renderData.swordNumber;i++){
	
					
					if(!renderData.success){
						var Yshift=200;
						if(renderData.progress<=500+i*400)
							Yshift=200/500*(renderData.progress-i*400);
						context.setTransform(1, 0, 0, 1,
							elem.width/2   + (200-Yshift)*Math.cos(Math.PI/2+renderData.swordRot[i]),
							elem.height-180+ (200-Yshift)*Math.sin(Math.PI/2+renderData.swordRot[i]));
						context.rotate(Math.PI*135/180 - Math.PI/2 + renderData.swordRot[i]);
						context.drawImage(Assets.img["sword"],-43,-43,86,86);
						context.setTransform(1, 0, 0, 1, 0, 0);
						
					}else{
						var Yshift=200;
						if(renderData.progress<=500+i*400)
							Yshift=200/500*(renderData.progress-i*400);
						context.setTransform(1, 0, 0, 1,
							elem.width/2 - (200-Yshift)*Math.cos(Math.PI/2+renderData.swordRot[i]),
							50 - (200-Yshift)*Math.sin(Math.PI/2+renderData.swordRot[i]));
						context.rotate(Math.PI*135/180 + Math.PI/2+ renderData.swordRot[i]);
						context.drawImage(Assets.img["sword"],-43,-43,86,86);
						context.setTransform(1, 0, 0, 1, 0, 0);			
					}
					
					if(500 + (renderData.progress - renderData.time)>0)
					{
						for(var p=0;p<20;p++){
							var l = Math.random()*(!renderData.success?1:-1);
							var str =(1-2*Math.random());
						var particle = {
									type:"magicsmoke",
									x:elem.width/2 - l*Yshift/200*70*Math.cos(Math.PI/2+renderData.swordRot[i]),						
									y:(renderData.success?50:elem.height-170) -  l*Yshift/200*70*Math.sin(Math.PI/2+renderData.swordRot[i]),
									start:renderData.progress,
									end:1000,
									life:0,
									size:2*Math.random(),
									movX:Math.cos(renderData.swordRot[i])*0.25*str,
									movY:Math.sin(renderData.swordRot[i])*0.25*str};
		
						renderData.particles.push(particle);}
					}
					
					if(renderData.progress>=450+i*400 && renderData.progress<=600+i*400)
						for(var p=0;p<10;p++){
							var l = Math.random()*(!renderData.success?1:-1);
							var str =(1-2*Math.random());
						var particle = {
									type:"healthsmoke",
									x:elem.width/2 - l*Yshift/200*70*Math.cos(Math.PI/2+renderData.swordRot[i]),						
									y:(renderData.success?50:elem.height-170) -  l*Yshift/200*70*Math.sin(Math.PI/2+renderData.swordRot[i]),
									start:renderData.progress,
									end:1000,
									life:0,
									lifepercent:(boss.health/boss.healthMax)+0.1*(1-2*Math.random()),
									size:2*Math.random(),
									movX:Math.cos(renderData.swordRot[i])*1.25*str,
									movY:Math.sin(renderData.swordRot[i])*1.25*str + 1.3*(renderData.success?1:-1)};
									
					renderData.particles.push(particle);}
				}
			break;
		}
		if(renderData.success)
		switch(renderData.player){
			default:
				if(renderData.progress>1000)
					drawAttackInfo(progress,handleText("[playerName]"),"Argument",renderData.player.toUpperCase());
			break;
			case "none":
			break;
			case "demon":
				if(renderData.progress>1000){
					drawAttackInfo(progress,handleText("[playerName]"),"Złośliwy demon","Demon Kartezjusza");

					//animate shielding effects
					for(var p=0;p<10;p++)
					{
						var distX  =  5*Math.sin(2*Math.PI*(renderData.progress-3800)/1000)+10+ ((2*28+boss.heroHpMax*67-4)/2+10)*((renderData.progress<2000)?(renderData.progress-1000)/1000:1);
						var distY =  5*Math.sin(2*Math.PI*(renderData.progress-3800)/1000)+10+ (0.5+0.5*Math.random())*60*((renderData.progress<2000)?(renderData.progress-1000)/1000:1);
						var arc = Math.PI*2* Math.random();
						
						var particle = {
							x:elem.width/2 + Math.cos(arc)*distX,
							y:elem.height-165 + Math.sin(arc)*distY,
							type:"shieldsmoke",
							start:renderData.progress,
							size: Math.random(),
							end:900*((renderData.progress<2000)?(renderData.progress-1000)/1000:1),
							life:0,
							movX:-Math.cos(arc),
							movY:-Math.sin(arc)};
							
						renderData.particles.push(particle);
					}
					
					//animate destruction wave
					if(renderData.progress>4000 && renderData.progress<6000)
					for(var p=0;p<40;p++)
					{
						var pov =2;
						var distX  =elem.width/2*(renderData.progress-3800)/2000;
						var distY =(elem.height-100)*(renderData.progress-3800)/2000;
						var arc = Math.PI*2* Math.random();
						var particle = {
							x:elem.width/2 + Math.cos(arc)*distX + (1-2*Math.random())*(pov/2),
							y:elem.height-180 + -Math.abs(Math.sin(arc)*distY) + (1-2*Math.random())*(pov/2),
							type:"explosionsmoke",
							start:renderData.progress,
							size: 5+15*Math.random(),
							end:1500*Math.random(),
							life:0,
							movX:-Math.cos(arc)*pov,
							movY:Math.abs(Math.sin(arc)*pov)};
							
						renderData.particles.push(particle);
					}
				}
			break;
			case "russell":
				if(renderData.progress>1000 )
					drawAttackInfo(progress,handleText("[playerName]"),"Wiedza Bezpośrednia","Fundament Russella");
				if(renderData.progress>4000 && renderData.progress<5000 && Math.random()<0.15 ){
					
				//var pov = Math.abs(particle.ty-(elem.height-200))/2;
				var x = elem.width/2 + 100*(1-2* Math.random())
				/*var arc = Math.PI/2 + Math.atan(			
				(confY-(elem.height-200))/
				-(confX-x)
				);*/
				
				var particle = {
					type:"bottle",
					x:x,
					y:elem.height-200,
					tx:confX+100+10*(1-2* Math.random()),
					ty:confY+50+10*(1-2* Math.random()),
					start:renderData.progress,
					color:Math.round(4*Math.random()),
					size: 5+15*Math.random(),
					end:1500*Math.random(),
					life:0,
					rotSpeed:1.5*(1-2* Math.random()),
					movX:((confX+44.5*4/3)-x)/2,
					movY: -Math.abs(confY+50-(elem.height-200))*5};
					
				renderData.particles.push(particle);
				
				}
			break;
			case "james":
				if(renderData.progress>1000 )
					drawAttackInfo(progress,handleText("[playerName]"),"Doświadczenie religijne","Doświadczenie Jamesa");
				//Angel missileo
				if(renderData.progress>4000 && renderData.progress<5000){
					context.setTransform(1, 0, 0, 1, confX+82+4,elem.height-200 - (elem.height-200-confY)*((renderData.progress-4000)/1000));
					context.rotate((Math.PI*225/180));
					context.rotate(-Math.PI);					
					context.drawImage(Assets.img["jamesSword"],
					-17*4/3,-17*4/3,
					34*4/3,34*4/3);
					
					context.setTransform(1, 0, 0, 1, 0, 0);
					context.setTransform(1, 0, 0, 1, confX+82+4,elem.height-200 - (elem.height-200-confY)*((renderData.progress-4000)/1000));
					
					context.drawImage(Assets.img["jamesAngel0"],
					-17 + 40*Math.sin(Math.PI*2*((renderData.progress-4000)/1000)),-17,
					34,34);
					
					context.drawImage(Assets.img["jamesAngel1"],
					-17 - 40*Math.sin(Math.PI*2*((renderData.progress-4000)/1000)),-17,
					34,34);
					context.setTransform(1, 0, 0, 1, 0, 0);
					var boost = 5*Math.random()
					if(elem.height-200 - (elem.height-200-confY)*((renderData.progress-4000)/1000)<confY+150)
					{
						boost+= 20+10*Math.random();
						var particle = {
							x:confX+82+4+40*(1-2*Math.random()),
							y:elem.height-200 - (elem.height-200-confY)*((renderData.progress-4000)/1000)+40*(1-2*Math.random()),
							type:"explosion",
							smoketype:"explosionsmoke",
							start:renderData.progress,
							size: 5*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())};
							
						renderData.particles.push(particle);						
					
					}
					for(var p=0;p<10+boost;p++){			
						var side = (Math.random()>0.5)?-1:1;
						var particle = {
							x:confX+82+4
							+ side*40*Math.sin(Math.PI*2*((renderData.progress-4000)/1000)),
							y:elem.height-200 - (elem.height-200-confY)*((renderData.progress-4000)/1000),
							type:"magicsmoke",
							start:renderData.progress,
							size: 2*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:1.5+Math.random()};
							
						renderData.particles.push(particle);						
					}

				}
			break;
			case "hawking":
				if(renderData.progress>1000 )
					drawAttackInfo(progress,handleText("[playerName]"),"Koniec czasu","Tornado Czasoprzestrzeni");
				if(renderData.progress>3000 && renderData.progress<5000){
					context.setTransform(1, 0, 0, 1, elem.width/2,elem.height-130-50*((renderData.progress-2000)/1500));
					context.rotate((Math.PI*225/180));
					context.rotate(-Math.PI);					
					context.drawImage(Assets.img["hawking5"],
					-17*4/3,-17*4/3,
					34*4/3,34*4/3);		
					context.setTransform(1, 0, 0, 1, 0, 0);
				}
				if(renderData.progress>4000 && renderData.progress<6000){
					
					

					for(var p=0;p<30+60*((renderData.progress-4000)/1000);p++){
						var parY = Math.random()*(elem.height-200-confY)*((renderData.progress-4000)/1000)						
						var parX = (1-2*Math.random())*100*(parY/(elem.height-200-confY))
						var particle = {
							x:confX+82+4 + parX,
							y:elem.height-180 - parY,
							type:"spacetimefabric",
							start:renderData.progress,
							size: 15+5*Math.random(),
							end:250+250*Math.random(),
							life:40+250*Math.random(),
							movX:2*(parX/100),
							movY:2*(parY/(elem.height-200-confY))};
							
						renderData.particles.push(particle);						
					}
				}
			break;
			
			case "popper":
				if(renderData.progress>1000)
					drawAttackInfo(progress,handleText("[playerName]"),"Solidna nauka","Falsyfikator Poppera");
				
				if(renderData.progress>3400 && renderData.progress<3500 || renderData.progress>5900 && renderData.progress<6000)
				{
						var particle = {
							x:elem.width/2,
							y:elem.height-200,
							type:"explosion",
							smoketype:"magicsmoke",
							start:renderData.progress,
							size: 5*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())};
							
						renderData.particles.push(particle);						
				}
				if(renderData.progress>3500){	
					
					context.setTransform(1, 0, 0, 1, elem.width/2+Math.sin(progress/500)*6,elem.height-200+Math.cos(progress/290)*6);
					context.rotate((Math.PI*225/180));
					context.rotate(-Math.PI);					
					context.drawImage(Assets.img["popper5"],
					-17*4/3,-17*4/3,
					34*4/3,34*4/3);		
					context.setTransform(1, 0, 0, 1, 0, 0);
					if(renderData.progress>4000)
					{
						potionColor =[255,0,0,0.9];

						var color = cUtils.colorGradients([potionColor,[potionColor[0]*0.5,potionColor[1]*0.5,potionColor[2]*0.3,0.2],potionColor], [0.5,1],Math.pow(Math.cos(progress/290),2))		
						context.fillStyle="rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
						context.beginPath();
						context.moveTo(elem.width/2+Math.sin(progress/500)*6,elem.height-200+Math.cos(progress/290)*6-17*4/3);
						context.lineTo(elem.width/2-Math.sin(progress/500)*30,confY+Assets.img["confu"].height/8);
						context.lineTo(elem.width/2-Math.sin(progress/500)*20,confY+Assets.img["confu"].height/8-10);
						context.lineTo(elem.width/2+Math.sin(progress/500)*20,confY+Assets.img["confu"].height/8-10);
						context.lineTo(elem.width/2+Math.sin(progress/500)*30,confY+Assets.img["confu"].height/8);
						context.closePath();
						context.fill();
						context.beginPath();
						
						var particle = {
							x:elem.width/2+30*(1-2*Math.random()),
							y:confY+Assets.img["confu"].height/8+30*(1-2*Math.random()),
							type:"explosion",
							smoketype:"explosionsmoke",
							start:renderData.progress,
							size: 5*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())};
							
						renderData.particles.push(particle);	
						
					}
					
				}
				if(renderData.progress>3675){
					context.setTransform(1, 0, 0, 1, elem.width/2-200+Math.sin(progress/500)*6,elem.height-250+Math.cos(progress/290)*6);
					//context.rotate((Math.PI*225/180));
					//context.rotate(-Math.PI);					
					context.drawImage(Assets.img["popperpaper"],
					-17*4/3,-17*4/3,
					34*4/3,34*4/3);		
					context.translate(2+((renderData.progress-3675)/700*20%20),-15+Math.floor((renderData.progress-3675)/700)*5+Math.sin(progress/40)*4);
					context.drawImage(Assets.img["popperwriter"],
					-17,-17,
					34,34);		
					context.setTransform(1, 0, 0, 1, 0, 0);
				}
				if(renderData.progress>3650 && renderData.progress<3700 || renderData.progress>5900 && renderData.progress<6000){
						var particle = {
							x:elem.width/2-200,
							y:elem.height-250,
							type:"explosion",
							smoketype:"magicsmoke",
							start:renderData.progress,
							size: 5*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())};
							
						renderData.particles.push(particle);	
						
						var particle = {
							x:elem.width/2-195,
							y:elem.height-260,
							type:"explosion",
							smoketype:"magicsmoke",
							start:renderData.progress,
							size: 5*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())};
							
						renderData.particles.push(particle);
				}
				/*if(renderData.progress>4000 && renderData.progress<6000){
					for(var p=0;p<30+100*((renderData.progress-4000)/1000);p++){	
						var parY = Math.random()*(elem.height-200-confY)*((renderData.progress-4000)/1000)
						var particle = {
							x:confX+82+4
							+ (1-2*Math.random())*100*(parY/(elem.height-200-confY)),
							y:elem.height-180 - parY,
							type:"spacetimefabric",
							start:renderData.progress,
							size: 15+5*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:(1-2*Math.random())};
							
						renderData.particles.push(particle);						
					}
				}*/
			break;
			
			case "arysto":
				if(renderData.progress>1000)
					drawAttackInfo(progress,handleText("[playerName]"),"Pierwszy Poruszyciel","Młot Pierwszej Przyczyny");
				
				if(renderData.missliecount == undefined)
					renderData.missliecount=0;
				if(renderData.progress>3000){
					context.setTransform(1, 0, 0, 1,
						elem.width/2+Math.sin(progress/500)*6,
						elem.height-200+Math.cos(progress/290)*6
					);
					
					context.rotate((Math.PI*225/180));
					context.rotate(-Math.PI);					
					context.drawImage(Assets.img["arysto"],
					-17*4/3,-17*4/3,
					34*4/3,34*4/3);		
					context.setTransform(1, 0, 0, 1, 0, 0);
				}
				if(renderData.progress>3400+renderData.missliecount*300 
				&& renderData.progress<3500+renderData.missliecount*300)
				{
					renderData.missliecount++;
					var particle = {
						x:elem.width/2,
						y:elem.height-220,
						type:"magicboltt",
						tx:confX+66,						
						ty:confY+62,
						start:renderData.progress,
						end:200,
						life:0,
						movX:6*(1-2*Math.random()),
						movY:6*(1-2*Math.random())};
						
					renderData.particles.push(particle);
					
				}
			
			break;
			case "akwinata":
				if(renderData.progress>1000)
					drawAttackInfo(progress,handleText("[playerName]"),"Pięć dróg","Droga Tomasza");
				
				if(renderData.progress>2000)	
				for(var i=0;i<5;i++){
					var pow =25+2*Math.cos((renderData.progress-3000)/200);
					var arc = 2*Math.PI/5*i + 2*Math.PI*(renderData.progress-3000)/4000;
					if(renderData.progress>(2000+100*i)){
					var particle = {
						x:elem.width/2 + (1-2*Math.random()) + pow*Math.cos(arc),
						y:elem.height-220 + (1-2*Math.random()) + pow*Math.sin(arc),
						type:"potionsmoke",
						color:i,
						start:renderData.progress,
						end:200,
						size:40+5*Math.random(),
						life:0,
						movX:(1-2*Math.random()),
						movY:(1-2*Math.random())};
						
					renderData.particles.push(particle);
					}
				}
				
				if(renderData.progress>2500){
					var pow =25+2*Math.cos((renderData.progress-2500)/200);					
					var particle = {
						x:elem.width/2 + (1-2*Math.random()) + pow*Math.cos(6*Math.PI/5),
						y:elem.height-220 + (1-2*Math.random()) + pow*Math.sin(6*Math.PI/5) - 50*(renderData.progress-2500)/1000,
						type:"potionsmoke",
						color:3,
						start:renderData.progress,
						end:200,
						size:40+5*Math.random(),
						life:0,
						movX:(1-2*Math.random()),
						movY:(1-2*Math.random())};
					particle.y= particle.y<elem.height/2?elem.height/2:particle.y;
					var px = particle.x + 1000*Math.cos(-Math.PI/2+Math.PI/4*Math.sin(2*Math.PI*(renderData.progress-2500)/2000));
					var py = particle.y + 300*Math.sin(-Math.PI/2+Math.PI/4*Math.sin(2*Math.PI*(renderData.progress-2500)/2000));
					px = (px<0)?0:((px>elem.width)?elem.width :px);
					py = (py<0)?0:((py>elem.height)?elem.height:py);
					context.beginPath();
					context.lineWidth=3;
					context.strokeStyle="red";
					context.moveTo(particle.x,particle.y);
					context.lineTo(px,py);
					context.closePath();
					context.stroke();
					context.beginPath();
					
					renderData.particles.push(particle);
					for(var i=0;i<15;i++){
					var particle = {
							x:px,
							y:py,
							type:"magicsmoke",
							start:renderData.progress,
							size: 2*Math.random(),
							end:500,
							life:0,
							movX:(1-2*Math.random()),
							movY:1.5+Math.random()};							
					renderData.particles.push(particle);
					}			
				}
			break;
		}
	}
}
function select(id){
		if(battlescript.scenes[currentscene].options[id].consequence != undefined)
		{
			if(battlescript.scenes[currentscene].options[id].consequence.bosshp)
			{

				boss.health += battlescript.scenes[currentscene].options[id].consequence.bosshp
				
				for(var i=0;i<100;i++)
				{
							var parY = 20+Assets.img["GUIhpBar"].height/2 +Assets.img["GUIhpBar"].height/2*(1-2*Math.random())
							var parX=	30+(boss.health-1
							-(battlescript.scenes[currentscene].options[id].consequence.bosshp>0?0:battlescript.scenes[currentscene].options[id].consequence.bosshp)
							)*67+33+(elem.width-(2*28+boss.healthMax*67-4))/2+33*(1-2*Math.random())
							var particle = {
								type:"healthsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:1000,
								life:0,
								lifepercent:(boss.health/boss.healthMax)+0.1*(1-2*Math.random()),
								size:2*Math.random(),
								movX:0.1*(1-2*Math.random()),
								movY:0.1*(1-2*Math.random())};
								
							renderData.particles.push(particle);
				}
			}
			if(battlescript.scenes[currentscene].options[id].consequence.herohp)
			{
				boss.heroHp += battlescript.scenes[currentscene].options[id].consequence.herohp
				if(boss.heroHp>boss.heroHpMax){
					battlescript.scenes[currentscene].options[id].consequence.herohp-=boss.heroHp-boss.heroHpMax
					boss.heroHp=boss.heroHpMax
				}
				for(var i=0;i<100;i++)
				{
							var parY = elem.height-180+Assets.img["GUIhpBar"].height/2 +Assets.img["GUIhpBar"].height/2*(1-2*Math.random())
							var parX=	30+(boss.heroHp-1
							-(battlescript.scenes[currentscene].options[id].consequence.herohp>0?0:battlescript.scenes[currentscene].options[id].consequence.herohp)
							)*67+33+(elem.width-(2*28+boss.heroHpMax*67-4))/2+33*(1-2*Math.random())
							var particle = {
								type:"healthsmoke",
								x:parX,						
								y:parY,
								start:renderData.progress,
								end:1000,
								life:0,
								lifepercent:(boss.heroHp/boss.heroHpMax)+0.1*(1-2*Math.random()),
								size:2*Math.random(),
								movX:0.1*(1-2*Math.random()),
								movY:0.1*(1-2*Math.random())};
								
							renderData.particles.push(particle);
				}
			}
			mouse.buttons = 0;
		}
	change=battlescript.scenes[currentscene].options[id].target
}



var showplanet = false;
var planetshown = null;
var scale  = 1;
var position =0;
var variant =1;
function drawplanet(progress,hei){
	var traveltime = (17000/scale);

	if (!planetshown) planetshown = progress;
	
	if(planetshown+traveltime<=progress)
	{
		planetshown=null;
		showplanet=false;
		return
	}
	context.drawImage(	Assets.img["planet"+variant],
	
		-((progress-planetshown)/traveltime)*(elem.width+Assets.img["planet"+variant].width*scale)+elem.width,position*(hei-Assets.img["planet"+variant].width*scale),		
			Assets.img["planet"+variant].width*scale,
			Assets.img["planet"+variant].height*scale);	
}

		
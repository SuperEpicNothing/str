var elem1 = document.getElementById("guiPlayerMain");
	setTimeout(addMouseListener,2000,elem1,gpmsc);
	setTimeout(gpmsc,1000);
function gpmsc(){
	
	c1 = elem1.getContext('2d');
	c1.fillStyle="#262626";
	c1.fillRect(0, 0, elem1.width, elem1.height);
	c1.fill();
	c1.mozImageSmoothingEnabled = false;
	c1.webkitImageSmoothingEnabled = false;
	c1.msImageSmoothingEnabled = false;
	c1.imageSmoothingEnabled = false;
	
	c1.strokeStyle="#8c8c8c";
	c1.lineWidth=10;
	c1.strokeRect(80,75,250,50);
	c1.stroke();
	c1.fillStyle="#777777";
	c1.fillRect(80,75,250,50);
	
	c1.strokeStyle="#8c8c8c";
	c1.lineWidth=10;
	c1.strokeRect(340,75,300,50);
	c1.stroke();
	c1.fillStyle="#777777";
	c1.fillRect(340,75,300,50);
	
	c1.font = (20)+"px Aclonica"
	c1.textBaseline = "top";
	c1.textAlign="center"; 	
	c1.fillStyle="#ffffbf";
	c1.fillText( handleText("[playerGender] [playerName] lv.[playerLvl]"),205,85)

	c1.strokeStyle="#8c8c8c";
	c1.lineWidth=10;
	c1.strokeRect(80,130,250,300);
	c1.stroke();

	c1.fillStyle="#777777";
	c1.fillRect(80,130,250,300);
	c1.fill();
	
	
	c1.strokeStyle="#8c8c8c";
	c1.lineWidth=10;
	c1.strokeRect(340,130,300,300);
	c1.stroke();

	c1.fillStyle="#777777";
	c1.fillRect(340,130,300,300);
	c1.fill();
	
	c1.fillStyle="#00ffaa";
	c1.fillRect(370,81,(240)*player.progress.xp,28);
	c1.fill();
	
	
	
	c1.drawImage(Assets.img["players"],
	24*(player.appearance+(player.gender?0:3)), 0,
	24,32,
	80,140,250,320);
	c1.drawImage(Assets.img["GUIxpbar"],340,75,300,40)
	
	c1.font = (14)+"px Aclonica"
	c1.textBaseline = "top";
	c1.textAlign="center"; 	
	c1.fillStyle="#ffffbf";
	c1.fillText( handleText("Doświadczenie"),370+(240)*0.5,86)
	if(player.progress.skillp>0)
	{
	c1.fillText("+"+player.progress.skillp+" Punktów do rozdania",370+(240)*0.5,115)
	}	
	c1.font = (20)+"px Aclonica"
	c1.fillText( "Osiągnięcia",elem1.width-230,45)
	drawAchievments();
	for(var i=0;i<player.stats.length;i++)
	{
	drawStat(375,145,i)
	}
}
function drawAchievments()
{
	var l = Assets.achievments.length
	var i=0;
	for(var ach=0;ach<l;ach++)
	{
		var r = Assets.achievments[ach].level;
		var unlocked = player.achievements.indexOf(ach)>=0
		var hidden = Assets.achievments[ach].hidden!=null
		if(hidden && !unlocked)
			continue;
		c1.drawImage(Assets.img["GUIachievments"],
		 32*r,unlocked?0:33,
		 32,32,
		 elem1.width-466+(66*(i%7)),70+(66*Math.floor(i/7)),64,64);
		

		if(unlocked)
		c1.drawImage(Assets.img[ Assets.achievments[ach].icon],elem1.width-466+(66*(i%7))+14,70+(66*Math.floor(i/7))+14,36,36);

		c1.font = (9)+"px Aclonica"
		c1.textBaseline = "top";
		c1.textAlign="center"; 	
		c1.fillStyle=unlocked?"#ffffbf":"#999999";
		c1.fillText( unlocked?Assets.achievments[ach].fullname:"??????????????????????????????????????????".substring(0,Assets.achievments[ach].fullname.length), elem1.width-466+(66*(i%7)+32),70+(66*Math.floor(i/7))+50)
		
		/*if(unlocked &&inBounds(elem1.width-466+(66*(i%7)),70+(66*Math.floor(i/7)),64,64))
		{
			c1.font = (12)+"px Aclonica"
				c1.textAlign="left"; 	
				c1.wrapText( Assets.achievments[ach].desc,mouse.x-32,mouse.y,100,12)

		}*/
	
		i++;
		
		
	}
	for(var ach=l-1;ach>=0;ach--)
	{	
		var unlocked = player.achievements.indexOf(ach)>=0
		var hidden = Assets.achievments[ach].hidden!=null
		if(hidden && !unlocked)
			continue;
		i--;
		if(unlocked &&inBounds(elem1.width-466+(66*(i%7)),70+(66*Math.floor(i/7)),64,64))
		{	
				c1.lineWidth=2;
				c1.strokeRect(mouse.x-105,mouse.y+20,210,10+4*12);
				c1.stroke();
				c1.fillStyle="rgba(0,0,0,0.7)";
				c1.fillRect(mouse.x-105,mouse.y+20,210,10+4*12);
				c1.fill();
				c1.fillStyle="#ffffbf"
				c1.font = (12)+"px Aclonica"
				c1.textAlign="left"; 	
				c1.wrapText( Assets.achievments[ach].desc,mouse.x-100,mouse.y+25,200,12)

		}
				

	}
}
function drawStat(x,y,stat){
	var maxskill = 9
	var h = (300-10)/player.stats.length - player.stats.length
	var w = (300-40)/maxskill
	c1.font = (30)+"px Aclonica"
	c1.textBaseline = "top";
	c1.textAlign="center"; 
	var ws = (c1.measureText(player.statNames.charAt(4)).width)+2
	y+=stat*(h+4);
	
	//Name
	c1.fillStyle=player.statColors[stat];
	c1.fillRect(x-ws+1,y+1,ws-2,h-2);
	c1.fill();
	
	c1.strokeStyle=player.statColors[stat];
	c1.lineWidth=2;
	c1.strokeRect(x-ws+1,y+1,ws-2,h-2);
	c1.stroke();
	
	c1.strokeStyle="rgba(0,0,0,0.2)";
	c1.lineWidth=2;
	c1.strokeRect(x-ws+1,y+1,ws-2,h-2);
	c1.stroke();
	
	c1.fillStyle="rgba(0,0,0,0.2)";	
	c1.fillText(player.statNames.charAt(stat),x-(ws)/2+1,y+10)
	c1.fill();
	c1.fillStyle="rgba(0,0,0,0.2)";	
	c1.fillRect(x-ws+1,y+1,ws-2,h-2);
	c1.fill();
	
	//stat count
	for(var i=0;i<player.stats[stat];i++){
		c1.fillStyle=player.statColors[stat];
		c1.fillRect(x+i*w+1,y+1,w-2,h-2);
		c1.fill();
		c1.strokeStyle=player.statColors[stat];
		c1.lineWidth=2;
		c1.strokeRect(x+i*w+1,y+1,w-2,h-2);
		c1.stroke();
		c1.strokeStyle="rgba(0,0,0,0.2)";
		c1.lineWidth=2;
		c1.strokeRect(x+i*w+1,y+1,w-2,h-2);
		c1.stroke();
	}
	
	
	if(player.stats[stat]<maxskill && player.progress.skillp>0)
	{
		//border+body
		var i = player.stats[stat]
		c1.fillStyle=player.statColors[stat];
		c1.fillRect(x+i*w+1,y+1,w-2,h-2);
		c1.fill();
		c1.strokeStyle=player.statColors[stat];
		c1.lineWidth=2;
		c1.strokeRect(x+i*w+1,y+1,w-2,h-2);
		c1.stroke();
		c1.strokeStyle="rgba(0,0,0,0.2)";
		
		//borders
		c1.lineWidth=2;
		c1.strokeRect(x+i*w+1,y+1,w-2,h-2);
		c1.stroke();
		
		
		c1.fillStyle="#ffffbf";	
		//+
		c1.fillRect(x+i*w+1+5,y+1+h/2-4,w-10,8);
		c1.fillRect(x+i*w+1+w/2-4,y+1+h/2-(w-10)/2,8,w-10);
		//c1.strokeRect(x+i*w+1,y+1,w-2,h-2);
		c1.fill();
	
		if(!inBounds(x+w*i,y,w,h)){
			//darken
			c1.fillStyle="rgba(0,0,0,0.2)";	
			c1.fillRect(x+i*w+1,y+1,w-2,h-2);
			c1.fill();
		}
		else if(mouse.event =="mouseup")
		{
			//updateskill
			player.stats[stat]++
			mouse.buttons = 0;
			mouse.event="";
			skillpoints(-1)
		}
	}
	//showText
	
	if(inBounds(x-ws,y,w*9+ws,h))
	{
	c1.font = (30)+"px Aclonica"
	c1.textBaseline = "top";
	c1.textAlign="left"; 	
	c1.strokeStyle="rgba(60,60,60,0.7)";
	var l = c1.measureText(player.statFullNames[stat]).width+10
	c1.strokeRect(Math.min(mouse.x,elem1.width-l),mouse.y-40,l,40);
	c1.stroke();
	c1.fillStyle="rgba(0,0,0,0.7)";
	c1.fillRect(Math.min(mouse.x,elem1.width-l),mouse.y-40,l,40);
	c1.fill();
	c1.fillStyle="#ffffbf";
	c1.fillText( player.statFullNames[stat],Math.min(mouse.x+5,elem1.width-l+5),mouse.y-35)	
	}
}
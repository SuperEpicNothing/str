var pcC;
var input;
var context;
var data = document.getElementById("playercreation").elements;
var srcImg;
var nameM = ["Ekebolios","Maksymos","Akslepiodotos","Trazymach","Hermarchos","Echekrates","Panajtios","Filodemos","Alkidamas","Naumachios","Polemon","Demetriusz","Domninos","Alucard","Krates"];
var nameF = ["﻿Aspazja","Hipparchia","Deotyma","Hypatia","Hildegarda","Sozypatra","Arystoklea","Melissa","Temistoklea","Abrotelia","Lasteneja","Asklepigenia"];

function startPlayerCreation(){
	
pcC = document.getElementById('playerCreation');
 srcImg = new Image();
 srcImg.src = "images/gui/PC.png";
input = new CanvasInput({
  canvas: pcC,
  onkeyup:onupdate,
  fontSize: 12,
  fontFamily: 'Aclonica',
  fontColor: '#ffffbf',
  placeHolderColor: '#ffffbf',
  width: 206,
  height: 17,
  x: 26,
  y: 35,
  backgroundColor: "#808080",
  borderColor: "#808080",
  borderRadius: 0,
  borderWidth: 0,
  padding: 0,
  boxShadow: "0px 0px 0px rgba(255, 255, 255, 0)",
  innerShadow: "0px 0px 0px rgba(255, 255, 255, 0)",
  placeHolder: 'wpisz imię...'
});
	context = pcC.getContext('2d');
	addMouseListener(pcC)
	randomPC();
	input.value(input.placeHolder());
 	window.requestAnimationFrame(renderPC);
}

function onupdate()
{
	data.namedItem("name").value=input.value();
}

function randomPC(){
	console.log(name)
	var gender = (Math.random()>0.5);
	data.namedItem("gender").checked=gender;
	data.namedItem("teachmode").checked=false;
	
	if(gender)
		data.namedItem("name").value=nameM[Math.floor(nameM.length*Math.random())];
	else
		data.namedItem("name").value=nameF[Math.floor(nameF.length*Math.random())];
	
	input.value(data.namedItem("name").value);
	data.namedItem("apperance").value=Math.floor(Math.random()*2.99);
}
function pcstepUp(){
	if(data.namedItem("apperance").value==2)
		data.namedItem("apperance").value=0;
	else
	data.namedItem("apperance").stepUp();
}
function pcstepDown(){
	if(data.namedItem("apperance").value==0)
		data.namedItem("apperance").value=2;
	else
	data.namedItem("apperance").stepDown();
}
function pcGender(b){
	data.namedItem("gender").checked=b;
}
function renderPC(){

	if(!Assets.loadedImages){
			window.requestAnimationFrame(renderPC);
			return;
	}

	context.drawImage(srcImg,0,0,260,367,0,20,260,367);
	cUtils.imageSmoothing(context,false)
	context.drawImage(Assets.img["players"],
	24*(data.namedItem("teachmode").checked?6:(parseInt(data.namedItem("apperance").value)+(data.namedItem("gender").checked?0:3))), 0,
	24,32,
	24,102,219,291);
	cUtils.imageSmoothing(context,true);
	
	cUtils.drawButtonImg(context,pcC,262,0, srcImg,190, 310, 39,43,randomPC);
	
	cUtils.drawButtonImg(context,pcC,301,63, srcImg,26, 82, 21,25,pcstepUp,1);
	cUtils.drawButtonImg(context,pcC,322,63, srcImg,213,82, 21,25,pcstepDown,1);
	
	cUtils.drawButtonImg(context,pcC,301,0, srcImg, 95, 57, 37,21,pcGender,true,data.namedItem("gender").checked);
	cUtils.drawButtonImg(context,pcC,338,0, srcImg,132, 57, 37,21,pcGender,false,!data.namedItem("gender").checked);
	

	input.render();
	cUtils.drawButton(context,pcC,"Stwórz",57, 360, 142,17,true,createPlayer)
	
	context.drawImage(srcImg,262,129+(data.namedItem("teachmode").checked?0:39),39,39,26,312,39,39);
	if(inBounds(26,312,39,39)){
		if(mouse.up && mouse.target==pcC && mouse.prepare){
			data.namedItem("teachmode").checked=!data.namedItem("teachmode").checked;
			data.namedItem("gender").checked=false;
			mouse.up=false;
			mouse.prepare=false;
		}
		
		if(mouse.buttons>0)
		{
			mouse.prepare=true;
		}
		else
			mouse.prepare=false;
	}
	
	window.requestAnimationFrame(renderPC);
}
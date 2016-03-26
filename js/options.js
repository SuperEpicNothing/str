function optionOpen(){
	console.log("open");
	option=getCookie("options")?getCookie("options"):{volume:80,speed:0,teach:false};
	document.getElementById("volume").value=option.volume;
	document.getElementById("speed").value=option.speed;
	document.getElementById("wait").value=option.wait;
	document.getElementById("teach").checked=option.teach;
	document.getElementById("autoskip").checked=option.autoskip;
	optionUpdate();
}
function optionUpdate()
{
	document.getElementById("volumeL").innerHTML="Głośność: "+document.getElementById("volume").value+"%";
	document.getElementById("speedL").innerHTML="Prędkość pisania: x"+(document.getElementById("speed").value);
	document.getElementById("waitL").innerHTML="Czas na przeczytanie: x"+(document.getElementById("wait").value);
	document.getElementById("wait").style.visibility=document.getElementById("autoskip").checked?"visible":"hidden";
	document.getElementById("waitL").style.visibility=document.getElementById("wait").style.visibility;

}
function optionSave(){
	console.log("save");
	option.volume=document.getElementById("volume").value;
	option.speed=document.getElementById("speed").value;
	option.autoskip=document.getElementById("autoskip").checked;
	option.wait=option.autoskip? document.getElementById("wait").value :1;
	option.teach=document.getElementById("teach").checked;


	setCookie("options",option);
	$("#itemModal").modal("hide");
	updateChapters()
}
function optionDelete(){
	console.log("delete");
	player=null;
	deleteCookie("player");
	deleteCookie("options");
	option={volume:80,speed:0,teach:false,autoskip:true};
	$("#itemModal").modal("hide");
	location.reload(); 
}
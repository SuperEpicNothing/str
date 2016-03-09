var option={volume:80,speed:0,wait:1,teach:false}
function optionOpen(){
	console.log("open");
	option=getCookie("options")?getCookie("options"):{volume:80,speed:0,teach:false};
	document.getElementById("volume").value=option.volume;
	document.getElementById("speed").value=option.speed;
	document.getElementById("wait").value=option.wait;
	document.getElementById("teach").checked=option.teach;
	optionUpdate();
}
function optionUpdate()
{
	document.getElementById("volumeL").innerHTML="Głośność: "+document.getElementById("volume").value+"%";
	document.getElementById("speedL").innerHTML="Zmiana Prędkości Tekstu: x"+(document.getElementById("speed").value);
	document.getElementById("waitL").innerHTML="Zmiana Prędkości Czkania: x"+(document.getElementById("wait").value);

}
function optionSave(){
	console.log("save");
	option.volume=document.getElementById("volume").value;
	option.speed=document.getElementById("speed").value;
	option.wait=document.getElementById("wait").value;
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
	option={volume:80,speed:0,teach:false};
	$("#itemModal").modal("hide");
	updateChapters()
}
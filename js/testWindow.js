function canvasLoaded()
{
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		var arr = JSON.parse(xmlhttp.responseText);
        loadScenes(arr);
    }
	};
	xmlhttp.open("GET", "json/hawking2.json", true);
	xmlhttp.send();
}
function scenesLoaded()
{
		render()
		ready=true;
}



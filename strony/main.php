<div class="mainMenu">
	<a href="?noplayer=0" class="btn btn-primary btn-block">New Game</a>
	<a id="loadGame" href="?p=0&pp=0"   class="btn btn-primary btn-block">Load Game</a>
	<a href="?help=0"   class="btn btn-primary btn-block">Help</a>
</div>

<script type="text/javascript" onload="loader()">
	function loader(){
		if(document.cookie.indexOf("player") < 0){
			document.getElementById("loadGame").style="visibility:hidden";
			console.log("test");
		}
	}
</script>
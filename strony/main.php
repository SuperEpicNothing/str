<div class="mainMenu">
	<a href="?noplayer=0" class="btn btn-primary btn-block">Nowa gra</a>
	<a id="loadGame" href="?p=0&pp=0"   class="btn btn-primary btn-block">Kontynuuj grę</a>
	<a href="?help=0"   class="btn btn-primary btn-block">O co chodzi? / Pomoc</a>
</div>

<script type="text/javascript" onload="loader()">
	function loader(){
		if(document.cookie.indexOf("player") < 0){
			document.getElementById("loadGame").style="visibility:hidden";
			console.log("test");
		}
	}
</script>
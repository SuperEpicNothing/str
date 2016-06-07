<!DOCTYPE html>
<?php
$page = $_GET['p']; // przypisanie zmiennych 
if($page == "")
	$page=0;

$subpage = $_GET['pp']; // przypisanie zmiennych 
if($subpage == "")
	$subpage=0;
// nazwa strony
$strony = file("strony.txt");

$submenu[count($strony)];
for($i=0;$i<count($strony);$i++)
$submenu[$i]= file("strony/".$i."/menu.txt");



?>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="Krzysztof Stasiowski">
	<link id="icon" rel="icon" type="image/x-icon" />
    <title>Nauka i Wiara</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">

	<link rel="stylesheet" href="css/equal-height-columns.css">


	<!-- Niebieskie Menu -->
    <link href="css/menubar-blue.css" rel="stylesheet">
	<!-- Hover-->
<link href="css/hover.css" rel="stylesheet" media="all">
	<!-- equal height-->
	<link href="css/equal-height-columns.css" rel="stylesheet" media="all">
	
	<!-- Custom styles for this template -->
    <link href="css/main.css" rel="stylesheet">
	<link href="css/guiItems.css" rel="stylesheet">
	<link href="css/guiPlayer.css" rel="stylesheet">
	<link href="css/guiOption.css" rel="stylesheet">


	<!-- Custom styles for this template -->
    <link href="css/sidebar.css" rel="stylesheet">

	
	    <!-- Bootstrap core JavaScript
    ================================================== -->
    <script src="js/jquery.min.js"></script>
<!--
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
-->
   	<script src="js/seedrandom.js"></script>
	<script src="js/bootstrap.min.js"></script>
	
	<script src="js/loader.js"></script>
	<script src="js/graphics/canvasUtils.js"></script>
	<?php
	if($_GET['noplayer']==null && $_GET['main']==null && $_GET['help']==null)
			echo
		'
		<script src="js/graphics/notifications.js"></script>
		<script src="js/graphics/buttons.js"></script>
		<script src="js/playerGUI.js"></script>
		<script src="js/graphics/audio.js"></script>
		<script src="js/itemMenu.js">
		'
	?>

	<!--<script src="js/window.js"></script>-->

	<!-- Begin Cookie Consent plugin by Silktide - http://silktide.com/cookieconsent -->
<script type="text/javascript">
    window.cookieconsent_options = {"message":"Ta strona korzysta z plików cookies, [przeczytaj informacje o wymaganiach EU]",
	"dismiss":"OK",
	"learnMore":"Więcej informacji",
	"link":"todo",
	"theme":"dark-bottom"};
</script>

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.9/cookieconsent.min.js"></script>
<!-- End Cookie Consent plugin -->

	
<body data-spy="scroll" data-target="#sidebar" data-offset="50">
	<canvas id="favicon" width=32 height=32 hidden></canvas>

	<div class="loadAclonica"> </div>
	<div id="enabledhyperlink" class="enabledLink" style="visibility:hidden"> </div>
	<div id="disabledhyperlink" class="disabledLink" style="visibility:hidden"> </div>

    <nav class="navbar navbar-default navbar-fixed-top">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="?main=0">
					<div class="hidden-sm">Nauka i Wiara</div>
					<div class="visible-sm-inline-block">NiW</div>
				</a>
			</div>

			<div id="navbar" class="collapse navbar-collapse">
	
				<ul class="nav navbar-nav navbreaker pull-right">
				<?php
				if($_GET['noplayer']==null && $_GET['main']==null && $_GET['help']==null) 
			/*	echo '
						<li><a href="#" data-toggle="collapse" data-target="#guiPlayer" style="padding: 10px 10px;height:50px;width:50px" onmouseout="this.firstChild.style.filter=\'grayscale(100%)\'" onmouseover="this.firstChild.style.filter=\'grayscale(0%)\'"><img id="guiPlayerVisage"  src="images/avatars.png" height=32 style="margin: 0px 0px;padding: 0px 0px;clip: rect(0px, 25px, 32px, 0px);position: absolute;filter:grayscale(100%);"> <span id="guiPlayerLevel" style="background-color:lightblue;position: relative;left: 25px;top: -10px;" class="badge">0</span><span id="guiSkillPNew" style="position: relative;left: 25px;top: -10px;" class="badge">0</span></img> </a></li>
						<li><a href="#" data-toggle="collapse" data-target="#guiItems" id="items" style="padding: 10px 10px;height:50px;width:50px"  onmouseout="this.firstChild.src=\'images/gui/I_Chest01.png\'" onmouseover="this.firstChild.src=\'images/gui/I_Chest02.png\'"><img src="images/gui/I_Chest01.png" height=34 style="margin: 0px 0px;padding: 0px 0px;filter:grayscale(100%);"> <span id="guiItemsNew" style="position: relative;left: 25px;top: -40px;" class="badge">0</span></img></a></li>
				'*/
				echo '
						<li><a href="#" onclick=" openGUI(0)" style="padding: 10px 10px;height:50px;width:50px" onmouseout="this.firstChild.style.filter=\'grayscale(100%)\'" onmouseover="this.firstChild.style.filter=\'grayscale(0%)\'"><img id="guiPlayerVisage"  src="images/avatars.png" height=32 style="margin: 0px 0px;padding: 0px 0px;clip: rect(0px, 25px, 32px, 0px);position: absolute;filter:grayscale(100%);"> <span id="guiPlayerLevel" style="background-color:lightblue;position: relative;left: 25px;top: -10px;" class="badge">0</span><span id="guiSkillPNew" style="position: relative;left: 25px;top: -10px;" class="badge">0</span></img> </a></li>
						<li><a href="#" onclick=" openGUI(1)" id="items" style="padding: 10px 10px;height:50px;width:50px"  onmouseout="this.firstChild.src=\'images/gui/I_Chest01.png\'" onmouseover="this.firstChild.src=\'images/gui/I_Chest02.png\'"><img src="images/gui/I_Chest01.png" height=34 style="margin: 0px 0px;padding: 0px 0px;filter:grayscale(100%);"> <span id="guiItemsNew" style="position: relative;left: 25px;top: -40px;" class="badge">0</span></img></a></li>
				'			
				?>
					<li><a href="#" data-toggle="modal"  data-target="#itemModal" style="padding: 0px 0px;height:50px;width:50px" onclick="optionOpen()"><img src="images/gui/gear2.png" style="margin: 0px 0px;padding: 0px 0px;height:50px"></span></a></li>
				</ul>
			</div><!--/.nav-collapse -->
		</div>
    </nav>
	
	<?php readfile("strony/itemModal.html");?>			
	<div class="container">
		<?php
			if($_GET['main']!=null)
				readfile("strony/main.php");
			else if($_GET['noplayer']!=null)
				readfile("strony/playerCreation.html");
			else if($_GET['help']!=null)
				readfile("strony/help.html");
			else
			require 'content.php';
		?>
	</div>
	
  </body>
</html>

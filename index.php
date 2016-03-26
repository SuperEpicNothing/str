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
$submenu = file("strony/".$page."/menu.txt");



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
	
	<!-- Custom styles for this template -->
    <link href="css/sidebar.css" rel="stylesheet">

	
	    <!-- Bootstrap core JavaScript
    ================================================== -->
    <script src="js/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
   	<script src="js/seedrandom.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/loader.js"></script>
<script src="js/window.js"></script>

	<!-- Begin Cookie Consent plugin by Silktide - http://silktide.com/cookieconsent -->
<script type="text/javascript">
    window.cookieconsent_options = {"message":"Ta strona korzysta z plików cookies, [przeczytaj informacje o wymaganiach EU]",
	"dismiss":"OK",
	"learnMore":"Więcej Informacji",
	"link":null,
	"theme":"dark-bottom"};
</script>

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.9/cookieconsent.min.js"></script>
<!-- End Cookie Consent plugin -->

	
  <body data-spy="scroll" data-target="#sidebar" data-offset="50">
  								<canvas id="favicon" width=32 height=32 hidden></canvas>

<div class="loadAclonica"> </div>

    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
			<span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#"><div class="hidden-sm">Algorytmy Genetyczne</div><div class="visible-sm-inline-block">AG</div></a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
		  <?php for($i=0 ;$i<count($strony); $i++)
		  {
			  echo " <li><a  id='pageButton".$i."' class='hvr-underline-from-center' href='?p=".$i."&pp=0'>".$strony[$i]."</a></li>\n\t\t";
		  }
		  ?>
           </ul>
		   <ul class="nav navbar-nav navbreaker pull-right">
		    <li><a href="#" data-toggle="collapse" data-target="#guiPlayer" style="padding: 10px 10px;height:50px;width:50px" onmouseout="this.firstChild.style.filter='grayscale(100%)'" onmouseover="this.firstChild.style.filter='grayscale(0%)'"><img id="guiPlayerVisage"  src="images/avatars.png" height=32 style="margin: 0px 0px;padding: 0px 0px;clip: rect(0px, 25px, 32px, 0px);position: absolute;filter:grayscale(100%);"> <span id="guiPlayerLevel" style="background-color:lightblue;position: relative;left: 25px;top: -10px;" class="badge">0</span><span id="guiSkillPNew" style="position: relative;left: 25px;top: -10px;" class="badge">0</span></img> </a></li>
            <li><a href="#" data-toggle="collapse" data-target="#guiItems" id="items" style="padding: 10px 10px;height:50px;width:50px"  onmouseout="this.firstChild.src='images/gui/I_Chest01.png'" onmouseover="this.firstChild.src='images/gui/I_Chest02.png'"><img src="images/gui/I_Chest01.png" height=34 style="margin: 0px 0px;padding: 0px 0px;filter:grayscale(100%);"> <span id="guiItemsNew" style="position: relative;left: 25px;top: -40px;" class="badge">0</span></img></a></li>
            <li><a href="#" data-toggle="modal" data-target="#itemModal" style="padding: 0px 0px;height:50px;width:50px" onclick="optionOpen()"><img src="images/gui/gear2.png" style="margin: 0px 0px;padding: 0px 0px;height:50px"></span></a></li>
           </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
	

	<?php readfile("strony/itemModal.html");?>			
	<div class="container">
	<div class="row">
			<div id="guiPlayer" class="panel-collapse collapse">
				<div class="panel-body">
				<div class="row row-eq-height ">
						<div class="col-xs-12 ">
							<div class="box ">
								<canvas id="guiPlayerMain" width=1120 height=500 ></canvas>
								<script src="js/playerGui.js"></script>
							</div>
						</div
				</div>
				</div>
				
				</div>
			</div>
		</div>
		<div class="row">
			<div id="guiItems" class="panel-collapse collapse">
				<div class="panel-body">
				<div class="row row-eq-height ">
					<div class="col-xs-4 ">
						<div class="box list">
							<div class="box">
							<div class="row">
									<div class="col-xs-6">
										<button id='GUIItemsScrollsButton' class="btn btn-default" onclick="changeTab(0)">Scrolls</button>
									</div>
									<div class="col-xs-6">
										<button id='GUIItemsItemsButton' class="btn btn-default" onclick="changeTab(1)">Items</button>
									</div>
							</div>
							</div>
							<div class="row">
								<div class="col-xs-12">
									<ul id="GUIItemsItems" hidden></ul>
									<ul id="GUIItemsScrolls" hidden></ul>
								</div>
							</div>
						</div>
					</div>
					<div class="col-xs-8 ">
							<div class="box">
								<div class="row row-eq-height">
									<div class="col-xs-8">
										<div class="stats">
											<ul id="GUIItemsData" >
											  <li>Name:<br> - Scroll - Lorem ipsum et dolor sit amet</li>
											  <li>Type:<br> - Scroll</li>
											  <li>Autor:<br> - Lorem</li>
											  <li>Stats:<br><ul><li></li><li></li><li></li><li></li></ul></li>
											</ul>
										</div>
									</div>
									
									<div class="col-xs-4">
										<div class="box imagebox">
										<img id="GUIItemsImage" src="images/gui/untitled.png" alt="" width="100%" border="0" ></img>
										</div>
									</div>
								</div>
							</div>
							<div class="box">
								<div class="row">
									<div class="col-xs-12 ">
									<span>Description: <br></span>
									<div class="GUIItemsDesc">
										<span id="GUIItemsDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque massa libero, finibus in hendrerit viverra, cursus vitae augue. In sollicitudin tempor risus, eu tristique nibh facilisis non. Pellentesque rutrum felis dui, vitae laoreet sem gravida et. Nulla facilisi. Duis ac enim imperdiet, tempor velit at, iaculis ipsum. Aenean vitae tortor eu tortor tincidunt volutpat. Cras iaculis mattis ipsum, eget molestie elit feugiat in.</span> 
									</div></div>
								</div>
								<div class="row">
									<div class="col-xs-9"></div>
									<div class="col-xs-3">
										<button id="GUIItemsButton" hidden class="btn btn-default" onclick="window.open('docs/historia pieniądza.pdf', '_blank');">Learn more</button>
									</div>
								</div>
							</div>
						</div>
				</div>
			</div>
		</div>
		<div class="row">
		  <nav id="sidebar">
		  <ul class="nav nav-pills nav-stacked">

		  		  <?php for($i=0 ;$i<count($submenu); $i++)
		  {
			  echo " <li><a  id='submenuLink".$page."-".$i."' class=".($i==$subpage && $subpage!="test" ?"'active disabledSubmenuLink'":"'enabledSubmenuLink'")." href='?p=".$page."&pp=".$i."'>".$submenu[$i]."</a></li>\n\t\t";
		  }
		  ?>
		  <li><hr></hr><li>
		  	<li><a <?php echo "href='?p=".$page."&pp=test' class=".($subpage=="test" ?"'active'":"''") ?> >KONFU?</a></li>
		  </ul>
		  
		  </nav>
		  <div class="col-xs-10">
			<?php readfile("strony/".$page."/".($subpage=="test"?"endboss":$subpage).".html");?>
		  </div>
		</div>
	</div>

  </body>
</html>

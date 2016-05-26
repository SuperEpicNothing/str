<!-- GUI PLAYER	-->
<div class="row">
	<div id="guiPlayer" class="panel-collapse collapse">
		<div class="panel-body">
			<div class="row row-eq-height ">
				<div class="col-xs-12 ">
					<div class="box ">
						<canvas id="guiPlayerMain" width=1120 height=500 ></canvas>
						
					</div>
				</div>
			</div>
		</div>		
	</div>
</div>
<!-- GUI ITEMS	-->
<div class="row">
	<div id="guiItems" class="panel-collapse collapse">
		<div class="panel-body">
			<div class="row">
				<div class="vert">
					<div class="col-xs-4 list">
						<div class="box list">
							<div class="navbut">
								<button id='GUIItemsScrollsButton' class="btn btn-default" onclick="changeTab(0)">Zwoje</button>
								<button id='GUIItemsItemsButton' class="btn btn-default" onclick="changeTab(1)">Przedmioty</button>
							</div>
								<ul id="GUIItemsItems" hidden></ul>
								<ul id="GUIItemsScrolls" hidden></ul>
						</div>
					</div>
					<div class="col-xs-8 ">
						<div class="stats">
							<div class="box">
								<ul id="GUIItemsData" >
									<li>Nazwa:<br> - Scroll - Lorem ipsum et dolor sit amet</li>
									<li>Autor:<br> - Lorem</li>											
								</ul>
								<div class="imagebox">
									<canvas id="GUIItemsImage" alt="" width="100px" height="100px" border="0" ></canvas>
								</div>
							</div>
						</div>
						<div class="GUIItemsDesc">
							<div class="box">
								<span>Opis: <br></span>
								<span id="GUIItemsDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque massa libero, finibus in hendrerit viverra, cursus vitae augue. In sollicitudin tempor risus, eu tristique nibh facilisis non. Pellentesque rutrum felis dui, vitae laoreet sem gravida et. Nulla facilisi. Duis ac enim imperdiet, tempor velit at, iaculis ipsum. Aenean vitae tortor eu tortor tincidunt volutpat. Cras iaculis mattis ipsum, eget molestie elit feugiat in.</span> 
								<button id="GUIItemsButton" class="btn btn-default" onclick="window.open('', '_blank');">Więcej</button>
							</div>
						</div>
					</div>						
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-xs-3 col-md-2 sdbr">
		<ul class=" nav nav-pills nav-stacked" id="sidebar" >
  				<?php 
				for($i=0 ;$i<count($strony); $i++) {
					/*echo " <li><a  id='pageButton".$i."' class='hvr-underline-from-center' href='?p=".$i."&pp=0'>".$strony[$i]."</a><ul>\n";*/
					echo "\n\t<li> <a  id='pageButton".$i."' class='enabledLink ".(($i==$page)?"active":"")."' data-toggle='collapse' data-target='#n".$i."'>".trim($strony[$i])."</a><ul id='n".$i."' class='nav nav-pills nav-stacked collapse topics".(($i==$page)?" in":"")."'>";
					for($j=0 ;$j<count($submenu[$i]); $j++) {
						/*separator po wstępie	
						*href='?p=".$i."&pp=".$j."*/
						echo "\n\t\t<li><a id='lesson".$i."-".$j."'class='hvr-curl-bottom-right enabledLink' href='?p=".$i."&pp=".$j."' >".trim($submenu[$i][$j])."</a></li>";
					/*echo " <li><a  id='submenuLink".$page."-".$i."' class=".($i==$subpage && $subpage!="test" ?"'active'":"'enabledSubmenuLink'")." href='?p=".$page."&pp=".$i."'>".$submenu[$i]."</a></li>";
					*/}
					echo "<li><a id='test".$i."' href='?p=".$i."&pp=test' class='hvr-curl-bottom-right enabledLink".($subpage=="test" ?"'active'":"''")."' >Starcie z Konfuzjuszem</a></li>";
					echo "\n\t</ul></li>";
				}

				?>			
				
		</ul>
	</div>
	<div class="col-xs-9 col-md-10">
		<?php 
			readfile("strony/".$page."/".($subpage=="test"?"endboss":$subpage).".html");
		?>
	</div>
</div>
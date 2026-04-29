<?php
if (!isset($_GET['page']) || empty($_GET['page'])) {
	$_GET['page'] = 'controller_home';
}

if ($_GET['page'] === "controller_home") {
	include("view/inc/top_page_home.html");
}
else {
	include("view/inc/top_page.html");
}
session_start();
?>
<?php
include("view/inc/header.html");
?>
<?php
include("view/inc/pages.php");
?>
<?php
include("view/inc/footer.html");
?>
<?php
include("view/inc/bottom_page.html");
?>
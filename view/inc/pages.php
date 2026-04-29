<?php
switch ($_GET['page']) {
	case "controller_home":
		$_GET['op'] = 'view'; // ← fuerza el op=view
		include("module/home/controller/controller_home.php");
		break;
	case "controller_shop":
		$_GET['op'] = 'view';
		include("module/shop/view/shop.php");
		break;
	default:
		$_GET['op'] = 'view';
		include("module/home/controller/controller_home.php");
		break;
}
?>
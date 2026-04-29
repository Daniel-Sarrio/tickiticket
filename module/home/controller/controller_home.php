<?php
// $data = 'hola crtl home';
// die('<script>console.log('.json_encode( $data ) .');</script>');

$path = '/opt/lampp/htdocs/tickiticket_v7/';
include($path . "module/home/model/DAOHome.php");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

switch ($_GET['op']) {
    case 'view':
        // $data = 'hola crtl home view';
        // die('<script>console.log('.json_encode( $data ) .');</script>');
        include($path . "module/home/view/home.html");
        break;

    case 'homePageGames':
        // echo json_encode("homePageCategory");
        // exit();
        try {
            $daohome = new DAOHome();
            $SelectGames = $daohome->select_all_games();
        // echo json_encode($SelectGames);
        // exit();
        }
        catch (Exception $e) {
            echo json_encode("error");
        }

        if (!empty($SelectGames)) {
            echo json_encode($SelectGames);
        }
        else {
            echo json_encode("error");
        }
        break;
    case 'homePageCategories':
        try {
            $daohome = new DAOHome();
            $SelectCategories = $daohome->select_all_categories();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit();
        }
        if (!empty($SelectCategories)) {
            echo json_encode($SelectCategories);
        }
        else {
            echo json_encode("error");
        }
        break;
    case 'homePageEquipos':
        try {
            $daohome = new DAOHome();
            $SelectEquipos = $daohome->select_all_equipos();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit();
        }
        if (!empty($SelectEquipos)) {
            echo json_encode($SelectEquipos);
        }
        else {
            echo json_encode("error");
        }
        break;
    case 'homePageEstadios':
        try {
            $daohome = new DAOHome();
            $SelectEstadios = $daohome->select_all_estadios();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit();
        }
        if (!empty($SelectEstadios)) {
            echo json_encode($SelectEstadios);
        }
        else {
            echo json_encode("error");
        }
        break;

    default:
        include("view/inc/error404.php");
        break;
}
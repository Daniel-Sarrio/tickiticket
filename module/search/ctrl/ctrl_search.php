<?php
$path = '/opt/lampp/htdocs/tickiticket_v7/';
include($path . "module/search/model/DAO_serch.php");

switch ($_GET['op']) {
    case 'search_brand':
        try {
            $searchDao = new DAO_search();
            $result = $searchDao->search_brand();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if (!empty($result)) {
            echo json_encode($result);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'search_category_null':
        try {
            $searchDao = new DAO_search();
            $result = $searchDao->search_category_null();
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if (!empty($result)) {
            echo json_encode($result);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'search_category':
        try {
            $searchDao = new DAO_search();
            $brand = isset($_POST['brand']) ? intval($_POST['brand']) : 0;
            $result = $searchDao->search_category($brand);
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if (!empty($result)) {
            echo json_encode($result);
        }
        else {
            echo json_encode("error");
        }
        break;

    case 'autocomplete':
        try {
            $dao = new DAO_search();
            $complete = isset($_POST['complete']) ? trim($_POST['complete']) : '';
            $brand = isset($_POST['brand']) ? intval($_POST['brand']) : 0;
            $category = isset($_POST['category']) ? intval($_POST['category']) : 0;

            if (!empty($_POST['brand']) && empty($_POST['category'])) {
                $rdo = $dao->select_only_brand($complete, $brand);
            }
            else if (!empty($_POST['brand']) && !empty($_POST['category'])) {
                $rdo = $dao->select_brand_category($complete, $brand, $category);
            }
            else if (empty($_POST['brand']) && !empty($_POST['category'])) {
                $rdo = $dao->select_only_category($category, $complete);
            }
            else {
                $rdo = $dao->select_city($complete);
            }
        }
        catch (Exception $e) {
            echo json_encode("error");
            exit;
        }

        if (!empty($rdo)) {
            echo json_encode($rdo);
        }
        else {
            echo json_encode("error");
        }
        break;

    default:
        include($path . "view/inc/error404.php");
        break;
}

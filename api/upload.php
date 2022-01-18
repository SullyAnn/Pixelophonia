<?php
        var_dump("hello du php");
        $my_file = $_FILES['img1'];
        $file_path = $my_file['tmp_name']; // temporary upload path of the file
        $file_name = $_POST['name']; // desired name of the file
        move_uploaded_file($file_path, '../assets/uploads/' . basename($file_name)); // save the file at `img/FILE_NAME`
?>


//     header("Access-Control-Allow-Origin: *");
//     header("Access-Control-Allow-Methods: PUT, GET, POST");
//     header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
//     echo 'on est dans le php';
//     // Folder Path For Ubuntu
//     // $folderPath = "/var/www/my-app/uploads";
//     // Folder Path For Window
//     $folderPath = "../assets/uploads/";

//     $file1_tmp = $_FILES['img1']['tmp_name'];
//     $file1_ext = strtolower(end(explode('.',$_FILES['img1']['name'])));
//     $file1 = $folderPath . uniqid() . '.'.$file1_ext;
//     move_uploaded_file($file1_tmp, $file1);
//     $file2_tmp = $_FILES['img2']['tmp_name'];
//     $file2_ext = strtolower(end(explode('.',$_FILES['img2']['name'])));
//     $file2 = $folderPath . uniqid() . '.'.$file2_ext;
//     move_uploaded_file($file2_tmp, $file2);
    
//    return json_encode(['status'=>true]);

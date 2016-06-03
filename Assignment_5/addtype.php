<?php
/**
 * Created by PhpStorm.
 * User: donald
 * Date: 6/3/16
 * Time: 1:52 PM
 */

$row = 1;

$fp = fopen('winequality.csv', 'w');

if (($handle = fopen("winequality-red.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle)) !== FALSE) {
        if ($row === 1) {
            $data[] = 'wine_type';
        } else {
            $data[] = 'red';
        }

        fputcsv($fp, $data);
        $row++;
    }
    fclose($handle);
}

$row = 1;
if (($handle = fopen("winequality-white.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle)) !== FALSE) {
        if ($row === 1) {
            $row++;
            continue;
        } else {
            $data[] = 'white';

        }

        fputcsv($fp, $data);
        $row++;
    }
    fclose($handle);
}

fclose($fp);
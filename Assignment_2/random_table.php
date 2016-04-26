<?php

//$studentIds = [101, 105, 107, 217, 218, 1005, 1702, 1802, 2001, 4001, 501, 2449];
$majors = ['Computer Science', 'Economics', 'Social Science', 'Biology', 'Chemistry', 'Physics', 'Medieval History', 'Art'];
$standings = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
$prereqs = ['Y', 'N'];

$newRows = '';

$totalNeeded = 12;

for ($i = 0; $i < $totalNeeded; $i++)
{
    // Make student id
    $studentId = rand(1, 99999);

    // Select major
    $major = $majors[rand(0,7)];

    // Select standing
    $standing = $standings[rand(0, 3)];

    // Make grade
    $grade = rand(50, 100);

    // Select prereq
    $prereq = $prereqs[rand(0,1)];

    // Determine letter
    if ($grade >= 90) {
        $letter = 'A';
    } elseif ($grade >= 80) {
        $letter = 'B';
    } elseif ($grade >= 70) {
        $letter = 'C';
    } elseif ($grade >= 60) {
        $letter = 'D';
    } else {
        $letter = 'F';
    }

    $newRows .= $studentId . ',' . $major . ',' . $standing . ',' . $grade . ',' . $prereq . ',' . $letter . PHP_EOL;
}

print_r($newRows);
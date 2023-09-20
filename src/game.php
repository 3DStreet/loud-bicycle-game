<?php
/**
 * Template Name: Game Fullscreen
 * @package WordPress
 * @subpackage MEAN_AND_GREEN
 * @since 0.1.0
 * @version 1.0
 */

// report errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Map of random identifiers to image filenames and descriptions
$validImages = array(
    'x1abc' => array('filename' => 'bmw.jpg', 'description' => 'Can you avoid all the BMWs in the Loud Bicycle game?', 'width' => 500, 'height' => 339),
    'y2def' => array('filename' => 'suv.jpg', 'description' => 'Can you stay safe with all the SUVs in the Loud Bicycle game?', 'width' => 500, 'height' => 339),
    'z3ghi' => array('filename' => 'taxi.jpg', 'description' => 'Can you avoid getting run over by a taxi in the Loud Bicycle game?', 'width' => 500, 'height' => 339),
    'a4jkl' => array('filename' => 'truck.jpg', 'description' => 'Can you stay safe with all the trucks in the Loud Bicycle game?', 'width' => 500, 'height' => 339),
    'b5mno' => array('filename' => 'unknown.jpg', 'description' => 'Can you get home safely in the Loud Bicycle game?', 'width' => 500, 'height' => 339),

    '91sna' => array('filename' => 'raygun.jpg', 'description' => 'How many cars can you turn into bicycles in the Loud Bicycle game?', 'width' => 500, 'height' => 339),
    'f2s6s' => array('filename' => 'loudmini.jpg', 'description' => 'How powerful is Loud Mini in the Loud Bicycle game?', 'width' => 500, 'height' => 339)
);

// Check if the 'v' parameter exists in our array
$imageKey = isset($_GET['v']) && isset($validImages[$_GET['v']]) ? $_GET['v'] : null;

// If the key was found, use the corresponding image and description, otherwise default to bicycle collision with a truck
if ($imageKey) {
    $imageUrl = "https://loudbicycle.com/screenshots/" . $validImages[$imageKey]['filename'];
    $imageDescription = $validImages[$imageKey]['description'];
    $imageWidth = $validImages[$imageKey]['width'];
    $imageHeight = $validImages[$imageKey]['height'];
} else {
    $imageUrl = "https://loudbicycle.com/screenshots/bicycle-collision-with-truck.jpg";
    $imageDescription = "Can you get the kids to school safely? Try the Loud Bicycle game!";
    $imageWidth = 1306;
    $imageHeight = 1023;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo assets_url(); ?>/images/favicons/apple-touch-icon.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo assets_url(); ?>/images/favicons/favicon-32x32.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="194x194" href="<?php echo assets_url(); ?>/images/favicons/favicon-194x194.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="192x192" href="<?php echo assets_url(); ?>/images/favicons/android-chrome-192x192.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo assets_url(); ?>/images/favicons/favicon-16x16.png?v=47BrWnbJxN">
    <link rel="manifest" href="<?php echo assets_url(); ?>/images/favicons/site.webmanifest?v=47BrWnbJxN">
    <link rel="shortcut icon" href="<?php echo assets_url(); ?>/images/favicons/favicon.ico">

    <title>LOUD BICYCLE | THE GAME</title>
    <link rel="canonical" href="https://www.loudbicycle.com/game" />

    <!-- Open Graph Tags -->
    <meta property="og:title" content="LOUD BICYCLE | THE GAME">
    <meta property="og:description" content="<?php echo $imageDescription; ?>">
    <meta name="image" property="og:image" content="<?php echo $imageUrl; ?>">
    <meta property="og:image:width" content="<?php echo $imageWidth; ?>">
    <meta property="og:image:height" content="<?php echo $imageHeight; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.loudbicycle.com/game">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="LOUD BICYCLE | THE GAME">
    <meta name="twitter:description" content="<?php echo $imageDescription; ?>">
    <meta name="twitter:image" content="<?php echo $imageUrl; ?>">

    <meta property="og:author" content="Loud Bicycle">



    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <iframe id="gameIframe" src="https://3dstreet.github.io/loud-bicycle-game/" style="border:none; overflow:hidden; position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;" frameborder="0" scrolling="no" allowfullscreen></iframe>
    <script>
        document.getElementById('gameIframe').src = "https://3dstreet.github.io/loud-bicycle-game/";
    </script>
</body>
</html>

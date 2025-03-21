<html>
  <head>
    <title>Loud Bicycle Game</title>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-35839795-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-35839795-1');

        let quoteInterval;  // Making it globally available in this script

        async function displayRandomQuote() {
          // Wait for the necessary elements to be available
          while (!document.getElementById("quote-text") || !document.getElementById("quote-author")) {
            // Wait for 1/10th of a second before checking again
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          const quoteContainer = document.getElementById("quote-text");
          const authorContainer = document.getElementById("quote-author");

          // Create an array of indices, and shuffle it
          let indices = [...Array(quotes.length).keys()];
          indices = shuffle(indices);
          let currentIndex = 0;
          const randomQuote = quotes[indices[currentIndex]];
          const splitQuote = randomQuote.split(" - ");

          quoteContainer.textContent = splitQuote[0];
          authorContainer.textContent = "- " + splitQuote[1];

          currentIndex = 1;

          quoteInterval = setInterval(() => {
            const randomQuote = quotes[indices[currentIndex]];
            const splitQuote = randomQuote.split(" - ");
            
            quoteContainer.textContent = splitQuote[0];
            authorContainer.textContent = "- " + splitQuote[1];

            currentIndex = (currentIndex + 1) % quotes.length; // Cycle through indices
          }, 4000); // Change quote every 3 seconds
        }

        // Function to shuffle an array
        function shuffle(array) {
          let currentIndex = array.length, randomIndex;

          while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
              array[randomIndex], array[currentIndex]];
          }

          return array;
        }

        const quotes = [
          "\"Four wheels move the body, two wheels move the soul.\" - Gilda Texter",
          "\"My biggest fear is that when I die my wife will sell my bicycles for what I told her they cost.\" - Anonymous",
          "\"Life is like a 10-speed bicycle. Most of us have gears we never use.\" - Charles M. Schulz",
          "\"I thought of that while riding my bicycle.\" - Albert Einstein",
          "\"When I see an adult on a bicycle, I do not despair for the future of the human race.\" - H.G. Wells",
          "\"Nothing compares to the simple pleasure of a bike ride.\" - John F. Kennedy"
        ];

        displayRandomQuote();

  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta charset="UTF-8">
<!-- social things -->
<?php

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
    $imageUrl = "https://game.loudbicycle.com/screenshots/" . $validImages[$imageKey]['filename'];
    $imageDescription = $validImages[$imageKey]['description'];
    $imageWidth = $validImages[$imageKey]['width'];
    $imageHeight = $validImages[$imageKey]['height'];
} else {
    $imageUrl = "https://game.loudbicycle.com/screenshots/bicycle-collision-with-truck.jpg";
    $imageDescription = "Can you get the kids to school safely? Try the Loud Bicycle game!";
    $imageWidth = 1306;
    $imageHeight = 1023;
}

$assetsUrl = "https://game.loudbicycle.com/wp-assets"?>


<!-- Favicon -->
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo $assetsUrl; ?>/images/favicons/apple-touch-icon.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $assetsUrl; ?>/images/favicons/favicon-32x32.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="194x194" href="<?php echo $assetsUrl; ?>/images/favicons/favicon-194x194.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="192x192" href="<?php echo $assetsUrl; ?>/images/favicons/android-chrome-192x192.png?v=47BrWnbJxN">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $assetsUrl; ?>/images/favicons/favicon-16x16.png?v=47BrWnbJxN">
    <link rel="manifest" href="<?php echo $assetsUrl; ?>/images/favicons/site.webmanifest?v=47BrWnbJxN">
    <link rel="shortcut icon" href="<?php echo $assetsUrl; ?>/images/favicons/favicon.ico">

    <!-- Open Graph Tags -->
    <meta property="og:title" content="LOUD BICYCLE | THE GAME">
    <meta property="og:description" content="<?php echo $imageDescription; ?>">
    <meta name="image" property="og:image" content="<?php echo $imageUrl; ?>">
    <meta property="og:image:width" content="<?php echo $imageWidth; ?>">
    <meta property="og:image:height" content="<?php echo $imageHeight; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://game.loudbicycle.com">

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="LOUD BICYCLE | THE GAME">
    <meta name="twitter:description" content="<?php echo $imageDescription; ?>">
    <meta name="twitter:image" content="<?php echo $imageUrl; ?>">




  </head>
  <body>
    <a-scene
    keyboard-shortcuts="enterVR: false"
    fog="type: linear; color: #AAA; far: 100"
    renderer="gammaOutput: true"
    vr-mode-ui="enabled: false" 
    ar-mode-ui="enabled: false" 
    device-orientation-permission-ui="enabled: false"
    pool__interactable="container: #level; mixin: interactable-mixin; size: 20" 
    pool__bikes="container: #level; mixin: bike-pool-mixin; size: 6" 
    pool__smogs="container: #level; mixin: smog-mixin; size: 20" >
    <a-assets>
        <street-assets url="./3dstreet-assets/"></street-assets>
        <audio id="muffled-voice" src="./assets/muffled_voice.webm" preload="auto"></audio>
        <audio id="tires" src="./assets/tires.webm" preload="auto"></audio>

        <audio id="game-over" src="./assets/game-over.webm" preload="auto"></audio>
        <audio id="win-sound" src="./assets/win.webm" preload="auto"></audio>

        <audio id="ambient-sound-a" src="./assets/background/ambience_1-2.webm" loop preload="auto"></audio>
        <audio id="ambient-sound-b" src="./assets/background/ambience_3-4.mp3" loop preload="auto"></audio>
        <audio id="music-1" src="./assets/background/level_1.mp3" preload="auto"></audio>
        <audio id="music-2" src="./assets/background/level_2.mp3" preload="auto"></audio>
        <audio id="music-3" src="./assets/background/level_3.mp3" preload="auto"></audio>
        <audio id="music-4" src="./assets/background/level_4.mp3" preload="auto"></audio>
        
        <audio id="horn-sound" src="./assets/horn.webm" loop preload="auto"></audio>


        <audio id="shout-female-sound-0" src="./assets/shout_woman_1.webm" preload="auto"></audio>
        <audio id="shout-female-sound-1" src="./assets/shout_woman_2.webm" preload="auto"></audio>
        <audio id="shout-female-sound-2" src="./assets/shout_woman_3.webm" preload="auto"></audio>

        <audio id="shout-male-sound-0" src="./assets/shout_man_1.webm" preload="auto"></audio>
        <audio id="shout-male-sound-1" src="./assets/shout_man_2.webm" preload="auto"></audio>
        <audio id="shout-male-sound-2" src="./assets/shout_man_3.webm" preload="auto"></audio>
        
        <audio id="ouch-female-sound" src="./assets/ouch_woman.webm" preload="auto"></audio>
        <audio id="ouch-male-sound" src="./assets/ouch_man.webm" preload="auto"></audio>
        <audio id="ouch-baby-sound-0" src="./assets/ouch_baby1.webm" preload="auto"></audio>
        <audio id="ouch-baby-sound-1" src="./assets/ouch_baby2.webm" preload="auto"></audio>

        <audio id="powerup-sound" src="./assets/powerup.webm" preload="auto"></audio>
        <audio id="pop-sound" src="./assets/pop.webm" preload="auto"></audio>
        <audio id="sparkle-sound" src="./assets/sparkle.webm" preload="auto"></audio>
        
        <img id="comic-effect" src="./assets/comic_effect.png">
        <img id="grass-floor" src="./3dstreet-assets/materials/TexturesCom_Grass0052_1_seamless_S.jpg">
        <img id="sky" src="./3dstreet-assets/CGSkies_0343_doubled_2048.jpg">
        <a-mixin id="interactable-mixin" interactable  sound="src:#muffled-voice" material="color: red" color="#4CC3D9"></a-mixin>
        <a-mixin id="smog-mixin" smog geometry="primitive: box; width: 1; height: 1; depth: 0.2"></a-mixin>
        <a-mixin id="bike-pool-mixin" gltf-model="#cyclist-kid-asset" animation-mixer bike-train-member></a-mixin>
        <a-asset-item id="wave" src="./assets/wave.glb"></a-asset-item>
        <a-asset-item id="bell-asset" src="./assets/bell.glb"></a-asset-item>

        <!-- vehicles -->
        <a-asset-item id="sedan-taxi-rigged" src="./3dstreet-assets/sets/vehicles-rig/gltf-exports/draco/sedan-taxi-rig.glb"></a-asset-item>
        <a-asset-item id="sedan-rigged" src="./3dstreet-assets/sets/vehicles-rig/gltf-exports/draco/sedan-rig.glb"></a-asset-item>
        <a-asset-item id="box-truck-rigged" src="./3dstreet-assets/sets/vehicles-rig/gltf-exports/draco/isuzu-truck-rig.glb"></a-asset-item>
        <a-asset-item id="suv-rigged" src="./3dstreet-assets/sets/vehicles-rig/gltf-exports/draco/suv-rig.glb"></a-asset-item>

        <!-- loud bicycle pack -->
        <a-asset-item id="cyclist-cargo-asset" src="./3dstreet-assets/sets/cargo-bike-animation/gltf-exports/draco/cargo_bike_animation_v1.glb"></a-asset-item>
        <a-asset-item id="cyclist1-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/cyclist-1-animation-v1.glb"></a-asset-item>
        <a-asset-item id="cyclist2-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/cyclist-2-animation-v1.glb"></a-asset-item>
        <a-asset-item id="cyclist3-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/cyclist-3-animation-v1.glb"></a-asset-item>
        <a-asset-item id="cyclist4-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/cyclist-4-animation-v1.glb"></a-asset-item>
        <a-asset-item id="cyclist5-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/cyclist-5-animation-v1.glb"></a-asset-item>
        <a-asset-item id="cyclist-kid-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/Kid_cyclist_animation_v01.glb"></a-asset-item>
        <a-asset-item id="cyclist-dutch-asset" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/Dutch_cyclist_animation_v01.glb"></a-asset-item>
        <a-asset-item id="loud-bicycle-mini-asset" src="./3dstreet-assets/sets/cycle-horn/gltf-exports/draco/loud-bicycle-mini-horn.glb"></a-asset-item>
        <a-asset-item id="loud-bicycle-classic-asset" src="./3dstreet-assets/sets/cycle-horn/gltf-exports/draco/loud-bicycle-classic-horn.glb"></a-asset-item>
        <a-asset-item id="building-school-asset" src="./3dstreet-assets/sets/school-building/gltf-exports/draco/school-building.glb"></a-asset-item>
        <a-asset-item id="building-bar-asset" src="./3dstreet-assets/sets/irish-bar-building/gltf-exports/draco/irish-bar-building.glb"></a-asset-item>
        <a-asset-item id="vehicle-bmw-m2-asset" src="./3dstreet-assets/sets/vehicles-rig/gltf-exports/draco/BWM_m2-rig.glb"></a-asset-item>
        <a-asset-item id="prop-suburban-houses-asset" src="./3dstreet-assets/objects/suburbia/suburban-houses.glb"></a-asset-item>
        <a-asset-item id="prop-banner-wfh-asset" src="./3dstreet-assets/sets/wfh-banner/gltf-exports/draco/wfh-banner.glb"></a-asset-item>
        <a-asset-item id="prop-raygun-asset" src="./3dstreet-assets/sets/ray-gun/gltf-exports/draco/rayGun.glb"></a-asset-item>
        <a-asset-item id="scrubber-asset" src="./3dstreet-assets/sets/c02-scrubber/gltf-exports/draco/co2-scrubber.glb"></a-asset-item>
        <a-asset-item id="prop-heart-asset" src="./assets/heart-model_v01.glb"></a-asset-item>
        <a-asset-item id="prop-finish-asset" src="./assets/finish.glb"></a-asset-item>
        <a-asset-item id="prop-parklet" src="./3dstreet-assets/sets/street-props-parklet/gltf-exports/draco/parklet.glb"></a-asset-item>
        <a-mixin id="cyclist-cargo" gltf-model="#cyclist-cargo-asset"></a-mixin>
        <a-mixin id="cyclist1" gltf-model="#cyclist1-asset"></a-mixin>
        <a-mixin id="cyclist2" gltf-model="#cyclist2-asset"></a-mixin>
        <a-mixin id="cyclist3" gltf-model="#cyclist3-asset"></a-mixin>
        <a-mixin id="cyclist4" gltf-model="#cyclist4-asset"></a-mixin>
        <a-mixin id="cyclist5" gltf-model="#cyclist5-asset"></a-mixin>
        <a-mixin id="cyclist-kid" gltf-model="#cyclist-kid-asset"></a-mixin>
        <a-mixin id="cyclist-dutch" gltf-model="#cyclist-dutch-asset"></a-mixin>
        <a-mixin id="loud-bicycle-mini" gltf-model="#loud-bicycle-mini-asset"></a-mixin>
        <a-mixin id="loud-bicycle-classic" gltf-model="#loud-bicycle-classic-asset"></a-mixin>
        <a-mixin id="building-school" gltf-model="#building-school-asset"></a-mixin>
        <a-mixin id="building-bar" gltf-model="#building-bar-asset"></a-mixin>
        <a-mixin id="vehicle-bmw-m2" gltf-model="#vehicle-bmw-m2-asset"></a-mixin>
        <a-mixin id="prop-suburban-houses" gltf-model="#prop-suburban-houses-asset"></a-mixin>
        <a-mixin id="prop-banner-wfh" gltf-model="#prop-banner-wfh-asset"></a-mixin>
        <a-mixin id="scrubber" gltf-model="#scrubber-asset"></a-mixin>

        <!-- just for the show -->
        <a-asset-item id="just-bike-dutch1" src="./assets/bikes/dutch_cycle.glb"></a-asset-item>
        <a-mixin id="just-bike-dutch" gltf-model="#just-bike-dutch1"></a-mixin>
        <a-asset-item id="just-bike-1" src="./3dstreet-assets/sets/cyclist-animation/gltf-exports/draco/cyclist-1-animation-v1.glb"></a-asset-item>
        <a-mixin id="just-bike" gltf-model="#just-bike-1"></a-mixin>
        <a-asset-item id="kid-bike-1" src="./assets/bikes/kid_bike.glb"></a-asset-item>
        <a-mixin id="kid-bike" gltf-model="#kid-bike-1"></a-mixin>
       

      </a-assets>
      <a-entity id="ambient-light" light="type: ambient; color: #222"></a-entity>
      <a-entity id="directional-light" light="type: directional; color: #444; intensity: 0.6" position="-0.5 1 1"></a-entity>
      <a-sky src="#sky"></a-sky>
      <!--            center/height/  distance away -->
      <a-camera position="0 4 4" rotation="-15 0 0" wasd-controls-enabled="false" look-controls-enabled="false" fov="90"></a-camera>
      <a-entity id="bell-indicator" gltf-model="#bell-asset" visible="false" scale="0.75 0.75 0.75"></a-entity>

      <!-- the raygun blast wave -->
      <a-entity id="flash-light" light="type: point; color: #f2ad13; decay: 0.23; distance: 25.35; intensity: 0.0" animation="property: light.intensity; from: 0.0; to: 5.0; dur: 400; dir: alternate; loop: 1; startEvents: startAnimation" position="0 1 -0.40039" rotation="-19.74 0 0"></a-entity>

      <a-entity id="interactable-spawner" interactable-pool></a-entity>
      <a-entity id="smog-spawner" smog-pool></a-entity>
      <a-entity id="bike-train-spawner" bike-train-pool></a-entity>

      <a-entity id="game-manager" game-manager sound="src: url(./assets/breath_caugh.webm);"></a-entity>
      <a-entity noise-meter="clickerId:bell; meterId:special-meter; isSmall:true; keyCode:ArrowUp;" sound="src: url(./assets/bell.webm);"></a-entity>
      <a-entity id="horn-noise" noise-meter="clickerId:main; meterId:main-meter; isSmall:false; keyCode:Control"></a-entity>
      <a-entity id="ray-noise" noise-meter="clickerId:ray; meterId:ray-meter; keyCode:Shift; lightId: flash-light" sound="src: url(./assets/raygun2.webm);"></a-entity>


      <a-entity
        id="model"
        geometry="primitive: box; depth: 1.5; width: 0.6"
        material="visible: false;"
        sound="src: url(./assets/ouch_woman.webm);"
        player-controller="speed: 2.0"
        aabb-collider="objects:[interactable], [smog]"
      >
        <a-entity id="spot-light" light="type: spot; angle: 15.97; color: #f5f0e5; penumbra: 0.54; decay: 0.23; distance: 25.35; intensity: 1.47" position="0 1 -0.40039" rotation="-19.74 0 0"></a-entity>

        <!-- <a-entity id="back-light" geometry="primitive: plane; height: 0.02; width: 0.06" material="shader: flat; color: red" position="-0.02, 0.949 0.432"></a-entity> -->
        <a-entity id="player-cyclist"  gltf-model="#cyclist1-asset" animation-mixer rotation="0 180 0"></a-entity>

        <!-- the wave graphic for bell and horn -->
        <a-entity id="noise-indicator" gltf-model="#wave" visible="false" noise-indicator position="0 1 0">
         <a-sphere id="noise-indicator-collider" visible="false" aabb-collider="objects:[interactable], [bike-train-member]"></a-sphere>
        </a-entity>
        <!-- <a-entity mixin="scrubber" position="-0.03 0.81 -0.77" rotation="0 180 0"></a-entity> -->
      </a-entity>

      <a-entity id="level" animation="property: position; to: 0 0 400; autoplay: false; dur: 100000; easing: linear; loop: false">
        <a-plane src="#grass-floor" height="1000" width="1000" rotation="-90 0 0" position="0 -0.05 0" material="repeat: 20 20"></a-plane>
      </a-entity>

    </a-scene>



<!-- title and subtitle boxes -->
<div id="meta-title-container" class="disabled">
<div id="title-container">
    <div id="title"><center>
      1. Lead the kids to school</center>
    </div>
    <div id="subtitle">
      tap the bell for them to follow you
      </div>
</div>
</div>

<div id="logo">
  <img src="./assets/logo-white.svg">
</div>


<!-- end animation stars popping sector-->
<div id="congrats-animation" class="disabled">
  <div id="congrats-animation-level">
    <img id="level-end-image" class="level-end-images" src="./assets/levels/home.png" >
  </div>
  <div id="congrats-animation-stars">
    <img id="level-end-stars" class="level-end-images" src="./assets/levels/0-stars.png">
  </div>

</div>





<!-- swipe left/right instructions-->
    <div id="instructions2">
      <img src="./assets/instructions/turn-swipe.gif" >
    </div>

<!-- special weapon, bell-->
    <div id="bell">
      <img class="icon" src="./assets/bell.svg" >
    </div>
    <progress id="special-meter" class="high-meter" value="0" max="100"></progress>

<!-- main weapon, shout, Loud Classic, Loud Mini -->
    <div id="main">
      <img class="icon" src="./assets/shout.svg" >
    </div>
    <progress id="main-meter" class="high-meter" value="0" max="100"></progress>

<!-- Raygun -->
  <div id="ray">
    <img class="icon" src="./assets/gun-ray.png" >
  </div>
  <progress id="ray-meter" style="display: none" class="high-meter" value="0" max="100"></progress>

<!-- main game menu -->
    <div id="game-menu">
      <div id="game-menu-bg">
      </div>
      <div id="landing">
        <img src="./assets/logo__loud-bicycle.svg" alt="Loud Bicycle Logo">
        <h1 id="landing-label">The Loud Bicycle game is loading ...</h1>
          <div id="quote-container">
            <p id="quote-text">
            </p>
            <p id="quote-author" id="quote-author"></p>
          </div>
      </div>
      <div id="main-menu" class="disabled gone">
        <div id="main-menu-top">
          <div id="intro-modal" class="disabled">

            <!-- <div id="button-container">
              <button class="btn" onclick="setSettingsEnabled(true)"><span class="text">Settings</span></button> &nbsp;
              <button class="btn" onclick="setCreditsEnabled(true)"><span class="text">Credits</span></button>
            </div> -->

            <div id="play-button">
              <!-- play button styled like the continue button-->
              <button id="tutorial-play" class="btn"><span class="text">Play</span> &nbsp <span class="glyphicon">▶</span></button>
            </div>
            <div id="icon-legend">
              <img src="./assets/instructions/icon-legend.png">
            </div>
            <div id="tutorial">
              <center>
                <img src="./assets/instructions/just-bikes.png">
              </center>
            </div>

            
          </div>
          
        </div>
      </div>
      <div id="level-end-screen" class="disabled">

        <div id="level-end-container">

          <div id="level-end-image-container">
            <!-- <div id="handlebar"> -->
            <div id="level-end-levelId-container">
              <img id="handlebar-image" class="level-end-images" src="./assets/handlebar.svg" style="opacity: 0;">
            </div>


            <div id="handlebar-bar">
              <img id="handlebar-bar-image" class="level-end-images" src="./assets/handlebar.svg">

            </div>

            <div id="handlebar-bell">
              <img id="handlebar-bell-image" class="level-end-images" src="./assets/bell.svg">
            </div>
            <div id="handlebar-mini">
              <img class="level-end-images handlebar-disabled" src="./assets/loud_mini.png">
            </div>
            <div id="handlebar-raygun">
              <img class="level-end-images handlebar-disabled" src="./assets/gun-ray.png">
            </div>
            <div id="handlebar-screws" >
              <img class="level-end-images handlebar-disabled" src="./assets/security-screws.png">
            </div>
          </div>
          <!-- </div> -->

          <div id="level-end-image-container-fail">
            <img id="level-end-image-fail-image" class="level-end-images" src="./assets/screenshots/BMW.jpg" class="level-end-images gone">
          </div>
          

          <div id="level-end-content"></div>
          <div id="level-end-data"></div>
  
          <div id="share-links">
            <span class="action-button-container">
              Share your <span id="share-text-span">win</span>!
              <div id="grouping socials">
              <span class="action-confirmation" style="display: none;">Copied. Paste to share!</span>
              <span class="copy-text action-button">
                <img src="./assets/social/copy.png" alt="Copy text">                
              </span>
                  <span class="share-facebook action-button">
                    <img src="./assets/social/facebook_1.png" alt="Share Facebook">
                  </span>
                  <span class="share-twitter action-button">
                    <img src="./assets/social/twitter_1.png" alt="Share Twitter">
                  </span>
                  <span class="share-whatsapp action-button">
                    <img src="./assets/social/whatsapp_1.png" alt="Share Whatsapp">
                  </span>
                </div>
          </div>
    
          <!-- <p>Crash statistics coming soon...</p>           -->
          <div id="level-end-buttons" class="horizontal-buttons">
            <button id="level-end-retry" class="btn" onclick="replayLevel();">   <span id="replay-button-text" class="text">Replay</span> &nbsp   <span class="glyphicon2">↻</span></button>
            <button id="level-end-continue" class="btn" onclick="setEndScreenEnabled(false); setMenuEnabled(false)"><span id="continue-button-text" class="text">Continue</span> &nbsp <span class="glyphicon">▶</span></button>  
            <!-- when fail should be retry and -->
          </div>
        </div>
        <div id="powered-by-credits">
          <p>Powered by <a href="https://loudbicycle.com">Loud Bicycle</a> and <a href="https://www.3dstreet.org/" target="_blank"><img src="./assets/3dstreet.svg"></a></p>
        </div>
      </div>
      <div id="level-selection" class="disabled">
        <div id="game-title">
          Loud Bicycle THE GAME
        </div>
      
        <div id="level-container">
          <img id="level-background" src="./assets/levels/background.png" alt="Level selection background">
          <img id="level-1-button" class="level-button" src="assets/levels/school.png" alt="Level 1">
          <img id="level-2-button" class="level-button" src="assets/levels/office.png" alt="Level 2">
          <img id="level-3-button" class="level-button" src="assets/levels/bar.png" alt="Level 3">
          <img id="level-4-button" class="level-button" src="assets/levels/home.png" alt="Level 4">

          <!-- <img id="level-shop-button" class="level-shop disabled" src="assets/levels/shop.png" alt="Loud Shop"> -->
          <img id="level-5-button" class="level-button level-5-button-class gone" src="assets/levels/shop.png" alt="Loud Shop" style="border: none; border-radius: 0px">
          
          <div id="level-stars-all" class="gone">
          <img id="level-1-stars" class="level-star" src="assets/levels/0-stars.png">
          <img id="level-2-stars" class="level-star" src="assets/levels/1-stars.png">
          <img id="level-3-stars" class="level-star" src="assets/levels/2-stars.png">
          <img id="level-4-stars" class="level-star" src="assets/levels/3-stars.png">
        </div>
        </div>
        <!-- <button class="btn back-button" onclick="setLevelSelectionEnabled(false); setMenuEnabled(true)"><span class="text">Back</span></button> -->
      </div>
      
      <div id="pause-menu" class="disabled">
        <div id="pause-menu-container">
          <button id="continue" class="btn"><span class="text">Continue ▶</span></button>
          <button id="quit" class="btn"><span class="text">Quit</span></button>
        </div>
      </div>
      <div id="credits" class="disabled">
        <p>
          A game by Loud Bicycle
        </p>
        <h5>
          Developed by
        </h5>
        <p>
          Jonathan Lansey
        </p>
        <p>
          Kieran Farr
        </p>
        <p>
          Florian Isikci
        </p>
        <button class="btn" onclick="setCreditsEnabled(false)"><span class="text">Back</span></button>
      </div>
      <div id="settings" class="disabled">
        <div>
          <input type="range" id="volume" name="volume" value="1"
                 min="0" max="1" step="0.01" onchange="setGlobalVolume(this.value)">
          <label for="volume">Volume</label>
        </div>
        <button class="btn" onclick="setSettingsEnabled(false)"><span class="text">Back</span></button>
      </div>
    </div>

    <!-- how many lives / hearts you have -->
    <div id="life-indicator-container">
      <div class="life-indicator"></div>
      <div class="life-indicator"></div>
      <div class="life-indicator"></div>
    </div>
    <div id="score-container">
      <p id="score">0</p>
    </div>
  </body>
  <script>
    let sceneEl = document.querySelector('a-scene');
    let gameMenu = document.querySelector('#game-menu');
    let landing = document.querySelector('#landing');
    let credits = document.querySelector('#credits');
    let mainMenu = document.querySelector('#main-menu');
    let endScreen = document.querySelector('#level-end-screen');
    let settings = document.querySelector('#settings');
    let levelSelection = document.querySelector('#level-selection');
    let pauseMenu = document.querySelector('#pause-menu');
    let introModalTimer1 = null;
    let introModalTimer2 = null;

    // Level ids in the same order as userStars object
    const levelIds = ['level-1-button', 'level-2-button', 'level-3-button', 'level-4-button'];

    sceneEl.addEventListener('loaded', () => {
      if(window.innerWidth <= 600) {
        document.querySelector('a-camera').setAttribute('fov', 110);
      }
      landing.classList.add('disabled');
      mainMenu.classList.remove('disabled');
      mainMenu.classList.remove('gone');
      mainMenu.classList.add('enabled');

      // enable level selection
      document.querySelector('#level-selection').classList.remove('disabled');
      this.updateLevelButtons();
      // change the border color of level-1-button to gray
      document.querySelector('#level-1-button').classList.remove('border-yellow');

      if(quoteInterval) clearInterval(quoteInterval);

      if(gameManager && gameManager.userStars && gameManager.userStars['level1']) {
        document.querySelector('#level-stars-all').classList.remove('gone');
        // document.querySelector('#level-stars-all').classList.add('enabled');
        return;
      }

      // highlight the school level with the sparkle sound after 300 ms
      introModalTimer1 = setTimeout(() => {

        // only do this if you are not already playing (gamestate 3)
        if (window.gameManager.getGameState() === 3){
          this.powerupAudio = document.querySelector('#sparkle-sound');
          this.powerupAudio.currentTime = 0; // Reset the audio to the start
          this.powerupAudio.play();
          
            document.querySelector('#level-1-button').classList.add('highlight');        
          // increase the width of level-1-button
          document.querySelector('#level-1-button').style.width = '30%';
          // move to the left by 3%
          document.querySelector('#level-1-button').style.left = '35%';
          document.querySelector('#level-1-button').classList.add('border-yellow');
        }
        
        // move to the intro-modal screen after 3. seconds
        introModalTimer2 = setTimeout(() => {
          document.querySelector('#intro-modal').classList.remove('disabled');
          document.querySelector('#intro-modal').classList.add('enabled');

          // disable the level-selection screen
          document.querySelector('#level-selection').classList.add('disabled');
          document.querySelector('#level-selection').classList.remove('enabled');

          // undo the changes to the level-1-button
          document.querySelector('#level-1-button').style.width = '24%';
          document.querySelector('#level-1-button').style.left = '38%';

          // enable the title
          document.querySelector('#meta-title-container').classList.remove('disabled');
          document.querySelector('#meta-title-container').classList.add('enabled');

          // remove the game-title
          document.querySelector('#game-title').classList.add('gone');

          // reenable level-stars-all
          document.querySelector('#level-stars-all').classList.remove('gone');
          // document.querySelector('#level-stars-all').classList.add('enabled');

          // set to enabled
          // document.querySelector('#level-5-button').classList.remove('disabled');
          document.querySelector('#level-5-button').classList.remove('gone');
          // document.querySelector('#level-shop-button').classList.add('enabled');

          // raise the horn and shout above the menu for the first bit
          // but if you are already playing, don't do this
          console.log("gamestate: " + window.gameManager.getGameState())
          if (window.gameManager.getGameState() === 3){
            document.querySelector('#main').style.zIndex = 11;
            document.querySelector('#bell').style.zIndex = 11;
            document.querySelector('#meta-title-container').style.zIndex = 11;
          }
          
        }, 3000);


      }, 1000);


    })

    function setCreditsEnabled(b) {
      if(b) {
        mainMenu.classList.remove('enabled');
        mainMenu.classList.add('disabled');
        mainMenu.classList.add('gone');
        credits.classList.add('enabled');
        credits.classList.remove('disabled');
      } else {
        mainMenu.classList.remove('disabled');
        mainMenu.classList.remove('gone');
        mainMenu.classList.add('enabled');
        credits.classList.remove('enabled');
        credits.classList.add('disabled');
      }
    }

    function setSettingsEnabled(b) {
      if(b) {
        mainMenu.classList.remove('enabled');
        mainMenu.classList.add('disabled');
        mainMenu.classList.add('gone');
        settings.classList.add('enabled');
        settings.classList.remove('disabled');
      } else {
        mainMenu.classList.remove('disabled');
        mainMenu.classList.remove('gone');
        mainMenu.classList.add('enabled');
        settings.classList.remove('enabled');
        settings.classList.add('disabled');
      }
    }

    function setEndScreenEnabled(b, message) {

      // overwrite with a new message if you just beat with 3 stars
      if (gameManager.justBeat12Stars){

        message = `
                <img src="./assets/let-cars-share-road.png" class="icon" style="float: right; margin: 0 10px 10px 10px;">
                <img src="./assets/finalwin2.jpg" class="icon" style="float: right; margin: 0 10px 10px 10px;">
                                <h1>Congratulations you beat the game!</h1>
                                    <p>
                                    We want to send you stickers in real life 🎉 <a href="https://loudbicycle.com/horn">CLICK HERE to visit the shop</a> use coupon code BIKEHERO to get stickers for free.
                                </p>`

      }

      if(b) {
        document.querySelector('#game-menu-bg').style.opacity = 1;
        endScreen.classList.add('enabled');
        endScreen.classList.remove('disabled');
        levelSelection.classList.remove('enabled');
        levelSelection.classList.add('disabled');
        if(message) {
          endScreen.querySelector('#level-end-content').innerHTML = message;
        }
      } else {
        // bop these guys down, wherever you came from
        endScreen.classList.remove('enabled');
        endScreen.classList.add('disabled');
        levelSelection.classList.add('enabled');
        levelSelection.classList.remove('disabled');

        }
      }



    function setPauseEnabled(b) {
      if(b) {
        pauseMenu.classList.add('enabled');
        pauseMenu.classList.remove('disabled');
      } else {
        pauseMenu.classList.remove('enabled');
        pauseMenu.classList.add('disabled');
      }
    }

    function updateLevelButtons() {

      console.log("updating level buttons");

      // Star ids in the same order
      const starIds = ['level-1-stars', 'level-2-stars', 'level-3-stars', 'level-4-stars'];

      // Make sure gameManager and userStars exist
      if(gameManager && gameManager.userStars) {
        // Iterate over each level and update the button image
        for(let i = 0; i < levelIds.length; i++) {
          // Get current level id
          let levelId = levelIds[i];
          // Get the corresponding button element
          let levelButton = document.getElementById(levelId);
          // Get the corresponding star element
          let starImage = document.getElementById(starIds[i]);

          // reset it in case we made it extra wide to emphasise it earlier
          levelButton.style.width = '24%';
          levelButton.style.transition = '';

          let stars = gameManager.userStars[`level${i+1}`];
          // Check if the user has completed this level or it's the level user is currently at
          if(gameManager.userStars[`level${i+1}`] !== null) {
            // levelButton.style.filter = 'grayscale(0%)';
            levelButton.classList.remove('level-button-grayscale');
            levelButton.classList.remove('border-yellow');
            // add stars
            starImage.src = `assets/levels/${stars}-stars.png`;
            starImage.style.display = 'inline-block'; 

          } else if(gameManager.userStars[`level${i}`] !== null) {
            // This is the level user is currently at
            // levelButton.style.filter = 'grayscale(0%)';
            levelButton.classList.remove('level-button-grayscale');
            levelButton.classList.add('border-yellow');
            starImage.style.display = 'none';
          } else {
            // The level is not reached yet
            // levelButton.style.filter = 'grayscale(100%)';
            levelButton.classList.add('level-button-grayscale');
            levelButton.classList.remove('border-yellow');
            starImage.style.display = 'none';
          }
        }

         // if you have just beat the level
         if (window.gameManager.justBeatLevel != null && window.gameManager.justBeatLevel < 3){
          console.log("Just beat a level.");
          // just pause here for half a second see what happens, also play the sparkle sound

          let levelId = levelIds[window.gameManager.justBeatLevel];
          // Get the corresponding button element
          let levelButton = document.getElementById(levelId);
          // change the button
          levelButton.classList.remove('border-yellow');

          // levelButton.style.filter = 'grayscale(100%)';
          levelButton.classList.add('level-button-grayscale');
          // levelButton.style.transition = 'filter 0.75s';
          levelButton.style.transition = 'filter 0.75s, width 0.75s';

          setTimeout(() => {
            this.powerupAudio = document.querySelector('#sparkle-sound');
            this.powerupAudio.currentTime = 0; // Reset the audio to the start
            this.powerupAudio.play();

            levelButton.classList.add('highlight'); 
            levelButton.classList.add('border-yellow');       
            // levelButton.style.filter = 'grayscale(0%)';
            levelButton.classList.remove('level-button-grayscale');
            levelButton.style.width = '28%';
            console.log("just expanded the business");
            window.gameManager.justBeatLevel = null;

          }, 500);
        }
      }
    }


    function setLevelSelectionEnabled(b) {
      // update the level buttons based on how far you've gotten in the game
      updateLevelButtons();
      
      // bop these guys down, wherever you came from
      document.querySelector('#main').style.zIndex = 9;
      document.querySelector('#bell').style.zIndex = 9;

      if(b) {
        let hasPlayedBefore = localStorage.getItem("played-loud-bicycle");

        mainMenu.classList.remove('enabled');
        mainMenu.classList.add('disabled');
        mainMenu.classList.add('gone');
        if(hasPlayedBefore) {
          levelSelection.classList.add('enabled');
          levelSelection.classList.remove('disabled');
        } else {
          // Set key for loading level selection after playing the first time
          localStorage.setItem("played-loud-bicycle", '1')
          window.gameManager.generateLevel(0);
          window.gameManager.playLevel();
          setMenuEnabled(false);
        }
      } else {
        levelSelection.classList.remove('enabled');
        levelSelection.classList.add('disabled');
      }


    }

    let audioVolume = 1.0;

    function setGlobalVolume(amount) {
      sceneEl.audioListener.setMasterVolume(amount)
    }

    function setMenuEnabled(b) {

      // clear the introModalTimer
      console.log("clearing timer");
      clearTimeout(this.introModalTimer1);
      clearTimeout(this.introModalTimer2);
      document.querySelector('#main').style.zIndex = 9;
      document.querySelector('#bell').style.zIndex = 9;


      updateLevelButtons();
      landing.classList.add('disabled');
      if(b) {
        mainMenu.classList.remove('disabled');
        mainMenu.classList.remove('gone');
        mainMenu.classList.add('enabled');
      } else {
        mainMenu.classList.add('disabled');
        mainMenu.classList.add('gone');
        mainMenu.classList.remove('enabled');
      }
    }

    function replayLevel() {
        setMenuEnabled(false);
        setLevelSelectionEnabled(false)
        setEndScreenEnabled(false);

        // this is somewhat duplicitive, related to the 'hasPlayedBefore' variable which is vestigal
        levelSelection.classList.remove('enabled');
        levelSelection.classList.add('disabled');
        
        window.gameManager.generateLevel(window.gameManager.getLevelIndex());
        window.gameManager.playLevel();        
    }

// // Call the function when the page loads
// displayRandomQuote();

  let buttons = document.querySelectorAll(".level-button");

  buttons.forEach(button => {
    button.addEventListener('mousedown', function(e) {
      e.preventDefault();
    });
  });

  
  function shareContent() {

    document.querySelector('.share-facebook').addEventListener('click', function() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=https://game.loudbicycle.com/${gameManager.appendToLink}`;
        window.open(url, '_blank');
    });

    document.querySelector('.share-twitter').addEventListener('click', function() {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(gameManager.shareText + ' https://game.loudbicycle.com/' + gameManager.appendToLink)}`;
        window.open(url, '_blank');
    });

    document.querySelector('.share-whatsapp').addEventListener('click', function() {
        const url = `https://wa.me/?text=${encodeURIComponent(gameManager.shareText + ' https://game.loudbicycle.com/' + gameManager.appendToLink)}`;
        window.open(url, '_blank');
    });

    document.querySelector('.copy-text').addEventListener('click', function() {
        const textToCopy = `${gameManager.shareText} https://game.loudbicycle.com/${gameManager.appendToLink}`;
        navigator.clipboard.writeText(textToCopy).then(function() {
            document.querySelector('.action-confirmation').style.display = "inline";
            setTimeout(function() {
                document.querySelector('.action-confirmation').style.display = "none";
            }, 1000);
        });
    });
}

function isMobileDevice() {
    return (window.innerWidth <= 600) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0) || 
           /Mobi|Android/i.test(navigator.userAgent);
}

window.onload = function() {
    shareContent();
    checkScreenSize();
};

function checkScreenSize() {
    const turnInstructions = document.querySelector('#instructions2 img');
    const iconLegend = document.querySelector('#icon-legend img');

    if (isMobileDevice()) {
        // For mobile devices
        turnInstructions.src = './assets/instructions/turn-swipe.gif';
        iconLegend.src = './assets/instructions/icon-legend.png';
    } else {
        // For non-mobile devices
        turnInstructions.src = './assets/instructions/turn-keys.gif';
        iconLegend.src = './assets/instructions/icon-legend-keys.png';
    }
}

window.addEventListener('resize', checkScreenSize);




  </script>
</html>

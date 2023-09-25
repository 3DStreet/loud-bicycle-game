export const SIDE_STREET_URL = './levels/side_street-26f46f90-bd11-11ec-b3b1-39567990c5f6.json';

/*
* To enable the spawning of interactable types in a level, add them to the 'interactables' array
* 'side' - Intersection
* 'driveway' - Driveway
* 'leftCross' - Left Cross
* 'rightCross' - Right Cross
* 'rightHook' - Right Hook
*/

export const gameData = {
    cheatSpeed: 7.0,
    levels: [
        {
            nameId: 'school',
            levelNumber: 1,
            title: 'Lead the kids to school',
            subtitle: 'Tap the bell to pick up a kid',
            fogNear: 40000,
            fogFar: 40000,
            fogColor: '#00ffff',
            ambientLightColor: '#0000', 
            directionalLightColor: '#FFFFFF', 
            directionalLightIntensity: 1.0, 
            directionalLightPosition: '-5 8 4',
            hasBikeLight: false, 

// tmp
            // directionalLightIntensity: 1.0, 
            // directionalLightPosition: '5 5 -5',


            //  (n streets*length +  )
            endDistance: 3 * 50 + 2 * 10 + 20 - 5,
            startingLane: 2,
            amountLanes: 3,
            laneWidth: 3.048,
            amountBikePool: 3,
            bikePoolSpawnOffset: 1.0,
            bikePoolIsAdult: false,
            streetLength: 50,
            streetWidth: 20,
            intersectionWidthOffset: 10,
            intersectionCurbMargins: {
                top: 4.6,
                bottom: 4.6,
                left: 10.0,
                right: 7.0
            },
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#building-school-asset',

            ambientSoundId: '#ambient-sound-a',
            ambientSoundVolume: 0.7,

            musicSoundId: '#music-1',

            onInteractableHitSoundId: '#muffled-voice',

            tutorial: true,
            
            spawnMinis: true,
            spawnHearts: true,
            interactables: {
                'driveway': 0.85,
                'rightCross': 1.0
            },
            streetUrls: [
                './levels/street_1.json',
                './levels/street_0.json',
                // './levels/street_1.json',
                './levels/street_1b.json',
                // './levels/street_1b.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function(score) {
                return `
                <img src="./assets/loud-mini-onbike.jpg" class="icon" style="float: right; margin: 0 -10% 10px 10px;">
                <h1>You won Loud Mini!</h1>
                It sounds like a car horn. 
                <a href="https://www.loudbicycle.com" target="_blank">Learn more ...</a>
                
            `
            }
        },
        {
            nameId: 'office',
            levelNumber: 2, 
            title: 'Lead work friends to the office',
            subtitle: 'Tap the bell to pick up a friend',
            fogNear: 40000,
            fogFar: 40000,
            fogColor: '#AAA',
            directionalLightColor: '#FFFFFF', 
            directionalLightIntensity: 1.0, 
            // directionalLightPosition: '0.2 0.3 0.1',
            //           [right/-left, up/down, forward/back]

            // morning
            directionalLightPosition: '-5 8 4',

            // afternoon
            // directionalLightPosition: '5 8 -4',

            // sunset
            // directionalLightPosition: '5 5 -10',
            hasBikeLight: false, 
            endDistance: 3 * 50 + 2 * 10 + 20 - 5,
            startingLane: 1,
            amountLanes: 3,
            amountBikePool: 3,
            bikePoolSpawnOffset: 1,
            bikePoolIsAdult: true,
            laneWidth: 3.048,
            streetLength: 50,
            streetWidth: 20,
            intersectionWidthOffset: 10,
            intersectionCurbMargins: {
                top: 4.6,
                bottom: 4.6,
                left: 10.0,
                right: 7.0
            },
            startWithMini: true,
            spawnRaygun: true,
            spawnHearts: true,
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#prop-suburban-houses-asset',
            lastBuildingAdditionalAssetId: '#prop-banner-wfh-asset',
            ambientSoundId: '#ambient-sound-a',
            ambientSoundVolume: 0.2,

            musicSoundId: '#music-2',

            onInteractableHitSoundId: '#tires',

            tutorial: false,
            
            interactables: {
                'rightHook': 0.3,
                'rightCross': 0.7,
                'driveway': 0.8
            },
            streetUrls: [
                './levels/street_2.json',
                './levels/street_2.json',
                // './levels/street_2b.json',
                // './levels/street_2b.json',
                './levels/street_2b.json',
                // './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function(score) {
                return `
                        <h1>You got the Ray Gun!</h1>
                        Turn cars into bicycles, awaiting approval by FDA/FCC.
                        `
            }
        },
        {
            nameId: 'bar',
            levelNumber: 3,
            title: 'Get to the bar. <img id="shift" src="./assets/instructions/shift.png">',
            subtitle: null,
            fogNear: 0,
            fogFar: 550,
            fogColor: '#646464',
            ambientLightColor: '#646464', 
            directionalLightColor: '#646464', 
            directionalLightIntensity: 1.0, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: false, 
            endDistance: 4 * 50 + 3 * 10 + 20 + 4,
            startingLane: 2,
            amountLanes: 3,
            amountBikePool: 0,
            bikePoolSpawnOffset: 1,
            bikePoolIsAdult: true,
            disableBikePool: true,
            laneWidth: 3.248,
            streetLength: 50,
            streetWidth: 20,
            intersectionWidthOffset: 28,
            intersectionCurbMargins: {
                top: 4.6,
                bottom: 4.6,
                left: 10.0,
                right: 7.0
            },
            startWithMini: true,
            startWithRaygun: true,
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#building-bar-asset',
            ambientSoundId: '#ambient-sound-b',
            ambientSoundVolume: 0.2,
            musicSoundId: '#music-3',

            onInteractableHitSoundId: '#tires',

            tutorial: false,

            interactables: {
                'rightHook': 0.8,
                'rightCross': 0.9,
                'driveway': 0.8,
                'side': 1.0,
                'parking': 1.0,
                'double-parking': 1.0
            },
            streetUrls: [
                './levels/street_3.json',
                './levels/street_3.json',
                './levels/street_3b.json',
                './levels/street_3b.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function() {
                return `<h1>You got to the bar!</h1>
                <div class="ballot-box">
                <h2>Office of the Mayor - Ballot</h2>
                <p>VOTE: Should Loud Street have a protected bike lane?</p>
                <div class="ballot-buttons">
                    <button id="yesBtn">YES</button>
                    <button id="noBtn">NO</button>
                </div>
                <div id="results" style="display: none;">
                <div class="bar yes"><div class="background"></div><span>99% YES</span></div>
                <div class="bar no"><div class="background"></div><span>1% NO</span></div>
                </div>
            </div>
            
                      `
            }
        },
        {
            nameId: 'home',
            levelNumber: 4,
            title: 'Get all the way home',
            subtitle: null,
            fogNear: 3,
            fogFar: 40,
            fogColor: '#242424',
            ambientLightColor: '#171717', 
            directionalLightColor: '#171717', 
            directionalLightIntensity: 0.6, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: true, 
            endDistance: 6 * 50 + 5 * 10 + 20 + 12,
            startingLane: 2,
            amountLanes: 3,
            amountBikePool: 0,
            bikePoolSpawnOffset: 1,
            bikePoolIsAdult: true,
            disableBikePool: true,
            laneWidth: 3.048,
            streetLength: 50,
            streetWidth: 20,
            intersectionWidthOffset: 10,
            intersectionCurbMargins: {
                top: 4.6,
                bottom: 4.6,
                left: 10.0,
                right: 7.0
            },
            startWithMini: true,
            startWithRaygun: true,
            spawnHearts: true,
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#prop-suburban-houses-asset',
            ambientSoundId: '#ambient-sound-b',
            ambientSoundVolume: 0.2,
            musicSoundId: '#music-4',

            onInteractableHitSoundId: '#tires',

            tutorial: false,
            interactables: {
                'rightHook': 0.4,
                'rightCross': 0.8,
                'driveway': 0.6,
                'side': 0.8
            },
            streetUrls: [
                './levels/street_3b.json',
                './levels/street_3.json',
                './levels/street_2b.json',
                './levels/street_2.json',
                './levels/street_1b.json',
                './levels/street_1.json'
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function() {
                return `<img src="./assets/security-screws.png" class="icon" style="float: right; margin: 0 10px 10px 10px;">
                        <img src="./assets/loud-mini-onbike.jpg" class="icon" style="float: right; margin: 0 10px 10px 10px;">
                        <h1>Congratulations you won!</h1>
                            <p>
                            You get free Loud Mini security screws in real life <a href="https://loud-bicycle-store.myshopify.com/cart/32290221654067:1,10359316551:1?discount=SUPERSAVERBIKETRAINHERO">Click here to order</a>
                        </p>`
            }
        }
    ]
}

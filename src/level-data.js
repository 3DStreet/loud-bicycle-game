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
            name: 'Level 1 - Lead the kids to school',
            fogNear: 40000,
            fogFar: 40000,
            fogColor: '#00FFFFFF',
            ambientLightColor: '#0000', 
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
            //  (n streets*length +  )
            endDistance: 4 * 50 + 3 * 10 + 20,
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

            tutorial: true,
            
            spawnMinis: true,
            spawnHearts: true,
            interactables: {
                'driveway': 0.5,
                // 'side': 0.5,
                'rightCross': 1.0
            },
            streetUrls: [
                './levels/street_1.json',
                './levels/street_1.json',
                // './levels/street_1.json',
                './levels/street_1b.json',
                './levels/street_1b.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function(score) {
                return `
                            You brought ${score} kids safely to school!
                            <p>
                            You picked up the Loud Mini horn.
                            It sounds like a car horn and should help you a LOT. <img src="./assets/loud_mini.svg" class="icon">
                            <br>
                            $179 <a href="https://loudbicycle.com">loudbicycle.com</a> *not a joke, if you like it you can buy it
                            </p>
                        `
            }
        },
        {
            name: 'Level 2 - Lead people to work',
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
            endDistance: 4 * 50 + 3 * 10 + 20,
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
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#prop-suburban-houses-asset',
            lastBuildingAdditionalAssetId: '#prop-banner-wfh-asset',
            ambientSoundId: '#ambient-sound-a',
            ambientSoundVolume: 0.2,

            musicSoundId: '#music-2',
            tutorial: false,
            
            interactables: {
                'rightHook': 0.7,
                'rightCross': 0.5,
                'driveway': 0.8
            },
            streetUrls: [
                './levels/street_2.json',
                './levels/street_2.json',
                // './levels/street_2b.json',
                './levels/street_2b.json',
                './levels/street_2b.json',
                // './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function(score) {
                return `
                        You brought ${score} colleagues safely to work!
                        <p>
                        You picked up the Loud Ray Gun.
                        Turn all the cars into bicycles, awaiting approval by FDA/FCC. <img src="./assets/gun-ray.png" class="icon">
                        <br>
                        $$$$ spacebucks.
                        </p>
                `
            }
        },
        {
            name: 'Level 3 - Get to the bar!',
            fogNear: 0,
            fogFar: 250,
            fogColor: '#646464',
            ambientLightColor: '#646464', 
            directionalLightColor: '#646464', 
            directionalLightIntensity: 1.0, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: true, 
            endDistance: 4 * 50 + 3 * 10 + 20,
            startingLane: 2,
            amountLanes: 3,
            amountBikePool: 0,
            bikePoolSpawnOffset: 1,
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
            tutorial: false,

            interactables: {
                'rightHook': 0.8,
                'rightCross': 0.9,
                'driveway': 0.8,
                'side': 0.9,
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
                return `You got to the bar!`
            }
        },
        {
            name: 'Level 4 - Get home safely',
            fogNear: 3,
            fogFar: 40,
            fogColor: '#242424',
            ambientLightColor: '#171717', 
            directionalLightColor: '#171717', 
            directionalLightIntensity: 0.6, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: true, 
            endDistance: 6 * 50 + 5 * 10 + 20,
            startingLane: 2,
            amountLanes: 3,
            amountBikePool: 0,
            bikePoolSpawnOffset: 1,
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
            lastBuildingAssetId: '#building-bar.asset',
            ambientSoundId: '#ambient-sound-b',
            ambientSoundVolume: 0.2,
            musicSoundId: '#music-4',
            tutorial: false,

            interactables: {
                'rightHook': 0.4,
                'rightCross': 0.8,
                'driveway': 0.3,
                'side': 0.7
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
                return `You got home safely!`
            }
        }
    ]
}

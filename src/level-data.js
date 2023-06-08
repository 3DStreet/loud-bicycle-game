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
    cheatSpeed: 5.0,
    levels: [
        {
            name: 'Level 1 - Lead the kids to school',
            fogNear: 200,
            fogFar: 400,
            fogColor: '#AAA',
            ambientLightColor: '#222', 
            directionalLightColor: '#222', 
            directionalLightIntensity: 10.6, 
            directionalLightPosition: '0.2 0.3 0.1', 
            hasBikeLight: true, 
            endDistance: 180,
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
            spawnMinis: true,
            interactables: {
                'driveway': 0.3,
                // 'side',
                'rightCross': 0.8
            },
            streetUrls: [
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json',
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json',
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json',
                './levels/street_2-b4112510-c1fa-11ec-877c-abfad556cfc6.json',
                './levels/street_2-b4112510-c1fa-11ec-877c-abfad556cfc6.json',
                './levels/street_2-b4112510-c1fa-11ec-877c-abfad556cfc6.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function(score) {
                return `You brought ${score} kids safely to school!`
            }
        },
        {
            name: 'Level 2 - Lead people to work',
            fogNear: 200,
            fogFar: 400,
            fogColor: '#AAA',
            ambientLightColor: '#222', 
            directionalLightColor: '#222', 
            directionalLightIntensity: 0.6, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: false, 
            endDistance: 180,
            startingLane: 2,
            amountLanes: 4,
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
            interactables: {
                'rightHook': 0.4,
                'rightCross': 0.8,
                'driveway': 0.3
            },
            streetUrls: [
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
            ],
            intersectionUrls: [
                'https://cdn.glitch.global/4cbfc52c-9f40-485c-b7ff-e3ed0494f9a0/intersection.jpeg?v=1650059985944'
            ],
            getLevelEndMessage: function(score) {
                return `You brought ${score} colleagues safely to work.`
            }
        },
        {
            name: 'Level 3 - Get to the bar!',
            fogNear: 200,
            fogFar: 400,
            fogColor: '#AAA',
            ambientLightColor: '#222', 
            directionalLightColor: '#222', 
            directionalLightIntensity: 0.6, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: true, 
            endDistance: 180,
            startingLane: 2,
            amountLanes: 4,
            amountBikePool: 3,
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
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#building-bar-asset',
            interactables: {
                'rightHook': 0.4,
                'rightCross': 0.8,
                'driveway': 0.3,
                'side': 0.7
            },
            streetUrls: [
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_5-93937ae0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_5-93937ae0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_5-93937ae0-c1ff-11ec-877c-abfad556cfc6.json',

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
            fogNear: 200,
            fogFar: 400,
            fogColor: '#AAA',
            ambientLightColor: '#222', 
            directionalLightColor: '#222', 
            directionalLightIntensity: 0.6, 
            directionalLightPosition: '0 0 0', 
            hasBikeLight: true, 
            endDistance: 180,
            startingLane: 2,
            amountLanes: 4,
            amountBikePool: 3,
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
            streetLengthAdditionalRange: 10,
            lastBuildingOffset: 20,
            lastBuildingAssetId: '#building-bar.asset',
            interactables: {
                'rightHook': 0.4,
                'rightCross': 0.8,
                'driveway': 0.3,
                'side': 0.7
            },
            streetUrls: [
                './levels/street_5-93937ae0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_5-93937ae0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_4-1da4bec0-c1ff-11ec-877c-abfad556cfc6.json',
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
                './levels/street_2-b4112510-c1fa-11ec-877c-abfad556cfc6.json',
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json',
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

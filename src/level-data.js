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
    levels: [
        {
            name: 'Level 1 - Lead the kids to school',
            endDistance: 180,
            startingLane: 2,
            amountLanes: 3,
            laneWidth: 3.048,
            amountBikePool: 3,
            bikePoolSpawnOffset: 1.0,
            streetLength: 50,
            streetWidth: 20,
            streetLengthAdditionalRange: 10,
            spawnMinis: true,
            interactables: [
                'driveway',
                // 'side',
                'rightCross'
            ],
            streetUrls: [
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json',
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json',
                './levels/street_2-b4112510-c1fa-11ec-877c-abfad556cfc6.json',
                './levels/street_2-b4112510-c1fa-11ec-877c-abfad556cfc6.json',
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
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
            endDistance: 180,
            startingLane: 2,
            amountLanes: 2,
            amountBikePool: 3,
            bikePoolSpawnOffset: 0.5,
            laneWidth: 2.5,
            streetLength: 100,
            streetWidth: 45,
            startWithMini: true,
            streetLengthAdditionalRange: 10,
            interactables: [
                'rightHook',
                'rightCross',
                'driveway'

            ],
            streetUrls: [
                './levels/street_3-6a184410-c1fb-11ec-877c-abfad556cfc6.json',
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
            startingLane: 2,
            laneWidth: 2.5,
            amountLanes: 2,
            amountBikePool: 3,
            bikePoolSpawnOffset: 0.5,
            endDistance: 180,
            streetLength: 100,
            streetWidth: 45,
            streetLengthAdditionalRange: 10,
            streetUrls: [
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json'
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
            startingLane: 2,
            amountLanes: 2,
            laneWidth: 2.5,
            amountBikePool: 3,
            bikePoolSpawnOffset: 0.6,
            endDistance: 180,
            streetLength: 100,
            streetWidth: 45,
            streetLengthAdditionalRange: 10,
            streetUrls: [
                './levels/street_1-51136070-c1f7-11ec-877c-abfad556cfc6.json'
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

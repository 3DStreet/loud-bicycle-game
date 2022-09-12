export const gameData = {
    levels: [
        {
            name: 'Level 1 - Drop off the kids',
            endDistance: 180,
            amountBikePool: 3,
            streetLength: 50,
            streetWidth: 20,
            streetLengthAdditionalRange: 10,
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
            name: 'Level 2 - Get to work',
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
            getLevelEndMessage: function(score) {
                return `You brought ${score} colleagues safely to work.`
            }
        },
        {
            name: 'Level 3 - Get to the bar!',
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
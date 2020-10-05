import { Player } from './classes/Player.js'
import { Map } from './classes/Map.js'
import { MapGenerator } from './classes/MapGenerator.js'
import { MapGeneratorMenu } from './classes/MapGeneratorMenu.js'

let canvas, context, map
const game = {}

game.play = function (player, gameType, playersMap) {
    canvas = document.getElementById('map')
    context = canvas.getContext('2d')

    start()
    function start() {
        console.log('first loaded')

        const spriteSheet = new Image()
        spriteSheet.src = player.spriteSheet

        map = new Map(context)

        player = new Player(canvas,
            context,
            map.firstMap,
            spriteSheet,
            // x coordinate 
            0,
            // y coordinate
            canvas.height / 2,
            // sprite sheet width and height
            spriteSheet.width,
            spriteSheet.height,
            // frames per secound
            500,
            // number of frames
            4,
            // sprite width
            player.width,
            // sprite height
            player.height,
            // level
            player)

        document.getElementById('sushiNumbers').innerText = player.sushi
        document.querySelector('#game-info').style.display = 'flex'

        loop()
    }

    renderMap(gameType)

    function renderMap() {
        setInterval(() => {
            if (gameType === 'level up') {
                map.mapModels.forEach((model, i) => {
                    if (model.level === player.level) {
                        map.currentMap = map.mapModels[i]
                        player.currentMap = map.currentMap
                        map.drawMap(map.currentMap)
                    }
                })
            }


            if(gameType === 'use map'){
                map.currentMap = playersMap
                player.currentMap = playersMap
                map.drawMap(playersMap)
            }

        }, 1000)
    }

    function loop() {
        update()
        draw()
        requestAnimationFrame(loop)
    }

    function draw() {
        player.drawAnimated(player.context, player.currentFrameSet)
    }

    function update() {
        player.update()
    }

    //player movement
    window.addEventListener('keyup', (e) => {
        e.preventDefault()
        player.isTouchingFlag()

        if (player.level !== 1) {
            player.isTouchingSushi()
        }

        if (player.level === 3) {
            player.isTouchingBox()
        }

        switch (e.keyCode) {
            case 39:
                player.makeSteps('right', map, map.drawMap)
                break

            case 37:
                player.makeSteps('left', map, map.drawMap)
                break

            case 32:
                player.jump(map, map.drawMap)
                break
        }

    })

    //blocks default horizontal scrolling by left/right arrow keys
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 39].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
}

game.createOwnMap = function (player) {
    canvas = document.getElementById('map')
    context = canvas.getContext('2d')

    const mapGenerator = new MapGenerator(context, player)
    mapGenerator.drawBaseMap()

    const mapGeneratorMenu = new MapGeneratorMenu(context, player)
    mapGeneratorMenu.setMenu()

    mapGenerator.renderCreateMapButton()
}

export default game

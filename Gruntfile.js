/*global module:false*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-shell')
    grunt.loadNpmTasks('grunt-gcc');
    grunt.loadNpmTasks('grunt-copy-to')


    function appendPrefix(prefix, to) {
        for (var i = 0; i < to.length; i++) {
            to[i] = prefix + to[i]
        }
        return to
    }

    function srcJs(to) {
        return appendPrefix('src/js/', to)
    }

    function srcCss(to) {
        return appendPrefix('src/css/', to)
    }


    var concatGroups = {
        common:[
            'util/package.js',
            'util/util.js',
            'config/Config.js',
            'util/Font.js',
            'util/I18n.js'
        ],
        header:[
            'util/package.js',
            'util/util.js',
            'config/Config.js',
            'util/Font.js',
            'util/I18n.js',
            'util/BackButton.js',
            'page/template/Page.js',
            'page/template/HeaderPage.js'
        ]
    }
    concatGroups.map = concatGroups.header.concat([
        'map/Config.js',
        'router/builder.js',
        'util/HashSet/lightImpl.js',
        'util/StationColor.js',
        'map/package.js',
        'map/util.js',
        'map/facade/Facade.js',
        'map/markers/Markers.js',
        'map/exits/Exits.js',
        'map/builder.js',
        'map/GpsSquare.js',
        'map/facade/Google.js',
        'map/markers/GoogleMarkers.js',
        'map/exits/GoogleExits.js',
        'map/facade/LeafletProviders.js',
        'map/facade/Leaflet.js',
        'map/markers/LeafletMarkers.js',
        'map/exits/LeafletExits.js'
    ])

    var buildPaths = {
        thirdParty:'target/plain/js/3rdparty/',
        android:'target/devices/android'
    }

    function createIcon(dimension, where) {
        return 'convert src/images/icon/logo.png -resize ' + dimension + ' ' + where + '; optipng ' + where
    }

    function createIconAndroid(dimension, type) {
        if (type != '')
            type = '-' + type
        return createIcon(dimension, buildPaths.android + '/res/drawable' + type + '/icon.png')
    }

    // Project configuration.
    grunt.initConfig({
        pkg:'<json:package.json>',
        cssmin:{
            compress:{
                files:{
                    'target/plain/css/index.css':srcCss(
                        ['main.css', 'button.css', 'page/template/contentPage.css', 'page/index.css']
                    ),
                    'target/plain/css/selectAddress.css':srcCss([
                        'main.css', 'button.css', 'page/template/contentPage.css',
                        'page/template/header.css', 'prompter.css', 'page/template/selectableList.css',
                        'page/template/selectPage.css'
                    ]),
                    'target/plain/css/address.css':srcCss([
                        'main.css', 'button.css',
                        'page/template/inputPage.css', 'prompter.css', 'page/template/header.css'
                    ]),
                    'target/plain/css/station.css':srcCss([
                        'main.css', 'button.css', 'page/template/inputPage.css',
                        'prompter.css', 'page/template/header.css', 'stationPrompt.css', 'page/station.css'
                    ]),
                    'target/plain/css/map.css':srcCss(
                        ['main.css', 'button.css', 'page/template/header.css', 'page/map.css']
                    ),
                    'target/plain/css/selectRoute.css':srcCss([
                        'main.css', 'button.css', 'page/template/contentPage.css',
                        'page/template/header.css', 'prompter.css', 'page/template/selectableList.css',
                        'page/template/selectPage.css', 'stationPrompt.css'
                    ]),
                    'target/plain/css/router.css':srcCss(
                        ['main.css', 'button.css', 'page/template/header.css', 'page/router.css']
                    ),
                    'target/plain/css/preferences/index.css':srcCss([
                        'main.css', 'button.css', 'page/template/contentPage.css',
                        'page/template/header.css', 'page/preferences/index.css'
                    ]),
                    'target/plain/css/preferences/map.css':srcCss(
                        ['main.css', 'button.css', 'page/template/header.css', 'page/preferences/map.css']
                    ),
                    'target/plain/css/preferences/lang.css':srcCss([
                        'main.css', 'button.css', 'page/template/contentPage.css',
                        'page/template/header.css', 'prompter.css', 'page/template/selectableList.css',
                        'page/template/selectPage.css', 'page/preferences/lang.css'
                    ])
                }
            }
        },
        copy:{
            images:{
                files: [{expand: true, cwd: 'src/images/', src:'**/*', dest:'target/plain/images', filter: 'isFile'}]
            },
            config:{
                files: [{expand: true, cwd: 'src/js/config/', src:'**/!(Config|Bo)', dest:'target/plain/js/config', filter: 'isFile'}]
            },
            android:{
                files: [{expand: true, cwd: 'target/plain/', src:'**/*', dest:buildPaths.android + '/assets/www', filter: 'isFile'}]
            }
        },
        copyto: {
            thirdParty: {
                files: [
                    {cwd: 'node_modules/i18n/dist/', src: ['i18n.min.js'], dest: buildPaths.thirdParty}
                    ,{cwd: 'node_modules/Prompter/dist/', src: ['prompter.min.js'], dest: buildPaths.thirdParty}
                    ,{cwd: 'node_modules/canvas-manipulation/dist/', src: ['canvas-manipulation.min.js', 'canvas-manipulation-zoom-buttons.min.js'], dest: buildPaths.thirdParty}
                    ,{cwd: 'node_modules/canvas-manipulation-touch-listener-plugin/www/js/dist/', src: ['*.min.js'], dest: buildPaths.thirdParty}
                    ,{cwd: 'node_modules/canvas-manipulation/node_modules/hammerjs/dist/', src: ['hammer.min.js'], dest: buildPaths.thirdParty}
                    ,{
                        cwd: 'node_modules/leaflet/dist/',
                        src: ['images/*', 'leaflet.css'], dest: 'target/plain/css/'
                    }
                    ,{cwd: 'node_modules/leaflet/dist/', src: ['leaflet.js'], dest: buildPaths.thirdParty}
                    ,{cwd: 'node_modules/SelectLayersControl/dist/', src: ['*.min.js'], dest: buildPaths.thirdParty}
                    ,{cwd: 'node_modules/SelectLayersControl/node_modules/Leaflet.ActiveLayers/dist/', src: ['*.min.js'], dest: buildPaths.thirdParty}
                ]
            }

        },

        concat:{
            index:{
                src:srcJs(
                    concatGroups.common.concat([
                        'map/package.js',
                        'map/util.js',
                        'map/Config.js',
                        'map/facade/Facade.js',
                        'map/facade/Google.js',
                        'map/facade/Leaflet.js',
                        'map/facade/LeafletProviders.js',
                        'config/Bootstrap.js',
                        'page/template/Page.js',
                        'page/template/DefaultPage.js',
                        'page/template/ContentCenterPage.js',
                        'page/index.js'
                    ])),
                dest:'target/plain/js/index.js'
            },
            address:{
                src:srcJs(
                    concatGroups.header.concat([
                        'map/package.js',
                        'map/util.js',
                        'map/search.js',
                        'page/template/DefaultPage.js',
                        'page/template/AutoCompletePage.js',
                        'page/address.js'
                    ])),
                dest:'target/plain/js/address.js'
            },
            station:{
                src:srcJs(
                    concatGroups.header.concat([
                        'map/package.js',
                        'map/util.js',
                        'util/StationColor.js',
                        'util/StationPrompt.js',
                        'page/template/DefaultPage.js',
                        'page/template/AutoCompletePage.js',
                        'page/station.js'
                    ])),
                dest:'target/plain/js/station.js'
            },
            selectAddress:{
                src:srcJs(
                    concatGroups.header.concat([
                        'map/package.js',
                        'map/util.js',
                        'page/template/DefaultPage.js',
                        'page/template/ContentCenterPage.js',
                        'page/template/SelectableList.js',
                        'page/selectAddress.js'
                    ])),
                dest:'target/plain/js/selectAddress.js'
            },
            map:{
                src:srcJs(
                    concatGroups.map.concat([
                        'page/map.js'
                    ])),
                dest:'target/plain/js/map.js'
            },
            selectRoute:{
                src:srcJs(
                    concatGroups.header.concat([
                        'util/StationColor.js',
                        'util/StationPrompt.js',
                        'page/template/DefaultPage.js',
                        'page/template/ContentCenterPage.js',
                        'page/template/SelectableList.js',
                        'map/Config.js',
                        'router/builder.js',
                        'page/selectRoute.js'
                    ])),
                dest:'target/plain/js/selectRoute.js'
            },
            router:{
                src:srcJs(
                    concatGroups.header.concat([
                        'router/util.js',
                        'router/Config.js',
                        'router/Router.js',
                        'drawer/Config.js',
                        'drawer/package.js',
                        'drawer/canvas/DrawUtils.js',
                        'drawer/Drawer.js',
                        'drawer/Matrix.js',
                        'page/router.js'])
                ),
                dest:'target/plain/js/router.js'
            },
            preferencesIndex:{
                src:srcJs(
                    concatGroups.header.concat([
                        'page/template/DefaultPage.js',
                        'page/template/ContentCenterPage.js',
                        'page/preferences/index.js'
                    ])),
                dest:'target/plain/js/preferences/index.js'
            },
            preferencesMap:{
                src:srcJs(
                    concatGroups.map.concat([
                        'page/preferences/map.js'
                    ])),
                dest:'target/plain/js/preferences/map.js'
            },
            preferencesLang:{
                src:srcJs(
                    concatGroups.header.concat([
                        'page/template/DefaultPage.js',
                        'page/template/ContentCenterPage.js',
                        'page/template/SelectableList.js',
                        'page/preferences/lang.js'
                    ])),
                dest:'target/plain/js/preferences/lang.js'
            }
        },
        watch:{
            files:['Gruntfile.js', 'src/**/*.js', 'src/**/*.css', 'target/plain/*.html'],
            tasks:'android-no-min'
        },
        shell:{
            watermark:{
                command:'sh src/script/watermark.sh target/plain/images/scheme',
                failOnError:true,
                stdout:true
            },
            optipng:{
                command:'sh src/script/optipng.sh target/plain/images target/plain/css/images',
                failOnError:true,
                stdout:true
            },
            minConfig:{
                command:'java -classpath ./target/classes com.garageteam.metroexit.Minifier ./target/plain/js/config/',
                failOnError:true,
                stdout:true
            },
            iconsAndroid:{
                command:createIconAndroid('57x57', '') + ';' + createIconAndroid('72x72', 'hdpi') + ';' + createIconAndroid('36x36', 'ldpi') + ';' + createIconAndroid('48x48', 'mdpi'),
                failOnError:true,
                stdout:true
            }
        },
        gcc:{
            main:{
                jar:'~/programs/gcc/build/compiler.jar',
                root:'target/plain/js',
                deep:false,
                filters:[
                    {
                        condition:/.*\.js$/,
                        params:'--compilation_level ADVANCED_OPTIMIZATIONS --externs node_modules/i18n/dist/externs.js --externs ~/programs/gcc/externs/google_maps_api_v3.js'
                    }
                ]
            },
            preferences:{
                jar:'~/programs/gcc/build/compiler.jar',
                root:'target/plain/js/preferences',
                deep:false,
                filters:[
                    {
                        condition:/^.*\.js$/i,
                        params:'--compilation_level ADVANCED_OPTIMIZATIONS --externs node_modules/i18n/dist/externs.js --externs ~/programs/gcc/externs/google_maps_api_v3.js'
                    }
                ]
            }
        }
    })

    //обработка графики
    grunt.registerTask('media', ['shell:watermark', 'shell:optipng'])
    //сжатие скриптов
    grunt.registerTask('min', ['gcc', 'shell:minConfig'])
    // Default task.
    grunt.registerTask('default', ['copy:images', 'copy:config', 'copyto', 'cssmin', 'concat'])
    //shell:optipng shell == shell, проверено экспериментально
    grunt.registerTask('android', ['default', 'min', 'media', 'copy:android', 'shell:iconsAndroid'])
    //без картинок
    grunt.registerTask('android-no-media', ['default', 'min', 'copy:android'])
    //без картинок и сжатия
    grunt.registerTask('android-no-min', ['default', 'copy:android'])

};
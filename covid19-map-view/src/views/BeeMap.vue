<template>
    <div ref="mapContainer"></div>
</template>

<script>
    import {Scene, HeatmapLayer} from '@antv/l7'
    import {GaodeMap} from '@antv/l7-maps'
    import request from '../utils/request.js'

    export default {
        name: 'BeeMap',
        mounted() {
            this.initScene()
        },
        data() {
            return {
                el: null,
                scene: null,
                heatmapLayer: null
            }
        },
        methods: {
            initScene() {
                this.el = this.$refs.mapContainer
                this.scene = new Scene({
                    id: this.el,
                    map: new GaodeMap({
                        style: 'dark',
                        pitch: 0,
                        center: [116.2825, 39.9],
                        zoom: 2.632456779444394
                    })
                })
                this.scene.on('loaded', () => {
                    this.getGeoJson().then(data => {
                        this.initHeatmapLayer(data)
                    })
                })
            },
            getGeoJson() {
                return new Promise(resolve => {
                    request.get('/getGeoJson').then(result => {
                        resolve(result.data)
                    })
                })
            },
            initHeatmapLayer(data) {
                this.heatmapLayer = new HeatmapLayer({})
                    .source(data)
                    .shape('hexagonColumn')
                    .size('totalConfirmed', [1, 15]) // weight映射通道
                    .style({
                        intensity: 2,
                        radius: 20,
                        opacity: 1.0,
                        rampColors: {
                            colors: [
                                '#FF4818',
                                '#F7B74A',
                                '#FFF598',
                                '#91EABC',
                                '#2EA9A1',
                                '#206C7C'
                            ].reverse(),
                            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
                        }
                    })
                this.scene.addLayer(this.heatmapLayer)
            }
        }
    }
</script>

<style scoped>

</style>
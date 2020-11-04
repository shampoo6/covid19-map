<template>
    <div ref="mapContainer"></div>
</template>

<script>
    import {Scene} from '@antv/l7'
    import {WorldLayer} from '@antv/l7-district'
    import {GaodeMap} from '@antv/l7-maps'
    import request from '../utils/request.js'

    export default {
        name: 'WorldMap',
        mounted() {
            this.initScene()
        },
        data() {
            return {
                el: null,
                scene: null,
                layer: null,
                colors: [
                    '#fdd0a2',
                    '#fdae6b',
                    '#fd8d3c',
                    '#e6550d',
                    '#ff0000'
                ]
            }
        },
        methods: {
            initScene() {
                this.el = this.$refs.mapContainer
                this.scene = new Scene({
                    id: this.el,
                    map: new GaodeMap({
                        center: [-101.372165, 39.778186],
                        pitch: 0,
                        style: 'dark',
                        zoom: 0,
                        minZoom: 0,
                        maxZoom: 10
                    })
                })
                this.scene.on('loaded', () => {
                    request.get('/worldCovid19Data').then(result => {
                        let data = result.data.data

                        this.layer = new WorldLayer(this.scene, {
                            data: data,
                            joinBy: ['NAME_CHN', 'name'],
                            bubble: {
                                enable: true,
                                color: {
                                    field: 'confirm',
                                    values: (count) => {
                                        return count > 5000000
                                            ? this.colors[4]
                                            : count > 1000000
                                                ? this.colors[3]
                                                : count > 500000
                                                    ? this.colors[2]
                                                    : count > 100000
                                                        ? this.colors[1]
                                                        : this.colors[0]
                                    }
                                },
                                size: {
                                    field: 'confirm',
                                    values: [10, 70]
                                },
                                style: {
                                    opacity: 0.55
                                }
                            },
                            stroke: '#ccc',
                            label: {
                                enable: true,
                                textAllowOverlap: false,
                                field: 'NAME_CHN'
                            },
                            popup: {
                                enable: true,
                                Html: props => {
                                    return `<span>${props.NAME_CHN}</span><br/>
                                            <ul>
                                            <li>确诊: ${typeof props.confirm !== 'undefined' ? props.confirm : '无数据'}</li>
                                            <li>死亡: ${typeof props.dead !== 'undefined' ? props.dead : '无数据'}</li>
                                            <li>治愈: ${typeof props.heal !== 'undefined' ? props.heal : '无数据'}</li>
                                            </ul>
                                            `
                                }
                            }
                        })
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
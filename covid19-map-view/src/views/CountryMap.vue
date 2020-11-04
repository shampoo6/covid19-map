<template>
    <div ref="mapContainer"></div>
</template>

<script>
    import {Scene} from '@antv/l7'
    import {CountryLayer} from '@antv/l7-district'
    import {GaodeMap} from '@antv/l7-maps'
    import request from '../utils/request.js'

    export default {
        name: 'CountryMap',
        mounted() {
            this.initScene()
        },
        data() {
            return {
                el: null,
                scene: null,
                provinceData: null,
                countryLayer: null,
                colors: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e']
            }
        },
        methods: {
            initScene() {
                this.el = this.$refs.mapContainer
                this.scene = new Scene({
                    id: this.el,
                    map: new GaodeMap({
                        center: [114.313886, 30.599462],
                        pitch: 0,
                        style: 'blank',
                        zoom: 3,
                        minZoom: 0,
                        maxZoom: 10
                    })
                })
                this.scene.on('loaded', () => {
                    this.getCovid19Data().then(data => {
                        this.initCountryLayer(data)
                    })
                })
            },
            // 获取疫情数据
            getCovid19Data() {
                return new Promise(resolve => {
                    request.get('/getCovid19Data').then(result => {
                        // 格式化数据
                        this.provinceData = result.data['provinceArray']
                        resolve(this.provinceData)
                    })
                })
            },
            // 初始化countryLayer
            initCountryLayer(data) {
                this.countryLayer = new CountryLayer(this.scene, {
                    data: data,
                    joinBy: ['NAME_CHN', 'childStatistic'],
                    depth: 1,
                    fill: {
                        /*color: {
                            field: 'childStatistic',
                            values: [
                                '#feedde',
                                '#fdd0a2',
                                '#fdae6b',
                                '#fd8d3c',
                                '#e6550d',
                                '#a63603'
                            ]
                        }*/
                        color: '#e6e6e6'
                    },
                    bubble: {
                        enable: true,
                        size: {
                            field: 'totalConfirmed',
                            values: [15, 35]
                        },
                        color: {
                            field: 'totalConfirmed',
                            values: (count) => {
                                return count > 10000
                                    ? this.colors[6]
                                    : count > 1000
                                        ? this.colors[5]
                                        : count > 500
                                            ? this.colors[4]
                                            : count > 100
                                                ? this.colors[3]
                                                : count > 10
                                                    ? this.colors[2]
                                                    : count > 1
                                                        ? this.colors[1]
                                                        : this.colors[0]
                            }
                        },
                        style: {
                            opacity: 0.55
                        }
                    },
                    popup: {
                        enable: true,
                        Html: props => {
                            return `<span>${props.NAME_CHN}:</span>
                                    <ul>
                                    <li>确诊：${typeof props.totalConfirmed !== 'undefined' ? props.totalConfirmed : '无数据'}</li>
                                    <li>死亡：${typeof props.totalDeath !== 'undefined' ? props.totalDeath : '无数据'}</li>
                                    <li>治愈：${typeof props.totalCured !== 'undefined' ? props.totalCured : '无数据'}</li></ul>`
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
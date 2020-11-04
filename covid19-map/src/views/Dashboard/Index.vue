<template>
    <a-space direction="vertical" style="width: 100%">
        <a-row>
            <my-title title="国内疫情">
                <div style="color:#ccc">数据更新时间: {{time}}</div>
            </my-title>
        </a-row>
        <a-row :gutter="[16, 0]">
            <a-col :span="4">
                <a-card hoverable>
                    <a-statistic :value-style="{ color: '#ff7e00' }" title="总确诊人数" :value="totalConfirmed"/>
                </a-card>
            </a-col>
            <a-col :span="4">
                <a-card hoverable>
                    <a-statistic :value-style="{ color: '#3f8600' }" title="总治愈人数" :value="totalCured"/>
                </a-card>
            </a-col>
            <a-col :span="4">
                <a-card hoverable>
                    <a-statistic :value-style="{ color: '#cf1322' }" title="总死亡人数" :value="totalDeath"/>
                </a-card>
            </a-col>
            <a-col :span="4">
                <a-card hoverable>
                    <a-statistic title="总新增病例" :value="totalIncrease"/>
                </a-card>
            </a-col>
            <a-col :span="4">
                <a-card hoverable>
                    <a-statistic title="总疑似病例" :value="totalDoubtful"/>
                </a-card>
            </a-col>
            <a-col :span="4">
                <a-card hoverable>
                    <a-statistic title="新增疑似病例" :value="incDoubtful"/>
                </a-card>
            </a-col>
        </a-row>
        <a-row>
            <my-title title="国内疫情图"/>
        </a-row>
        <a-row>
            <a-col :span="16" :offset="4">
                <iframe :src="countryMapSrc" style="height: 316px; width: 100%;"></iframe>
            </a-col>
        </a-row>
        <a-row>
            <my-title title="海外疫情图"/>
        </a-row>
        <a-row>
            <a-col :span="16" :offset="4">
                <iframe :src="worldMapSrc" style="height: 316px; width: 100%;"></iframe>
            </a-col>
        </a-row>
        <a-back-top/>
    </a-space>
</template>

<script>
    import request from '../../utils/request.js'
    import MyTitle from './Title.vue'

    export default {
        name: 'Dashboard',
        components: {
            MyTitle
        },
        mounted() {
            request.get('/getCovid19Data').then(result => {
                let {totalConfirmed, totalCured, totalDeath, totalDoubtful, totalIncrease, incDoubtful, time} = (result.data.country)
                this.totalConfirmed = totalConfirmed
                this.totalCured = totalCured
                this.totalDeath = totalDeath
                this.totalDoubtful = totalDoubtful
                this.totalIncrease = totalIncrease
                this.incDoubtful = incDoubtful
                this.time = time
            })
        },
        data() {
            return {
                totalConfirmed: 0,
                totalCured: 0,
                totalDeath: 0,
                totalDoubtful: 0,
                totalIncrease: 0,
                incDoubtful: 0,
                time: '',

                countryMapSrc: process.env.VUE_APP_BASE_URL + '/#/countryMap',
                worldMapSrc: process.env.VUE_APP_BASE_URL + '/#/worldMap'
            }
        },
        methods: {}
    }
</script>

<style scoped>
    .ant-row {
        padding-left: 20px;
        padding-right: 20px;
        margin-bottom: 20px;
    }
</style>
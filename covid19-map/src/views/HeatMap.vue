<template>
    <div style="height: 100%">
        <iframe :src="src" style="width: 100%; height: 100%"></iframe>
    </div>
</template>

<script>
    export default {
        name: 'HeatMap',
        data() {
            return {
                src: process.env.VUE_APP_BASE_URL + '/#/heatMap'
            }
        }
    }
</script>

<style scoped>

</style>
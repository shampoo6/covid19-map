<template>
    <div>
        <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="12"><b class="title">{{title}}</b></a-col>
            <a-col :span="12">
                <a-row type="flex" justify="end">
                    <slot></slot>
                </a-row>
            </a-col>
        </a-row>
        <a-divider/>
    </div>
</template>

<script>
    export default {
        name: 'Title',
        props: {
            title: String
        }
    }
</script>

<style scoped>
    .title {
        font-size: 24px;
        color: #ff7e00
    }
</style>
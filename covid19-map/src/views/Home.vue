<template>
    <div>
        <a-affix :offset-top="0">
            <a-menu ref="header" v-model="current" mode="horizontal" theme="dark" @select="onSelected">
                <a-menu-item key="/dashboard">
                    <a-icon type="appstore"/>
                    综合信息
                </a-menu-item>
                <a-menu-item key="/country">
                    <a-icon type="appstore"/>
                    全国疫情图
                </a-menu-item>
                <a-menu-item key="/heat">
                    <a-icon type="appstore"/>
                    全国疫情热力图
                </a-menu-item>
                <a-menu-item key="/bee">
                    <a-icon type="appstore"/>
                    全国疫情热力图3D
                </a-menu-item>
                <a-menu-item key="/world">
                    <a-icon type="appstore"/>
                    全球疫情图
                </a-menu-item>
                <a-menu-item key="/worldHeat">
                    <a-icon type="appstore"/>
                    全球疫情热力图
                </a-menu-item>
            </a-menu>
        </a-affix>
        <div :style="contentStyle">
            <router-view/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        created() {
            this.current = [this.$route.path]
            window.onresize = this.resizeContent
            this.$nextTick(() => {
                this.resizeContent()
            })
        },
        data() {
            return {
                current: ['/country'],
                contentStyle: {
                    height: '0'
                }
            }
        },
        methods: {
            onSelected({selectedKeys}) {
                this.$router.push(selectedKeys[0])
            },
            resizeContent() {
                let windowHeight = window.innerHeight
                let headerHeight = this.$refs.header.$el.clientHeight
                this.contentStyle.height = windowHeight - headerHeight + 'px'
            }
        },
        beforeDestroy() {
            window.onresize = null
        }
    }
</script>

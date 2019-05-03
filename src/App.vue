<template>
	<div id="app">
		<loading v-model="isLoading"></loading>
		<keep-alive>
			<router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepAlive"></router-view>
	</div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            isLoading: state => state.common.isLoading
        })
    },
    mounted () {
    },
    components: {
        Loading
    }
}
</script>

<style lang="less">
</style>

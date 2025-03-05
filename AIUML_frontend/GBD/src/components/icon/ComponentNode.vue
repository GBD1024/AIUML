<template>
    <svg width="30" height="30">
        <g transform="translate(3,3)" style="visibility: visible">
            <!-- 大方块（组件主体） -->
            <rect x="5" y="5" width="20" height="20" fill="#ffffff" stroke="#000000" stroke-width="1.3"
                pointer-events="all"></rect>

            <!-- 小方块1（上方，覆盖在左侧部分） -->
            <rect x="3" y="10" width="5" height="5" fill="#ffffff" stroke="#000000" stroke-width="1.3"></rect>

            <!-- 小方块2（下方，覆盖在左侧部分） -->
            <rect x="3" y="17" width="5" height="5" fill="#ffffff" stroke="#000000" stroke-width="1.3"></rect>
        </g>
    </svg>
</template>

<script>
export default {
};
</script>

<style scoped>
.svg-node {
    left: 1px;
    top: 1px;
    width: 30px;
    height: 30px;
    display: block;
    position: relative;
    overflow: hidden;
}
</style>

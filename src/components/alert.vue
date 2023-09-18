<style scoped>
    .note-block.tip {
        border-left-color: var(--md-theme-default-primary);
    }

    .note-block {
        padding: 8px 10px;
        overflow: hidden;
        border-left: 4px solid #ffab40;
    }

    .note-block.md-theme-default {
        background-color: #eee;
    }
</style>
<template>
    <div style="margin-bottom: 10px;">
        <div class="note-block tip md-theme-default">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "alert",
        props: {
            type: String,
        },
        methods: {}
    }
</script>

<style scoped>

</style>
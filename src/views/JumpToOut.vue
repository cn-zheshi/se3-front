<template>
    <div><p>等待跳转...</p></div>
</template>

<script>
export default {
    name:"JumpToOut",
    mounted(){
        console.log(this.$route.query.url);
        window.location.href=this.$route.query.url;
    }
}
</script>

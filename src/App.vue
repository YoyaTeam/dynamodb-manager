<template>
  <div id="app">
    <default-header></default-header>
    <router-view/>
  </div>
</template>

<script>
import DefaultHeader from '@/components/header'

export default {
  name: 'App',
  components: { DefaultHeader }
}
</script>

<style>
</style>

<template>
    <nav-menu :collapse="collapse"></nav-menu>
</template>

<script>
import NavMenu from './_nav_menu'
export default {
  components: {
    NavMenu
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  }
}
</script>

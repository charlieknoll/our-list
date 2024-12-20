<template>
  <q-btn
    :color="selected ? 'primary' : 'default'"
    :class="{ 'shadow-2 bg-white': selected }"
    v-bind="$attrs"
  >
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  name: 'QsBtn',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

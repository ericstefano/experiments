<script setup lang="ts">
import { cn } from '~/lib/utils'
import { type InputProps } from '../input/'
const {class: classProp, ...props} = defineProps<InputProps>()
const _props = toRef(props);
const show = ref(false);
function toggle() {
  show.value = !show.value;
}
</script>

<template>
  <div :class="cn('relative flex items-center', classProp)">
    <Input v-bind="_props" class="pr-11" :type="show ? 'text' : 'password'"/>
    <Button class="absolute end-2 rounded-full p-1.5 h-auto" type="button" variant="ghost" @click="toggle" aria-label="show-password">
      <Icon v-if="show" size="1.25rem" name="lucide:eye"/>
      <Icon v-if="!show" size="1.25rem" name="lucide:eye-off"/>
    </Button>
  </div>
</template>

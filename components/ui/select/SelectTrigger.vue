<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from 'radix-vue'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'], error?: boolean }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      { 'border-destructive': error },
      props.class,
    )"
  >
    <slot />
    <SelectIcon as-child>
      <Icon class="opacity-50" size="1rem" name="lucide:chevron-down" />
    </SelectIcon>
  </SelectTrigger>
</template>

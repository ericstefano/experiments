<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { useFormField } from './useFormField'
import { cn } from '~/lib/utils'

const props = defineProps<{
  error?: boolean;
  class?: HTMLAttributes['class']
}>()

const { formDescriptionId } = useFormField()
</script>

<template>
  <p
    :id="formDescriptionId"
    :class="cn('text-sm text-muted-foreground', {'text-destructive': error}, props.class)"
  >
    <slot />
  </p>
</template>

<script lang="ts">
	import { t } from '$lib/i18n'
	import { createRecordModal } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
</script>

<Button
	on:click={() => createRecordModal.open()}
	size="xs"
	class="h-full !rounded-md inline-flex items-center whitespace-nowrap bg-blue-500"
>
	<i class="ti ti-row-insert-bottom text-sm mr-2" />
	{$t('Create New Record')}</Button
>

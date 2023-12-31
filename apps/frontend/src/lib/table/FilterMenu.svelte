<script lang="ts">
	import cx from 'classnames'
	import { Badge, Button, Modal, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import FilterItem from './FilterItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import { filters, getTable, getView, q, recordHash } from '$lib/store/table'
	import { isOperatorWithoutValue, type IFilter } from '@undb/core'
	import { writable } from 'svelte/store'
	import { t } from '$lib/i18n'

	const value = writable<Partial<IFilter>[]>([...$filters])
	$: value.set([...$filters])

	const table = getTable()
	const view = getView()

	const TEMP_ID = '__TEMP_ID'

	const add = () => {
		$value = [...$value, { path: TEMP_ID }]
	}

	const remove = (index: number) => {
		$value = $value.filter((f, i) => i !== index)
	}

	const data = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ enabled: false, refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash },
	)

	const setFilter = trpc().table.view.filter.set.mutation({
		async onSuccess() {
			open = false
			await $data.refetch()
		},
	})
	async function apply() {
		const validFilters = $value.filter(
			(v) =>
				!!v.path && !!v.operator && !!v.type && (isOperatorWithoutValue(v.operator) ? true : v.value !== undefined),
		) as IFilter[]

		$setFilter.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: validFilters,
		})
	}

	let open = false
</script>

<Button
	id="filters-menu"
	size="xs"
	color="alternative"
	on:click={() => (open = true)}
	class={cx(
		'h-full !rounded-md whitespace-nowrap border-0 hover:!bg-blue-50 dark:hover:!bg-gray-800',
		!!$filters.length && '!bg-blue-50 dark:!bg-primary-600',
	)}
>
	<span class="inline-flex items-center gap-2 text-blue-600 dark:text-gray-100">
		<i class="ti ti-filter text-sm" />
		{$t('Filter')}

		{#if !!$filters.length}
			<Badge class="rounded-full h-4 px-2 bg-blue-700 !text-white">{$filters.length}</Badge>
		{/if}
	</span>
</Button>
<Modal placement="top-center" bind:open class="w-full" size="sm">
	<form on:submit|preventDefault={apply} id="filter_menu" class="space-y-4">
		{#if $value.length}
			<span class="text-xs font-medium text-gray-500 dark:text-gray-300">{$t('set filters in this view')}</span>
			<ul class="space-y-2">
				{#each $value as filter, index}
					<FilterItem {filter} {index} {remove} />
				{/each}
			</ul>
		{:else}
			<span class="text-xs font-medium text-gray-400">{$t('no filters applied')}</span>
		{/if}
	</form>
	<svelte:fragment slot="footer">
		<div class="flex w-full justify-between">
			<Button color="alternative" size="xs" on:click={add} disabled={$value.some((v) => v.path === TEMP_ID)}
				>{$t('Create New Filter')}</Button
			>
			<Button size="xs" type="submit" form="filter_menu">{$t('Apply', { ns: 'common' })}</Button>
		</div>
	</svelte:fragment>
</Modal>

{#if $setFilter.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setFilter.error.message}
		</span>
	</Toast>
{/if}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { QueryRecords, SelectField } from '@egodb/core'
import { Container, Group, Modal, useEgoUITheme, useListState } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { openKanbanEditFieldAtom } from './kanban-edit-field.atom'
import { KanbanLane, SortableKanbanLane } from './kanban-lane'
import { SelectKanbanField } from './select-kanban-field'

interface IProps extends ITableBaseProps {
  field: SelectField
  records: QueryRecords
}

export const SelectBoard: React.FC<IProps> = ({ table, field, records }) => {
  const [options, handlers] = useListState(field.options.options)

  useEffect(() => {
    handlers.setState(field.options.options)
  }, [field])

  const items = options.map((o) => o.id.value)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [activeId, setActiveId] = useState<string | null>(null)
  const active = options.find((o) => o.id.value === activeId)

  const reorderOptions = trpc.table.reorderOptions.useMutation()

  const [opened, setOpened] = useAtom(openKanbanEditFieldAtom)

  const theme = useEgoUITheme()

  return (
    <Container fluid ml={0}>
      {opened && (
        <Modal
          target="body"
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
          overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
          overlayOpacity={0.55}
          overlayBlur={3}
        >
          <SelectKanbanField table={table} onSuccess={() => setOpened(false)} />
        </Modal>
      )}

      <Group>
        <KanbanLane table={table} field={field} records={records} title="uncategorized" id={null} />

        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setActiveId(active.id as string)}
          onDragEnd={(e) => {
            const { over, active } = e
            if (over) {
              handlers.reorder({
                from: active.data.current?.sortable?.index,
                to: over.data.current?.sortable?.index,
              })

              reorderOptions.mutate({
                tableId: table.id.value,
                fieldId: field.id.value,
                from: active.id as string,
                to: over.id as string,
              })
            }
            setActiveId(null)
          }}
          modifiers={[restrictToHorizontalAxis]}
          collisionDetection={closestCenter}
        >
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            {options.map((option) => (
              <SortableKanbanLane
                field={field}
                table={table}
                records={records}
                key={option.id.value}
                id={option.id.value}
                title={option.name.value}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            <KanbanLane
              table={table}
              field={field}
              records={records}
              title={active ? active.name.value : ''}
              id={active ? active.id.value : ''}
            />
          </DragOverlay>
        </DndContext>
      </Group>
    </Container>
  )
}

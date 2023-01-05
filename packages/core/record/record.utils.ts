import { filter, map, pipe, toArray } from '@fxts/core'
import type { ICreateFieldsSchema_internal, ICreateFieldValueSchema_internal } from '../field'
import { createFieldValueSchema_internal } from '../field'
import type { TableSchema } from '../value-objects'
import type { IMutateRecordValueSchema } from './record.schema'

export const createRecordInputs = (
  schema: TableSchema,
  value: IMutateRecordValueSchema,
): ICreateFieldsSchema_internal => {
  return pipe(
    value,
    map(({ name, value }) =>
      schema.getField(name).map((field) => ({ type: field.type, field, value } as ICreateFieldValueSchema_internal)),
    ),
    filter((f) => f.isSome),
    map((f) => f.unwrap()),
    map((f) => createFieldValueSchema_internal.parse(f)),
    toArray,
  )
}
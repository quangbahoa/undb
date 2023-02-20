import { IRecordQueryModel, ITableRepository, ReferenceFieldTypes, WithRecordTableId } from '@egodb/core'
import type { IQueryHandler } from '@egodb/domain'
import type { IGetForeignRecordsOutput } from './get-foreign-records.query.interface.js'
import type { GetForeignRecordsQuery } from './get-foreign-records.query.js'

export class GetForeignRecordsQueryHandler implements IQueryHandler<GetForeignRecordsQuery, IGetForeignRecordsOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly rm: IRecordQueryModel) {}

  async execute(query: GetForeignRecordsQuery) {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const field = table.schema.getFieldById(query.fieldId).unwrap() as ReferenceFieldTypes

    const foreignTable = (await this.tableRepo.findOneById(query.foreignTableId)).unwrap()
    const filter = foreignTable.getSpec(query.viewId)

    let spec = WithRecordTableId.fromString(query.foreignTableId)
      .map((s) => (filter.isNone() ? s : s.and(filter.unwrap())))
      .unwrap()

    const records = await this.rm.findForiegn(foreignTable.id.value, spec, foreignTable.schema.toIdMap(), field)

    return { records }
  }
}

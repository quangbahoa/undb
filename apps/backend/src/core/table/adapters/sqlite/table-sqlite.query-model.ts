import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import type { IQueryTable } from '@undb/core'
import { type ITableCache, type ITableSpec } from '@undb/core'
import { EntityManager, TableSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'
import { InjectTableKVCache } from './table-sqlite.repository.js'

@Injectable()
export class NestTableSqliteQueryModel extends TableSqliteQueryModel {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
    @InjectTableKVCache() protected readonly cache: ITableCache,
  ) {
    super(em, cache)
  }

  @UseRequestContext()
  async find(): Promise<IQueryTable[]> {
    return super.find()
  }

  @UseRequestContext()
  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  async findOneById(id: string): Promise<Option<IQueryTable>> {
    return super.findOneById(id)
  }
}

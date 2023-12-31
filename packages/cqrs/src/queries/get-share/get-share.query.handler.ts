import type { IQueryHandler } from '@undb/domain'
import { IShareQueryModel, ShareSpecification, WithShareId, WithShareView } from '@undb/integrations'
import { None, Option, Some } from 'oxide.ts'
import type { IGetShareOutput } from './get-share.query.interface.js'
import type { GetShareQuery } from './get-share.query.js'

export class GetShareQueryHandler implements IQueryHandler<GetShareQuery, IGetShareOutput> {
  constructor(protected readonly rm: IShareQueryModel) {}

  private getSpec(query: GetShareQuery): Option<ShareSpecification> {
    let spec: Option<ShareSpecification> | undefined = undefined

    if (query.id) {
      spec = Some(WithShareId.fromString(query.id))
    }

    if (query.targetId) {
      spec = Some(new WithShareView(query.targetId))
    }

    if (!spec) {
      spec = None
    }

    return spec
  }

  async execute(query: GetShareQuery): Promise<IGetShareOutput> {
    const spec = this.getSpec(query)
    if (spec.isNone()) throw new Error('invalid query spec')

    const share = (await this.rm.findOne(spec.unwrap())).into(null)

    return {
      share,
    }
  }
}

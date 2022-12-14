import { SetFiltersCommandHandler as DomainHandler, SetFitlersCommand, type ITableRepository } from '@egodb/core'
import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { InjectTableReposiory } from '../adapters'

@CommandHandler(SetFitlersCommand)
export class SetFiltersCommandHandler extends DomainHandler implements ICommandHandler<SetFitlersCommand> {
  constructor(
    @InjectTableReposiory()
    protected readonly repo: ITableRepository,
  ) {
    super(repo)
  }
}
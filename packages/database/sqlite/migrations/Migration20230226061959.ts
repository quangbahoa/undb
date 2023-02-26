import { Migration } from '@mikro-orm/migrations'

export class Migration20230226061959 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `ego_table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `views_order` text null, primary key (`id`));',
    )
    this.addSql('create index `ego_table_deleted_at_index` on `ego_table` (`deleted_at`);')

    this.addSql(
      "create table `ego_field` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `system` text not null default false, `type` text check (`type` in ('id', 'created-at', 'updated-at', 'auto-increment', 'string', 'email', 'color', 'number', 'date', 'select', 'bool', 'date-range', 'reference', 'tree', 'parent', 'rating')) not null, `foreign_table_id` text null, `parent_field_id` text null, `tree_field_id` text null, `display_field_ids` text null, `max` integer null, constraint `ego_field_table_id_foreign` foreign key(`table_id`) references `ego_table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `ego_field_deleted_at_index` on `ego_field` (`deleted_at`);')
    this.addSql('create index `ego_field_table_id_index` on `ego_field` (`table_id`);')
    this.addSql('create index `ego_field_type_index` on `ego_field` (`type`);')

    this.addSql(
      "create table `ego_option` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `field_id` text null, `name` text not null, `color_name` text check (`color_name` in ('dark', 'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange')) not null, `color_shade` integer not null, constraint `ego_option_field_id_foreign` foreign key(`field_id`) references `ego_field`(`id`) on delete cascade on update cascade, primary key (`key`));",
    )
    this.addSql('create index `ego_option_deleted_at_index` on `ego_option` (`deleted_at`);')
    this.addSql('create index `ego_option_field_id_index` on `ego_option` (`field_id`);')

    this.addSql(
      "create table `ego_view` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `display_type` text check (`display_type` in ('kanban', 'calendar', 'grid', 'tree')) not null, `sorts` json null, `kanban_field_id` text null, `calendar_field_id` text null, `tree_field_id` text null, `filter` json null, `field_options` json null, `fields_order` text null, constraint `ego_view_table_id_foreign` foreign key(`table_id`) references `ego_table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `ego_view_deleted_at_index` on `ego_view` (`deleted_at`);')
    this.addSql('create index `ego_view_table_id_index` on `ego_view` (`table_id`);')
  }
}

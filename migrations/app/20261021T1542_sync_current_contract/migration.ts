#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3c51c601a2fec95b6402b5aa3ccd03e3c4fde108bc3098dc56451eea80a074cb/contract';
import endContract from '../../snapshots/3c51c601a2fec95b6402b5aa3ccd03e3c4fde108bc3098dc56451eea80a074cb/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b24d527bdff9dc63a3027be57a4339df579119da333ceca55607d5d382a49a19/contract';
import startContract from '../../snapshots/b24d527bdff9dc63a3027be57a4339df579119da333ceca55607d5d382a49a19/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropDefault({ schema: 'public', table: 'User', column: 'updatedAt' }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Workspace',
        constraint: 'Workspace_status_check_c0eed61d',
      }),
      this.addColumn({
        schema: 'public',
        table: 'AgentPrompt',
        column: col('workspaceId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Canvas',
        column: col('content', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Canvas',
        column: col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Doc',
        column: col('content', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Doc',
        column: col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Doc',
        column: col('yjsState', 'bytea', { codecRef: { codecId: 'pg/bytea@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Workspace',
        column: col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Workspace',
        column: col('position', 'float8', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/float8@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Workspace',
        column: col('shareToken', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'AgentPrompt',
        column: 'ownerId',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Canvas',
        column: 'updatedAt',
        type: 'timestamptz',
        temporaryDefault: sql`'epoch'`,
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Canvas',
        column: 'workspaceId',
        type: 'text',
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Doc',
        column: 'updatedAt',
        type: 'timestamptz',
        temporaryDefault: sql`'epoch'`,
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Doc',
        column: 'workspaceId',
        type: 'text',
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Workspace',
        column: 'updatedAt',
        type: 'timestamptz',
        temporaryDefault: sql`'epoch'`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Canvas',
        constraint: 'Canvas_workspaceId_key',
        columns: ['workspaceId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Doc',
        constraint: 'Doc_workspaceId_key',
        columns: ['workspaceId'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'Workspace',
        constraint: 'Workspace_status_check_04914b68',
        expression: sql`"status" IN ('PLANNING', 'IN_PROGRESS', 'IN_REVIEW', 'DONE')`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Workspace',
        constraint: 'Workspace_shareToken_key',
        columns: ['shareToken'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AgentPrompt',
        index: 'AgentPrompt_ownerId_createdAt_idx_ffd2310a',
        columns: ['ownerId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AgentPrompt',
        index: 'AgentPrompt_workspaceId_idx_ba65f874',
        columns: ['workspaceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Workspace',
        index: 'Workspace_clerkOrgId_idx_865e99ac',
        columns: ['clerkOrgId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AgentPrompt',
        foreignKey: {
          name: 'AgentPrompt_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'Workspace', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Canvas',
        foreignKey: {
          name: 'Canvas_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'Workspace', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Doc',
        foreignKey: {
          name: 'Doc_workspaceId_fkey',
          columns: ['workspaceId'],
          references: { schema: 'public', table: 'Workspace', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

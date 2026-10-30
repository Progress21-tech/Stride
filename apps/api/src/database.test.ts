import { afterAll, describe, expect, it } from 'vitest';
import { prisma } from '@sylpace/db';

describe('PostgreSQL connection', () => {
  it('runs a query against the migrated database', async () => {
    const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 AS value`;
    expect(result[0]?.value).toBe(1);
  });
});

afterAll(async () => prisma.$disconnect());

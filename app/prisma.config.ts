import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaPostgres } from '@prisma/adapter-pg';

export default defineConfig({
	earlyAccess: true,
	schema: path.join('prisma', 'schema.prisma'),
	migrate: {
		async adapter(env) {
			return new PrismaPostgres({
				connectionString: env.DATABASE_URL
			});
		}
	}
});

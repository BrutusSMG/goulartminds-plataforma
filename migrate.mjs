// migrate.mjs
import { execSync } from 'child_process';

console.log('Iniciando o processo de migração...');

try {
  // 1. Gera o Prisma Client específico para o ambiente da Vercel (Linux)
  console.log('Gerando o Prisma Client para o ambiente de produção...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma Client gerado com sucesso.');

  // 2. Aplica as migrações no banco de dados
  console.log('Aplicando migrações (db push)...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('Migração (db push) aplicada com sucesso.');

} catch (e) {
  console.error('Ocorreu um erro durante o processo de migração:', e);
  process.exit(1);
}

console.log('Processo de migração finalizado com sucesso.');

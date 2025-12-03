// prisma/scripts/migrate.mjs
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

// Função para executar um comando no shell
const execute = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`Falha ao executar o comando: ${command}`, e);
    return false;
  }
};

async function main() {
  console.log('Iniciando o processo de migração...');

  // 1. Gera o Prisma Client para garantir que está atualizado
  if (!execute('npx prisma generate')) {
    process.exit(1);
  }
  console.log('Prisma Client gerado com sucesso.');

  // 2. Aplica as migrações usando db push
  // Usamos --force-reset para garantir que ele se aplique mesmo se houver divergências
  // e --accept-data-loss porque é seguro para o nosso caso de uso inicial.
  if (!execute('npx prisma db push --force-reset --accept-data-loss')) {
    process.exit(1);
  }
  console.log('Migração (db push) aplicada com sucesso.');

  // 3. (Opcional, mas bom para ter) Tenta se conectar ao banco de dados para validar
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('Conexão com o banco de dados validada com sucesso.');
    await prisma.$disconnect();
  } catch (e) {
    console.error('Falha ao validar a conexão com o banco de dados.', e);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Um erro inesperado ocorreu durante a migração:', e);
  process.exit(1);
});

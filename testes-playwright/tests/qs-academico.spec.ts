import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://andrewsys.github.io/02-TesteAutomatizado/');
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verificar que o aluno aparece na tabela
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      // await expect(page.getByText('João Silva')).toBeVisible();
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A tabela deve continuar sem dados reais
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

  });

  // ========== GRUPO 0: Verificações de Interface ==========
  // Demonstra asserções ricas do Playwright além da verificação de texto

  test.describe('Verificações de Interface', () => {

    test('deve exibir o título correto da página', async ({ page }) => {
      await expect(page).toHaveTitle(/QS Acadêmico/);
    });

    test('deve exibir a seção de cadastro ao carregar a página', async ({ page }) => {
      await expect(page.locator('#secao-cadastro')).toBeVisible();
    });

    test('deve ter o placeholder correto no campo Nome do Aluno', async ({ page }) => {
      await expect(page.getByLabel('Nome do Aluno')).toHaveAttribute(
        'placeholder', 'Digite o nome completo'
      );
    });

    test('deve exibir mensagem de tabela vazia ao carregar a página', async ({ page }) => {
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (8 + 6 + 10) / 3 = 8.00
      const celulaMedia = page.locator('#tabela-alunos tbody tr td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  // ========== GRUPO 3: Validação de Notas ==========

  test.describe('Validação de Notas', () => {

    test('não deve cadastrar aluno com nota maior que 10', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Inválido');
      await page.getByLabel('Nota 1').fill('11');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('As notas devem estar entre 0 e 10');
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

    test('não deve cadastrar aluno com nota negativa', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Inválido');
      await page.getByLabel('Nota 1').fill('-1');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('As notas devem estar entre 0 e 10');
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

  });

  // ========== GRUPO 4: Busca por Nome ==========

  test.describe('Busca por Nome', () => {

    test('deve exibir apenas o aluno correspondente ao termo buscado', async ({ page }) => {
      // Cadastrar primeiro aluno
      await page.getByLabel('Nome do Aluno').fill('Carlos Almeida');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Cadastrar segundo aluno
      await page.getByLabel('Nome do Aluno').fill('Maria Fernanda');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('5');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Filtrar por "Carlos"
      await page.getByLabel('Buscar por nome').fill('Carlos');

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.getByText('Carlos Almeida')).toBeVisible();
      await expect(page.getByText('Maria Fernanda')).not.toBeVisible();
    });

  });

  // ========== GRUPO 5: Exclusão de Alunos ==========

  test.describe('Exclusão de Alunos', () => {

    test('deve remover o aluno da tabela após exclusão', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Lucas Pereira');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('button', { name: 'Excluir Lucas Pereira' }).click();

      // Verificar que o nome do aluno não está mais visível
      await expect(page.getByText('Lucas Pereira')).not.toBeVisible();
      // Verificar que a tabela voltou ao estado vazio
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

  });

  // ========== GRUPO 6: Estatísticas ==========

  test.describe('Estatísticas', () => {

    test('deve exibir os totais corretos nos cards após cadastrar alunos com situações distintas', async ({ page }) => {
      // Aprovado: média >= 7
      await page.getByLabel('Nome do Aluno').fill('Alice Aprovada');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('9');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Recuperação: 5 <= média < 7
      await page.getByLabel('Nome do Aluno').fill('Bruno Recuperação');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Reprovado: média < 5
      await page.getByLabel('Nome do Aluno').fill('Clara Reprovada');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('3');
      await page.getByLabel('Nota 3').fill('3');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#stat-total')).toHaveText('3');
      await expect(page.locator('#stat-aprovados')).toHaveText('1');
      await expect(page.locator('#stat-recuperacao')).toHaveText('1');
      await expect(page.locator('#stat-reprovados')).toHaveText('1');
    });

  });

  // ========== GRUPO 7: Situação do Aluno ==========

  test.describe('Situação do Aluno', () => {

    test('deve exibir "Aprovado" para aluno com média maior ou igual a 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('8');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (8 + 8 + 8) / 3 = 8.00 → Aprovado
      const celulaSituacao = page.locator('#tabela-alunos tbody tr td').nth(5);
      await expect(celulaSituacao).toContainText('Aprovado');
    });

    test('deve exibir "Reprovado" para aluno com média menor que 5', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('3');
      await page.getByLabel('Nota 3').fill('3');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (3 + 3 + 3) / 3 = 3.00 → Reprovado
      const celulaSituacao = page.locator('#tabela-alunos tbody tr td').nth(5);
      await expect(celulaSituacao).toContainText('Reprovado');
    });

  });

  // ========== GRUPO 8: Múltiplos Cadastros ==========

  test.describe('Múltiplos Cadastros', () => {

    test('deve exibir 3 linhas na tabela após cadastrar 3 alunos consecutivos', async ({ page }) => {
      const alunos = [
        { nome: 'Aluno Um',   nota1: '7', nota2: '8', nota3: '9' },
        { nome: 'Aluno Dois', nota1: '5', nota2: '6', nota3: '7' },
        { nome: 'Aluno Três', nota1: '3', nota2: '4', nota3: '5' },
      ];

      for (const aluno of alunos) {
        await page.getByLabel('Nome do Aluno').fill(aluno.nome);
        await page.getByLabel('Nota 1').fill(aluno.nota1);
        await page.getByLabel('Nota 2').fill(aluno.nota2);
        await page.getByLabel('Nota 3').fill(aluno.nota3);
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

  });

});
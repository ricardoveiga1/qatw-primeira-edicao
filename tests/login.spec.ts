import { test, expect } from '@playwright/test';

test('Nao deve logar quando o codigo de autenticacao e invalido', async ({ page }) => {
  const usuario ={
    cpf: '00000014141',
    senha: '147258'
  }

  await page.goto('http://paybank-mf-auth:3000/');
  
  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  for (const digito of usuario.senha){
    await page.getByRole('button', { name: digito }).click();
  }

  //await page.getByRole('button', { name: '1' }).click();
  //await page.getByRole('button', { name: '4' }).click();
  //await page.getByRole('button', { name: '7' }).click();
  //await page.getByRole('button', { name: '2' }).click();
  //await page.getByRole('button', { name: '5' }).click();
  //await page.getByRole('button', { name: '8' }).click();
  
  await page.getByRole('button', { name: 'Continuar' }).click();
  
  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});
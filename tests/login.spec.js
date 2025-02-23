import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

test('Nao deve logar quando o codigo de autenticacao e invalido', async ({ page }) => {

  const usuario ={
    cpf: '00000014141',
    senha: '147258'
  }

  await page.goto('http://paybank-mf-auth:3000/');
  
  await page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(usuario.cpf);
  await page.getByRole('button', { name: 'Continuar' }).click();

  //await page.getByRole('button', { name: '1' }).click();
  //await page.getByRole('button', { name: '4' }).click();
  //await page.getByRole('button', { name: '7' }).click();
  //await page.getByRole('button', { name: '2' }).click();
  //await page.getByRole('button', { name: '5' }).click();
  //await page.getByRole('button', { name: '8' }).click();

  for (const digito of usuario.senha){
    await page.getByRole('button', { name: digito }).click();
  }
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});


test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)
  
  const usuario ={
    cpf: '00000014141',
    senha: '147258'
  }

  loginPage.acessaPagina()
  loginPage.informaCPF(usuario.cpf)
  loginPage.informarSenha(usuario.senha)
  

  //temporário 
  await page.waitForTimeout(10000)

  const codigo = await obterCodigo2FA()
  
  loginPage.informa2FA(codigo)

  //temporario
  await page.waitForTimeout(2000);

  //await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');

  expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});
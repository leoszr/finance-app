export const APP_NAME = 'Finance App';

export const APP_TAGLINE = 'Tracker financeiro local-first para uso pessoal.';

export function buildWelcomeMessage(appName: string = APP_NAME) {
  return `${appName} pronto para cuidar do dinheiro no dispositivo.`;
}

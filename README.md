# CryptoBot AI PRO 2.0 — Demo PWA

Protótipo educacional. **Não opera na Hezilex, não executa ordens, não garante resultados e não envia push em segundo plano.**

## Rodar localmente

1. Instale Node.js 20 ou superior.
2. No terminal, abra esta pasta.
3. Configure a chave Twelve Data como variável de ambiente (nunca a inclua no código do navegador):
   - macOS/Linux: `export TWELVE_DATA_API_KEY='SUA_CHAVE'`
   - Windows PowerShell: `$env:TWELVE_DATA_API_KEY='SUA_CHAVE'`
4. Execute `npm start`.
5. Abra `http://localhost:3000` no computador.

## Publicar para o iPhone

Publique esta pasta em um serviço que execute Node.js 20+ e disponibilize HTTPS, por exemplo Render ou Railway. Configure `TWELVE_DATA_API_KEY` no painel de variáveis de ambiente do serviço e o comando de inicialização `npm start`. Depois abra o URL HTTPS no Safari do iPhone, toque em Compartilhar > Adicionar à Tela de Início > Adicionar. Não exponha a chave de API em URLs públicos ou no navegador.

## Dados

Twelve Data `time_series`, intervalo `1min`, 100 candles. Símbolos: BTC/USD, ETH/USD, EUR/USD, GBP/USD, XAU/USD. Verifique na conta do provedor disponibilidade, cobertura, limites de créditos e direitos de uso para cada ativo; alguns símbolos ou intervalos podem exigir plano pago. O servidor mantém cache por 65 segundos para reduzir consumo de créditos, mas **5 ativos podem ultrapassar cotas gratuitas**. Não há feed em streaming.

## Sinais e Demo

Indicadores: EMA 9, EMA 21 e RSI 14 sobre velas de 1 minuto. A vela mais recente é descartada conservadoramente. Compra: EMA9>EMA21, RSI 50–70, último fechamento maior que anterior. Venda: EMA9<EMA21, RSI 30–50, último fechamento menor que anterior. Caso contrário: AGUARDAR. Expiração simulada: 5 minutos. O usuário registra uma simulação manualmente; ela fica no armazenamento local do navegador.

**Limitação importante:** o histórico de resultados só pode ser avaliado se o navegador estiver aberto e o provedor fornecer dados futuros suficientes. Datas/horários dos candles podem variar por timezone, e a avaliação do resultado pode permanecer PENDENTE. O preço de registro é o último candle fechado, não uma cotação executável. Não é um backtest confiável nem uma medição de acerto real. Não use os sinais para arriscar dinheiro.

## Alertas

A interface mostra o sinal enquanto o app está aberto. Não há configuração de notificações push ou sons nesta versão. Para notificações push reais, é necessário adicionar um backend com agendamento, persistência, VAPID e permissão de notificações no PWA instalado no iOS; isso não está incluído nesta versão.

## Segurança

Nunca coloque credenciais da Hezilex ou chaves Twelve Data no frontend. Não há integração com corretoras nem ordens automáticas. Para produção, acrescente autenticação, rate limiting, tratamento de fusos, observabilidade, política de privacidade e testes de indicadores e simulações.

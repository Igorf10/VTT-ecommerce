# VTT — Vale Tudo Team | E-commerce

E-commerce em React (Vite) para a academia de luta VTT. Consome uma API REST
de produtos; em desenvolvimento, essa API é simulada com `json-server` a
partir do arquivo `db.json`.

## Rodando o projeto

```bash
npm install

# Sobe a API mock (:3001) e o front-end (:5173) juntos, num comando só
npm run dev:all
```

Se preferir dois terminais separados (por exemplo pra ver os logs de cada
um isolado):

```bash
npm run server   # API mock em http://localhost:3001
npm run dev       # front-end em http://localhost:5173
```

Copie `.env.example` para `.env` se quiser mudar a URL da API:

```bash
cp .env.example .env
```

## Colocando no ar de graça

O site tem duas partes que precisam ser hospedadas separadamente: o
**front-end** (arquivos estáticos, React) e a **API mock** (`json-server`,
que é um processo Node que precisa ficar rodando). Elas vão pra provedores
diferentes.

### 1. API mock → Render (grátis)

1. Suba este projeto num repositório no GitHub.
2. Crie uma conta em [render.com](https://render.com) e clique em **New +
   → Blueprint**, apontando pro seu repositório. O Render vai ler o arquivo
   `render.yaml` (já incluso no projeto) e configurar tudo sozinho: build
   (`npm install`) e o comando de start (`npm run start:server`).
3. Quando terminar o deploy, o Render te dá uma URL pública, algo como
   `https://vtt-api.onrender.com`. É a URL da sua API em produção.

**Sobre o plano gratuito do Render:** o serviço "dorme" depois de ~15
minutos sem uso, e a primeira requisição depois disso demora uns 30-50
segundos pra "acordar". Pra um site em vitrine/portfólio tudo bem; se isso
incomodar, dá pra trocar pro plano pago mais barato do Render depois, sem
mudar nada no código.

**Sobre os dados:** o plano gratuito não tem disco persistente, então
cadastros de usuário e pedidos feitos em produção podem se perder quando o
serviço reinicia. Serve bem pra demonstrar o site funcionando; pra uma loja
de verdade, o passo seguinte é trocar o `json-server` por um banco de dados
de verdade (ex: Supabase, que também tem plano gratuito) — nesse ponto só
se mexe em `src/api/api.js`, o resto do app não muda.

### 2. Front-end → Vercel (grátis)

1. No mesmo repositório do GitHub, entre em [vercel.com](https://vercel.com),
   clique em **Add New → Project** e selecione o repositório. A Vercel
   detecta que é um projeto Vite automaticamente.
2. Antes de clicar em Deploy, adicione a variável de ambiente:
   - `VITE_API_URL` = a URL que o Render te deu (ex:
     `https://vtt-api.onrender.com`)
3. Clique em **Deploy**. Em ~1 minuto você recebe uma URL pública tipo
   `https://vtt-ecommerce.vercel.app` — é o link que outras pessoas usam
   pra acessar o site.

O arquivo `vercel.json` já está incluso e configurado pra rotas como
`/produto/3` ou `/minha-conta` funcionarem corretamente (sem isso, dar F5
numa página interna resultaria em erro 404).

**Alternativa igualmente boa e gratuita:** [netlify.com](https://netlify.com)
funciona do mesmo jeito (conecta o repo, define `VITE_API_URL` nas
variáveis de ambiente, deploy automático a cada push). O arquivo
`public/_redirects` já está incluso pra cuidar do mesmo problema de rotas.

### Depois do primeiro deploy

Tanto Vercel quanto Render ficam "escutando" o repositório: todo `git push`
pra branch principal já dispara um novo deploy sozinho, então você não
precisa repetir esses passos toda vez — é *"rodar sozinho"* também nesse
sentido.

```
src/
  api/api.js            -> toda comunicação com a API (único lugar a mudar)
  context/CartContext.jsx -> estado global do carrinho (localStorage)
  components/           -> Header, Footer, ProductCard
  pages/                -> Home, ProductDetail, Cart, Checkout, NotFound
  utils/format.js        -> formatação de moeda (BRL)
db.json                  -> dados mock consumidos pelo json-server
```

## Funcionalidades

- **Loja**: listagem de produtos por categoria, com filtro de **"Em promoção"**
  (aparece automaticamente quando algum produto tem `oldPrice` maior que
  `price` no `db.json` / na sua API).
- **Busca de produtos pela descrição**: campo de busca no header. Filtra
  pelos campos `description` e `name` dos produtos, atualizando a URL
  (`/?busca=termo`) — então o resultado é compartilhável e sobrevive a um
  refresh da página.
- **Contato rápido no header**: ícone do WhatsApp (abre uma conversa direto)
  e ícone de localização (abre um modal com as unidades da VTT).
- **Popup de boas-vindas**: modal de tela cheia oferecendo 10% de desconto
  na primeira compra pra quem se cadastra. Aparece uma vez por sessão do
  navegador (usa `sessionStorage`) pra não incomodar em toda navegação.
- **Barra de facilidades**: parcelamento, desconto à vista e frete grátis,
  logo abaixo do hero da home.
- **Carrinho**: adicionar, ajustar quantidade, remover um item ou esvaziar
  tudo de uma vez (com confirmação).
- **Conta de usuário**: cadastro e login em `/cadastro` e `/entrar`, sessão
  guardada no navegador (`localStorage`).
- **Meus pedidos**: em `/minha-conta` (rota protegida — redireciona pro
  login se não estiver autenticado), o usuário vê todos os pedidos feitos,
  com itens, status e total. Pedidos feitos como visitante (sem login) não
  aparecem nesse histórico — o checkout avisa isso na hora.

### ⚠️ Dados fictícios que você precisa trocar

Alguns conteúdos foram colocados como exemplo e têm que ser substituídos
pelos dados reais da VTT antes de ir pra produção:

- **WhatsApp**: constante `WHATSAPP_NUMBER` em `src/components/Header.jsx`
  (hoje é um número de exemplo).
- **Endereços das unidades**: array `STORES` em
  `src/components/StoresModal.jsx`.
- **Condições de parcelamento/frete**: textos em
  `src/components/BenefitsBar.jsx` (18x sem juros, 5% à vista, frete grátis
  acima de R$ 999,99) — ajuste pros valores e regras reais da loja.
- **Cupom de 10%**: o popup em `src/components/PromoModal.jsx` só
  direciona pro cadastro; a aplicação do cupom em si depende de você
  implementar a lógica no backend (gerar o cupom quando o usuário se
  cadastra e aplicá-lo no checkout).

⚠️ **Autenticação é um mock de desenvolvimento**: o `json-server` guarda a
senha em texto puro e não emite token de sessão de verdade. Funciona bem
pra testar o front-end, mas ao plugar sua API real, troque por um backend
que faça hash de senha (bcrypt) e autenticação por token (JWT ou sessão).
Isso está isolado em `src/api/api.js`, então a troca não afeta o resto do
app.

## Plugando a sua API de verdade

O front-end nunca fala diretamente com `db.json` — ele sempre passa por
`src/api/api.js`, que usa `axios` e lê a URL base de `VITE_API_URL`.

1. No `.env`, aponte para a sua API:
   ```
   VITE_API_URL=https://api.suaacademia.com.br
   ```
2. Garanta que sua API responda nesses formatos (ou ajuste `api.js`):
   - `GET /products` → lista de produtos
   - `GET /products?category=Luvas` → filtro por categoria
   - `GET /products/:id` → detalhe de um produto
   - `POST /users` → cadastro (retorne o usuário criado)
   - `GET /users?email=...&password=...` (ou equivalente no seu backend) →
     login; troque por um endpoint de autenticação de verdade (JWT/sessão)
   - `POST /orders` → cria um pedido vinculado ao `userId`
   - `GET /orders?userId=...` → histórico de pedidos de um usuário

Formato esperado de cada produto:

```json
{
  "id": 1,
  "name": "Luva de Boxe VTT Pro 14oz",
  "category": "Luvas",
  "price": 289.9,
  "oldPrice": 349.9,
  "stock": 18,
  "image": "https://...",
  "description": "..."
}
```

## Identidade visual

- Fundo preto fosco (`--ink-950`) com verde "veneno" (`--venom`) como cor de
  destaque em preços, CTAs e estados ativos — reservado para poucos elementos
  por página, mantendo o resto sóbrio.
- Tipografia de cartaz de luta: `Bebas Neue` (títulos, condensada e de
  impacto) + `Work Sans` (texto corrido, legível).
- Cantos retos (sem `border-radius`), bordas sólidas e divisores — estética
  mais "ringue/industrial" do que "SaaS arredondado".

Todos os tokens de cor e tipografia estão centralizados no topo de
`src/index.css`, então trocar a paleta é mexer só ali.

## Sobre as fotos dos produtos

As imagens em `db.json` são fotos reais de equipamento e prática de luta
(boxe, MMA, Muay Thai, Jiu-Jitsu, suplementação), hospedadas no CDN da
Unsplash sob a [Unsplash License](https://unsplash.com/license) — uso livre
para fins comerciais e não comerciais, sem necessidade de licença paga.
Alguns itens muito específicos (protetor bucal, corda de pular, aparador de
chute) não têm foto de produto isolado disponível gratuitamente, então
usam uma foto genérica da mesma categoria (proteção / equipamento de
academia) até você trocar por fotos reais do seu catálogo.

Créditos dos fotógrafos: Roman Aguila, Zachary Kadolph, Thao LEE, Alex Saks,
Dex Ezekiel, Nick Wang, Wade Austin Ellis, Samuel Girven e Eduardo Cano
Photo Co., todos via Unsplash.

Quando você tiver fotos reais dos seus produtos, é só trocar o campo
`image` de cada item — pode ser uma URL ou, se preferir, servir os arquivos
localmente e apontar para `/imagens/produto.jpg`.

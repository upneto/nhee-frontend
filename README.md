# Filosofia Colaborativa - Plataforma de Debates

Plataforma colaborativa de textos e debates filosóficos onde usuários compartilham reflexões, inteligência artificial extrai questões relevantes, e a comunidade participa de discussões profundas. Desenvolvido como SPA (Single Page Application) com design sóbrio, tipografia legível e foco na experiência de leitura e escrita prolongada.

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica das páginas
- **CSS3**: Design sóbrio com paleta escura e gradientes elegantes
- **JavaScript**: Lógica da aplicação e roteamento SPA
- **Bootstrap 5**: Framework CSS responsivo
- **Tipografia Serif**: 
  - **Crimson Text**: Fonte serifada para corpo de texto, otimizada para leitura prolongada
  - **Cinzel**: Fonte serifada clássica para títulos e cabeçalhos
- **Nginx**: Servidor web de alta performance

## Design e Identidade Visual

O sistema foi projetado especificamente para um acervo filosófico, com:

- **Paleta de Cores Sóbria**: Tons de preto (#0d0d0d, #1a1a1a) e cinza escuro (#2d2d2d)
- **Acentos Dourados**: Detalhes em dourado (#d4af37) e bronze (#b8935e) para elegância
- **Alta Legibilidade**: Fontes serif com tamanho generoso (18px) e espaçamento adequado (line-height: 1.8)
- **Contraste Otimizado**: Texto claro sobre fundo escuro para reduzir fadiga visual
- **Animações Suaves**: Transições elegantes que não distraem da leitura

## Estrutura do Projeto

```
/
├── index.html                 # Página principal da aplicação
├── start.bat                  # Script para iniciar o servidor Nginx
├── stop.bat                   # Script para parar o servidor Nginx
├── resources/
│   ├── main.css               # Estilos globais
│   ├── main.js                # Lógica principal e roteamento SPA
│   └── bootstrap/             # Arquivos do Bootstrap
│       ├── bootstrap.min.css
│       └── bootstrap.bundle.min.js
├── server/
│   ├── nginx/                 # Servidor Nginx
│   │   └── nginx-1.25.3/
│   │       ├── nginx.exe
│   │       └── conf/
│   │           └── nginx.conf # Configuração do Nginx
│   └── docker/                # Configuração Docker
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── start.sh
│       └── stop.sh
└── features/                  # Funcionalidades/telas da aplicação
    ├── authentication/
    │   ├── login/
    │   │   ├── login.html
    │   │   ├── login.css
    │   │   └── login.js
    │   ├── register/
    │   │   ├── register.html
    │   │   ├── register.css
    │   │   └── register.js
    │   └── forgot-password/
    │       ├── forgot-password.html
    │       ├── forgot-password.css
    │       └── forgot-password.js
    └── pages/
        ├── home/
        │   ├── home.html
        │   ├── home.css
        │   └── home.js
        ├── about/
        │   ├── about.html
        │   ├── about.css
        │   └── about.js
        ├── contact/
        │   ├── contact.html
        │   ├── contact.css
        │   └── contact.js
        └── 404/
            ├── 404.html
            ├── 404.css
            └── 404.js
```

## Como Executar

### Opção 1: Windows (Nginx Local)
1. Execute `start.bat` (como administrador se necessário).
2. Abra o navegador e acesse `http://localhost:8080`.
3. Para parar o servidor, execute `stop.bat`.

### Opção 2: Linux (Nginx Local)
**Nota**: O binário do Nginx incluído é para Windows. Para Linux, instale o Nginx separadamente.

1. Instale o Nginx:
   - Ubuntu/Debian: `sudo apt update && sudo apt install nginx`
   - CentOS/RHEL: `sudo yum install nginx` ou `sudo dnf install nginx`
   - Arch: `sudo pacman -S nginx`
2. Copie `server/nginx/nginx-1.25.3/conf/nginx.conf` para `/etc/nginx/nginx.conf` (ou o diretório de config do seu sistema).
3. Edite o arquivo copiado e mude `root c:/Workspace/frontend/blank;` para o caminho absoluto do projeto no Linux, ex.: `root /home/usuario/projeto;`.
4. Reinicie o Nginx: `sudo systemctl restart nginx` ou `sudo nginx -s reload`.
5. Abra o navegador e acesse `http://localhost` (porta 80).
6. Para parar: `sudo systemctl stop nginx` ou `sudo nginx -s stop`.

### Opção 3: Linux/Mac/Windows (Docker)
1. Instale o Docker e Docker Compose.
2. Navegue para `server/docker/` e execute `./start.sh` (Linux/Mac) ou `docker-compose up --build`.
3. Abra o navegador e acesse `http://localhost:8080`.
4. Para parar, execute `./stop.sh` ou `docker-compose down`.

**Nota**: A opção Docker permite rodar em qualquer sistema operacional com Docker instalado.

## Configuração para Diretório Diferente

Se o projeto for movido para um diretório diferente:

1. Abra o arquivo `resources/nginx/nginx-1.25.3/conf/nginx.conf`.
2. Localize a linha `root   c:/Workspace/frontend/blank;`.
3. Substitua pelo novo caminho absoluto do diretório raiz do projeto (ex.: `root   c:/Novo/Caminho/Para/Projeto;`).
4. Salve o arquivo.
5. Execute `start.bat` novamente.

**Nota**: O caminho deve usar barras `/` e ser absoluto. Se houver espaços no caminho, envolva em aspas duplas no arquivo de configuração.

## Desenvolvimento

- Cada funcionalidade tem seus próprios arquivos HTML, CSS e JS em `features/`.
- O Bootstrap é carregado globalmente, então pode ser usado em qualquer arquivo.
- Para adicionar novas páginas:
  1. Crie uma nova pasta em `features/pages/` ou `features/authentication/`
  2. Adicione os três arquivos: `nome.html`, `nome.css`, `nome.js`
- Mensagens personalizadas para cada usuário

✅ **Validação de Formulários**
- Validação em tempo real adaptada ao tema escuro
- Feedback visual com cores adequadas (verde/vermelho suaves)
- Mensagens de erro descritivas
- Prevenção de envio com dados inválidos

✅ **Interface Responsiva e Elegante**
- Design adaptável para diferentes tamanhos de tela
- Navegação com gradiente e efeitos hover sofisticados
- Tipografia otimizada para leitura de textos filosóficos
- Animações suaves e discretas

✅ **Páginas Temáticas**
- **Home**: Apresentação do acervo com citação filosófica e categorias
- **Sobre**: Informações sobre áreas do conhecimento e pensadores
- **Contato**: Formulário para comunicação com tema filosófico
- **404**: Página de erro elegante e consistente com o temascritivas
- Prevenção de envio com dados inválidos

✅ **Interface Responsiva**
- Design adaptável para diferentes tamanhos de tela
- Uso do Bootstrap 5 para componentes
- Navegação intuitiva
- Animações suaves

✅ **Páginas Funcionais**
- Home (com mensagem personalizada)
- Sobre (informações do projeto)
- Contato (formulário funcional)
- 404 (página de erro)

## Requisitos

- Windows (o Nginx é específico para Windows).
- Permissões para executar executáveis (pode requerer execução como administrador).

Se houver problemas, verifique o console do navegador para erros ou logs do Nginx.
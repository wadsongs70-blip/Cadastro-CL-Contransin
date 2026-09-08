# CL Parts Manager ⚙️

> **Catálogo permanente e estruturado de peças mecânicas para projetos de engenharia.**
> Substitui planilhas manuais por um sistema moderno, rápido, com persistência local em IndexedDB, pesquisa instantânea multicritério, fluxo contínuo de cadastro e exportação técnica para Excel.

---

## 1. Visão Geral e Objetivo

O **CL Parts Manager** foi desenvolvido especificamente para projetistas mecânicos, desenhistas técnicos e engenheiros de produto. Ele atua como fonte primária da verdade (Single Source of Truth) para o cadastro e histórico dimensional de peças usinadas, caldeiradas ou estampadas.

O software soluciona os principais gargalos de planilhas convencionais:
- **Prevenção de duplicidade de códigos**: ID no formato padronizado `ID-CL-XXX` com prefixo travado e cálculo automático do próximo número.
- **Cadastro sequencial de alta velocidade**: Função "Salvar e criar próxima" que grava o registro atual, emite toast de sucesso, gera o próximo ID e limpa os campos para o próximo desenho sem recarregar a tela.
- **Pesquisa Global Instantânea**: Busca em tempo real em mais de 10 atributos simultâneos (ID, descrição, PA, Código Sistema, dimensões, furos e observações).
- **Exportação Técnica Profissional**: Gera arquivos `.xlsx` oficiais com cabeçalho em duas linhas mescladas (`DIMENSÕES`, `FUROS A`, `FUROS B`, `INFORMAÇÕES ADICIONAIS`), filtros e largura automática de colunas.

---

## 2. Identidade Visual Oficial

A identidade visual do sistema utiliza o ícone oficial composto por:
- Componente mecânico cotado com linhas de chamada em azul técnico;
- Ficha de especificação técnica com preview isométrico e camadas;
- Cilindro de banco de dados em azul elétrico com anéis luminescentes.

Os arquivos de identidade estão disponíveis em:
- `public/favicon.svg` e `public/favicon.png` (Favicons de alta resolução)
- `public/logo.svg` e `public/logo.png` (Logotipo principal da aplicação)
- `src/assets/app-icon-reference.png` (Referência master)

---

## 3. Principais Funcionalidades

| Módulo | Descrição |
| :--- | :--- |
| **Dashboard** | Visão geral com métricas em tempo real (Total de peças, Último ID, Cadastradas hoje, Última peça) e atalhos rápidos de navegação. |
| **Central de Peças** | Tabela dinâmica de alta densidade com paginação (25, 50, 100), ordenação por qualquer coluna, seleção múltipla em lote, busca instantânea e gaveta de filtros técnicos. |
| **Cadastro em 5 Cards** | Divisão lógica: Card 01 (Identificação), Card 02 (Dimensões), Card 03 (Furos A), Card 04 (Furos B) e Card 05 (Fabricação & Rastreabilidade). |
| **Salvar e Criar Próxima** | Grava a peça atual no IndexedDB, recalcula o maior número existente e prepara o formulário para o próximo desenho instantaneamente. |
| **Duplicação de Peça** | Clona todas as dimensões, furos e tolerâncias de uma peça existente e atribui um novo ID disponível. |
| **Ficha Técnica (Modal / Detalhes)** | Visualização completa em estilo CAD das cotas e especificações técnicas de cada peça. |
| **Exportação Excel (.xlsx)** | Gera planilha SheetJS com duas linhas de cabeçalho mescladas, preenchimento azul escuro de engenharia e congelamento de painéis. |
| **Backup & Restauração JSON** | Exportação de cópia de segurança em arquivo `.json` e importação inteligente com detecção de duplicidades e estratégias de mesclagem ou substituição. |
| **Dark Mode Completo** | Alternância dinâmica entre temas Claro (Light), Escuro (Dark) e Sistema (System) com contraste otimizado para longas jornadas de projeto. |

---

## 4. Tecnologias Utilizadas

- **React 18** (Interface declarativa e componentes reutilizáveis)
- **TypeScript** (Tipagem estrita, sem uso de `any`)
- **Vite 5** (Build ultrarrápido com Hot Module Replacement)
- **Tailwind CSS** (Design system industrial responsivo)
- **SheetJS (xlsx)** (Manipulação avançada de planilhas de engenharia)
- **IndexedDB Nativo** (Persistência offline local permanente)
- **Lucide React** (Conjunto de ícones técnicos)
- **Zod** (Validação de schemas)
- **React Router 6** (Roteamento baseado em histórico no navegador)

---

## 5. Estrutura de Diretórios

```
cl-parts-manager/
├── public/
│   ├── favicon.svg          # Favicon vetorial
│   ├── favicon.png          # Favicon PNG
│   ├── logo.svg             # Logo vetorial oficial
│   └── logo.png             # Logo PNG oficial de alta resolução
├── src/
│   ├── assets/
│   │   └── app-icon-reference.png
│   ├── components/
│   │   ├── ui/              # Componentes base (Button, Input, Card, Badge, Modal, Toast)
│   │   ├── Sidebar.tsx      # Barra lateral retrátil com branding oficial
│   │   ├── Header.tsx       # Barra superior com busca global e seletor de tema
│   │   ├── PieceForm.tsx    # Formulário modular de 5 cards
│   │   ├── PieceTable.tsx   # Tabela avançada com ordenação e seleção em lote
│   │   ├── PieceRow.tsx     # Linha individual de dados com ações
│   │   ├── PieceDetailsModal.tsx # Ficha técnica de visualização CAD
│   │   ├── DimensionSection.tsx  # Seção de cotas com botões de espessuras padrão
│   │   ├── HoleSection.tsx       # Especificação de furos e oblongos
│   │   ├── FilterPanel.tsx       # Gaveta lateral de filtros combinados
│   │   ├── SearchBar.tsx         # Barra de pesquisa instantânea
│   │   ├── ExportPanel.tsx       # Painel de exportação XLSX
│   │   ├── BackupPanel.tsx       # Painel de backup e restauração JSON
│   │   └── ConfirmDialog.tsx     # Diálogo de confirmação para ações destrutivas
│   ├── pages/
│   │   ├── Dashboard.tsx    # Métricas e peças recentes
│   │   ├── Pieces.tsx       # Central de Peças
│   │   ├── NewPiece.tsx     # Cadastro de nova peça
│   │   ├── EditPiece.tsx    # Edição de peça
│   │   ├── PieceDetails.tsx # Ficha técnica dedicada
│   │   ├── Export.tsx       # Tela de exportação
│   │   ├── Backup.tsx       # Tela de backup
│   │   └── Settings.tsx     # Configurações e manutenção do banco
│   ├── hooks/
│   │   ├── usePieces.ts     # Hook central de estado do IndexedDB
│   │   ├── useFilters.ts    # Estado de filtros combinados
│   │   └── useTheme.ts      # Controle de tema Light/Dark/System
│   ├── services/
│   │   ├── database.ts      # Repositório IndexedDB com CRUD e cálculo de próximo ID
│   │   ├── excel.ts         # Motor SheetJS de exportação personalizada
│   │   └── backup.ts        # Validador e importador/exportador de JSON
│   ├── types/
│   │   ├── piece.ts         # Interfaces Piece, HoleData, FilterOptions
│   │   └── database.ts      # Tipos de backup e migração
│   ├── utils/
│   │   ├── generateId.ts    # Regras e parsing de ID-CL-XXX
│   │   ├── validators.ts    # Schemas Zod
│   │   ├── formatters.ts    # Formatadores de datas e cotas
│   │   └── search.ts        # Motor de busca multicritério e ordenação
│   ├── App.tsx              # Rotas e layout principal
│   ├── main.tsx             # Entrypoint React
│   └── index.css            # Diretivas Tailwind e estilização base
├── scripts/
│   └── test-units.js        # Testes automatizados de lógica e XLSX
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 6. Como Instalar e Rodar Localmente

### Pré-requisitos
- **Node.js**: Versão 18 ou superior (Recomendado LTS v24.x)
- **NPM**: Versão 9 ou superior

### Passos de Instalação

1. Clone ou acesse a pasta do projeto:
```bash
cd cl-parts-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

---

## 7. Geração de Build de Produção

Para gerar o pacote otimizado para deploy:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`. Para testar o build localmente:

```bash
npm run preview
```

---

## 8. Banco de Dados Permanente (IndexedDB)

Diferente do `localStorage` (limitado a ~5MB e strings), o CL Parts Manager utiliza o **IndexedDB nativo do navegador**:
- Suporta dezenas de milhares de registros com alta performance;
- Mantém os dados seguros ao reiniciar a máquina, fechar a aba ou atualizar a página;
- Na primeira execução, 4 peças de engenharia realistas são carregadas como demonstração (removíveis a qualquer momento em **Configurações -> Remover Dados de Demonstração**).

---

## 9. Versionamento no GitHub

O projeto já possui `.gitignore` completo configurado. Para enviar para o seu repositório:

```bash
git init
git add .
git commit -m "feat: initial commit CL Parts Manager"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cl-parts-manager.git
git push -u origin main
```

---

## 10. Deploy (Vercel, Netlify, Cloudflare Pages)

Como se trata de uma Single Page Application (SPA) cliente com Vite:
1. Conecte o repositório na **Vercel** ou **Netlify**;
2. Configurações de build automáticas detectadas:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. O aplicativo funcionará imediatamente em HTTPS com armazenamento IndexedDB isolado e seguro no navegador de cada usuário.

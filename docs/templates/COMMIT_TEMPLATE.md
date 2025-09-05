# 📝 Padrões de Commit - Biblioteca Universitária

## 🎯 Visão Geral

Este documento define os padrões de commit que devem ser seguidos no projeto Biblioteca Universitária para manter um histórico limpo e organizado.

---

## 🔤 Formato do Commit

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### **Exemplo:**
```
feat(auth): implement JWT authentication system

- Add JWT strategy and guard
- Implement login/logout endpoints
- Add user authentication middleware

Closes #123
```

---

## 📋 Tipos de Commit

### **✨ feat**
**Nova funcionalidade para o usuário**
```bash
feat(user): add user profile management
feat(material): implement material search functionality
feat(loan): add loan renewal system
```

### **🐛 fix**
**Correção de bug**
```bash
fix(auth): resolve JWT token expiration issue
fix(ui): fix responsive layout on mobile devices
fix(api): correct user validation error
```

### **📚 docs**
**Mudanças na documentação**
```bash
docs(readme): update installation instructions
docs(api): add authentication endpoints documentation
docs(frontend): update component usage examples
```

### **🎨 style**
**Mudanças que não afetam o código (espaços, formatação, etc.)**
```bash
style(components): format component files
style(scss): organize CSS variables
style(ts): fix TypeScript formatting
```

### **♻️ refactor**
**Refatoração de código (não corrige bug nem adiciona funcionalidade)**
```bash
refactor(auth): simplify authentication logic
refactor(services): extract common service methods
refactor(components): improve component structure
```

### **⚡ perf**
**Melhoria de performance**
```bash
perf(database): optimize user queries
perf(api): add response caching
perf(frontend): implement lazy loading
```

### **✅ test**
**Adição ou correção de testes**
```bash
test(auth): add authentication unit tests
test(api): implement integration tests
test(components): add component testing
```

### **🔧 chore**
**Tarefas de manutenção, build, etc.**
```bash
chore(deps): update dependencies
chore(build): configure production build
chore(ci): setup GitHub Actions
```

---

## 🎯 Escopo (Scope)

### **Backend**
- `auth` - Autenticação e autorização
- `user` - Gestão de usuários
- `material` - Gestão de materiais
- `loan` - Sistema de empréstimos
- `reservation` - Sistema de reservas
- `fine` - Gestão de multas
- `review` - Sistema de avaliações
- `api` - API geral
- `database` - Banco de dados
- `config` - Configurações
- `middleware` - Middlewares
- `utils` - Utilitários

### **Frontend**
- `ui` - Interface do usuário
- `components` - Componentes
- `pages` - Páginas
- `services` - Serviços
- `guards` - Guards de rota
- `interceptors` - Interceptors HTTP
- `styles` - Estilos e CSS
- `routing` - Roteamento

### **Geral**
- `docs` - Documentação
- `build` - Build e deploy
- `ci` - Integração contínua
- `deps` - Dependências
- `scripts` - Scripts

---

## 📝 Descrição

### **Regras para a Descrição**
- **Primeira letra em minúscula**
- **Sem ponto final**
- **Imperativo (como se fosse uma ordem)**
- **Máximo 72 caracteres**

### **✅ Exemplos Corretos:**
```bash
feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs(api): update endpoint documentation
```

### **❌ Exemplos Incorretos:**
```bash
feat(auth): Added user login functionality
fix(ui): Resolved button alignment issue
docs(api): Updated endpoint documentation
```

---

## 📄 Corpo do Commit (Body)

### **Quando usar o Body**
- **Explicar o "porquê"** da mudança
- **Listar mudanças específicas**
- **Mencionar breaking changes**
- **Referenciar issues**

### **Formato do Body**
```bash
feat(auth): implement JWT authentication

- Add JWT strategy with Passport
- Implement login/logout endpoints
- Add authentication middleware
- Update user service with auth methods

BREAKING CHANGE: User login now requires JWT token

Closes #123
Fixes #456
```

---

## 🔗 Footer

### **Referenciar Issues**
```bash
Closes #123          # Fecha a issue
Fixes #456           # Corrige a issue
Relates to #789      # Relacionado à issue
```

### **Breaking Changes**
```bash
BREAKING CHANGE: authentication now requires JWT token

This change breaks the existing authentication flow.
Users need to update their authentication method.
```

---

## 📱 Exemplos Completos

### **Feature com Breaking Change**
```bash
feat(auth): implement role-based access control

- Add role enum (STUDENT, TEACHER, LIBRARIAN, ADMIN)
- Implement role guard for route protection
- Update user model with role field
- Add role validation middleware

BREAKING CHANGE: User routes now require role-based access

Closes #234
```

### **Bug Fix com Testes**
```bash
fix(loan): resolve loan renewal date calculation

- Fix date calculation logic in loan service
- Add validation for renewal limits
- Update loan renewal tests
- Add edge case handling

Fixes #567
```

### **Refatoração**
```bash
refactor(services): extract common service methods

- Create base service class
- Extract CRUD operations to base service
- Update all services to extend base service
- Improve code reusability and maintainability

Relates to #890
```

### **Documentação**
```bash
docs(readme): update project setup instructions

- Add detailed installation steps
- Include environment configuration
- Add troubleshooting section
- Update development workflow

Closes #111
```

---

## 🚫 O que NÃO fazer

### **❌ Commits Muito Grandes**
```bash
# ❌ RUIM - Muitas mudanças em um commit
feat: implement complete user management system with authentication, roles, and permissions

# ✅ BOM - Commits menores e focados
feat(auth): add user authentication
feat(user): implement user management
feat(roles): add role-based permissions
```

### **❌ Mensagens Vazias**
```bash
# ❌ RUIM
fix

# ✅ BOM
fix(auth): resolve login validation error
```

### **❌ Mensagens Muito Longas**
```bash
# ❌ RUIM - Mais de 72 caracteres
feat(auth): implement comprehensive JWT authentication system with refresh tokens and role-based access control

# ✅ BOM
feat(auth): implement JWT authentication with roles
```

---

## 🔧 Configuração do Git

### **Template de Commit**
Crie um arquivo `.gitmessage` na raiz do projeto:

```bash
# .gitmessage
<type>(<scope>): <description>

[optional body]

[optional footer(s)]

# Tipos: feat, fix, docs, style, refactor, perf, test, chore
# Escopo: auth, user, material, loan, reservation, fine, review, api, ui, components, etc.
# Descrição: máximo 72 caracteres, imperativo, sem ponto final
```

### **Configurar Git para usar o template**
```bash
git config commit.template .gitmessage
```

### **Husky Hook (Recomendado)**
```json
// package.json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

---

## 📊 Ferramentas de Validação

### **Commitlint**
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### **Configuração (.commitlintrc.js)**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'user',
        'material',
        'loan',
        'reservation',
        'fine',
        'review',
        'api',
        'ui',
        'components',
        'docs',
        'build',
        'ci'
      ]
    ]
  }
};
```

---

## 🎯 Checklist de Commit

### **Antes de fazer commit:**
- [ ] Código está funcionando
- [ ] Testes passaram
- [ ] Linting está limpo
- [ ] Mensagem segue o padrão
- [ ] Escopo está correto
- [ ] Descrição é clara e concisa

### **Para commits complexos:**
- [ ] Body explica as mudanças
- [ ] Breaking changes estão documentados
- [ ] Issues relacionadas estão referenciadas
- [ ] Mudanças são atômicas

---

## 📚 Recursos Adicionais

### **Documentação Oficial**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)

### **Ferramentas**
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Commitlint](https://github.com/conventional-changelog/commitlint)
- [Husky](https://github.com/typicode/husky)

---

**Lembre-se: commits bem estruturados facilitam a manutenção e colaboração no projeto! 🚀**

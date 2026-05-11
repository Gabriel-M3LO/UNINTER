/* =====================================================
   script.js — Portfólio Gabriel Barbosa
   Funcionalidades:
     1. Menu hambúrguer (mobile)
     2. Destaque de link ativo ao rolar
     3. Alternância de tema claro/escuro
     4. Validação de formulário de contato
     5. Simulação de envio com modal de confirmação
   ===================================================== */

// ─── 1. ELEMENTOS ───────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const themeBtn    = document.getElementById('theme-btn');
const themeIcon   = document.getElementById('theme-icon');
const form        = document.getElementById('contact-form');
const successMsg  = document.getElementById('success-msg');
const modal       = document.getElementById('modal');
const modalClose  = document.getElementById('modal-close');
const submitBtn   = document.getElementById('submit-btn');

// Campos do formulário
const inputNome     = document.getElementById('nome');
const inputEmail    = document.getElementById('email');
const inputMensagem = document.getElementById('mensagem');

// Erros dos campos
const errorNome     = document.getElementById('error-nome');
const errorEmail    = document.getElementById('error-email');
const errorMensagem = document.getElementById('error-mensagem');

// ─── 2. MENU HAMBÚRGUER ─────────────────────────────────
/**
 * Abre/fecha o menu mobile ao clicar no botão hambúrguer.
 * Adiciona a classe 'open' tanto no botão quanto na lista de links.
 */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  // Acessibilidade: informa ao leitor de tela se o menu está expandido
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Fecha o menu ao clicar em qualquer link de navegação
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ─── 3. DESTAQUE DO LINK ATIVO AO ROLAR ─────────────────
/**
 * Observa as seções da página. Quando uma seção entra na viewport,
 * o link de navegação correspondente recebe a classe 'active'.
 */
const sections = document.querySelectorAll('.section');
const allNavLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id; // ex: "sobre", "formacao"...
        allNavLinks.forEach(link => {
          // Remove 'active' de todos os links
          link.classList.remove('active');
          // Adiciona 'active' apenas no link correspondente
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.35 } // 35% da seção deve estar visível
);

sections.forEach(sec => sectionObserver.observe(sec));

// ─── 4. TEMA CLARO / ESCURO ─────────────────────────────
/**
 * Alterna entre tema escuro (dark) e claro (light).
 * Salva a preferência no localStorage para persistência entre visitas.
 */
function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');
  // Ícone indicativo: lua = dark, sol = light
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Carrega tema salvo ou usa escuro como padrão
const savedTheme = localStorage.getItem('tema') || 'dark';
applyTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('tema', nextTheme);
});

// ─── 5. VALIDAÇÃO DO FORMULÁRIO ─────────────────────────

/**
 * Valida um campo individual.
 * @param {HTMLElement} input   - O campo de input/textarea
 * @param {HTMLElement} errorEl - O span onde exibir a mensagem de erro
 * @param {string}      type    - 'nome' | 'email' | 'mensagem'
 * @returns {boolean} - true se válido, false se inválido
 */
function validateField(input, errorEl, type) {
  const value = input.value.trim();

  // Limpa estado anterior
  input.classList.remove('invalid');
  errorEl.textContent = '';

  if (type === 'nome') {
    if (!value) {
      errorEl.textContent = 'Por favor, informe seu nome.';
      input.classList.add('invalid');
      return false;
    }
    if (value.length < 3) {
      errorEl.textContent = 'O nome deve ter ao menos 3 caracteres.';
      input.classList.add('invalid');
      return false;
    }
  }

  if (type === 'email') {
    if (!value) {
      errorEl.textContent = 'Por favor, informe seu e-mail.';
      input.classList.add('invalid');
      return false;
    }
    // Regex de validação de e-mail (RFC 5322 simplificado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorEl.textContent = 'Informe um e-mail válido. Ex: usuario@dominio.com';
      input.classList.add('invalid');
      return false;
    }
  }

  if (type === 'mensagem') {
    if (!value) {
      errorEl.textContent = 'Por favor, escreva sua mensagem.';
      input.classList.add('invalid');
      return false;
    }
    if (value.length < 10) {
      errorEl.textContent = 'A mensagem deve ter ao menos 10 caracteres.';
      input.classList.add('invalid');
      return false;
    }
  }

  return true; // campo válido
}

// Validação em tempo real (ao sair do campo — evento blur)
inputNome.addEventListener('blur', () =>
  validateField(inputNome, errorNome, 'nome'));
inputEmail.addEventListener('blur', () =>
  validateField(inputEmail, errorEmail, 'email'));
inputMensagem.addEventListener('blur', () =>
  validateField(inputMensagem, errorMensagem, 'mensagem'));

// Remove marcação de erro ao começar a digitar
[inputNome, inputEmail, inputMensagem].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
  });
});

// ─── 6. ENVIO DO FORMULÁRIO ─────────────────────────────
/**
 * Intercepta o submit do formulário, valida todos os campos,
 * e — se válido — simula o envio: exibe modal, limpa os campos
 * e mostra mensagem de sucesso.
 */
form.addEventListener('submit', event => {
  // Previne o comportamento padrão (não recarrega a página)
  event.preventDefault();

  // Valida cada campo e coleta resultados
  const nomeOk     = validateField(inputNome,     errorNome,     'nome');
  const emailOk    = validateField(inputEmail,    errorEmail,    'email');
  const mensagemOk = validateField(inputMensagem, errorMensagem, 'mensagem');

  // Se algum campo for inválido, foca no primeiro com erro e interrompe
  if (!nomeOk || !emailOk || !mensagemOk) {
    if (!nomeOk)     inputNome.focus();
    else if (!emailOk) inputEmail.focus();
    else              inputMensagem.focus();
    return;
  }

  // ── Simulação de envio ──
  // Desabilita botão durante "envio"
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  // Simula delay de rede (1.2 s)
  setTimeout(() => {
    // Limpa os campos
    form.reset();
    inputNome.classList.remove('invalid');
    inputEmail.classList.remove('invalid');
    inputMensagem.classList.remove('invalid');

    // Restaura botão
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensagem';

    // Exibe modal de confirmação
    modal.classList.remove('hidden');

    // Exibe mensagem de sucesso inline (acessível)
    successMsg.classList.remove('hidden');

    // Oculta mensagem inline após 5 segundos
    setTimeout(() => successMsg.classList.add('hidden'), 5000);
  }, 1200);
});

// ─── 7. FECHAR MODAL ────────────────────────────────────
/**
 * Fecha o modal de confirmação ao clicar no botão "Fechar"
 * ou ao clicar fora do modal (na sobreposição).
 */
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

modal.addEventListener('click', event => {
  // Fecha apenas se clicar na sobreposição (não no conteúdo do modal)
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});

// Fecha modal ao pressionar Escape
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
  }
});

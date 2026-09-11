(function () {
  'use strict';

  const routes = {
    cadastro: 'cadastro.html',
    orientacao: 'orientacao.html',
    mapa: 'mapa.html',
    comunicacao: 'comunicacao.html',
    gestor: 'gestor.html',
    dashboard: 'dashboard.html'
  };

  function go(page) {
    if (routes[page]) window.location.href = routes[page];
  }
  window.AC = { go };

  function showToast(message, kind = 'info') {
    const region = document.getElementById('live-region');
    if (!region) return;
    region.textContent = '';
    const node = document.createElement('div');
    node.className = `notice ${kind}`;
    node.innerHTML = `<strong>${kind === 'success' ? '✓' : kind === 'error' ? '!' : 'i'}</strong><span>${message}</span>`;
    region.appendChild(node);
    setTimeout(() => { if (node.parentNode) node.remove(); }, 5200);
  }
  window.AC.toast = showToast;

  function applyOnlineState() {
    const region = document.getElementById('network-status');
    if (!region) return;
    if (navigator.onLine) {
      region.className = 'notice info';
      region.innerHTML = '<span class="symbol">●</span><div><strong>Conexão disponível</strong><div class="muted">Os dados podem ser enviados normalmente.</div></div>';
    } else {
      region.className = 'notice warning';
      region.innerHTML = '<span class="symbol">⚠</span><div><strong>Você está sem internet</strong><div class="muted">O protótipo continua disponível. Evite repetir envios e tente novamente quando a conexão voltar.</div></div>';
    }
  }
  window.addEventListener('online', () => { applyOnlineState(); showToast('Conexão restaurada. Você pode tentar o envio novamente.', 'success'); });
  window.addEventListener('offline', () => { applyOnlineState(); showToast('Sem internet. O sistema manteve a tela aberta para você não perder o contexto.', 'warning'); });

  function bindFormValidation(form) {
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const required = [...form.querySelectorAll('[required]')];
      let valid = true;
      required.forEach(input => {
        const error = document.getElementById(`${input.id}-error`);
        const empty = !String(input.value || '').trim();
        input.setAttribute('aria-invalid', empty ? 'true' : 'false');
        if (error) error.hidden = !empty;
        if (empty) valid = false;
      });
      if (!valid) {
        const first = required.find(i => i.getAttribute('aria-invalid') === 'true');
        if (first) first.focus();
        showToast('Confira os campos marcados antes de continuar.', 'error');
        return;
      }
      showToast('Dados preparados com sucesso. Neste protótipo, o envio é apenas demonstrativo.', 'success');
      form.reset();
      form.querySelectorAll('[aria-invalid="true"]').forEach(i => i.setAttribute('aria-invalid', 'false'));
    });
  }

  function setupStepper() {
    const form = document.getElementById('cadastro-form');
    if (!form) return;
    const sections = [...document.querySelectorAll('[data-step]')];
    const buttonsNext = [...document.querySelectorAll('[data-next]')];
    const buttonsPrev = [...document.querySelectorAll('[data-prev]')];
    const progress = document.getElementById('progress-bar');
    const status = document.getElementById('step-status');
    let current = 1;

    function render() {
      sections.forEach(s => s.hidden = Number(s.dataset.step) !== current);
      document.querySelectorAll('.step').forEach((el, idx) => {
        el.classList.toggle('active', idx + 1 === current);
        el.classList.toggle('done', idx + 1 < current);
      });
      if (progress) progress.style.width = `${current * 25}%`;
      if (status) status.textContent = `Etapa ${current} de 4`;
      const first = document.querySelector(`[data-step="${current}"] input, [data-step="${current}"] select`);
      if (first) first.focus();
    }
    buttonsNext.forEach(btn => btn.addEventListener('click', () => {
      const section = document.querySelector(`[data-step="${current}"]`);
      const required = [...section.querySelectorAll('[required]')];
      let valid = true;
      required.forEach(input => {
        const empty = !String(input.value || '').trim();
        input.setAttribute('aria-invalid', empty ? 'true' : 'false');
        const error = document.getElementById(`${input.id}-error`);
        if (error) error.hidden = !empty;
        if (empty) valid = false;
      });
      if (!valid) { showToast('Preencha os campos obrigatórios desta etapa.', 'error'); return; }
      if (current < 4) { current += 1; render(); }
    }));
    buttonsPrev.forEach(btn => btn.addEventListener('click', () => { if (current > 1) { current -= 1; render(); } }));
    form.addEventListener('submit', e => { e.preventDefault(); showToast('Cadastro concluído no protótipo. Em um sistema real, os dados seriam enviados com segurança.', 'success'); });
    render();
  }

  function setupFilters() {
    const filter = document.getElementById('point-filter');
    const cards = [...document.querySelectorAll('[data-zone]')];
    if (!filter || !cards.length) return;
    filter.addEventListener('change', () => {
      const value = filter.value;
      cards.forEach(card => card.hidden = value !== 'todos' && card.dataset.zone !== value);
      showToast(value === 'todos' ? 'Mostrando todos os pontos.' : `Filtro aplicado: ${value}.`, 'info');
    });
  }

  function setupApproval() {
    document.querySelectorAll('[data-decision]').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('[data-request]');
        const badge = row?.querySelector('[data-status]');
        const decision = btn.dataset.decision;
        if (badge) {
          badge.textContent = decision === 'approve' ? '✓ Aprovada' : '✕ Recusada';
          badge.className = `badge ${decision === 'approve' ? 'approved' : 'rejected'}`;
        }
        row?.querySelectorAll('button').forEach(b => b.disabled = true);
        showToast(decision === 'approve' ? 'Solicitação aprovada.' : 'Solicitação recusada. Motivo deve ser registrado ao concluir a ação real.', decision === 'approve' ? 'success' : 'warning');
      });
    });
  }

  function setupCommunication() {
    const form = document.getElementById('message-form');
    const input = document.getElementById('message');
    const chat = document.getElementById('chat');
    if (!form || !input || !chat) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) { input.focus(); showToast('Digite uma mensagem antes de enviar.', 'error'); return; }
      const item = document.createElement('div');
      item.className = 'message user';
      item.innerHTML = `<strong>Você</strong><div>${value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</div><time>agora</time>`;
      chat.appendChild(item);
      input.value = '';
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast('Mensagem adicionada ao atendimento demonstrativo.', 'success');
    });
  }

  function setupDemoLoading() {
    const btn = document.getElementById('simulate-retry');
    const box = document.getElementById('loading-area');
    if (!btn || !box) return;
    btn.addEventListener('click', () => {
      box.hidden = false;
      setTimeout(() => {
        box.innerHTML = '<div class="notice error"><span class="symbol">!</span><div><strong>Não foi possível atualizar</strong><div class="muted">A conexão está instável. Tente novamente sem sair desta tela.</div></div></div>';
      }, 1100);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyOnlineState();
    bindFormValidation(document.querySelector('[data-validated-form]'));
    setupStepper(); setupFilters(); setupApproval(); setupCommunication(); setupDemoLoading();

    document.querySelectorAll('[data-confirm]').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast(btn.dataset.confirm || 'Ação realizada.', 'success');
      });
    });

    const installHint = document.getElementById('install-hint');
    if (installHint && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  });
})();

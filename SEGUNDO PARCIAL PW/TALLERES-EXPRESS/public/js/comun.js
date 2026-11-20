const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(payload?.message || payload?.error || 'No se pudo completar la solicitud.');
  return payload;
}

function pintarNav() {
  const nav = document.querySelector('#nav');
  if (!nav) return;
  const links = [
    ['/talleres', 'Talleres'],
    ['/alumnos/perfil', 'Usuarios'],
    ['/talleres/alumnos/perfil', 'Asistencia'],
  ];
  const current = window.location.pathname;
  nav.className = 'site-header';
  nav.innerHTML = `<div class="nav-wrap"><a class="brand" href="/"><span class="brand-mark">T</span><span>Aula Abierta</span></a><div class="nav-links">${links.map(([href, label]) => `<a href="${href}" ${current === href || (href === '/talleres' && current.startsWith('/talleres/')) ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</div></div>`;
}

function mostrarAviso(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('error', isError);
  element.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', pintarNav);

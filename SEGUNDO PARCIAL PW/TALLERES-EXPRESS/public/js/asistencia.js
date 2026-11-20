const profileForm = document.querySelector('#buscar-perfil');
const profileBox = document.querySelector('#perfil');
const availableBox = document.querySelector('#disponibles');
let registeredBoleta = '';

async function cargarDisponibles() {
  try {
    const { data } = await api('/api/talleres');
    const open = data.filter((item) => item.cupo > item.inscritos);
    availableBox.innerHTML = open.length ? open.map((item) => `
      <a class="workshop-card" href="/talleres/${item.id}">
        <div class="card-top"><span class="tag">${escapeHtml(item.fecha || 'Fecha por confirmar')}</span><span class="capacity">${item.cupo - item.inscritos} lugares</span></div>
        <h3>${escapeHtml(item.nombre)}</h3><p>${escapeHtml(item.descripcion || 'Detalles próximamente.')}</p>
        <div class="card-bottom"><span>${escapeHtml(item.instructor)}</span><span class="inline-link">Inscribirme →</span></div>
      </a>`).join('') : '<p class="empty-state">Por ahora no hay talleres con lugares disponibles.</p>';
  } catch (error) {
    availableBox.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const boleta = new FormData(profileForm).get('boleta').trim();
  const notice = document.querySelector('#perfil-aviso');
  try {
    const [{ data: profile }, { data: workshops }] = await Promise.all([
      api(`/api/alumnos/${encodeURIComponent(boleta)}/perfil`),
      api(`/api/alumnos/${encodeURIComponent(boleta)}/talleres`),
    ]);
    if (!profile) {
      profileBox.innerHTML = '';
      mostrarAviso(notice, 'No encontramos una cuenta ni inscripciones para esa boleta.', true);
      return;
    }
    registeredBoleta = boleta;
    mostrarAviso(notice, profile.registrado ? 'Perfil de usuario registrado.' : 'Perfil creado a partir de tus inscripciones.');
    profileBox.innerHTML = `<section class="panel"><div class="profile-head"><div><p class="eyebrow">${profile.registrado ? 'Cuenta registrada' : 'Perfil de alumno'}</p><h2>${escapeHtml(profile.nombre)}</h2></div><span class="tag">${escapeHtml(profile.rol)}</span></div>
      <p class="muted">Boleta ${escapeHtml(profile.boleta)}</p><h3 style="margin-top:24px">Mis talleres (${workshops.length})</h3>
      ${workshops.length ? `<ul class="profile-list">${workshops.map((item) => `<li><strong>${escapeHtml(item.nombre_taller)}</strong><br><span class="muted">${escapeHtml(item.fecha || 'Fecha por confirmar')} · ${escapeHtml(item.instructor)}</span></li>`).join('')}</ul>` : '<p class="muted">Todavía no tienes inscripciones.</p>'}</section>`;
    const refreshed = await api('/api/talleres');
    const openWorkshops = refreshed.data.filter((item) => item.cupo > item.inscritos);
    availableBox.innerHTML = openWorkshops.length ? openWorkshops.map((item) => `
      <a class="workshop-card" href="/talleres/${item.id}"><div class="card-top"><span class="tag">${escapeHtml(item.fecha || 'Fecha por confirmar')}</span><span class="capacity">${item.cupo - item.inscritos} lugares</span></div><h3>${escapeHtml(item.nombre)}</h3><p>${escapeHtml(item.descripcion || 'Detalles próximamente.')}</p><div class="card-bottom"><span>${escapeHtml(item.instructor)}</span><span class="inline-link">Inscribirme →</span></div></a>`).join('') : '<p class="empty-state">Por ahora no hay talleres con lugares disponibles.</p>';
  } catch (error) {
    mostrarAviso(notice, error.message, true);
  }
});

cargarDisponibles();

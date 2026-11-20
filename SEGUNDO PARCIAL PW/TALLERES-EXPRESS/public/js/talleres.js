const listaTalleres = document.querySelector('#talleres');

function fechaCorta(value) {
  if (!value) return 'Fecha por confirmar';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date);
}

function tarjetaTaller(taller) {
  const disponibles = Math.max(0, taller.cupo - taller.inscritos);
  return `<a class="workshop-card" href="/talleres/${taller.id}">
    <div class="card-top"><span class="tag">${escapeHtml(fechaCorta(taller.fecha))}</span><span class="capacity">${disponibles} lugares</span></div>
    <h3>${escapeHtml(taller.nombre)}</h3><p>${escapeHtml(taller.descripcion || 'Detalles próximamente.')}</p>
    <div class="card-bottom"><span>${escapeHtml(taller.instructor || 'Por confirmar')}</span><span class="inline-link">Ver taller →</span></div>
  </a>`;
}

async function cargarTalleres() {
  if (!listaTalleres) return;
  try {
    const { data } = await api('/api/talleres');
    listaTalleres.innerHTML = data.length ? data.map(tarjetaTaller).join('') : '<p class="empty-state">Aún no hay talleres disponibles.</p>';
  } catch (error) {
    listaTalleres.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

cargarTalleres();

const toggleForm = document.querySelector('#toggle-form');
if (toggleForm) {
  toggleForm.addEventListener('click', () => {
    const panel = document.querySelector('#crear-panel');
    panel.hidden = !panel.hidden;
    toggleForm.textContent = panel.hidden ? 'Crear taller' : 'Cerrar formulario';
  });
}

const formTaller = document.querySelector('#crear-taller');
if (formTaller) {
  formTaller.addEventListener('submit', async (event) => {
    event.preventDefault();
    const aviso = document.querySelector('#crear-aviso');
    const datos = Object.fromEntries(new FormData(formTaller));
    datos.cupo = Number(datos.cupo);
    try {
      await api('/api/talleres', { method: 'POST', body: JSON.stringify(datos) });
      mostrarAviso(aviso, 'Taller creado. Ya aparece en la agenda.');
      formTaller.reset();
      document.querySelector('#cupo').value = 15;
      await cargarTalleres();
    } catch (error) {
      mostrarAviso(aviso, error.message, true);
    }
  });
}

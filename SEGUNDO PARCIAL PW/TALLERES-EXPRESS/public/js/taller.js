const detail = document.querySelector('#detalle');
const workshopId = Number(location.pathname.split('/').pop());

async function cargarDetalle() {
  try {
    const [{ data: taller }, { data: asistencias }] = await Promise.all([
      api(`/api/talleres/${workshopId}`),
      api(`/api/talleres/${workshopId}/asistencias`),
    ]);
    const places = Math.max(0, taller.cupo - taller.inscritos);
    detail.innerHTML = `
      <p class="eyebrow">Detalle del taller</p><h1 style="font-size:clamp(36px,6vw,58px)">${escapeHtml(taller.nombre)}</h1>
      <p class="lead">${escapeHtml(taller.descripcion || 'Detalles próximamente.')}</p>
      <div class="two-col" style="margin-top:30px">
        <section><div class="panel"><div class="card-top"><span class="tag">${escapeHtml(taller.fecha || 'Fecha por confirmar')}</span><span class="capacity">${places} de ${taller.cupo} lugares</span></div>
          <p><strong>Instructor</strong><br>${escapeHtml(taller.instructor)}</p>
          <h2 style="margin-top:26px">Personas inscritas</h2>
          ${asistencias.length ? `<div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Boleta</th></tr></thead><tbody>${asistencias.map((item) => `<tr><td>${escapeHtml(item.nombre_alumno)}</td><td>${escapeHtml(item.boleta)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">Aún no hay inscripciones.</p>'}
        </div></section>
        <aside class="panel"><h2>Inscribirme</h2><p class="muted">Completa tus datos para reservar un lugar.</p>
          <form id="inscribir"><div class="field"><label for="nombre-alumno">Nombre completo</label><input id="nombre-alumno" name="nombre_alumno" minlength="3" maxlength="100" required></div>
          <div class="field" style="margin-top:14px"><label for="boleta">Boleta</label><input id="boleta" name="boleta" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" required></div>
          <button type="submit" ${places === 0 ? 'disabled' : ''}>${places === 0 ? 'Cupo completo' : 'Confirmar inscripción'}</button></form>
          <div id="inscripcion-aviso" class="notice" role="status"></div>
        </aside>
      </div>`;
    document.querySelector('#inscribir').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const aviso = document.querySelector('#inscripcion-aviso');
      const datos = Object.fromEntries(new FormData(form));
      datos.taller_id = workshopId;
      try {
        await api('/api/asistencias', { method: 'POST', body: JSON.stringify(datos) });
        mostrarAviso(aviso, 'Inscripción confirmada. ¡Nos vemos en el taller!');
        form.reset();
        await cargarDetalle();
      } catch (error) {
        mostrarAviso(aviso, error.message, true);
      }
    });
  } catch (error) {
    detail.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

cargarDetalle();

const userList = document.querySelector('#usuarios');
const userForm = document.querySelector('#crear-usuario');

async function cargarUsuarios() {
  try {
    const users = await api('/api/usuarios');
    userList.innerHTML = users.length ? `<div class="profile-list">${users.map((user) => `<div class="profile-head"><div><strong>${escapeHtml(user.nombre)}</strong><br><span class="muted">${escapeHtml(user.correo)} · ${escapeHtml(user.boleta)}</span></div><button class="secondary" type="button" data-delete="${user.id}" aria-label="Eliminar a ${escapeHtml(user.nombre)}">Eliminar</button></div>`).join('')}</div>` : '<p class="muted">Todavía no hay cuentas registradas.</p>';
  } catch (error) {
    userList.innerHTML = `<p class="muted">${escapeHtml(error.message)}</p>`;
  }
}

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const notice = document.querySelector('#usuario-aviso');
  const data = Object.fromEntries(new FormData(userForm));
  try {
    await api('/api/usuarios', { method: 'POST', body: JSON.stringify(data) });
    mostrarAviso(notice, 'Cuenta creada correctamente.');
    userForm.reset();
    await cargarUsuarios();
  } catch (error) {
    mostrarAviso(notice, error.message, true);
  }
});

userList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  try {
    await api(`/api/usuarios/${button.dataset.delete}`, { method: 'DELETE' });
    await cargarUsuarios();
  } catch (error) {
    window.alert(error.message);
  }
});

cargarUsuarios();

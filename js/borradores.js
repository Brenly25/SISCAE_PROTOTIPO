/* BORRADORES — JavaScript independiente */

document.addEventListener('DOMContentLoaded', async () => {
  const $ = id => document.getElementById(id);

  // Usuario de ejemplo del prototipo.
  const USER_ID = 'usr-0142';
  const DB_NAME = 'siscae-borradores-v1';

  const FILE_HELP =
    'Seleccione un archivo PDF, DOC, DOCX, EPUB o TXT de hasta 50 MB.';

  let database;
  let drafts = [];
  let editing = null;
  let busy = false;

  const escapeHTML = value =>
    String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);

  const formatDate = value =>
    new Date(value).toLocaleString('es-SV');

  const formatSize = bytes =>
    bytes < 1048576
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1048576).toFixed(1)} MB`;

  function showMessage(text, error = false) {
    $('feedback').hidden = false;
    $('feedback').className = error
      ? 'feedback error'
      : 'feedback';
    $('feedback').textContent = text;
  }

  /* Menú móvil */

  function toggleMenu(open) {
    $('sidebar').classList.toggle('active', open);
    $('mobileOverlay').classList.toggle('active', open);
    $('menuButton').setAttribute('aria-expanded', String(open));
  }

  $('menuButton').onclick = () => {
    const open =
      $('menuButton').getAttribute('aria-expanded') !== 'true';

    toggleMenu(open);
  };

  $('mobileOverlay').onclick = () => toggleMenu(false);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      toggleMenu(false);
    }
  });

  $('currentDate').textContent = new Intl.DateTimeFormat('es-SV', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  /* Almacenamiento exclusivo de borradores */

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        request.result.createObjectStore('borradores', {
          keyPath: 'id'
        });
      };

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => {
        reject(new Error(
          'No se pudo abrir el almacenamiento de borradores.'
        ));
      };
    });
  }

  async function loadDrafts() {
    drafts = await new Promise((resolve, reject) => {
      const request = database
        .transaction('borradores')
        .objectStore('borradores')
        .getAll();

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => {
        reject(new Error('No se pudieron leer los borradores.'));
      };
    });

    drafts = drafts
      .filter(draft => draft.autorId === USER_ID)
      .sort((a, b) => b.actualizado.localeCompare(a.actualizado));

    renderDrafts();
  }

  /*
   * Guarda o elimina un borrador.
   * Comprueba si fue modificado desde otra pestaña.
   */
  function writeDraft(record, previous = null) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        'borradores',
        'readwrite'
      );

      const store = transaction.objectStore('borradores');
      let reason;

      if (previous) {
        const request = store.get(previous.id);

        request.onsuccess = () => {
          const current = request.result;

          if (
            !current ||
            current.autorId !== USER_ID ||
            current.actualizado !== previous.actualizado
          ) {
            reason = new Error(
              'Este borrador cambió en otra pestaña. ' +
              'Recargue la página antes de continuar.'
            );

            transaction.abort();
            return;
          }

          if (record) {
            store.put(record);
          } else {
            store.delete(previous.id);
          }
        };
      } else {
        store.add(record);
      }

      transaction.oncomplete = resolve;

      transaction.onabort = () => {
        reject(reason || new Error(
          'No se guardó el cambio. ' +
          'Revise el espacio disponible del navegador.'
        ));
      };

      transaction.onerror = () => {};
    });
  }

  /* Formulario */

  function resetForm() {
    editing = null;

    $('draftForm').reset();
    $('formTitle').textContent = 'Nuevo borrador';
    $('saveButton').textContent = 'Guardar borrador';
    $('cancelEdit').hidden = true;
    $('archivo').required = true;
    $('fileHelp').textContent = FILE_HELP;
  }

  /* Lista y búsqueda */

  function renderDrafts() {
    const query = $('search')
      .value
      .trim()
      .toLocaleLowerCase('es');

    const visible = drafts.filter(draft =>
      `${draft.nombre} ${draft.archivo}`
        .toLocaleLowerCase('es')
        .includes(query)
    );

    $('draftCount').textContent = drafts.length;

    $('resultsText').textContent =
      `${visible.length} de ${drafts.length} borradores`;

    if (!visible.length) {
      $('draftList').innerHTML = `
        <div class="empty-state">
          <h3>
            ${query ? 'Sin coincidencias' : 'Todavía no hay borradores'}
          </h3>
          <p>
            ${
              query
                ? 'Pruebe con otro nombre.'
                : 'Guarde su primer archivo con el formulario de esta página.'
            }
          </p>
        </div>
      `;

      return;
    }

    $('draftList').innerHTML = visible.map(draft => `
      <article class="draft-card">
        <span class="draft-badge">Borrador</span>

        <h3>${escapeHTML(draft.nombre)}</h3>

        <p class="draft-file">
          ${escapeHTML(draft.archivo)} · ${formatSize(draft.tamano)}
        </p>

        <p class="muted">
          Actualizado: ${formatDate(draft.actualizado)}
        </p>

        ${
          draft.notas
            ? `<p class="draft-notes">${escapeHTML(draft.notas)}</p>`
            : ''
        }

        <div class="draft-actions">
          <button
            type="button"
            class="secondary"
            data-action="edit"
            data-id="${escapeHTML(draft.id)}"
          >
            Editar
          </button>

          <button
            type="button"
            class="secondary"
            data-action="download"
            data-id="${escapeHTML(draft.id)}"
          >
            Descargar
          </button>

          <button
            type="button"
            class="danger"
            data-action="delete"
            data-id="${escapeHTML(draft.id)}"
          >
            Eliminar
          </button>
        </div>
      </article>
    `).join('');
  }

  $('search').addEventListener('input', renderDrafts);

  $('cancelEdit').addEventListener('click', () => {
    if (!busy) {
      resetForm();
    }
  });

  /* Crear o actualizar */

  $('draftForm').addEventListener('submit', async event => {
    event.preventDefault();

    if (busy || !database) return;

    const nombre = $('nombre').value.trim();
    const selectedFile = $('archivo').files[0];
    const file = selectedFile || editing?.file;

    if (!nombre) {
      return showMessage('Escriba el nombre del borrador.', true);
    }

    if (!file || !file.size) {
      return showMessage(
        'Seleccione un archivo que no esté vacío.',
        true
      );
    }

    if (!/\.(pdf|doc|docx|epub|txt)$/i.test(file.name)) {
      return showMessage(
        'El archivo debe ser PDF, DOC, DOCX, EPUB o TXT.',
        true
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return showMessage(
        'El archivo debe pesar como máximo 50 MB.',
        true
      );
    }

    const previous = editing;
    const now = new Date().toISOString();

    const record = {
      id: previous?.id || Array.from(
        crypto.getRandomValues(new Uint8Array(16)),
        byte => byte.toString(16).padStart(2, '0')
      ).join(''),

      autorId: USER_ID,
      nombre,
      notas: $('notas').value.trim(),
      archivo: file.name,
      tamano: file.size,
      file,
      creado: previous?.creado || now,
      actualizado: now
    };

    busy = true;
    $('formFields').disabled = true;
    $('saveButton').textContent = 'Guardando…';

    try {
      await writeDraft(record, previous);
      resetForm();
      await loadDrafts();

      showMessage(
        previous
          ? 'Borrador actualizado correctamente.'
          : 'Borrador guardado correctamente.'
      );
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      busy = false;
      $('formFields').disabled = false;

      $('saveButton').textContent = editing
        ? 'Guardar cambios'
        : 'Guardar borrador';
    }
  });

  /* Acciones de las tarjetas */

  $('draftList').addEventListener('click', async event => {
    const button = event.target.closest('button[data-action]');

    if (!button || busy) return;

    const draft = drafts.find(item => item.id === button.dataset.id);

    if (!draft) return;

    const action = button.dataset.action;

    if (action === 'edit') {
      editing = draft;

      $('nombre').value = draft.nombre;
      $('notas').value = draft.notas || '';
      $('archivo').value = '';
      $('archivo').required = false;

      $('formTitle').textContent = 'Editar borrador';
      $('saveButton').textContent = 'Guardar cambios';
      $('cancelEdit').hidden = false;

      $('fileHelp').textContent =
        `Archivo actual: ${draft.archivo}. ` +
        'Si no selecciona otro, se conservará. ' +
        'Al reemplazarlo se sustituye el archivo anterior. ' +
        FILE_HELP;

      $('formTitle').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      $('nombre').focus({ preventScroll: true });
      return;
    }

    if (action === 'download') {
      if (!draft.file) {
        return showMessage('No se encontró el archivo.', true);
      }

      const url = URL.createObjectURL(draft.file);
      const link = document.createElement('a');

      link.href = url;
      link.download = draft.archivo;

      document.body.append(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    if (action === 'delete') {
      const confirmed = confirm(
        `¿Eliminar el borrador "${draft.nombre}" y su archivo? ` +
        'Esta acción no se puede deshacer.'
      );

      if (!confirmed) return;

      busy = true;
      button.disabled = true;
      $('formFields').disabled = true;

      try {
        await writeDraft(null, draft);

        if (editing?.id === draft.id) {
          resetForm();
        }

        await loadDrafts();
        showMessage('Borrador eliminado.');
      } catch (error) {
        showMessage(error.message, true);
      } finally {
        busy = false;
        button.disabled = false;
        $('formFields').disabled = false;
      }
    }
  });

  /* Inicialización */

  try {
    database = await openDatabase();
    await loadDrafts();
    $('formFields').disabled = false;
  } catch (error) {
    $('resultsText').textContent =
      'No se pudieron cargar los borradores.';

    showMessage(error.message, true);
  }
});
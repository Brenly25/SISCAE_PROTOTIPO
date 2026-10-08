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

  /* Utilidades */

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

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1048576) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

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

    $('menuButton').setAttribute(
      'aria-expanded',
      String(open)
    );
  }

  $('menuButton').addEventListener('click', () => {
    const open =
      $('menuButton').getAttribute('aria-expanded') !== 'true';

    toggleMenu(open);
  });

  $('mobileOverlay').addEventListener('click', () => {
    toggleMenu(false);
  });

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

  /* Base de datos */

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains('borradores')) {
          db.createObjectStore('borradores', {
            keyPath: 'id'
          });
        }
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
    const records = await new Promise((resolve, reject) => {
      const request = database
        .transaction('borradores')
        .objectStore('borradores')
        .getAll();

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => {
        reject(new Error(
          'No se pudieron leer los borradores.'
        ));
      };
    });

    // Excluye las marcas internas de configuración.
    drafts = records
      .filter(record =>
        record.autorId === USER_ID &&
        record.tipo !== 'configuracion'
      )
      .sort((a, b) =>
        b.actualizado.localeCompare(a.actualizado)
      );

    renderDrafts();
  }

  /*
   * Guarda o elimina un borrador.
   * Evita sobrescribir cambios hechos desde otra pestaña.
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

      transaction.oncomplete = () => resolve();

      transaction.onabort = () => {
        reject(reason || new Error(
          'No se guardó el cambio. ' +
          'Revise el espacio disponible del navegador.'
        ));
      };
    });
  }

  /* Diez archivos simulados */

  function cargarDatosSimulados() {
    const ejemplos = [
      {
        id: 'demo-borrador-ciencias',
        nombre: 'Libro de Ciencias Naturales — Unidad 1',
        archivo: 'ciencias_naturales_borrador.txt',
        notas:
          'Pendiente de agregar ilustraciones y revisar ' +
          'las actividades sobre los seres vivos.',
        contenido: [
          'CIENCIAS NATURALES',
          'Unidad 1: Los seres vivos',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Identificar las características de los seres vivos.',
          '',
          'Contenido:',
          'Los seres vivos realizan procesos como la nutrición,',
          'el crecimiento y la reproducción.',
          '',
          'Actividades:',
          '1. Escribir cinco ejemplos de seres vivos.',
          '2. Comparar una planta y un animal.',
          '3. Dibujar el ciclo de vida de una mariposa.',
          '',
          'Pendiente: agregar ilustraciones y bibliografía.'
        ].join('\n'),
        diasAtras: 0
      },
      {
        id: 'demo-borrador-matematica',
        nombre: 'Guía de Matemática — Fracciones',
        archivo: 'guia_fracciones_borrador.txt',
        notas:
          'Falta completar los ejercicios y verificar ' +
          'las respuestas de la última sección.',
        contenido: [
          'GUÍA DE MATEMÁTICA',
          'Tema: Fracciones',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Resolver operaciones básicas con fracciones.',
          '',
          'Una fracción representa partes de una unidad.',
          'El denominador indica en cuántas partes iguales',
          'se divide la unidad.',
          '',
          'Ejercicios:',
          '1. Resolver: 1/2 + 1/4.',
          '2. Resolver: 3/4 - 1/2.',
          '3. Representar gráficamente 2/3.',
          '4. Simplificar: 6/12.',
          '',
          'Pendiente: incluir las respuestas y ejemplos gráficos.'
        ].join('\n'),
        diasAtras: 1
      },
      {
        id: 'demo-borrador-lenguaje',
        nombre: 'Libro de Lenguaje — Comprensión lectora',
        archivo: 'comprension_lectora_borrador.txt',
        notas:
          'Revisar la redacción del texto e incorporar ' +
          'preguntas de análisis para los estudiantes.',
        contenido: [
          'LENGUAJE Y LITERATURA',
          'Tema: Comprensión lectora',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Lectura:',
          'Cada mañana, Lucía visitaba la biblioteca de su',
          'escuela para descubrir una nueva historia.',
          'Un día encontró un libro sobre los océanos y decidió',
          'compartir lo aprendido con sus compañeros.',
          '',
          'Preguntas:',
          '1. ¿A qué lugar iba Lucía?',
          '2. ¿Qué tema tenía el libro que encontró?',
          '3. ¿Por qué es útil compartir lo que aprendemos?',
          '',
          'Pendiente: ampliar la lectura y agregar una rúbrica.'
        ].join('\n'),
        diasAtras: 2
      },
      {
        id: 'demo-borrador-sociales',
        nombre: 'Estudios Sociales — Mi comunidad',
        archivo: 'mi_comunidad_borrador.txt',
        notas:
          'Agregar ejemplos de comunidades salvadoreñas ' +
          'y una actividad de participación ciudadana.',
        contenido: [
          'ESTUDIOS SOCIALES',
          'Tema: Mi comunidad',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Reconocer los espacios y servicios de la comunidad.',
          '',
          'Una comunidad está formada por personas que',
          'comparten un espacio y establecen relaciones.',
          '',
          'Actividades:',
          '1. Identificar los servicios de la comunidad.',
          '2. Dibujar un mapa del entorno de la escuela.',
          '3. Proponer una acción para cuidar los espacios públicos.',
          '',
          'Pendiente: incorporar fotografías y ejemplos locales.'
        ].join('\n'),
        diasAtras: 3
      },
      {
        id: 'demo-borrador-ingles',
        nombre: 'Cuaderno de Inglés — Everyday vocabulary',
        archivo: 'ingles_vocabulario_borrador.txt',
        notas:
          'Revisar la traducción del vocabulario ' +
          'y preparar los recursos de pronunciación.',
        contenido: [
          'ENGLISH WORKBOOK',
          'Topic: Everyday vocabulary',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Vocabulary:',
          'Book — Libro',
          'School — Escuela',
          'Teacher — Docente',
          'Window — Ventana',
          'Notebook — Cuaderno',
          '',
          'Activities:',
          '1. Write a sentence using the word "book".',
          '2. Name three objects in your classroom.',
          '3. Translate: "My notebook is blue".',
          '',
          'Pending: add illustrations and pronunciation resources.'
        ].join('\n'),
        diasAtras: 4
      },
      {
        id: 'demo-borrador-informatica',
        nombre: 'Manual de Informática — Seguridad digital',
        archivo: 'seguridad_digital_borrador.txt',
        notas:
          'Incluir ejemplos de correos sospechosos ' +
          'y una actividad sobre contraseñas.',
        contenido: [
          'MANUAL DE INFORMÁTICA',
          'Tema: Seguridad digital',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Reconocer prácticas básicas de protección digital.',
          '',
          'Contenido propuesto:',
          '1. Contraseñas largas y únicas.',
          '2. Verificación en dos pasos.',
          '3. Identificación de mensajes sospechosos.',
          '4. Protección de la información personal.',
          '',
          'Actividad:',
          'Analizar un correo ficticio e identificar las señales',
          'que podrían indicar un intento de engaño.',
          '',
          'Pendiente: diseñar los ejemplos y las capturas de apoyo.'
        ].join('\n'),
        diasAtras: 5
      },
      {
        id: 'demo-borrador-ambiental',
        nombre: 'Educación Ambiental — Cuidado del agua',
        archivo: 'cuidado_del_agua_borrador.txt',
        notas:
          'Completar la propuesta de una campaña escolar ' +
          'y agregar ilustraciones sobre el ahorro de agua.',
        contenido: [
          'EDUCACIÓN AMBIENTAL',
          'Tema: Cuidado del agua',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Promover el uso responsable del agua.',
          '',
          'Acciones propuestas:',
          '1. Cerrar los grifos cuando no se utilizan.',
          '2. Reportar las fugas que se observen.',
          '3. Evitar contaminar ríos y quebradas.',
          '',
          'Proyecto:',
          'Diseñar una campaña escolar con mensajes sobre',
          'el cuidado del agua en el hogar y la comunidad.',
          '',
          'Pendiente: definir materiales y criterios de evaluación.'
        ].join('\n'),
        diasAtras: 6
      },
      {
        id: 'demo-borrador-historia',
        nombre: 'Historia — Patrimonio cultural de El Salvador',
        archivo: 'patrimonio_cultural_borrador.txt',
        notas:
          'Verificar las fuentes y seleccionar imágenes ' +
          'de sitios y expresiones culturales.',
        contenido: [
          'HISTORIA',
          'Tema: Patrimonio cultural de El Salvador',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Valorar las expresiones culturales de la comunidad.',
          '',
          'Contenido propuesto:',
          '1. Concepto de patrimonio cultural.',
          '2. Tradiciones y celebraciones.',
          '3. Sitios históricos y arqueológicos.',
          '4. Conservación del patrimonio.',
          '',
          'Actividad:',
          'Investigar una tradición local y presentar',
          'su significado mediante un cartel.',
          '',
          'Pendiente: incorporar fuentes y revisar los datos.'
        ].join('\n'),
        diasAtras: 7
      },
      {
        id: 'demo-borrador-artistica',
        nombre: 'Educación Artística — Colores y formas',
        archivo: 'colores_y_formas_borrador.txt',
        notas:
          'Añadir ejemplos visuales y organizar ' +
          'los materiales necesarios para cada actividad.',
        contenido: [
          'EDUCACIÓN ARTÍSTICA',
          'Tema: Colores y formas',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Objetivo:',
          'Explorar el uso del color y las formas en una composición.',
          '',
          'Materiales:',
          'Papel, lápices de colores, regla y témperas.',
          '',
          'Actividades:',
          '1. Crear una composición con figuras geométricas.',
          '2. Experimentar con mezclas de pinturas.',
          '3. Describir las decisiones tomadas en el dibujo.',
          '',
          'Pendiente: agregar ejemplos y una guía de evaluación.'
        ].join('\n'),
        diasAtras: 8
      },
      {
        id: 'demo-borrador-docente',
        nombre: 'Guía docente — Planificación de actividades',
        archivo: 'planificacion_docente_borrador.txt',
        notas:
          'Completar el cronograma y revisar que las actividades ' +
          'correspondan con los objetivos de aprendizaje.',
        contenido: [
          'GUÍA DOCENTE',
          'Tema: Planificación de actividades',
          '',
          'Documento simulado para el prototipo SISCAE.',
          '',
          'Estructura de la planificación:',
          '1. Objetivo de aprendizaje.',
          '2. Actividad de inicio.',
          '3. Desarrollo del contenido.',
          '4. Práctica guiada.',
          '5. Evaluación y retroalimentación.',
          '',
          'Propuesta:',
          'Organizar una sesión con trabajo individual,',
          'discusión grupal y una actividad de cierre.',
          '',
          'Pendiente: asignar tiempos y completar el cronograma.'
        ].join('\n'),
        diasAtras: 9
      }
    ];

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        'borradores',
        'readwrite'
      );

      const store = transaction.objectStore('borradores');

      /*
       * Una marca por ejemplo evita duplicados y permite
       * conservar las eliminaciones después de recargar.
       */
      const marcaAnterior = `demo-borradores-v1-${USER_ID}`;
      const consultaAnterior = store.get(marcaAnterior);
      let customError;

      consultaAnterior.onsuccess = () => {
        const yaCargoTres = Boolean(consultaAnterior.result);

        ejemplos.forEach((ejemplo, index) => {
          const recordId = `${ejemplo.id}-${USER_ID}`;
          const marcaId = `semilla-${recordId}`;
          const consultaMarca = store.get(marcaId);

          consultaMarca.onsuccess = () => {
            if (consultaMarca.result) return;

            const guardarMarca = () => {
              store.put({
                id: marcaId,
                tipo: 'configuracion',
                ejemploCargado: true
              });
            };

            /*
             * Si utilizaste el código anterior de tres ejemplos,
             * respeta sus ediciones y eliminaciones.
             */
            if (yaCargoTres && index < 3) {
              guardarMarca();
              return;
            }

            const consultaBorrador = store.get(recordId);

            consultaBorrador.onsuccess = () => {
              try {
                // Conserva un ejemplo existente si ya fue editado.
                if (!consultaBorrador.result) {
                  const fecha = new Date();

                  fecha.setDate(
                    fecha.getDate() - ejemplo.diasAtras
                  );

                  const archivo = new File(
                    [ejemplo.contenido],
                    ejemplo.archivo,
                    {
                      type: 'text/plain;charset=utf-8',
                      lastModified: fecha.getTime()
                    }
                  );

                  store.add({
                    id: recordId,
                    autorId: USER_ID,
                    nombre: ejemplo.nombre,
                    notas: ejemplo.notas,
                    archivo: archivo.name,
                    tamano: archivo.size,
                    file: archivo,
                    creado: fecha.toISOString(),
                    actualizado: fecha.toISOString()
                  });
                }

                guardarMarca();
              } catch (error) {
                customError = error;
                transaction.abort();
              }
            };
          };
        });
      };

      transaction.oncomplete = () => resolve();

      transaction.onabort = () => {
        reject(new Error(
          'No se pudieron cargar los archivos simulados. ' +
          (customError?.message ||
            'Revise el espacio disponible del navegador.')
        ));
      };
    });
  }

  /* Restablecer formulario */

  function resetForm() {
    editing = null;

    $('draftForm').reset();
    $('formTitle').textContent = 'Nuevo borrador';
    $('saveButton').textContent = 'Guardar borrador';
    $('cancelEdit').hidden = true;
    $('archivo').required = true;
    $('fileHelp').textContent = FILE_HELP;
  }

  /* Mostrar borradores y aplicar búsqueda */

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
            ${
              query
                ? 'Sin coincidencias'
                : 'Todavía no hay borradores'
            }
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
          ${escapeHTML(draft.archivo)}
          · ${formatSize(draft.tamano)}
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

  /* Crear o actualizar borrador */

  $('draftForm').addEventListener('submit', async event => {
    event.preventDefault();

    if (busy || !database) return;

    const nombre = $('nombre').value.trim();
    const selectedFile = $('archivo').files[0];
    const file = selectedFile || editing?.file;

    if (!nombre) {
      return showMessage(
        'Escriba el nombre del borrador.',
        true
      );
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
    const button = event.target.closest(
      'button[data-action]'
    );

    if (!button || busy) return;

    const draft = drafts.find(
      item => item.id === button.dataset.id
    );

    if (!draft) return;

    const action = button.dataset.action;

    /* Editar */

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

      $('nombre').focus({
        preventScroll: true
      });

      return;
    }

    /* Descargar */

    if (action === 'download') {
      if (!draft.file) {
        return showMessage(
          'No se encontró el archivo.',
          true
        );
      }

      try {
        const url = URL.createObjectURL(draft.file);
        const link = document.createElement('a');

        link.href = url;
        link.download = draft.archivo;

        document.body.append(link);
        link.click();
        link.remove();

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } catch (error) {
        showMessage(
          'No se pudo descargar el archivo.',
          true
        );
      }

      return;
    }

    /* Eliminar */

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

    // Genera los diez ejemplos sin duplicarlos al recargar.
    await cargarDatosSimulados();

    // Muestra los ejemplos y los borradores guardados.
    await loadDrafts();

    $('formFields').disabled = false;
  } catch (error) {
    $('resultsText').textContent =
      'No se pudieron cargar los borradores.';

    showMessage(error.message, true);
  }
});
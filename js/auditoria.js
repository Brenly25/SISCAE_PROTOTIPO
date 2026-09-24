
document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     DATOS SIMULADOS
  ================================================== */

  const records = [
    {
      id: "AUD-0098",
      category: "asset",
      action: "Nueva versión registrada",
      description: "Se incorporó una nueva versión del recurso editorial.",
      user: "María López",
      email: "maria.lopez@clases.edu.sv",
      role: "Autor / Editor",
      resource: "Libro de Ciencias Naturales",
      version: "Versión 3",
      date: "2026-09-24",
      time: "10:42 a. m.",
      ip: "192.168.1.24",
      session: "SES-84F21A",
      result: "Registrado",
      hash: "6a8d9f3c84f27a01...c42018ae"
    },
    {
      id: "AUD-0097",
      category: "security",
      action: "Usuario registrado",
      description: "Se registró una nueva cuenta institucional.",
      user: "Administrador",
      email: "administrador@clases.edu.sv",
      role: "Administrador",
      resource: "Gestión de usuarios",
      version: "Nueva cuenta",
      date: "2026-09-24",
      time: "9:18 a. m.",
      ip: "192.168.1.10",
      session: "SES-91A30C",
      result: "Registrado",
      hash: ""
    },
    {
      id: "AUD-0096",
      category: "access",
      action: "Inicio de sesión",
      description: "Acceso institucional registrado correctamente.",
      user: "Carlos Hernández",
      email: "carlos.hernandez@clases.edu.sv",
      role: "Revisor",
      resource: "SISCAE",
      version: "Acceso al sistema",
      date: "2026-09-24",
      time: "8:51 a. m.",
      ip: "192.168.1.31",
      session: "SES-77D08F",
      result: "Autorizado",
      hash: ""
    },
    {
      id: "AUD-0095",
      category: "review",
      action: "Revisión registrada",
      description: "Se registró una intervención de revisión.",
      user: "Ana Martínez",
      email: "ana.martinez@clases.edu.sv",
      role: "Revisor",
      resource: "Guía metodológica de Matemática",
      version: "Versión 2",
      date: "2026-09-24",
      time: "8:22 a. m.",
      ip: "192.168.1.44",
      session: "SES-58BC42",
      result: "Registrado",
      hash: "24c8a90b126ef871...719da5c3"
    },
    {
      id: "AUD-0094",
      category: "integrity",
      action: "Integridad consultada",
      description: "Se consultó la referencia de integridad del archivo.",
      user: "Administrador",
      email: "administrador@clases.edu.sv",
      role: "Administrador",
      resource: "Libro de Estudios Sociales",
      version: "Versión 5",
      date: "2026-09-24",
      time: "7:55 a. m.",
      ip: "192.168.1.10",
      session: "SES-91A30C",
      result: "Verificado",
      hash: "e11f42ca7e8d9634...02e93f11"
    },
    {
      id: "AUD-0093",
      category: "security",
      action: "Permisos actualizados",
      description: "Se modificó la configuración de permisos de un perfil.",
      user: "Administrador",
      email: "administrador@clases.edu.sv",
      role: "Administrador",
      resource: "Rol de revisor editorial",
      version: "Configuración de acceso",
      date: "2026-09-23",
      time: "3:26 p. m.",
      ip: "192.168.1.10",
      session: "SES-60D91B",
      result: "Registrado",
      hash: ""
    },
    {
      id: "AUD-0092",
      category: "asset",
      action: "Activo consultado",
      description: "Se consultó la información del recurso.",
      user: "Carlos Hernández",
      email: "carlos.hernandez@clases.edu.sv",
      role: "Revisor",
      resource: "Guía metodológica",
      version: "Versión 4",
      date: "2026-09-23",
      time: "1:04 p. m.",
      ip: "192.168.1.31",
      session: "SES-32F01A",
      result: "Registrado",
      hash: ""
    },
    {
      id: "AUD-0091",
      category: "review",
      action: "Contenido aprobado",
      description: "Se registró la aprobación del contenido editorial.",
      user: "Ana Martínez",
      email: "ana.martinez@clases.edu.sv",
      role: "Revisor",
      resource: "Cuaderno de trabajo de Lenguaje",
      version: "Versión 2",
      date: "2026-09-23",
      time: "11:37 a. m.",
      ip: "192.168.1.44",
      session: "SES-40A88D",
      result: "Registrado",
      hash: "90a72c14fd881b30...a11c68d9"
    }
  ];

  const $ = id => document.getElementById(id);

  // Fecha fija para mantener coherencia con los datos de demostración.
  const demoToday = "2026-09-24";

  const categoryNames = {
    access: "Acceso al sistema",
    asset: "Activos editoriales",
    review: "Revisión y aprobación",
    security: "Usuarios y permisos",
    integrity: "Integridad de archivos"
  };

  const periodNames = {
    all: "Todo el historial",
    today: "Hoy",
    yesterday: "Ayer",
    last7: "Últimos 7 días",
    last30: "Últimos 30 días",
    custom: "Rango personalizado"
  };

  const icons = {
    access: `<svg viewBox="0 0 24 24">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <path d="m10 17 5-5-5-5M15 12H3"/>
    </svg>`,

    asset: `<svg viewBox="0 0 24 24">
      <path d="M3 7h6l2 2h10v10H3z"/>
      <path d="M3 7V5h6l2 2"/>
    </svg>`,

    review: `<svg viewBox="0 0 24 24">
      <path d="m9 11 3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>`,

    security: `<svg viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>`,

    integrity: `<svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/>
      <path d="m8.5 12 2.3 2.3 4.8-5"/>
    </svg>`
  };

  /* ==================================================
     UTILIDADES
  ================================================== */

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function formatDate(value) {
    if (!value) return "No especificada";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  function shiftDate(value, days) {
    const date = new Date(`${value}T12:00:00`);
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function validateDates(criteria) {
    if (criteria.period !== "custom") return "";

    if (!criteria.start || !criteria.end) {
      return "Seleccione ambas fechas.";
    }

    if (criteria.start > criteria.end) {
      return "La fecha inicial no puede ser posterior a la final.";
    }

    return "";
  }

  function filterRecords(criteria) {
    let from = "";
    let to = "";

    switch (criteria.period) {
      case "today":
        from = demoToday;
        to = demoToday;
        break;

      case "yesterday":
        from = shiftDate(demoToday, -1);
        to = from;
        break;

      case "last7":
        from = shiftDate(demoToday, -6);
        to = demoToday;
        break;

      case "last30":
        from = shiftDate(demoToday, -29);
        to = demoToday;
        break;

      case "custom":
        from = criteria.start;
        to = criteria.end;
        break;
    }

    const search = normalize(criteria.search.trim());

    return records.filter(record => {

      if (
        criteria.user &&
        criteria.user !== "all" &&
        record.email !== criteria.user
      ) {
        return false;
      }

      if (
        criteria.event !== "all" &&
        record.category !== criteria.event
      ) {
        return false;
      }

      if (from && record.date < from) return false;
      if (to && record.date > to) return false;

      if (search) {
        const searchable = normalize([
          record.id,
          record.action,
          record.user,
          record.email,
          record.role,
          record.resource,
          record.version,
          record.description
        ].join(" "));

        if (!searchable.includes(search)) return false;
      }

      return true;
    });
  }

  /* ==================================================
     USUARIOS
  ================================================== */

  const users = Array.from(
    new Map(
      records.map(record => [
        record.email,
        {
          name: record.user,
          email: record.email,
          role: record.role
        }
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  function populateUsers() {
    const tableSelect = $("userFilter");
    const reportSelect = $("reportUser");

    users.forEach(user => {
      const label = `${user.name} — ${user.role}`;

      tableSelect.add(
        new Option(label, user.email)
      );

      reportSelect.add(
        new Option(label, user.email)
      );
    });
  }

  function findUser(email) {
    return users.find(user => user.email === email);
  }

  /* ==================================================
     TABLA
  ================================================== */

  function getTableCriteria() {
    return {
      user: $("userFilter").value,
      event: $("eventFilter").value,
      period: $("periodFilter").value,
      start: $("filterStart").value,
      end: $("filterEnd").value,
      search: $("searchFilter").value
    };
  }

  function renderTable(items) {
    $("auditBody").innerHTML = items.map(record => `
      <tr>
        <td>
          <div class="event-cell">
            <span class="event-symbol">
              ${icons[record.category]}
            </span>
            <div>
              <span class="table-primary">
                ${escapeHtml(record.action)}
              </span>
              <span class="table-secondary">
                ${escapeHtml(categoryNames[record.category])}
              </span>
            </div>
          </div>
        </td>

        <td>
          <span class="table-primary">
            ${escapeHtml(record.user)}
          </span>
          <span class="table-secondary">
            ${escapeHtml(record.role)}
          </span>
        </td>

        <td>
          <span class="table-primary">
            ${escapeHtml(record.resource)}
          </span>
          <span class="table-secondary">
            ${escapeHtml(record.version)}
          </span>
        </td>

        <td>
          <span class="table-primary">
            ${formatDate(record.date)}
          </span>
          <span class="table-secondary">
            ${escapeHtml(record.time)}
          </span>
        </td>

        <td>
          <span class="result-badge ${
            record.result === "Verificado" ||
            record.result === "Autorizado"
              ? "verified"
              : ""
          }">
            ${escapeHtml(record.result)}
          </span>
        </td>

        <td>
          <button class="view-button"
                  data-id="${escapeHtml(record.id)}">
            Ver detalle
          </button>
        </td>
      </tr>
    `).join("");

    $("resultCount").textContent = items.length;
    $("visibleCount").textContent = items.length;

    $("tableSummary").textContent =
      `Mostrando ${items.length} registros`;

    $("emptyState").hidden = items.length > 0;
  }

  function applyTableFilters() {
    const criteria = getTableCriteria();

    $("filterDates").hidden =
      criteria.period !== "custom";

    const error = validateDates(criteria);
    $("filterError").textContent = error;

    renderTable(
      error ? [] : filterRecords(criteria)
    );
  }

  [
    "userFilter",
    "eventFilter",
    "periodFilter",
    "filterStart",
    "filterEnd"
  ].forEach(id => {
    $(id).addEventListener("change", applyTableFilters);
  });

  $("searchFilter").addEventListener(
    "input",
    applyTableFilters
  );

  $("clearFilters").addEventListener("click", () => {
    $("searchFilter").value = "";
    $("userFilter").value = "all";
    $("eventFilter").value = "all";
    $("periodFilter").value = "all";
    $("filterStart").value = "";
    $("filterEnd").value = "";

    applyTableFilters();
  });

  /* ==================================================
     DETALLE
  ================================================== */

  $("auditBody").addEventListener("click", event => {
    const button = event.target.closest("[data-id]");

    if (button) {
      openDetail(button.dataset.id);
    }
  });

  function openDetail(id) {
    const record = records.find(item => item.id === id);
    if (!record) return;

    $("detailCategory").textContent =
      categoryNames[record.category];

    $("detailAction").textContent = record.action;
    $("detailDescription").textContent = record.description;
    $("detailId").textContent = record.id;
    $("detailUser").textContent = record.user;
    $("detailEmail").textContent = record.email;
    $("detailRole").textContent = record.role;
    $("detailResource").textContent = record.resource;
    $("detailVersion").textContent = record.version;

    $("detailDate").textContent =
      `${formatDate(record.date)} · ${record.time}`;

    $("detailResult").textContent = record.result;
    $("detailIp").textContent = record.ip;
    $("detailSession").textContent = record.session;
    $("detailHash").textContent = record.hash;

    $("detailIntegrityBox").hidden = !record.hash;

    $("detailDrawer").classList.add("active");
    $("drawerOverlay").classList.add("active");

    $("detailDrawer").setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("locked");
  }

  function closeDetail() {
    $("detailDrawer").classList.remove("active");
    $("drawerOverlay").classList.remove("active");

    $("detailDrawer").setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("locked");
  }

  $("closeDetail").addEventListener("click", closeDetail);
  $("drawerOverlay").addEventListener("click", closeDetail);

  /* ==================================================
     REPORTE: ALCANCE
  ================================================== */

  function getScope() {
    return document.querySelector(
      'input[name="reportScope"]:checked'
    ).value;
  }

  function updateScope() {
    const individual = getScope() === "individual";

    $("generalCard").classList.toggle(
      "selected",
      !individual
    );

    $("individualCard").classList.toggle(
      "selected",
      individual
    );

    $("reportUserBox").hidden = !individual;

    updateReportPreview();
  }

  document.querySelectorAll(
    'input[name="reportScope"]'
  ).forEach(input => {
    input.addEventListener("change", updateScope);
  });

  /* ==================================================
     REPORTE: CRITERIOS
  ================================================== */

  function getReportCriteria() {
    return {
      user: getScope() === "individual"
        ? $("reportUser").value
        : "all",

      event: $("reportEvent").value,
      period: $("reportPeriod").value,
      start: $("reportStart").value,
      end: $("reportEnd").value,
      search: $("reportSearch").value
    };
  }

  let reportResults = [];

  function updateReportPreview() {
    const criteria = getReportCriteria();
    const individual = getScope() === "individual";

    $("reportDates").hidden =
      criteria.period !== "custom";

    let error = validateDates(criteria);

    if (individual && !criteria.user) {
      error = "Seleccione el usuario para generar el reporte.";
    }

    $("reportError").textContent = error;

    if (error) {
      reportResults = [];
      $("reportCount").textContent = "—";
      $("generateReport").disabled = true;
    } else {
      reportResults = filterRecords(criteria);

      $("reportCount").textContent =
        reportResults.length;

      $("generateReport").disabled =
        reportResults.length === 0;
    }

    const user = findUser(criteria.user);

    $("reportScopeSummary").textContent =
      individual
        ? user
          ? `Reporte individual: ${user.name}`
          : "Reporte individual"
        : "Reporte general";

    const periodLabel =
      criteria.period === "custom" &&
      criteria.start &&
      criteria.end
        ? `${formatDate(criteria.start)} al ${formatDate(criteria.end)}`
        : periodNames[criteria.period];

    $("reportCriteriaSummary").textContent =
      `${categoryNames[criteria.event] || "Todos los eventos"} · ${periodLabel}`;

    if (!error && reportResults.length === 0) {
      $("reportError").textContent =
        "No hay registros que coincidan con los criterios seleccionados.";
    }
  }

  [
    "reportUser",
    "reportPeriod",
    "reportEvent",
    "reportStart",
    "reportEnd"
  ].forEach(id => {
    $(id).addEventListener(
      "change",
      updateReportPreview
    );
  });

  $("reportSearch").addEventListener(
    "input",
    updateReportPreview
  );

  /* ==================================================
     ABRIR Y CERRAR MODAL
  ================================================== */

  function openReportModal() {
    const current = getTableCriteria();

    // Si se filtró una persona, se propone el reporte individual.
    const individual = current.user !== "all";

    document.querySelector(
      `input[name="reportScope"][value="${
        individual ? "individual" : "general"
      }"]`
    ).checked = true;

    $("reportUser").value =
      individual ? current.user : "";

    $("reportEvent").value = current.event;
    $("reportPeriod").value = current.period;
    $("reportStart").value = current.start;
    $("reportEnd").value = current.end;
    $("reportSearch").value = current.search;

    updateScope();

    $("reportModal").classList.add("active");
    $("reportModal").setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("locked");
  }

  function closeReportModal() {
    $("reportModal").classList.remove("active");
    $("reportModal").setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("locked");
  }

  $("openReport").addEventListener(
    "click",
    openReportModal
  );

  $("closeReport").addEventListener(
    "click",
    closeReportModal
  );

  $("cancelReport").addEventListener(
    "click",
    closeReportModal
  );

  document.querySelectorAll(
    "[data-close-report]"
  ).forEach(element => {
    element.addEventListener(
      "click",
      closeReportModal
    );
  });

  /* ==================================================
     GENERAR REPORTE
  ================================================== */

  $("generateReport").addEventListener(
    "click",
    generateReport
  );

  function generateReport() {
    updateReportPreview();

    if (!reportResults.length) return;

    const criteria = getReportCriteria();
    const individual = getScope() === "individual";
    const selectedUser = findUser(criteria.user);

    const includeUser = $("includeUser").checked;
    const includeResource = $("includeResource").checked;
    const includeTechnical = $("includeTechnical").checked;
    const includeIntegrity = $("includeIntegrity").checked;

    const scopeTitle = individual
      ? `Reporte individual: ${selectedUser.name}`
      : "Reporte general";

    const periodLabel =
      criteria.period === "custom"
        ? `${formatDate(criteria.start)} al ${formatDate(criteria.end)}`
        : periodNames[criteria.period];

    const eventLabel =
      categoryNames[criteria.event] || "Todos los eventos";

    let headers = "<th>Evento</th>";

    if (includeUser) {
      headers += "<th>Usuario responsable</th>";
    }

    if (includeResource) {
      headers += "<th>Recurso asociado</th>";
    }

    if (includeTechnical) {
      headers += "<th>Información técnica</th>";
    }

    headers += "<th>Resultado</th>";

    if (includeIntegrity) {
      headers += "<th>Integridad</th>";
    }

    const rows = reportResults.map(record => {
      let cells = `
        <td>
          <strong>${escapeHtml(record.action)}</strong>
          <small>${escapeHtml(record.id)}</small>
        </td>
      `;

      if (includeUser) {
        cells += `
          <td>
            ${escapeHtml(record.user)}
            <small>${escapeHtml(record.email)}</small>
            <small>${escapeHtml(record.role)}</small>
          </td>
        `;
      }

      if (includeResource) {
        cells += `
          <td>
            ${escapeHtml(record.resource)}
            <small>${escapeHtml(record.version)}</small>
          </td>
        `;
      }

      if (includeTechnical) {
        cells += `
          <td>
            ${formatDate(record.date)}
            <small>${escapeHtml(record.time)}</small>
            <small>IP: ${escapeHtml(record.ip)}</small>
            <small>Sesión: ${escapeHtml(record.session)}</small>
          </td>
        `;
      }

      cells += `
        <td>${escapeHtml(record.result)}</td>
      `;

      if (includeIntegrity) {
        cells += `
          <td class="hash">
            ${record.hash
              ? escapeHtml(record.hash)
              : "No aplica"}
          </td>
        `;
      }

      return `<tr>${cells}</tr>`;
    }).join("");

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      $("reportError").textContent =
        "El navegador bloqueó la ventana. Permita las ventanas emergentes e intente nuevamente.";
      return;
    }

    const generatedAt = new Date()
      .toLocaleString("es-SV");

    reportWindow.document.open();

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de auditoría - SISCAE</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 35px;
            color: #172033;
            background: white;
            font-family: Arial, sans-serif;
            font-size: 11px;
          }

          .toolbar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 25px;
          }

          .toolbar button {
            padding: 12px 20px;
            border: 0;
            border-radius: 4px;
            background: #0637B7;
            color: white;
            font-weight: bold;
            cursor: pointer;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            padding-bottom: 22px;
            border-bottom: 4px solid #06246A;
          }

          .brand {
            color: #0637B7;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1.5px;
          }

          h1 {
            margin: 10px 0;
            color: #06246A;
            font-size: 25px;
          }

          .subtitle {
            color: #667085;
            line-height: 1.5;
          }

          .document-label {
            color: #667085;
            text-align: right;
            font-size: 10px;
          }

          .document-label strong {
            display: block;
            margin-bottom: 7px;
            color: #06246A;
          }

          .criteria {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            margin-top: 25px;
            border: 1px solid #DCE3EE;
          }

          .criteria > div {
            padding: 15px;
            border-right: 1px solid #DCE3EE;
            border-bottom: 1px solid #DCE3EE;
          }

          .criteria span {
            display: block;
            color: #667085;
            font-size: 9px;
          }

          .criteria strong {
            display: block;
            margin-top: 7px;
            color: #06246A;
            overflow-wrap: anywhere;
          }

          .summary {
            margin-top: 22px;
            padding: 15px;
            border-left: 4px solid #F5CE32;
            background: #F1F5FC;
          }

          h2 {
            margin: 30px 0 15px;
            color: #06246A;
            font-size: 16px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }

          th {
            padding: 11px;
            background: #06246A;
            color: white;
            text-align: left;
          }

          td {
            padding: 11px;
            vertical-align: top;
            border-bottom: 1px solid #DCE3EE;
            overflow-wrap: anywhere;
          }

          tbody tr:nth-child(even) {
            background: #F7F9FC;
          }

          td strong,
          td small {
            display: block;
          }

          td small {
            margin-top: 5px;
            color: #667085;
            font-size: 8px;
          }

          .hash {
            max-width: 140px;
            font-family: monospace;
            overflow-wrap: anywhere;
          }

          footer {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #DCE3EE;
            color: #8793A6;
            font-size: 9px;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          @media print {
            body {
              padding: 0;
            }

            .toolbar {
              display: none;
            }

            thead {
              display: table-header-group;
            }

            tr {
              break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>

        <div class="toolbar">
          <button onclick="window.print()">
            Imprimir / Guardar como PDF
          </button>
        </div>

        <header class="header">
          <div>
            <div class="brand">SISCAE</div>
            <h1>Reporte de auditoría</h1>
            <p class="subtitle">
              Sistema Integral de Seguridad y Control
              de Activos Editoriales
            </p>
          </div>

          <div class="document-label">
            <strong>DOCUMENTO DE DEMOSTRACIÓN</strong>
            Generado: ${escapeHtml(generatedAt)}
          </div>
        </header>

        <section class="criteria">

          <div>
            <span>Alcance del reporte</span>
            <strong>${escapeHtml(scopeTitle)}</strong>
          </div>

          <div>
            <span>Período</span>
            <strong>${escapeHtml(periodLabel)}</strong>
          </div>

          <div>
            <span>Tipo de evento</span>
            <strong>${escapeHtml(eventLabel)}</strong>
          </div>

          <div>
            <span>Búsqueda específica</span>
            <strong>
              ${escapeHtml(
                criteria.search.trim() ||
                "Sin búsqueda específica"
              )}
            </strong>
          </div>

        </section>

        <div class="summary">
          <strong>
            ${reportResults.length} registros encontrados
          </strong>
          <p>
            El reporte incluye únicamente los registros
            correspondientes a los criterios seleccionados.
          </p>
        </div>

        <h2>Detalle de los registros</h2>

        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <footer>
          <span>SISCAE · Reporte simulado de auditoría</span>
          <span>Ministerio de Educación</span>
        </footer>

      </body>
      </html>
    `);

    reportWindow.document.close();

    closeReportModal();
  }

  /* ==================================================
     MENÚ Y PERFIL
  ================================================== */

  $("menuButton").addEventListener("click", () => {
    $("sidebar").classList.add("open");
    $("mobileOverlay").classList.add("active");
    document.body.classList.add("locked");
  });

  function closeSidebar() {
    $("sidebar").classList.remove("open");
    $("mobileOverlay").classList.remove("active");
    document.body.classList.remove("locked");
  }

  $("mobileOverlay").addEventListener(
    "click",
    closeSidebar
  );

  $("profileButton").addEventListener("click", event => {
    event.stopPropagation();
    $("profile").classList.toggle("open");
  });

  document.addEventListener("click", event => {
    if (!$("profile").contains(event.target)) {
      $("profile").classList.remove("open");
    }
  });

  /* ==================================================
     CERRAR SESIÓN
  ================================================== */

  function openLogout() {
    $("profile").classList.remove("open");
    $("logoutModal").classList.add("active");
    $("logoutModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
  }

  function closeLogout() {
    $("logoutModal").classList.remove("active");
    $("logoutModal").setAttribute("aria-hidden", "true");
    document.body.classList.remove("locked");
  }

  $("sidebarLogout").addEventListener(
    "click",
    openLogout
  );

  $("profileLogout").addEventListener(
    "click",
    openLogout
  );

  document.querySelectorAll(
    "[data-close-logout]"
  ).forEach(element => {
    element.addEventListener("click", closeLogout);
  });

  $("confirmLogout").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if ($("reportModal").classList.contains("active")) {
      closeReportModal();
    } else if ($("logoutModal").classList.contains("active")) {
      closeLogout();
    } else if ($("detailDrawer").classList.contains("active")) {
      closeDetail();
    } else {
      closeSidebar();
      $("profile").classList.remove("open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 950) {
      closeSidebar();
    }
  });

  /* ==================================================
     INICIALIZACIÓN
  ================================================== */

  populateUsers();

  $("todayCount").textContent =
    records.filter(record =>
      record.date === demoToday
    ).length;

  applyTableFilters();

});
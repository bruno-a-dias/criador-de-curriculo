// Estado CV
const cv = {
    personal: { name: "", role: "", email: "", phone: "", location: "", website: "", summary: "" },
    objective: "",
    experience: [],
    education: [],
    skills: { technical: [], soft: [] },
    certifications: [],
    languages: [],
    projects: [],
    references: [],
    enabledSections: {
      objective: true,
      experience: true,
      education: true,
      skills: true,
      certifications: true,
      languages: true,
      projects: true,
      references: true,
    },
  };
  
  // Mock data
  const mockCV = {
    personal: {
      name: "Bruno Alves",
      role: "Desenvolvedor Full Stack",
      email: "bruno@email.com",
      phone: "(11) 99999-0000",
      location: "São Paulo, SP",
      website: "github.com/usuario",
      summary: "Profissional com experiência em sistemas web, foco em performance e acessibilidade.",
    },
    objective: "Atuar como Desenvolvedor Full Stack entregando soluções escaláveis.",
    experience: [
      { title: "Dev Front-end", company: "TechX", start: "2023", end: "Atual", description: "React, Bootstrap, testes, acessibilidade." },
    ],
    education: [
      { degree: "Sistemas de Informação", school: "Universidade ABC", start: "2017", end: "2020", details: "Ênfase em engenharia de software." },
    ],
    skills: { technical: ["JS", "Bootstrap", "Node"], soft: ["Comunicação", "Trabalho em equipe"] },
    certifications: ["Scrum Foundation"],
    languages: [{ name: "Português", level: "Nativo" }, { name: "Inglês", level: "Avançado" }],
    projects: [{ name: "Gerador de CV", description: "SPA para montar currículo.", tech: ["HTML", "CSS", "JS"], link: "https://exemplo.com" }],
    references: [{ name: "Maria Silva", relation: "Gestora", contact: "maria@empresa.com" }],
    enabledSections: {
      objective: true, experience: true, education: true, skills: true, certifications: true, languages: true, projects: true, references: true,
    },
  };
  
  // DOM refs
  const previewEl = document.getElementById("cvPreview");
  const themeToggle = document.getElementById("themeToggle");
  const mockToggle = document.getElementById("mockToggle");
  
  // Tema
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const dark = html.classList.toggle("dark");
    html.setAttribute("data-bs-theme", dark ? "dark" : "light");
    themeToggle.innerHTML = dark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
  });
  
  // Helpers
  const byId = (id) => document.getElementById(id);
  const input = (id, handler) => byId(id)?.addEventListener("input", (e) => handler(e.target.value.trim()));
  
  // Bind inputs pessoais
  [
    ["personal_name", (v) => (cv.personal.name = v)],
    ["personal_role", (v) => (cv.personal.role = v)],
    ["personal_email", (v) => (cv.personal.email = v)],
    ["personal_phone", (v) => (cv.personal.phone = v)],
    ["personal_location", (v) => (cv.personal.location = v)],
    ["personal_website", (v) => (cv.personal.website = v)],
    ["personal_summary", (v) => (cv.personal.summary = v)],
    ["objective", (v) => (cv.objective = v)],
  ].forEach(([id, fn]) => input(id, fn));
  
  // List editors
  function makeItem(fields) {
    const row = document.createElement("div");
    row.className = "border rounded p-3";
    row.innerHTML = fields
      .map((f) => {
        const col = f.full ? "col-12" : "col-12 col-md-6";
        return `<div class="${col}">
          <label class="form-label">${f.label}</label>
          <input type="text" class="form-control" data-key="${f.key}" value="${f.value || ""}" />
        </div>`;
      })
      .join("") + `<div class="col-12 text-end mt-2">
        <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove"><i class="bi bi-trash"></i> Remover</button>
      </div>`;
    const grid = document.createElement("div");
    grid.className = "row g-3";
    grid.appendChild(row);
    return grid;
  }
  
  function bindList(listId, arr, template) {
    const listEl = document.getElementById(listId);
    const render = () => {
      listEl.innerHTML = "";
      arr.forEach((item, idx) => {
        const el = makeItem(template(item));
        el.addEventListener("input", (e) => {
          const target = e.target;
          if (!(target instanceof HTMLInputElement)) return;
          const key = target.getAttribute("data-key");
          if (!key) return;
          arr[idx][key] = target.value;
          renderPreview();
        });
        el.querySelector("[data-action='remove']").addEventListener("click", () => {
          arr.splice(idx, 1);
          render();
          renderPreview();
        });
        listEl.appendChild(el);
      });
    };
    render();
    return {
      add(item) {
        arr.push(item);
        render();
        renderPreview();
      },
    };
  }
  
  // Experiência
  const expEditor = bindList("experienceList", cv.experience, (it) => [
    { label: "Cargo", key: "title", value: it.title },
    { label: "Empresa", key: "company", value: it.company },
    { label: "Início (ex: 2023)", key: "start", value: it.start },
    { label: "Fim (ex: 2025 ou Atual)", key: "end", value: it.end },
    { label: "Descrição", key: "description", value: it.description, full: true },
  ]);
  document.querySelector("[data-action='add-exp']").addEventListener("click", () =>
    expEditor.add({ title: "", company: "", start: "", end: "", description: "" })
  );
  
  // Educação
  const eduEditor = bindList("educationList", cv.education, (it) => [
    { label: "Curso/Graduação", key: "degree", value: it.degree },
    { label: "Instituição", key: "school", value: it.school },
    { label: "Início", key: "start", value: it.start },
    { label: "Fim", key: "end", value: it.end },
    { label: "Detalhes", key: "details", value: it.details, full: true },
  ]);
  document.querySelector("[data-action='add-edu']").addEventListener("click", () =>
    eduEditor.add({ degree: "", school: "", start: "", end: "", details: "" })
  );
  
  // Idiomas
  const langEditor = bindList("languagesList", cv.languages, (it) => [
    { label: "Idioma", key: "name", value: it.name },
    { label: "Nível", key: "level", value: it.level },
  ]);
  document.querySelector("[data-action='add-lang']").addEventListener("click", () =>
    langEditor.add({ name: "", level: "" })
  );
  
  // Projetos
  const projEditor = bindList("projectsList", cv.projects, (it) => [
    { label: "Projeto", key: "name", value: it.name },
    { label: "Link", key: "link", value: it.link },
    { label: "Tecnologias (vírgula)", key: "tech", value: (it.tech || []).join(", "), full: true },
    { label: "Descrição", key: "description", value: it.description, full: true },
  ]);
  document.querySelector("[data-action='add-proj']").addEventListener("click", () =>
    projEditor.add({ name: "", link: "", tech: [], description: "" })
  );
  
  // Referências
  const refEditor = bindList("referencesList", cv.references, (it) => [
    { label: "Nome", key: "name", value: it.name },
    { label: "Relação", key: "relation", value: it.relation },
    { label: "Contato", key: "contact", value: it.contact },
  ]);
  document.querySelector("[data-action='add-ref']").addEventListener("click", () =>
    refEditor.add({ name: "", relation: "", contact: "" })
  );
  
  // Skills/Certifications simples (texto -> arrays)
  byId("skills_tech").addEventListener("input", (e) => {
    cv.skills.technical = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
    renderPreview();
  });
  byId("skills_soft").addEventListener("input", (e) => {
    cv.skills.soft = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
    renderPreview();
  });
  byId("certifications").addEventListener("input", (e) => {
    cv.certifications = e.target.value.split(";").map((s) => s.trim()).filter(Boolean);
    renderPreview();
  });
  
  // Toggle de seções
  [
    "objective","experience","education","skills","certifications","languages","projects","references",
  ].forEach((key) => {
    const el = byId(`toggle_${key}`);
    el.addEventListener("change", (e) => {
      cv.enabledSections[key] = e.target.checked;
      renderPreview();
    });
  });
  
  // Mock data loader
  mockToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      Object.assign(cv, JSON.parse(JSON.stringify(mockCV)));
      // hidratar campos básicos
      byId("personal_name").value = cv.personal.name || "";
      byId("personal_role").value = cv.personal.role || "";
      byId("personal_email").value = cv.personal.email || "";
      byId("personal_phone").value = cv.personal.phone || "";
      byId("personal_location").value = cv.personal.location || "";
      byId("personal_website").value = cv.personal.website || "";
      byId("personal_summary").value = cv.personal.summary || "";
      byId("objective").value = cv.objective || "";
      byId("skills_tech").value = (cv.skills.technical || []).join(", ");
      byId("skills_soft").value = (cv.skills.soft || []).join(", ");
      byId("certifications").value = (cv.certifications || []).join("; ");
      // re-render lists
      expEditor.add({}); cv.experience.pop();
      eduEditor.add({}); cv.education.pop();
      langEditor.add({}); cv.languages.pop();
      projEditor.add({}); cv.projects.pop();
      refEditor.add({}); cv.references.pop();
    } else {
      // reset
      Object.assign(cv, {
        personal: { name: "", role: "", email: "", phone: "", location: "", website: "", summary: "" },
        objective: "",
        experience: [],
        education: [],
        skills: { technical: [], soft: [] },
        certifications: [],
        languages: [],
        projects: [],
        references: [],
        enabledSections: cv.enabledSections,
      });
      document.getElementById("cvForm").reset();
      // limpar listas
      document.getElementById("experienceList").innerHTML = "";
      document.getElementById("educationList").innerHTML = "";
      document.getElementById("languagesList").innerHTML = "";
      document.getElementById("projectsList").innerHTML = "";
      document.getElementById("referencesList").innerHTML = "";
    }
    renderPreview();
  });
  
  // Render do preview
  function renderPreview() {
    const show = (k) => cv.enabledSections[k] !== false;
  
    const section = (title, inner) => `
      <div class="cv-section">
        <div class="cv-section-title">${title}</div>
        ${inner}
      </div>
    `;
  
    const personal = `
      <header class="text-center border-bottom pb-2 mb-3">
        <h1 class="h3 m-0">${cv.personal.name || "Nome Completo"}</h1>
        <div class="cv-muted">${[cv.personal.role, cv.personal.location].filter(Boolean).join(" • ")}</div>
        <div class="small mt-1">${[cv.personal.email, cv.personal.phone, cv.personal.website].filter(Boolean).join(" | ")}</div>
        ${cv.personal.summary ? `<p class="mt-2">${cv.personal.summary}</p>` : ""}
      </header>
    `;
  
    const objective = show("objective") && cv.objective
      ? section("Objetivo Profissional", `<p>${cv.objective}</p>`) : "";
  
    const experience = show("experience") && cv.experience.length
      ? section("Experiência Profissional",
        cv.experience.map(e => `
          <div class="cv-item">
            <div class="fw-semibold">${e.title || ""} — ${e.company || ""} (${e.start || ""} – ${e.end || "Atual"})</div>
            ${e.description ? `<div class="small cv-muted">${e.description}</div>` : ""}
          </div>
        `).join("")
      ) : "";
  
    const education = show("education") && cv.education.length
      ? section("Educação",
        cv.education.map(ed => `
          <div class="cv-item">
            <div class="fw-semibold">${ed.degree || ""} — ${ed.school || ""} (${ed.start || ""} – ${ed.end || ""})</div>
            ${ed.details ? `<div class="small cv-muted">${ed.details}</div>` : ""}
          </div>
        `).join("")
      ) : "";
  
    const skills = show("skills") && (cv.skills.technical.length || cv.skills.soft.length)
      ? section("Habilidades", `
        ${cv.skills.technical.length ? `<div><strong>Técnicas:</strong> ${cv.skills.technical.join(", ")}</div>` : ""}
        ${cv.skills.soft.length ? `<div><strong>Interpessoais:</strong> ${cv.skills.soft.join(", ")}</div>` : ""}
      `) : "";
  
    const certifications = show("certifications") && cv.certifications.length
      ? section("Certificações", `<div>${cv.certifications.join(" • ")}</div>`) : "";
  
    const languages = show("languages") && cv.languages.length
      ? section("Idiomas", `<div>${cv.languages.map(l => `${l.name} (${l.level})`).join(" • ")}</div>`) : "";
  
    const projects = show("projects") && cv.projects.length
      ? section("Projetos", cv.projects.map(p => `
        <div class="cv-item">
          <div class="fw-semibold">${p.name || ""}${p.link ? ` — <a href="${p.link}" target="_blank" rel="noopener">link</a>` : ""}</div>
          ${p.description ? `<div class="small cv-muted">${p.description}</div>` : ""}
          ${p.tech?.length ? `<div class="small">Tecnologias: ${Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}</div>` : ""}
        </div>
      `).join("")) : "";
  
    const references = show("references") && cv.references.length
      ? section("Referências", cv.references.map(r => `
        <div class="cv-item">
          <div class="fw-semibold">${r.name || ""}${r.relation ? ` — ${r.relation}` : ""}${r.contact ? ` | ${r.contact}` : ""}</div>
        </div>
      `).join("")) : "";
  
    previewEl.innerHTML = personal + objective + experience + education + skills + certifications + languages + projects + references;
  }
  renderPreview();
  
  // Inputs que atualizam preview
  document.getElementById("cvForm").addEventListener("input", renderPreview);
  
  // Ações
  document.getElementById("btnPrint").addEventListener("click", () => window.print());
  document.getElementById("btnNew").addEventListener("click", () => {
    document.getElementById("cvForm").reset();
    Object.assign(cv, {
      personal: { name: "", role: "", email: "", phone: "", location: "", website: "", summary: "" },
      objective: "", experience: [], education: [], skills: { technical: [], soft: [] },
      certifications: [], languages: [], projects: [], references: [],
    });
    ["experienceList","educationList","languagesList","projectsList","referencesList"].forEach(id => document.getElementById(id).innerHTML = "");
    renderPreview();
  });
  
  // PDF
  document.getElementById("btnPdf").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const node = document.getElementById("cvPreview");
  
    await pdf.html(node, {
      html2canvas: { scale: 2, useCORS: true, backgroundColor: getComputedStyle(node).backgroundColor || "#ffffff" },
      margin: [36, 36, 36, 36],
      autoPaging: "text",
      callback: () => pdf.save("curriculo.pdf"),
      windowWidth: node.scrollWidth,
    });
  });
   
  // DOCX
  document.getElementById("btnDocx").addEventListener("click", async () => {
    if (!cv.personal.name || !cv.education.length || !cv.experience.length) {
      alert("Preencha: Nome, Experiência e Educação antes de exportar.");
      return;
    }
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;
    const children = [];
  
    const addHeading = (t) => children.push(new Paragraph({ text: t, heading: HeadingLevel.HEADING_2 }));
    const addPara = (t) => t && children.push(new Paragraph({ children: [new TextRun(t)] }));
  
    // Header
    children.push(new Paragraph({ children: [new TextRun({ text: cv.personal.name, bold: true, size: 30 })], alignment: AlignmentType.CENTER }));
    addPara([cv.personal.role, cv.personal.location].filter(Boolean).join(" • "));
    addPara([cv.personal.email, cv.personal.phone, cv.personal.website].filter(Boolean).join(" | "));
    addPara(cv.personal.summary);
  
    if (cv.enabledSections.objective && cv.objective) { addHeading("Objetivo Profissional"); addPara(cv.objective); }
    if (cv.enabledSections.experience && cv.experience.length) {
      addHeading("Experiência Profissional");
      cv.experience.forEach(e => { addPara(`${e.title} — ${e.company} (${e.start} – ${e.end || "Atual"})`); addPara(e.description); });
    }
    if (cv.enabledSections.education && cv.education.length) {
      addHeading("Educação");
      cv.education.forEach(ed => { addPara(`${ed.degree} — ${ed.school} (${ed.start} – ${ed.end})`); addPara(ed.details); });
    }
    if (cv.enabledSections.skills && (cv.skills.technical.length || cv.skills.soft.length)) {
      addHeading("Habilidades");
      if (cv.skills.technical.length) addPara("Técnicas: " + cv.skills.technical.join(", "));
      if (cv.skills.soft.length) addPara("Interpessoais: " + cv.skills.soft.join(", "));
    }
    if (cv.enabledSections.certifications && cv.certifications.length) {
      addHeading("Certificações"); addPara(cv.certifications.join(" • "));
    }
    if (cv.enabledSections.languages && cv.languages.length) {
      addHeading("Idiomas"); addPara(cv.languages.map(l => `${l.name} (${l.level})`).join(" • "));
    }
    if (cv.enabledSections.projects && cv.projects.length) {
      addHeading("Projetos");
      cv.projects.forEach(p => { addPara(`${p.name}${p.link ? ` — ${p.link}` : ""}`); addPara(p.description); if (p.tech?.length) addPara("Tecnologias: " + (Array.isArray(p.tech) ? p.tech.join(", ") : p.tech)); });
    }
    if (cv.enabledSections.references && cv.references.length) {
      addHeading("Referências"); cv.references.forEach(r => addPara(`${r.name}${r.relation ? ` — ${r.relation}` : ""}${r.contact ? ` | ${r.contact}` : ""}`));
    }
  
    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "curriculo.docx";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  
// -------------------------
// Accueil
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  showPage('body_one'); // Only show body_one on initial load

  // -------------------------
  // Auto-zoom reset on blur for all inputs
  // -------------------------
  function attachAutoZoomReset(input) {
    input.addEventListener('blur', () => {
      setTimeout(() => {
        window.scrollTo(window.scrollX, window.scrollY);
      }, 100);
    });
  }

  // -------------------------
  // Page navigation
  // -------------------------
  const pages = [
    { linkId: 'show_body_one', bodyId: 'body_one' },
    { linkId: 'show_body_two', bodyId: 'body_two' },
    { linkId: 'show_body_three', bodyId: 'body_three' },
    { linkId: 'show_body_four', bodyId: 'body_four' }
  ];

  function showPage(activeBodyId) {
    pages.forEach(p => {
      const body = document.getElementById(p.bodyId);
      body.style.display = p.bodyId === activeBodyId ? 'block' : 'none';
    });
  }

  pages.forEach(p => {
    const link = document.getElementById(p.linkId);
    if (!link) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(p.bodyId);
    });
  });

  // -------------------------
  // Dice roller
  // -------------------------
  function getStatModifier(stat) {
    const idMap = {
      "Force": "str_value",
      "Grâce": "dex_value",
      "Charme": "charm_value",
      "Ingéniosité": "int_value",
      "Générique": null
    };
    if (!idMap[stat]) return 0;
    const el = document.getElementById(idMap[stat]);
    return parseInt(el.textContent) || 0;
  }

  function getEquipModifier(stat) {
    const statPrefixMap = {
      "Force": "str",
      "Grâce": "dex",
      "Charme": "charm",
      "Ingéniosité": "int",
      "Générique": null
    };
    const prefix = statPrefixMap[stat];
    if (!prefix) return 0;

    let sum = 0;
    for (let i = 1; i <= 20; i++) {
      const typeSelect = document.getElementById(`equip${i}-type`);
      const valueSpan = document.getElementById(`equip${i}-value`);
      if (!typeSelect || !valueSpan) continue;
      if (typeSelect.value.startsWith(prefix)) {
        sum += parseInt(valueSpan.textContent) || 0;
      }
    }
    return sum;
  }

  function getWoundModifier() {
    const woundEl = document.getElementById("wound");
    return woundEl && woundEl.classList.contains("active") ? -1 : 0;
  }

  document.querySelector(".dice-throw").addEventListener("click", () => {
    const stat = document.getElementById("dice-stat").value;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;

    const statMod = getStatModifier(stat);
    const equipMod = getEquipModifier(stat);
    const woundMod = getWoundModifier();
    const total = d1 + d2 + statMod + equipMod + woundMod;

    document.querySelector(".dice-roll").textContent = `Lancer : ${d1} + ${d2} = ${d1 + d2}`;
    document.querySelector(".dice-modifier").textContent = `Caractéristiques : ${statMod}`;
    document.querySelector(".dice-equipment").textContent = `Equipement : ${equipMod}`;
    document.querySelector(".dice-wound").textContent = `Blessure : ${woundMod}`;

    if (d1 === 1 && d2 === 1) {
      document.querySelector(".dice-total").textContent = "Epic fail !";
    } else if (d1 === 6 && d2 === 6) {
      document.querySelector(".dice-total").textContent = "Epic win !";
    } else {
      document.querySelector(".dice-total").textContent = `Total : ${total}`;
    }
  });

  // -------------------------
  // + and - counters
  // -------------------------
  document.querySelectorAll(".counter_button").forEach(btn => {
    btn.addEventListener("click", () => {
      const stat = btn.id.replace(/^(increase_|decrease_)/, "");
      const counter = document.getElementById(stat + "_value");
      if (!counter) return;

      let value = parseInt(counter.textContent) || 0;
      if (btn.id.startsWith("increase")) value++;
      else if (btn.id.startsWith("decrease")) value = Math.max(0, value - 1);

      counter.textContent = value;
    });
  });

  // -------------------------
  // Status toggle
  // -------------------------
  document.querySelectorAll(".status_container").forEach(container => {
    const textEl = container.querySelector(".status_text");
    container.addEventListener("click", () => {
      const isActive = container.classList.toggle("active");
      textEl.textContent = isActive ? "Blessé !" : "";
    });
  });

  // -------------------------
  // Equipment generation
  // -------------------------
  const container = document.getElementById("equipment");
  const effects = [
    { value: "none", label: "Aucun effet" },
    { value: "str", label: "Force" },
    { value: "dex", label: "Grâce" },
    { value: "charm", label: "Charme" },
    { value: "int", label: "Ingéniosité" }
  ];

  for (let i = 1; i <= 20; i++) {
    // Name input
    const inputDiv = document.createElement("div");
    inputDiv.className = "input span-two-columns";

    const label = document.createElement("label");
    label.className = "input_label";
    label.textContent = `N° ${i}`;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "input_field";
    input.id = `equip${i}`;

    inputDiv.append(label, input);
    container.appendChild(inputDiv);

    // Effect + controls
    const selectDiv = document.createElement("div");
    selectDiv.className = "input span-two-columns";

    const select = document.createElement("select");
    select.className = "select_modfield";
    select.id = `equip${i}-type`;

    effects.forEach(effect => {
      const option = document.createElement("option");
      option.value = `${effect.value}${i}-mod`;
      option.textContent = effect.label;
      select.appendChild(option);
    });

    const valueSpan = document.createElement("span");
    valueSpan.className = "equip_value";
    valueSpan.id = `equip${i}-value`;
    valueSpan.textContent = "0";

    const increaseBtn = document.createElement("span");
    increaseBtn.className = "equip_button";
    increaseBtn.textContent = "+";

    const decreaseBtn = document.createElement("span");
    decreaseBtn.className = "equip_button";
    decreaseBtn.textContent = "-";

    increaseBtn.addEventListener("click", () => {
      valueSpan.textContent = parseInt(valueSpan.textContent, 10) + 1;
    });
    decreaseBtn.addEventListener("click", () => {
      valueSpan.textContent = parseInt(valueSpan.textContent, 10) - 1;
    });

    selectDiv.append(select, valueSpan, increaseBtn, decreaseBtn);
    container.appendChild(selectDiv);
  }

  // -------------------------
  // Boons
  // -------------------------
  const boonContainer = document.getElementById('boons');
  for (let i = 1; i <= 3; i++) {
    const div = document.createElement('div');
    div.className = 'input bc_input_container';

    const label = document.createElement('label');
    label.className = 'input_label';
    label.textContent = `Bénédiction ${i}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bc_input_field';
    input.id = `boon${i}`;

    const clear = document.createElement('span');
    clear.className = 'clear_bc';
    clear.textContent = '✖';
    clear.dataset.target = input.id;
    clear.addEventListener('click', () => { input.value = ''; });

    div.append(label, input, clear);
    boonContainer.appendChild(div);
  }

  // -------------------------
  // Curses
  // -------------------------
  const cursesContainer = document.getElementById('curses');
  for (let i = 1; i <= 10; i++) {
    const div = document.createElement('div');
    div.className = 'input';

    const label = document.createElement('label');
    label.className = 'input_label';
    label.textContent = `Malédiction ${i}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bc_input_field';
    input.id = `curse${i}`;

    const clear = document.createElement('span');
    clear.className = 'clear_bc';
    clear.textContent = '✖';
    clear.dataset.target = input.id;
    clear.addEventListener('click', () => { input.value = ''; });

    div.append(label, input, clear);
    cursesContainer.appendChild(div);
  }

  // -------------------------
  // Titles
  // -------------------------
  const titlesContainer = document.getElementById("titles");
  for (let i = 1; i <= 6; i++) {
    const div = document.createElement("div");
    div.className = "input";

    const label = document.createElement("label");
    label.className = "input_label";
    label.textContent = `Titre ${i}`;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "titles_input_field";
    input.id = `titles_${i}`;

    const clear = document.createElement("span");
    clear.className = "clear_titles";
    clear.dataset.target = input.id;
    clear.textContent = "✖";
    clear.addEventListener("click", () => {
      input.value = "";
      localStorage.removeItem(input.id);
    });

    div.append(label, input, clear);
    titlesContainer.appendChild(div);
  }

  // -------------------------
  // Notos and Hades checkboxes
  // -------------------------
  const notosCodes = [
    "Oasis","Obligation","Ocre","Ode","Odieux","Oedipe","Oeillade","Offre","Oiseau","Okra",
    "Oléolat","Oliphant","Onéreux","Opposé","Optique","Oquassa","Oracle","Orage","Ordalie","Orgueil",
    "Ormeau","Otus","Ovation","Ovibos","Ozone"
  ];

  const hadesCodes = [
    "Nadir","Napalm","Natron","Nature","Nauséabond","Nautile","Navarin","Navrant","Néant","Néfaste",
    "Négation","Négoce","Némésis","Nenni","Néo-Apollon","Néo-Arès","Néo-Artémis","Néo-Athéna","Néophyte","Nerveux",
    "Neurones","Neutralisation","Neveu","Nickel","Nid","Nihilisme","Nimbe","Nirvana","Noble","Nocif",
    "Nom","Nomade","Nonchalant","Nouilles","Nounou","Nourricier","Nourrisson","Nouveauté","Nuisible","Nuit",
    "Nullification","Nullité","Nuque"
  ];

  function buildCheckboxes(containerId, codes, prefix) {
    const container = document.getElementById(containerId);
    codes.forEach((code, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `${prefix}${index + 1}`;
      const text = document.createElement('span');
      text.textContent = code;
      label.append(input, text);
      container.appendChild(label);
    });
  }

  buildCheckboxes('notos-codes', notosCodes, 'cn');
  buildCheckboxes('hades-codes', hadesCodes, 'ch');

  // -------------------------
  // Local Storage Autosave
  // -------------------------
  function attachAutosave(el) {
    if (!el.id) return;
    const key = el.id;

    const saved = localStorage.getItem(key);
    if (saved !== null) {
      if (el.type === "checkbox") el.checked = saved === "true";
      else el.value = saved;
    }

    const save = () => {
      if (el.type === "checkbox") localStorage.setItem(key, el.checked);
      else localStorage.setItem(key, el.value);
    };

    el.addEventListener("input", save);
    el.addEventListener("change", save);
  }

  document.querySelectorAll("input, textarea, select").forEach(attachAutosave);

  // Counters
  document.querySelectorAll(".counter").forEach(counter => {
    const key = counter.id;
    if (!key) return;
    const saved = localStorage.getItem(key);
    if (saved !== null) counter.textContent = saved;

    const observer = new MutationObserver(() => {
      localStorage.setItem(key, counter.textContent);
    });
    observer.observe(counter, { childList: true });
  });

  // Status containers
  document.querySelectorAll(".status_container").forEach(container => {
    const textEl = container.querySelector(".status_text");
    const keyActive = container.id + "_active";
    const keyText = container.id + "_text";

    if (localStorage.getItem(keyActive) === "true") container.classList.add("active");
    textEl.textContent = localStorage.getItem(keyText) || "";

    const observer = new MutationObserver(() => {
      localStorage.setItem(keyActive, container.classList.contains("active"));
      localStorage.setItem(keyText, textEl.textContent);
    });
    observer.observe(textEl, { childList: true });
  });

  // Dynamic inputs
  function autosaveDynamicInput(input) {
    if (!input || !input.id) return;
    const key = input.id;
    const saved = localStorage.getItem(key);
    if (saved !== null) input.value = saved;
    input.addEventListener("input", () => localStorage.setItem(key, input.value));
    attachAutoZoomReset(input); // attach auto-zoom handler here
  }

  function autosaveDynamicSelect(select) {
    if (!select || !select.id) return;
    const key = select.id;
    const saved = localStorage.getItem(key);
    if (saved !== null) select.value = saved;
    select.addEventListener("change", () => localStorage.setItem(key, select.value));
  }

  function autosaveDynamicCounter(counter) {
    if (!counter || !counter.id) return;
    const key = counter.id;
    const saved = localStorage.getItem(key);
    if (saved !== null) counter.textContent = saved;
    const observer = new MutationObserver(() => localStorage.setItem(key, counter.textContent));
    observer.observe(counter, { childList: true });
  }

  function autosaveDynamicCheckbox(checkbox) {
    if (!checkbox || !checkbox.id) return;
    const key = checkbox.id;
    const saved = localStorage.getItem(key);
    if (saved !== null) checkbox.checked = saved === "true";
    checkbox.addEventListener("change", () => localStorage.setItem(key, checkbox.checked));
  }

  // Apply autosave + auto-zoom for dynamically created elements
  for (let i = 1; i <= 20; i++) {
    autosaveDynamicInput(document.getElementById(`equip${i}`));
    autosaveDynamicSelect(document.getElementById(`equip${i}-type`));
    autosaveDynamicCounter(document.getElementById(`equip${i}-value`));
  }
  for (let i = 1; i <= 3; i++) autosaveDynamicInput(document.getElementById(`boon${i}`));
  for (let i = 1; i <= 10; i++) autosaveDynamicInput(document.getElementById(`curse${i}`));
  for (let i = 1; i <= 6; i++) autosaveDynamicInput(document.getElementById(`titles_${i}`));
  document.querySelectorAll("#notos-codes input, #hades-codes input").forEach(autosaveDynamicCheckbox);

  // Personal notes field
  autosaveDynamicInput(document.getElementById("personal-notes"));
});

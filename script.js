// -------------------------
// Accueil
// -------------------------

document.addEventListener('DOMContentLoaded', () => {
  showPage('body_one'); // Only show body_one on initial load
});

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

// ------------------
// Dice roller
// ------------------
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

document.getElementById("dice-throw").addEventListener("click", () => {
  const stat = document.getElementById("dice-stat").value;
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;

  const statMod = getStatModifier(stat);
  const equipMod = getEquipModifier(stat);
  const woundMod = getWoundModifier();
  const total = d1 + d2 + statMod + equipMod + woundMod;

  document.getElementById("dice-roll").textContent = `Lancer : ${d1} + ${d2} = ${d1 + d2}`;
  document.getElementById("dice-modifier").textContent = `Caractéristiques : ${statMod}`;
  document.getElementById("dice-equipment").textContent = `Equipement : ${equipMod}`;
  document.getElementById("dice-wound").textContent = `Blessure : ${woundMod}`;

  if (d1 === 1 && d2 === 1) {
    document.getElementById("dice-total").textContent = "Epic fail !";
  } else if (d1 === 6 && d2 === 6) {
    document.getElementById("dice-total").textContent = "Epic win !";
  } else {
    document.getElementById("dice-total").textContent = `Total : ${total}`;
  }
});




// -------------------------
// + and - counters
// -------------------------

document.querySelectorAll(".counter_button").forEach(btn => {
  btn.addEventListener("click", () => {
    // Determine the stat name from the button ID
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
// Status toggle (click only)
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
  // ----- Equipment Name Input -----
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

  // ----- Equipment Effect + Controls -----
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

  // ----- Add Button Functionality -----
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
// Create boon list
// -------------------------
const boonContainer = document.getElementById('boons');

for (let i = 1; i <= 3; i++) {
  const div = document.createElement('div');
  div.className = 'input bc_input_container'; // optional: use flex container

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

  // Clear input on click
  clear.addEventListener('click', () => {
    input.value = '';
  });

  div.append(label, input, clear);
  boonContainer.appendChild(div);
}

// -------------------------
// Create curse list
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

  // Clear input on click
  clear.addEventListener('click', () => {
    input.value = '';
  });

  div.append(label, input, clear);
  cursesContainer.appendChild(div);
}

// -------------------------
// Create title list
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

  // Clear button functionality
  clear.addEventListener("click", () => {
    input.value = "";
    localStorage.removeItem(input.id); // remove from localStorage if using autosave
  });

  div.append(label, input, clear);
  titlesContainer.appendChild(div);
}

//----------------------------
// Create SAVE codes
//----------------------------
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

// Helper function to build checkboxes
function buildCheckboxes(containerId, codes, prefix) {
  const container = document.getElementById(containerId);
  codes.forEach((code, index) => {
    const label = document.createElement('label');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `${prefix}${index + 1}`;

    const text = document.createElement('span');
    text.textContent = code;

    label.appendChild(input);
    label.appendChild(text);
    container.appendChild(label);
  });
}

// Generate Notos and Hadès checkboxes
buildCheckboxes('notos-codes', notosCodes, 'cn');
buildCheckboxes('hades-codes', hadesCodes, 'ch');



// ---------------------------
// Local storage SAVING PART
// ---------------------------

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------
  // STATIC inputs, textareas, selects, checkboxes
  // -------------------------
  function attachAutosave(el) {
    if (!el.id) return;
    const key = el.id;

    // Load saved value
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      if (el.type === "checkbox") el.checked = saved === "true";
      else el.value = saved;
    }

    // Save on change/input
    const save = () => {
      if (el.type === "checkbox") localStorage.setItem(key, el.checked);
      else localStorage.setItem(key, el.value);
    };

    el.addEventListener("input", save);
    el.addEventListener("change", save);
  }

  document.querySelectorAll("input, textarea, select").forEach(attachAutosave);

  // -------------------------
  // COUNTERS
  // -------------------------
  document.querySelectorAll(".counter").forEach(counter => {
    const key = counter.id;
    if (!key) return;

    const saved = localStorage.getItem(key);
    if (saved !== null) counter.textContent = saved;

    // Save when value changes (via DOM mutation)
    const observer = new MutationObserver(() => {
      localStorage.setItem(key, counter.textContent);
    });
    observer.observe(counter, { childList: true });
  });

  // -------------------------
  // STATUS CONTAINERS
  // -------------------------
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

  // -------------------------
  // DYNAMICALLY GENERATED FIELDS
  // -------------------------
  function autosaveDynamicInput(input) {
    const key = input.id;
    if (!key) return;

    // Restore value
    const saved = localStorage.getItem(key);
    if (saved !== null) input.value = saved;

    // Save on input
    input.addEventListener("input", () => localStorage.setItem(key, input.value));
  }

  function autosaveDynamicSelect(select) {
    const key = select.id;
    if (!key) return;

    // Restore value
    const saved = localStorage.getItem(key);
    if (saved !== null) select.value = saved;

    // Save on change
    select.addEventListener("change", () => localStorage.setItem(key, select.value));
  }

  function autosaveDynamicCounter(counter) {
    const key = counter.id;
    if (!key) return;

    // Restore value
    const saved = localStorage.getItem(key);
    if (saved !== null) counter.textContent = saved;

    // Save on mutation
    const observer = new MutationObserver(() => {
      localStorage.setItem(key, counter.textContent);
    });
    observer.observe(counter, { childList: true });
  }

  function autosaveDynamicCheckbox(checkbox) {
    const key = checkbox.id;
    if (!key) return;

    // Restore checked state
    const saved = localStorage.getItem(key);
    if (saved !== null) checkbox.checked = saved === "true";

    checkbox.addEventListener("change", () => localStorage.setItem(key, checkbox.checked));
  }

  // Call these on dynamically created elements after you generate them
  // Example for equipment (after appending elements):
  for (let i = 1; i <= 20; i++) {
    autosaveDynamicInput(document.getElementById(`equip${i}`));
    autosaveDynamicSelect(document.getElementById(`equip${i}-type`));
    autosaveDynamicCounter(document.getElementById(`equip${i}-value`));
  }

  // Example for boons, curses, titles
  for (let i = 1; i <= 3; i++) autosaveDynamicInput(document.getElementById(`boon${i}`));
  for (let i = 1; i <= 10; i++) autosaveDynamicInput(document.getElementById(`curse${i}`));
  for (let i = 1; i <= 6; i++) autosaveDynamicInput(document.getElementById(`titles_${i}`));

  // Example for Notos/Hadès codes
  document.querySelectorAll("#notos-codes input, #hades-codes input").forEach(autosaveDynamicCheckbox);

  // Notes field
  autosaveDynamicInput(document.getElementById("personal-notes"));

});

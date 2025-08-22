document.addEventListener('DOMContentLoaded', () => {

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
      document.getElementById(p.bodyId).style.display = p.bodyId === activeBodyId ? 'block' : 'none';
    });
  }

  pages.forEach(p => {
    const link = document.getElementById(p.linkId);
    if(link) link.addEventListener('click', e => { e.preventDefault(); showPage(p.bodyId); });
  });

  showPage('body_one');

  // -------------------------
  // Dice roller
  // -------------------------
  function getStatModifier(stat){
    const map={ "Force":"str_value", "Grâce":"dex_value", "Charme":"charm_value", "Ingéniosité":"int_value" };
    return map[stat]? parseInt(document.getElementById(map[stat]).textContent)||0 : 0;
  }

  function getEquipModifier(stat){
    const prefixMap={ "Force":"str", "Grâce":"dex", "Charme":"charm", "Ingéniosité":"int" };
    const prefix = prefixMap[stat];
    if(!prefix) return 0;
    let sum = 0;
    for(let i=1;i<=20;i++){
      const type = document.getElementById(`equip${i}-type`);
      const value = document.getElementById(`equip${i}-value`);
      if(type && value && type.value.startsWith(prefix)) sum += parseInt(value.textContent)||0;
    }
    return sum;
  }

  function getWoundModifier(){
    const wound = document.getElementById("wound");
    return wound && wound.classList.contains("active") ? -1 : 0;
  }

  document.querySelector(".dice-throw").addEventListener("click",()=>{
    const stat = document.getElementById("dice-stat").value;
    const d1 = Math.floor(Math.random()*6)+1;
    const d2 = Math.floor(Math.random()*6)+1;
    const total = d1 + d2 + getStatModifier(stat) + getEquipModifier(stat) + getWoundModifier();
    document.querySelector(".dice-roll").textContent=`Lancer : ${d1} + ${d2} = ${d1+d2}`;
    document.querySelector(".dice-modifier").textContent=`Caractéristiques : ${getStatModifier(stat)}`;
    document.querySelector(".dice-equipment").textContent=`Equipement : ${getEquipModifier(stat)}`;
    document.querySelector(".dice-wound").textContent=`Blessure : ${getWoundModifier()}`;
    if(d1===1 && d2===1) document.querySelector(".dice-total").textContent="Epic fail !";
    else if(d1===6 && d2===6) document.querySelector(".dice-total").textContent="Epic win !";
    else document.querySelector(".dice-total").textContent=`Total : ${total}`;
  });

  // -------------------------
  // Counters (+/-)
  // -------------------------
  document.querySelectorAll(".counter_button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const stat = btn.id.replace(/^(increase_|decrease_)/,"");
      const counter = document.getElementById(stat+"_value");
      if(!counter) return;
      let value = parseInt(counter.textContent)||0;
      value = btn.id.startsWith("increase") ? value+1 : value-1;
      counter.textContent = value;
      counter.dispatchEvent(new Event('input'));
    });
  });

  // -------------------------
  // Status containers
  // -------------------------
  document.querySelectorAll(".status_container").forEach(container=>{
    const textEl = container.querySelector(".status_text");
    container.addEventListener("click",()=>{
      const active = container.classList.toggle("active");
      textEl.textContent = active ? "Blessé !" : "";
      container.dispatchEvent(new Event('change'));
    });
  });

  // -------------------------
  // Helper: create input with clear
  // -------------------------
  function createInputWithClear(container,idPrefix,index,labelText,clearClass){
    const div = document.createElement("div");
    div.className="input";
    const label = document.createElement("label");
    label.className="input_label";
    label.textContent=`${labelText} ${index}`;
    const input = document.createElement("input");
    input.type="text";
    input.id=`${idPrefix}${index}`;
    input.className=clearClass==="clear_titles"?"titles_input_field":"bc_input_field";
    const clear = document.createElement("span");
    clear.className=clearClass;
    clear.textContent="✖";
    clear.dataset.target=input.id;
    clear.addEventListener("click",()=>{
      input.value="";
      input.dispatchEvent(new Event('input'));
    });
    div.append(label,input,clear);
    container.appendChild(div);
  }

  // -------------------------
  // Equipment generation
  // -------------------------
  const equipmentContainer=document.getElementById("equipment");
  const effects=[{value:"none",label:"Aucun effet"},{value:"str",label:"Force"},{value:"dex",label:"Grâce"},{value:"charm",label:"Charme"},{value:"int",label:"Ingéniosité"}];

  for(let i=1;i<=20;i++){
    const inputDiv=document.createElement("div");
    inputDiv.className="input span-two-columns";
    const label=document.createElement("label"); label.className="input_label"; label.textContent=`N° ${i}`;
    const input=document.createElement("input"); input.type="text"; input.className="input_field"; input.id=`equip${i}`;
    inputDiv.append(label,input); equipmentContainer.appendChild(inputDiv);

    const selectDiv=document.createElement("div");
    selectDiv.className="input span-two-columns";
    const select=document.createElement("select"); select.className="select_modfield"; select.id=`equip${i}-type`;
    effects.forEach(effect=>{ const option=document.createElement("option"); option.value=`${effect.value}${i}-mod`; option.textContent=effect.label; select.appendChild(option); });
    const valueSpan=document.createElement("span"); valueSpan.className="equip_value"; valueSpan.id=`equip${i}-value`; valueSpan.textContent="0";
    const increaseBtn=document.createElement("span"); increaseBtn.className="equip_button"; increaseBtn.textContent="+"; increaseBtn.addEventListener("click",()=>{valueSpan.textContent=parseInt(valueSpan.textContent,10)+1; valueSpan.dispatchEvent(new Event('input'));});
    const decreaseBtn=document.createElement("span"); decreaseBtn.className="equip_button"; decreaseBtn.textContent="-"; decreaseBtn.addEventListener("click",()=>{valueSpan.textContent=parseInt(valueSpan.textContent,10)-1; valueSpan.dispatchEvent(new Event('input'));});
    selectDiv.append(select,valueSpan,increaseBtn,decreaseBtn);
    equipmentContainer.appendChild(selectDiv);
  }

  // -------------------------
  // Boons, Curses, Titles
  // -------------------------
  const boonContainer=document.getElementById('boons'); for(let i=1;i<=3;i++) createInputWithClear(boonContainer,"boon",i,"Bénédiction","clear_bc");
  const cursesContainer=document.getElementById('curses'); for(let i=1;i<=10;i++) createInputWithClear(cursesContainer,"curse",i,"Malédiction","clear_bc");
  const titlesContainer=document.getElementById("titles"); for(let i=1;i<=6;i++) createInputWithClear(titlesContainer,"titles_",i,"Titre","clear_titles");

  // -------------------------
  // Notos/Hadès codes
  // -------------------------
  const notosCodes=["Oasis","Obligation","Ocre","Ode","Odieux","Oedipe","Oeillade","Offre","Oiseau","Okra","Oléolat","Oliphant","Onéreux","Opposé","Optique","Oquassa","Oracle","Orage","Ordalie","Orgueil","Ormeau","Otus","Ovation","Ovibos","Ozone"];
  const hadesCodes=["Nadir","Napalm","Natron","Nature","Nauséabond","Nautile","Navarin","Navrant","Néant","Néfaste","Négation","Négoce","Némésis","Nenni","Néo-Apollon","Néo-Arès","Néo-Artémis","Néo-Athéna","Néophyte","Nerveux","Neurones","Neutralisation","Neveu","Nickel","Nid","Nihilisme","Nimbe","Nirvana","Noble","Nocif","Nom","Nomade","Nonchalant","Nouilles","Nounou","Nourricier","Nourrisson","Nouveauté","Nuisible","Nuit","Nullification","Nullité","Nuque"];

  function buildCheckboxes(containerId,codes,prefix){const container=document.getElementById(containerId);codes.forEach((code,index)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.id=`${prefix}${index+1}`;const text=document.createElement('span');text.textContent=code;label.appendChild(input);label.appendChild(text);container.appendChild(label);});}
  buildCheckboxes('notos-codes',notosCodes,'cn'); buildCheckboxes('hades-codes',hadesCodes,'ch');

  // -------------------------
  // Autosave
  // -------------------------
  function attachAutosave(el){
    if(!el.id) return;
    const key=el.id;
    const saved=localStorage.getItem(key);
    if(saved!==null){
      if(el.type==="checkbox") el.checked=saved==="true";
      else el.value=saved;
      if(el.classList.contains("counter")) el.textContent=saved;
    }
    const save=()=>{ if(el.type==="checkbox") localStorage.setItem(key,el.checked); else localStorage.setItem(key,el.value||el.textContent); };
    el.addEventListener("input",save); el.addEventListener("change",save);
    if(el.classList.contains("counter")) new MutationObserver(save).observe(el,{childList:true});
  }

  document.querySelectorAll("input,textarea,select,.counter").forEach(attachAutosave);
  document.querySelectorAll(".status_container").forEach(container=>{
    const textEl=container.querySelector(".status_text");
    const keyActive=container.id+"_active"; const keyText=container.id+"_text";
    if(localStorage.getItem(keyActive)==="true") container.classList.add("active");
    textEl.textContent=localStorage.getItem(keyText)||"";
    const save=()=>{localStorage.setItem(keyActive,container.classList.contains("active")); localStorage.setItem(keyText,textEl.textContent);};
    new MutationObserver(save).observe(textEl,{childList:true});
    container.addEventListener("click",save);
  });

});

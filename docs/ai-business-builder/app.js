const roles = [
  "CEO Synth",
  "Growth Hacker",
  "Product Architect",
  "Client Success",
  "Finance Copilot",
  "Market Scout"
];

const tickets = [
  { title: "Launch niche offer funnel", priority: "P1", status: "Queued" },
  { title: "Refactor onboarding copy", priority: "P2", status: "Building" },
  { title: "Analyze CAC drift", priority: "P1", status: "Research" }
];

const schedule = [
  "08:00 Discovery",
  "10:00 Prototype",
  "12:00 Outreach",
  "14:00 Build Sprint",
  "16:00 Review",
  "18:00 Ship"
];

const state = {
  level: 1,
  throughput: 0,
  resolved: 0,
  focus: 74,
  autoResearch: true,
  scheduler: true
};

const el = {
  level: document.querySelector("#levelValue"),
  throughput: document.querySelector("#throughputValue"),
  focus: document.querySelector("#focusValue"),
  resolved: document.querySelector("#resolvedValue"),
  spawnTicketBtn: document.querySelector("#spawnTicketBtn"),
  optimizeBtn: document.querySelector("#optimizeBtn"),
  ticketList: document.querySelector("#ticketList"),
  agentCards: document.querySelector("#agentCards"),
  scheduleRail: document.querySelector("#scheduleRail"),
  builderLog: document.querySelector("#builderLog"),
  focusSlider: document.querySelector("#focusSlider"),
  autoResearchToggle: document.querySelector("#autoResearchToggle"),
  schedulerToggle: document.querySelector("#schedulerToggle")
};

function renderTickets() {
  el.ticketList.innerHTML = "";
  tickets.forEach((ticket) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${ticket.priority} · ${ticket.title}</span><strong>${ticket.status}</strong>`;
    el.ticketList.appendChild(li);
  });
}

function renderAgents() {
  el.agentCards.innerHTML = "";
  roles.forEach((role, idx) => {
    const card = document.createElement("div");
    card.className = "agent-card";
    const fit = Math.round(83 + Math.sin(idx + state.focus / 20) * 12);
    card.innerHTML = `<div><b>${role}</b></div><small>GStack fit: ${fit}%</small>`;
    el.agentCards.appendChild(card);
  });
}

function renderSchedule() {
  el.scheduleRail.innerHTML = "";
  schedule.forEach((slot, index) => {
    const div = document.createElement("div");
    div.className = "slot";
    div.textContent = slot;
    if (state.scheduler && index === (state.throughput / 5) % schedule.length) {
      div.style.borderColor = "#46e49a";
      div.style.boxShadow = "0 0 0 1px #46e49a";
    }
    el.scheduleRail.appendChild(div);
  });
}

function log(message) {
  const item = document.createElement("p");
  item.textContent = message;
  el.builderLog.prepend(item);
  while (el.builderLog.children.length > 8) {
    el.builderLog.lastElementChild?.remove();
  }
}

function syncStats() {
  el.level.textContent = String(state.level);
  el.throughput.textContent = String(state.throughput);
  el.focus.textContent = String(state.focus);
  el.resolved.textContent = String(state.resolved);
}

function spawnTicket() {
  const seed = Math.floor(Math.random() * 999);
  tickets.unshift({
    title: `Client expansion plan #${seed}`,
    priority: Math.random() > 0.5 ? "P1" : "P2",
    status: "Queued"
  });
  state.throughput += 3;
  log("Paperclip queued a new strategic ticket.");
  renderTickets();
  syncStats();
}

function optimizeSweep() {
  state.level += 1;
  state.throughput += 9;
  state.resolved += 2;
  if (tickets.length > 2) {
    tickets.pop();
  }
  if (state.autoResearch) {
    state.focus = Math.min(100, state.focus + 4);
    el.focusSlider.value = String(state.focus);
    log("AutoResearch loop suggested prompt/edit upgrades for all builders.");
  } else {
    log("Optimization run completed with manual strategy mode.");
  }
  renderTickets();
  renderAgents();
  renderSchedule();
  syncStats();
}

el.spawnTicketBtn.addEventListener("click", spawnTicket);
el.optimizeBtn.addEventListener("click", optimizeSweep);
el.focusSlider.addEventListener("input", (event) => {
  state.focus = Number(event.target.value);
  renderAgents();
  syncStats();
  log(`Focus setter tuned to ${state.focus}.`);
});

el.autoResearchToggle.addEventListener("change", (event) => {
  state.autoResearch = event.target.checked;
  log(`AutoResearch ${state.autoResearch ? "enabled" : "disabled"}.`);
});

el.schedulerToggle.addEventListener("change", (event) => {
  state.scheduler = event.target.checked;
  renderSchedule();
  log(`Autonomous scheduler ${state.scheduler ? "enabled" : "disabled"}.`);
});

function backgroundLoop() {
  state.throughput += 1;
  if (state.throughput % 7 === 0) {
    state.resolved += 1;
    log("Continuous builder shipped a deployable increment.");
  }
  renderSchedule();
  syncStats();
}

setInterval(backgroundLoop, 4000);

/** 2.5D swarm visualizer **/
const canvas = document.querySelector("#swarmCanvas");
const ctx = canvas.getContext("2d");
let pointerDown = false;
let yaw = 0;

const swarm = Array.from({ length: 16 }, (_, i) => ({
  radius: 80 + (i % 4) * 26,
  angle: i * (Math.PI / 8),
  speed: 0.004 + (i % 5) * 0.001,
  z: Math.sin(i) * 50,
  color: i % 2 ? "#52d1ff" : "#9a7bff"
}));

canvas.addEventListener("pointerdown", () => (pointerDown = true));
canvas.addEventListener("pointerup", () => (pointerDown = false));
canvas.addEventListener("pointerleave", () => (pointerDown = false));
canvas.addEventListener("pointermove", (event) => {
  if (!pointerDown) return;
  yaw += event.movementX * 0.01;
});

function drawSwarm() {
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // HQ core
  const cx = width / 2;
  const cy = height / 2;
  const grad = ctx.createRadialGradient(cx, cy, 6, cx, cy, 80);
  grad.addColorStop(0, "rgba(82, 209, 255, 0.95)");
  grad.addColorStop(1, "rgba(82, 209, 255, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.fill();

  swarm.forEach((agent) => {
    agent.angle += agent.speed;
    const x3 = Math.cos(agent.angle + yaw) * agent.radius;
    const y3 = Math.sin(agent.angle) * 34;
    const z3 = Math.sin(agent.angle + yaw) * agent.radius + agent.z;
    const scale = (z3 + 220) / 420;

    const x = cx + x3;
    const y = cy + y3;
    const r = Math.max(2, 9 * scale);

    ctx.strokeStyle = "rgba(169, 182, 222, 0.2)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = agent.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = agent.color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
  requestAnimationFrame(drawSwarm);
}

renderTickets();
renderAgents();
renderSchedule();
syncStats();
log("System booted: Paperclip orchestration online.");
log("GStack mapped optimal business identity graph.");
log("Continuous builder cycle initialized.");
requestAnimationFrame(drawSwarm);

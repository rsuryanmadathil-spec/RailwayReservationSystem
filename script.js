
const MAX_CONFIRMED = 3;
const MAX_WAITING = 5;
const STORAGE_KEY = "railease_reservation_data";

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const data = JSON.parse(saved);

            if (
                Array.isArray(data.confirmed) &&
                Array.isArray(data.waiting) &&
                Array.isArray(data.cancelled) &&
                Number.isInteger(data.nextId) &&
                data.nextId >= 1001 &&
                data.confirmed.length <= MAX_CONFIRMED &&
                data.waiting.length <= MAX_WAITING
            ) {
                return data;
            }
        }
    } catch (error) {
        console.warn("Could not load saved reservations.", error);
    }

    return {
        confirmed: [],
        waiting: [],
        cancelled: [],
        nextId: 1001
    };
}

let data = loadData();

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        showToast("Unable to save data. Browser storage may be full.");
        return false;
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function findActiveTicket(id) {
    let passenger = data.confirmed.find(p => p.ticketId === id);

    if (passenger) {
        return { passenger, status: "Confirmed" };
    }

    passenger = data.waiting.find(p => p.ticketId === id);

    if (passenger) {
        return { passenger, status: "Waiting" };
    }

    return null;
}

function renderStats() {
    document.getElementById("confirmedCount").textContent =
        data.confirmed.length;

    document.getElementById("waitingCount").textContent =
        data.waiting.length;

    document.getElementById("availableCount").textContent =
        MAX_CONFIRMED - data.confirmed.length;

    document.getElementById("cancelledCount").textContent =
        data.cancelled.length;

    document.getElementById("confirmedPill").textContent =
        `${data.confirmed.length} passengers`;

    document.getElementById("waitingPill").textContent =
        `${data.waiting.length} waiting`;

    document.getElementById("cancelledPill").textContent =
        `${data.cancelled.length} records`;

    document.getElementById("capacityText").textContent =
        `${data.confirmed.length} / ${MAX_CONFIRMED}`;

    document.getElementById("capacityFill").style.width =
        `${data.confirmed.length / MAX_CONFIRMED * 100}%`;
}

function renderConfirmed() {
    const table = document.getElementById("confirmedTable");
    const empty = document.getElementById("confirmedEmpty");

    table.innerHTML = data.confirmed.map(p => `
        <tr>
            <td>${p.ticketId}</td>
            <td><strong>${escapeHTML(p.name)}</strong></td>
            <td>${p.age}</td>
            <td>${escapeHTML(p.source)} → ${escapeHTML(p.destination)}</td>
            <td><span class="badge badge-confirmed">Confirmed</span></td>
            <td>
                <button class="action-btn"
                    data-cancel-id="${p.ticketId}">Cancel</button>
            </td>
        </tr>
    `).join("");

    empty.hidden = data.confirmed.length > 0;
}

function renderWaiting() {
    const table = document.getElementById("waitingTable");
    const empty = document.getElementById("waitingEmpty");

    table.innerHTML = data.waiting.map((p, index) => `
        <tr>
            <td>${p.ticketId}</td>
            <td><strong>${escapeHTML(p.name)}</strong></td>
            <td>${p.age}</td>
            <td>${escapeHTML(p.source)} → ${escapeHTML(p.destination)}</td>
            <td>
                <span class="badge badge-waiting">
                    Waiting #${index + 1}
                </span>
            </td>
            <td>
                <button class="action-btn"
                    data-cancel-id="${p.ticketId}">Cancel</button>
            </td>
        </tr>
    `).join("");

    empty.hidden = data.waiting.length > 0;
}

function renderCancelled() {
    const list = document.getElementById("cancelledList");
    const empty = document.getElementById("cancelledEmpty");

    list.innerHTML = data.cancelled.map(p => `
        <div class="cancelled-item">
            <div>
                <strong>${escapeHTML(p.name)} · Ticket ${p.ticketId}</strong>
                <small>
                    ${escapeHTML(p.source)} → ${escapeHTML(p.destination)}
                </small>
            </div>
            <span class="badge badge-cancelled">Cancelled</span>
        </div>
    `).join("");

    empty.hidden = data.cancelled.length > 0;
}

function renderAll() {
    renderStats();
    renderConfirmed();
    renderWaiting();
    renderCancelled();
}

document.getElementById("bookingForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("passengerName").value.trim();
    const age = Number(document.getElementById("passengerAge").value);
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();

    if (!name || !source || !destination) {
        showToast("Please fill in all fields.");
        return;
    }

    if (!Number.isInteger(age) || age < 1 || age > 120) {
        showToast("Enter a valid age between 1 and 120.");
        return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
        showToast("Source and destination must be different.");
        return;
    }

    if (
        data.confirmed.length >= MAX_CONFIRMED &&
        data.waiting.length >= MAX_WAITING
    ) {
        showToast("Train and waiting list are full.");
        return;
    }

    const passenger = {
        ticketId: data.nextId,
        name,
        age,
        source,
        destination,
        bookedAt: new Date().toISOString()
    };

    if (data.confirmed.length < MAX_CONFIRMED) {
        data.confirmed.push(passenger);
    } else {
        data.waiting.push(passenger);
    }

    data.nextId++;

    if (!saveData()) {
        data.nextId--;
        if (data.confirmed.includes(passenger)) {
            data.confirmed.pop();
        } else {
            data.waiting.pop();
        }
        return;
    }

    renderAll();
    event.target.reset();

    if (findActiveTicket(passenger.ticketId).status === "Confirmed") {
        showToast(`Ticket ${passenger.ticketId} confirmed successfully!`);
    } else {
        showToast(`Ticket ${passenger.ticketId} added to the waiting list.`);
    }
});

function cancelTicket(id) {
    const confirmedIndex = data.confirmed.findIndex(p => p.ticketId === id);
    const waitingIndex = data.waiting.findIndex(p => p.ticketId === id);

    let passenger;
    let promoted = null;

    if (confirmedIndex !== -1) {
        passenger = data.confirmed[confirmedIndex];
        data.confirmed.splice(confirmedIndex, 1);

        if (data.waiting.length > 0) {
            promoted = data.waiting.shift();
            data.confirmed.push(promoted);
        }
    } else if (waitingIndex !== -1) {
        passenger = data.waiting[waitingIndex];
        data.waiting.splice(waitingIndex, 1);
    } else {
        showToast("Ticket not found.");
        return;
    }

    data.cancelled.unshift(passenger);

    if (!saveData()) {
        data.cancelled.shift();

        if (promoted) {
            data.confirmed.pop();
            data.waiting.unshift(promoted);
        }

        if (confirmedIndex !== -1) {
            data.confirmed.splice(confirmedIndex, 0, passenger);
        } else {
            data.waiting.splice(waitingIndex, 0, passenger);
        }

        renderAll();
        return;
    }

    renderAll();

    if (promoted) {
        showToast(
            `Ticket cancelled. ${promoted.name} is now confirmed!`
        );
    } else {
        showToast(`Ticket ${id} cancelled successfully.`);
    }

    document.getElementById("searchResult").textContent =
        "Search for a ticket to see its current status.";
    document.getElementById("searchResult").classList.add("empty-state");
}

document.addEventListener("click", event => {
    const button = event.target.closest("[data-cancel-id]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.cancelId);
    const record = findActiveTicket(id);

    if (!record) {
        showToast("Ticket not found.");
        return;
    }

    if (confirm(`Cancel ticket ${id} for ${record.passenger.name}?`)) {
        cancelTicket(id);
    }
});

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();

    const id = Number(document.getElementById("searchId").value);
    const result = document.getElementById("searchResult");

    if (!Number.isSafeInteger(id) || id < 1001) {
        showToast("Enter a valid ticket ID.");
        return;
    }

    const active = findActiveTicket(id);

    if (active) {
        const p = active.passenger;
        const isConfirmed = active.status === "Confirmed";

        result.classList.remove("empty-state");
        result.innerHTML = `
            <div class="result-line">
                <span>Ticket ID</span><strong>${p.ticketId}</strong>
            </div>
            <div class="result-line">
                <span>Passenger</span><strong>${escapeHTML(p.name)}</strong>
            </div>
            <div class="result-line">
                <span>Journey</span>
                <strong>${escapeHTML(p.source)} → ${escapeHTML(p.destination)}</strong>
            </div>
            <div class="result-line">
                <span>Status</span>
                <span class="badge ${isConfirmed ? "badge-confirmed" : "badge-waiting"}">
                    ${active.status}
                </span>
            </div>
        `;
        return;
    }

    const cancelled = data.cancelled.find(p => p.ticketId === id);

    result.classList.remove("empty-state");

    if (cancelled) {
        result.innerHTML = `
            <div class="result-line">
                <span>Ticket ID</span><strong>${cancelled.ticketId}</strong>
            </div>
            <div class="result-line">
                <span>Passenger</span><strong>${escapeHTML(cancelled.name)}</strong>
            </div>
            <div class="result-line">
                <span>Status</span>
                <span class="badge badge-cancelled">Cancelled</span>
            </div>
        `;
    } else {
        result.textContent = "No ticket found with this ID.";
    }
});

renderAll();

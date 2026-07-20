(() => {
  "use strict";

  const STORAGE_KEY = "anran-portfolio-access-v1";
  const PASSWORD_DIGEST =
    "22a2fa7d04248931a8853a7714b86546610afd01b2b1841890e979ba7ba6bcae";

  const digest = async (value) => {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  };

  const unlock = (gate) => {
    document.body.classList.remove("access-gate-active");
    for (const child of document.body.children) {
      if (child !== gate) {
        child.inert = false;
        child.removeAttribute("aria-hidden");
      }
    }
    gate.remove();
  };

  const showGate = () => {
    const gate = document.createElement("section");
    gate.className = "access-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "access-gate-title");
    gate.setAttribute("aria-describedby", "access-gate-description access-gate-error");
    gate.innerHTML = `
      <form class="access-gate__panel" data-access-form>
        <p class="access-gate__eyebrow">ANRAN ZHOU</p>
        <h1 id="access-gate-title">Private portfolio</h1>
        <p id="access-gate-description">Enter the access password to continue.</p>
        <label for="access-password">Password</label>
        <input id="access-password" type="password" autocomplete="current-password" required>
        <p id="access-gate-error" class="access-gate__error" role="status" aria-atomic="true" data-access-error></p>
        <button type="submit">Enter</button>
      </form>
    `;

    document.body.append(gate);
    document.body.classList.add("access-gate-active");
    for (const child of document.body.children) {
      if (child !== gate) {
        child.inert = true;
        child.setAttribute("aria-hidden", "true");
      }
    }

    const form = gate.querySelector("[data-access-form]");
    const input = gate.querySelector("#access-password");
    const error = gate.querySelector("[data-access-error]");
    input.focus();

    gate.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") {
        return;
      }
      const focusable = [...gate.querySelectorAll("input, button")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.textContent = "";
      try {
        if ((await digest(input.value)) !== PASSWORD_DIGEST) {
          input.select();
          error.textContent = "Incorrect password. Please try again.";
          return;
        }
        localStorage.setItem(STORAGE_KEY, "granted");
        unlock(gate);
      } catch {
        error.textContent = "Password verification is unavailable in this browser.";
      }
    });
  };

  if (localStorage.getItem(STORAGE_KEY) !== "granted") {
    showGate();
  }
})();

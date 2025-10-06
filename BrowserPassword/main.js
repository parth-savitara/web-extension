document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const msg = document.getElementById("msg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        msg.textContent = "";
        msg.style.color = "";

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            msg.style.color = "#ffb4b4";
            msg.textContent = "Please fill in both username and password fields.";
            return;
        }

        // Send login attempt to background
        chrome.runtime.sendMessage({ type: "LOGIN_ATTEMPT", username, password }, (response) => {
            if (!response) {
                // no response (service worker may be unloading) — still attempt to close tab on success
                msg.style.color = "#ffb4b4";
                msg.textContent = "No response from background. Try again.";
                return;
            }

            if (response.ok && response.success) {
                msg.style.color = "#b5ffd1";
                msg.textContent = "Login successful. Continuing...";
                // The background will try to close this tab; as a fallback, close after a short delay
                setTimeout(() => { try { window.close(); } catch (e) { } }, 700);
            } else if (response.ok && response.closedWindow) {
                // window closed by background
            } else {
                msg.style.color = "#ffb4b4";
                msg.textContent = "Incorrect username or password. Closing window...";
                // fallback: try to close this window after a short delay
                setTimeout(() => { try { window.close(); } catch (e) { } }, 700);
            }
        });
    });
});

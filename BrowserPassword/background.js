// background.js
// Updated: persist saved credentials and auto-authenticate across browser restarts.
// WARNING: This demo stores plaintext credentials. Do NOT use in production.

const LOGIN_PAGE = "login.html";
const DEMO_USERNAME = "Parth";
const DEMO_PASSWORD = "Parth@123";

// Set this to true to use chrome.storage.sync (will sync to user's Google account if enabled).
// Set false to use chrome.storage.local (persists only in the profile).
const USE_SYNC = true;
const STORAGE = USE_SYNC ? chrome.storage.sync : chrome.storage.local;

/** promisified storage get */
function getStorage(keys) {
  return new Promise((resolve) => STORAGE.get(keys, resolve));
}

/** promisified storage set */
function setStorage(obj) {
  return new Promise((resolve) => STORAGE.set(obj, resolve));
}

/** open login page (preferably in a given windowId) */
async function openLoginInWindow(windowId = null) {
  const tabs = await new Promise((res) =>
    chrome.tabs.query({ url: chrome.runtime.getURL(LOGIN_PAGE) }, res)
  );
  if (tabs && tabs.length > 0) {
    const tab = tabs[0];
    try {
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
      return;
    } catch (e) {
      // fallback to creating a new tab
    }
  }

  const createProps = { url: chrome.runtime.getURL(LOGIN_PAGE), active: true };
  if (typeof windowId === "number") createProps.windowId = windowId;
  chrome.tabs.create(createProps, () => {});
}

/** Ensure login tab appears on new tab creation if not authenticated */
async function ensureLoginOnNewTab(tab) {
  const { authenticated } = await getStorage(["authenticated"]);
  if (authenticated) return;

  if (!tab || !tab.id) return;
  const loginUrl = chrome.runtime.getURL(LOGIN_PAGE);
  const tabUrl = tab.pendingUrl || tab.url || "";

  if (tabUrl.startsWith(loginUrl) || tabUrl.startsWith("chrome-extension://")) return;

  try {
    await chrome.tabs.update(tab.id, { url: loginUrl, active: true });
  } catch (e) {
    if (tab.windowId) openLoginInWindow(tab.windowId);
    else openLoginInWindow();
  }
}

/** Try auto-authenticate using savedCreds */
async function tryAutoAuthenticate() {
  const keys = ["authenticated", "savedCreds"];
  const result = await getStorage(keys);
  // If already authenticated, nothing to do
  if (result.authenticated === true) return true;

  const creds = result.savedCreds;
  if (!creds || !creds.username || !creds.password) return false;

  // For demo: compare saved creds to demo values.
  // In a real app you would verify with a server or validate a token.
  if (creds.username === DEMO_USERNAME && creds.password === DEMO_PASSWORD) {
    await setStorage({ authenticated: true });
    return true;
  }
  // saved creds exist but wrong -> do not auto-auth
  return false;
}

/** ensure on start: auto-authenticate or open login */
async function ensureAuthOnStart() {
  const auto = await tryAutoAuthenticate();
  if (!auto) {
    const { authenticated } = await getStorage(["authenticated"]);
    if (!authenticated) openLoginInWindow();
  }
}

// Listeners
chrome.runtime.onInstalled.addListener(() => {
  ensureAuthOnStart();
});
chrome.runtime.onStartup.addListener(() => {
  ensureAuthOnStart();
});

chrome.windows.onCreated.addListener(async (window) => {
  const { authenticated } = await getStorage(["authenticated"]);
  if (!authenticated) openLoginInWindow(window.id);
});

chrome.tabs.onCreated.addListener((tab) => {
  ensureLoginOnNewTab(tab);
});

// Messages from login page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (!message || !message.type) {
      sendResponse({ ok: false, reason: "no-message" });
      return;
    }

    if (message.type === "LOGIN_ATTEMPT") {
      const { username, password, remember } = message;
      // Demo credential check
      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        // mark authenticated
        await setStorage({ authenticated: true });

        // If user asked to be remembered, store credentials (in sync or local depending on USE_SYNC)
        if (remember) {
          await setStorage({ savedCreds: { username, password } });
        } else {
          // optionally remove savedCreds if present
          await setStorage({ savedCreds: null });
        }

        // close login tab if possible
        if (sender && sender.tab && sender.tab.id) {
          try {
            chrome.tabs.remove(sender.tab.id);
          } catch (e) {}
        }

        sendResponse({ ok: true, success: true });
      } else {
        // wrong credentials -> close window containing tab (best effort)
        if (sender && sender.tab && sender.tab.windowId) {
          try {
            chrome.windows.remove(sender.tab.windowId);
            sendResponse({ ok: true, closedWindow: true });
          } catch (e) {
            sendResponse({ ok: false, success: false, reason: "failed-to-close-window" });
          }
        } else {
          sendResponse({ ok: false, success: false });
        }
      }
      return;
    }

    if (message.type === "LOGOUT") {
      await setStorage({ authenticated: false, savedCreds: null });
      if (sender && sender.tab && sender.tab.windowId) {
        openLoginInWindow(sender.tab.windowId);
      } else {
        openLoginInWindow();
      }
      sendResponse({ ok: true });
      return;
    }

    sendResponse({ ok: false, reason: "unknown-type" });
  })();

  return true; // indicate async sendResponse
});

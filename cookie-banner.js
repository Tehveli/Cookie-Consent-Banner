class CookieBanner extends HTMLElement {
  static get observedAttributes() {
    return ["lang"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lang = this.getAttribute("lang") || "en";
    this._themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  }

  connectedCallback() {
    if (localStorage.getItem("cookiesAccepted") === "true") {
      return;
    }
    this.render(); // Initial render will call _applyTheme

    // Listen for system theme changes
    this._themeMediaQuery.addEventListener("change", this._handleThemeChange);
    console.log("System theme listener attached.");

    // Listen for localStorage changes
    window.addEventListener("storage", this._handleStorageChange);
    console.log("localStorage 'storage' listener attached.");
  }

  disconnectedCallback() {
    this._themeMediaQuery.removeEventListener(
      "change",
      this._handleThemeChange
    );
    window.removeEventListener("storage", this._handleStorageChange);
    console.log("Listeners removed.");
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "lang") {
      this.lang = newValue;
      if (
        this.isConnected &&
        localStorage.getItem("cookiesAccepted") !== "true"
      ) {
        this.render();
      }
    }
  }

  _handleThemeChange = () => {
    console.log("System theme changed.");
    if (
      localStorage.getItem("theme") === "system" ||
      !localStorage.getItem("theme")
    ) {
      this._applyTheme();
    }
  };

  _handleStorageChange = (event) => {
    console.log("localStorage changed:", event);
    if (event.key === "theme") {
      console.log("localStorage 'theme' key changed. Applying theme.");
      this._applyTheme();
    }
  };

  _applyTheme() {
    const bannerElement = this.shadowRoot.querySelector(".banner");
    if (!bannerElement) {
      console.warn("Banner element not found in shadow DOM.");
      return;
    }

    const storedTheme = localStorage.getItem("theme");
    let useDarkTheme = false;

    if (storedTheme === "dark") {
      useDarkTheme = true;
    } else if (storedTheme === "light") {
      useDarkTheme = false;
    } else {
      useDarkTheme = this._themeMediaQuery.matches;
    }

    console.log(
      "Applying theme - storedTheme:",
      storedTheme,
      "useDarkTheme:",
      useDarkTheme
    );

    if (useDarkTheme) {
      bannerElement.classList.add("dark-theme");
    } else {
      bannerElement.classList.remove("dark-theme");
    }
  }

  render() {
    const translations = {
      en: {
        message: "We use cookies to improve your experience.",
        button: "Accept",
      },
      fr: {
        message: "Nous utilisons des cookies pour améliorer votre expérience.",
        button: "Accepter",
      },
      es: {
        message: "Usamos cookies para mejorar su experiencia.",
        button: "Aceptar",
      },
    };

    const t = translations[this.lang] || translations["en"];

    const styles = `
      :host {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 10000;
        font-family: system-ui, sans-serif;
        display: block;
      }

      .banner {
        background: #f9f9f9;
        color: #000;
        padding: 16px 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
        font-size: 1rem;
        animation: slideUp 0.3s ease-out;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      .banner.dark-theme {
        background: #222;
        color: #fff;
      }

      .message {
        flex: 1 1 auto;
        flex-direction: column;
        display: flex;
        min-width: 200px;
      }

      button {
        background: #000;
        color: #fff;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: transform 0.1s ease, background-color 0.3s ease, color 0.3s ease;
      }

      .banner.dark-theme button {
        background: #333;
        color: #fff;
      }

      button:active {
        transform: scale(0.98);
      }

      a {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
      }

      .banner.dark-theme a {
        color: #8ab4f8;
      }

      a:hover {
        text-decoration: underline;
      }

      .links {
        display: flex;
        gap: 10px;
        flex-direction: row;
        margin-top: 4px;
      }

      @media (max-width: 600px) {
        .banner {
          flex-direction: column;
          align-items: flex-start;
          padding: 12px 16px;
          font-size: 0.95rem;
        }

        button {
          align-self: stretch;
          width: 100%;
          margin-top: 10px;
        }
      }

      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="banner">
        <div class="message">
          ${t.message}
         <div class="links">
          <a href="https://www.tehveli.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a href="https://www.tehveli.com/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
          </div>
        </div>
        <button id="accept">${t.button}</button>
      </div>
    `;

    this.shadowRoot.getElementById("accept").onclick = () => {
      localStorage.setItem("cookiesAccepted", "true");
      this.remove();
    };

    this._applyTheme(); // Apply theme on initial render
  }
}

customElements.define("cookie-banner", CookieBanner);

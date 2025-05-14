class CookieBanner extends HTMLElement {
  static get observedAttributes() {
    return ["lang"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lang = this.getAttribute("lang") || "en";
    this._themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Handler for system theme changes (prefers-color-scheme)
    this._systemThemeChangeHandler = () => {
      // Renamed for clarity
      // Only re-apply theme if local storage theme is not explicitly set
      if (localStorage.getItem("theme") === null) {
        this._applyTheme();
      }
    };

    // Handler for localStorage changes
    this._localStorageChangeHandler = (event) => {
      // Check if the 'theme' key was the one that changed,
      // or if localStorage was cleared (event.key would be null).
      if (event.key === "theme" || event.key === null) {
        this._applyTheme();
      }
    };
  }

  connectedCallback() {
    if (localStorage.getItem("cookiesAccepted") === "true") {
      return;
    }
    this.render(); // render() will now call _applyTheme()

    // Listen for system theme changes
    this._themeMediaQuery.addEventListener(
      "change",
      this._systemThemeChangeHandler
    );
    // Listen for localStorage changes
    window.addEventListener("storage", this._localStorageChangeHandler);
  }

  disconnectedCallback() {
    // Clean up event listeners when the element is removed
    this._themeMediaQuery.removeEventListener(
      "change",
      this._systemThemeChangeHandler
    );
    window.removeEventListener("storage", this._localStorageChangeHandler);
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

  _applyTheme() {
    const bannerElement = this.shadowRoot.querySelector(".banner");
    if (!bannerElement) {
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
        background: #f9f9f9; /* Light theme default */
        color: #000; /* Light theme default */
        padding: 16px 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
        font-size: 1rem;
        animation: slideUp 0.3s ease-out;
        transition: background-color 0.3s ease, color 0.3s ease; /* Smooth theme transition */
      }

      .banner.dark-theme {
        background: #222; /* User's original dark background */
        color: #fff;   /* User's original dark text color */
      }

      .message {
        flex: 1 1 auto;
        flex-direction: column;
        display: flex;
        min-width: 200px;
      }

      button {
        background: #000; /* Light theme default */
        color: #fff;   /* Light theme default */
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: transform 0.1s ease, background-color 0.3s ease, color 0.3s ease;
      }

      .banner.dark-theme button {
        background: #333; /* Slightly different from banner for better affordance */
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

    this._applyTheme();
  }
}

customElements.define("cookie-banner", CookieBanner);

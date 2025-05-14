class CookieBanner extends HTMLElement {
  static get observedAttributes() {
    return ["lang"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lang = this.getAttribute("lang") || "en";
    this._themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    // Define the handler function once and bind it if necessary, or use an arrow function
    this._themeChangeHandler = () => {
      // Only re-apply theme if local storage theme is not set
      if (localStorage.getItem("theme") === null) {
        // Check specifically for null or undefined
        this._applyTheme();
      }
    };
  }

  connectedCallback() {
    if (localStorage.getItem("cookiesAccepted") === "true") {
      // If cookies are already accepted, no need to show the banner or attach listeners
      return;
    }
    this.render(); // render() will now call _applyTheme()
    this._themeMediaQuery.addEventListener("change", this._themeChangeHandler);
  }

  disconnectedCallback() {
    // Clean up the media query listener when the element is removed
    this._themeMediaQuery.removeEventListener(
      "change",
      this._themeChangeHandler
    );
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "lang") {
      this.lang = newValue;
      // Only re-render if the banner is actually connected and visible
      if (
        this.isConnected &&
        localStorage.getItem("cookiesAccepted") !== "true"
      ) {
        this.render(); // render() will now call _applyTheme()
      }
    }
  }

  _applyTheme() {
    const bannerElement = this.shadowRoot.querySelector(".banner");
    if (!bannerElement) {
      // This can happen if _applyTheme is called before render completes or if element is not found
      return;
    }

    const storedTheme = localStorage.getItem("theme"); // Expected: 'dark', 'light', or null

    let useDarkTheme = false;

    if (storedTheme === "dark") {
      useDarkTheme = true;
    } else if (storedTheme === "light") {
      useDarkTheme = false;
    } else {
      // No theme in local storage, use system preference
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

      /* Dark theme styles applied via .dark-theme class */
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

      /* Button styles for dark theme */

      .banner.dark-theme button {
        background: #333; /* Slightly different from banner for better affordance */
        color: #fff;
            }

      button:active {
        transform: scale(0.98);
      }

      a {
        color: inherit; /* This will make links inherit color from .banner or .banner.dark-theme */
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
        margin-top: 4px; /* Add some space above links */
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
          margin-top: 10px; /* Add space between message/links and button on mobile */
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
      this.remove(); // This will trigger disconnectedCallback
    };

    // Apply the theme after the DOM is constructed
    this._applyTheme();
  }
}

customElements.define("cookie-banner", CookieBanner);

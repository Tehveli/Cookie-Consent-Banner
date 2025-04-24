class CookieBanner extends HTMLElement {
  static get observedAttributes() {
    return ["lang", "theme"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lang = this.getAttribute("lang") || "en";
  }

  connectedCallback() {
    if (localStorage.getItem("cookiesAccepted") === "true") return;
    this.render();
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "lang") this.lang = newValue;
    this.render();
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

        @media (prefers-dark-interface) { 
          background: #222;
          color: #fff;
        }

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
        transition: transform 0.1s ease;

          @media (prefers-dark-interface) { 
          background: #222;
          color: #fff;
        }
      }

      button:active {
        transform: scale(0.98);
      }

      a {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      .links {
        display: flex;
        gap: 10px;
        flex-direction: row;
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
  }
}

customElements.define("cookie-banner", CookieBanner);

class CookieBanner extends HTMLElement {
  static get observedAttributes() {
    return ["lang", "theme"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.lang = this.getAttribute("lang") || "en";
    this.theme = this.getAttribute("theme") || "light";
  }

  connectedCallback() {
    if (localStorage.getItem("cookiesAccepted") === "true") return;

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "lang") this.lang = newValue;
    if (name === "theme") this.theme = newValue;
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
      // Add more languages here
    };

    const t = translations[this.lang] || translations["en"];

    const styles = `
        :host {
          position: fixed;
          bottom: 0;
          width: 100%;
          z-index: 10000;
          font-family: sans-serif;
        }
        .banner {
          background: ${this.theme === "dark" ? "#222" : "#f9f9f9"};
          color: ${this.theme === "dark" ? "#fff" : "#000"};
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 -2px 6px rgba(0,0,0,0.1);
        }
        button {
          background: ${this.theme === "dark" ? "#fff" : "#000"};
          color: ${this.theme === "dark" ? "#000" : "#fff"};
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
      `;

    this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="banner">
          <div>${t.message}</div>
        <div>
            <a href="https://www.tehveli.com/privacy" target="_blank" style="margin-right: 10px; color: inherit; text-decoration: underline;">Privacy Policy</a>
            <a href="https://www.tehveli.com/terms" target="_blank" style="color: inherit; text-decoration: underline;">Terms and Conditions</a>
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

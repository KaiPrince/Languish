import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

@customElement('languish-app')
export class LanguishApp extends LitElement {
  @property()
  title = 'Languish';

  @property()
  translation: String | null = null;

  @property()
  targetLang: String = 'fr';

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--languish-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  render() {
    return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>
        <p>The worst way to learn a language.</p>

        <textarea cols="30" rows="10" @change=${this._translate}></textarea>
        ${this.translation == null
          ? html`<p>Translated text will appear here.</p>`
          : html`<p lang=${this.targetLang}>${this.translation}</p>`}
      </main>

      <p class="app-footer">
        Made with ♥️ by
        <strong>Kai Prince</strong>
      </p>
    `;
  }

  private async _translate(e: Event): Promise<void> {
    const text = (e.target as HTMLInputElement).value ?? '';

    const res = await fetch('your translation api here', {
      method: 'post',
      body: JSON.stringify({
        text,
        sourceLang: 'en',
        targetLang: 'fr',
      }),
    });
    const json = await res.json();
    this.translation = json.result;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'languish-app': LanguishApp;
  }
}

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import 'dotenv/config';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

const { TRANSLATION_URL } = process.env;

@customElement('languish-app')
export class LanguishApp extends LitElement {
  @property()
  title = 'Langu-ish';

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

    .translation-row {
      display: flex;
      flex-direction: row;
      gap: 30px;
      border: 2px solid white;
      border-radius: 5px;
    }
  `;

  render() {
    return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>
        <p>The worst way to learn a language.</p>

        <select @change=${this._handleLangChange}>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="sr">Serbian</option>
        </select>

        <div class="translation-row">
          <textarea cols="30" rows="10" @input=${this._handleInput}></textarea>
          ${this._translation == null
            ? html`<p>
                ${this._isLoading
                  ? 'Translation is loading...'
                  : 'Translated text will appear here.'}
              </p>`
            : html`<p lang=${this._targetLang}>${this._translation}</p>`}
        </div>

        <button
          @click=${this._translate}
          ?disabled=${!this._computeCanTranslate()}
        >
          Translate
        </button>

        <button @click=${this._speak} ?disabled=${!this._computeCanSpeak()}>
          Speak
        </button>
      </main>

      <p class="app-footer">
        Made with ♥️ by
        <strong>Kai Prince</strong>
      </p>
    `;
  }

  @state()
  private _translation: string | null = null;

  @state()
  private _targetLang: string = 'fr';

  @state()
  private _text: string = '';

  @state()
  private _isLoading: boolean = false;

  private _handleInput(e: Event) {
    const text = (e.target as HTMLInputElement).value ?? '';
    this._text = text;
  }

  private _handleLangChange(e: Event) {
    const text = (e.target as HTMLInputElement).value ?? '';
    this._targetLang = text;
  }

  private _computeCanTranslate(): boolean {
    return !!this._text.length;
  }

  private _computeCanSpeak(): boolean {
    return !!this._translation?.length;
  }

  private async _translate(): Promise<void> {
    if (!this._computeCanTranslate()) {
      return;
    }

    if (!TRANSLATION_URL) {
      return;
    }

    this._isLoading = true;

    try {
      const res = await fetch(TRANSLATION_URL, {
        method: 'post',
        body: JSON.stringify({
          text: this._text,
          sourceLang: 'en',
          targetLang: this._targetLang,
        }),
      });
      const json = await res.json();
      this._translation = json.result;
    } finally {
      this._isLoading = false;
    }
  }

  private async _speak() {
    if (!this._computeCanSpeak() || !this._translation) {
      return;
    }

    const text = this._translation;
    if (
      'speechSynthesis' in window &&
      window.speechSynthesis.getVoices().length
    ) {
      // Speech Synthesis supported

      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

      for await (const word of text.split(' ')) {
        const msg = new SpeechSynthesisUtterance(word);
        msg.lang = this._targetLang;
        window.speechSynthesis.speak(msg);

        await sleep(1000);
      }
    } else {
      // Speech Synthesis not supported
      this._translation = "Sorry, your browser doesn't support text to speech!";
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'languish-app': LanguishApp;
  }
}

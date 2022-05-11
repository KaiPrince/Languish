import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TRANSLATION_URL } from './const.js';

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
      /* max-width: 960px; */
      width: 100%;
      margin: 0 auto;
      text-align: center;
      background-color: var(--languish-app-background-color);
      font-family: 'Comic Sans MS';
    }

    main {
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
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

    .col {
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      flex-direction: row;
    }

    .speed {
      flex-basis: 4;
    }

    .language {
      flex-basis: 8;
    }

    .highlight-text {
      color: red;
    }

    .placeholder-text {
      color: grey;
    }
  `;

  render() {
    return html`
      <main>
        <div class="row">
          <div class="col">
            <h1 class="title">${this.title}</h1>
            <p>The world's worst way to learn a language.</p>
            <div id="spritz-source-lang" class="spritz-reader">
              T<span class="highlight-text">h</span>ey
            </div>
            <div id="spritz-target-lang" class="spritz-reader">
              El<span class="highlight-text">l</span>os
              ${this._translation == null
                ? html`<small class="placeholder-text">
                    ${this._isLoading
                      ? 'Translation is loading...'
                      : 'Translated text will appear here.'}
                  </small>`
                : html`<span lang=${this._targetLang}
                    >${this._translation}</span
                  >`}
            </div>
            <div class="row">
              <div class="speed">250 wpm</div>
              <div class="language">
                <select @change=${this._handleLangChange}>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="sr">Serbian</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col">
            <textarea
              cols="30"
              rows="10"
              @input=${this._handleInput}
              placeholder="Paste your text here"
            ></textarea>
          </div>
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

      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = this._targetLang;
      msg.rate = 0.5;
      window.speechSynthesis.speak(msg);
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

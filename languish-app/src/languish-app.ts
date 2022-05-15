/* eslint-disable import/extensions */
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { TRANSLATION_URL } from './const.js';
import './components/reading-speed';
import './components/language-picker';
import './components/word-viewer';

@customElement('languish-app')
export class LanguishApp extends LitElement {
  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin: 0 auto;
      text-align: center;
      font-family: 'Comic Sans MS';
    }

    main {
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5rem;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }

    .col {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .col-left {
      gap: 0.7rem;
      align-items: center;
    }

    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
    }

    .speed {
      flex: 4;
      justify-content: center;
    }

    .language {
      flex: 8;
    }

    .placeholder-text {
      color: grey;
    }

    .title {
      font-size: 5rem;
      margin: unset;
    }

    .subtitle {
      font-size: 1.5rem;
      margin-block-start: 0.5em;
    }

    .text-input {
      padding-top: 0.5rem;
    }

    .spritz-reader {
      height: 2em;
      font-size: 2rem;
    }

    .control {
      width: 80%;
    }

    .control-row {
      gap: 0.5rem;
    }

    .em {
      font-family: 'Curlz MT';
    }

    .invert-brightness {
      color: black;
      background-color: white;
      border: 4px solid orange;
      border-radius: 10px;
    }

    textarea {
      width: 100%;
      height: 100%;
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

  @state()
  private _translation: string | null = null;

  @state()
  private _targetLang: string = 'fr';

  @state()
  private _sourceLang: string = 'en';

  @state()
  private _text: string = '';

  @state()
  private _isLoading: boolean = false;

  render() {
    return html`
      <main>
        <div class="row">
          <div class="col col-left">
            <div>
              <h1 class="title">Langu<span class="em">ish</span></h1>
              <p class="subtitle">The world's worst way to learn a language.</p>
            </div>
            <div
              id="spritz-source-lang"
              class="spritz-reader invert-brightness control"
            >
              ${this._computeCanSpeak()
                ? html`<word-viewer
                    words="${ifDefined(
                      this._text === null ? undefined : this._text
                    )}"
                  ></word-viewer>`
                : html`<span class="placeholder-text">
                    Translation will appear here
                  </span>`}
            </div>
            <div
              id="spritz-target-lang"
              class="spritz-reader invert-brightness control"
            >
              ${this._computeCanSpeak()
                ? html`<word-viewer
                    words="${ifDefined(
                      this._translation === null ? undefined : this._translation
                    )}"
                  ></word-viewer>`
                : html`<span class="placeholder-text">
                    Translation will appear here
                  </span>`}
            </div>
            <div class="row control control-row">
              <div class="speed col invert-brightness">
                <reading-speed></reading-speed>
              </div>
              <div class="language col invert-brightness">
                <language-picker
                  value=${this._targetLang}
                  @onChange=${this._updateTargetLang}
                ></language-picker>
              </div>
            </div>
          </div>
          <div class="col text-input">
            <textarea
              class="invert-brightness"
              @input=${this._handleInput}
              placeholder="Paste your text here"
            ></textarea>
            <textarea
              class="invert-brightness"
              .value=${this._translation ?? ''}
              placeholder="Translation will appear here."
            ></textarea>
          </div>
        </div>

        <div>
          <language-picker
            value=${this._sourceLang}
            @onChange=${this._updateSourceLang}
          ></language-picker>
        </div>

        <button
          @click=${this._translate}
          ?disabled=${!this._computeCanTranslate()}
        >
          ${this._isLoading ? 'Loading...' : 'Translate'}
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

  private _handleInput(e: Event) {
    const text = (e.target as HTMLInputElement).value ?? '';
    this._text = text;
  }

  private _updateSourceLang(e: CustomEvent) {
    this._sourceLang = e.detail.value;
  }

  private _updateTargetLang(e: CustomEvent) {
    this._targetLang = e.detail.value;
  }

  private _computeCanTranslate(): boolean {
    return !!this._text.length && this._sourceLang !== this._targetLang;
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
          sourceLang: this._sourceLang,
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

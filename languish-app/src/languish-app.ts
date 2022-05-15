/* eslint-disable wc/guard-super-call */
/* eslint-disable import/extensions */
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TRANSLATION_URL } from './const.js';
import './components/reading-speed';
import './components/language-picker';
import './components/word-viewer';
import debounce from './utils/debounce.js';

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
      font-size: 1.1em;
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
  private _translation: string = 'Ellos voluntad pasta sus texto aquí';

  @state()
  private _targetLang: string = 'es';

  @state()
  private _sourceLang: string = 'en';

  @state()
  private _text: string = 'They will paste their text here';

  @state()
  private _isLoading: boolean = false;

  @state()
  private _isPlaying: boolean = false;

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
              class="spritz-reader invert-brightness control col"
            >
              <word-viewer
                words=${this._text}
                ?play=${this._isPlaying}
              ></word-viewer>

              <div class="row">
                <button
                  @click=${this._speak}
                  ?disabled=${!this._computeCanSpeak()}
                >
                  ${!this._isPlaying ? 'Play' : 'Stop'}
                </button>
              </div>
            </div>
            <div
              id="spritz-target-lang"
              class="spritz-reader invert-brightness control"
            >
              <word-viewer
                words=${this._translation}
                ?play=${this._isPlaying}
              ></word-viewer>
            </div>
            <div class="row control control-row">
              <div class="language col invert-brightness">
                <language-picker
                  value=${this._sourceLang}
                  @onChange=${this._updateSourceLang}
                ></language-picker>
              </div>
              <span>-></span>
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
              placeholder="They will paste their text here"
            ></textarea>
            <textarea
              class="invert-brightness"
              .value=${this._translation ?? ''}
              placeholder="Translation will appear here"
              readonly
            ></textarea>
          </div>
        </div>
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

    this._debouncedTranslate();
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

  private _debouncedTranslate = debounce(() => this._translate(), 500);

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
    } catch (e) {
      this._translation = 'Translation failed.';
    } finally {
      this._isLoading = false;
    }
  }

  private async _speak() {
    if (!this._computeCanSpeak() || !this._translation) {
      return;
    }

    this._isPlaying = !this._isPlaying;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'languish-app': LanguishApp;
  }
}

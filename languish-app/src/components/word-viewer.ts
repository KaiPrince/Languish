/* eslint-disable wc/guard-super-call */
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { SpeedReader } from '../utils/spritz.js';

@customElement('word-viewer')
export default class WordViewer extends LitElement {
  static styles = css`
    :host {
      text-align: start;
    }

    pre {
      padding: 0.2em;
    }

    .highlight {
      color: red;
    }
  `;

  @state()
  private idx = 0;

  @property()
  words = '';

  @property({ type: Boolean })
  play = false;

  private intervalTimer?: any;

  connectedCallback() {
    super.connectedCallback();
    this.intervalTimer = setInterval(this.tickToNextWord, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.intervalTimer);
    this.intervalTimer = undefined;
  }

  render() {
    return html`<pre>${unsafeHTML(this._computeWordHtml())}</pre>`;
  }

  tickToNextWord = () => {
    if (this.play) {
      this.idx += 1;
    }
  };

  private _computeWordHtml() {
    if (!this.words) {
      return '';
    }

    const splitWords = this.words.split(' ');
    const idx =
      ((this.idx % splitWords.length) + splitWords.length) % splitWords.length;
    const word = splitWords[idx];
    return SpeedReader.padAndHighlightWord(word);
  }
}

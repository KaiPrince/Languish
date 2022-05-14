import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('language-picker')
export default class LanguagePicker extends LitElement {
  @property()
  value: string = 'en';

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    .control {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 10px;
    }
  `;

  render() {
    return html`
      <select
        class="control"
        @change=${this._handleLangChange}
        .value=${this.value}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
        <option value="sr">Serbian</option>
      </select>
    `;
  }

  private _handleLangChange(e: Event) {
    const text = (e.target as HTMLInputElement).value ?? '';
    this.value = text;
    this.dispatchEvent(
      new CustomEvent('onChange', {
        detail: {
          value: text,
        },
        composed: true,
      })
    );
  }
}

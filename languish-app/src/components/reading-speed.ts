import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('reading-speed')
export default class ReadingSpeed extends LitElement {
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
      <select class="control">
        <option value="250">250 wpm</option>
      </select>
    `;
  }
}

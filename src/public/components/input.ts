export function inputComponent(text: string, placeholder: string, id: string) {
  const input = `
        <div class="button-component__container">
            <form>
              <label class="title-input">${text}</label>
              <br />
              <input class="input-component" id="${id}" name="${id}" placeholder="${placeholder}" />
            </form>
        </div>
    `;

  return input;
}

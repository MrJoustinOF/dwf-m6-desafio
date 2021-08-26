export function buttonComponent(text: string, id: string, clase: string) {
  const button = `
    <div class="button-component__container">
      <button class="button-component ${clase}" id="${id}">${text}</button>
    </div>
    `;
  return button;
}

export function addSelected(hand, el) {
  const tijeras = el.querySelector(".img-hand__tijeras");
  const piedra = el.querySelector(".img-hand__piedra");
  const papel = el.querySelector(".img-hand__papel");

  if (hand === "tijeras") {
    tijeras.classList.add("selected");
    tijeras.classList.remove("deselected");
    piedra.classList.add("deselected");
    piedra.classList.remove("selected");
    papel.classList.add("deselected");
    papel.classList.remove("selected");
  } else if (hand === "piedra") {
    tijeras.classList.add("deselected");
    tijeras.classList.remove("selected");
    piedra.classList.add("selected");
    piedra.classList.remove("deselected");
    papel.classList.add("deselected");
    papel.classList.remove("selected");
  } else if (hand === "papel") {
    tijeras.classList.add("deselected");
    tijeras.classList.remove("selected");
    piedra.classList.add("deselected");
    piedra.classList.remove("selected");
    papel.classList.add("selected");
    papel.classList.remove("deselected");
  }
}

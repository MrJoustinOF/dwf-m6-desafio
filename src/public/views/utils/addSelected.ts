export function addSelected(hand, el) {
  // export function addSelected(hand) {
  const tijeras = document.querySelector(".img-hand__tijeras");
  const piedra = document.querySelector(".img-hand__piedra");
  const papel = document.querySelector(".img-hand__papel");

  if (hand === "tijeras") {
    tijeras?.classList.add("selected");
    tijeras?.classList.remove("deselected");
    piedra?.classList.add("deselected");
    piedra?.classList.remove("selected");
    papel?.classList.add("deselected");
    papel?.classList.remove("selected");
  } else if (hand === "piedra") {
    tijeras?.classList.add("deselected");
    tijeras?.classList.remove("selected");
    piedra?.classList.add("selected");
    piedra?.classList.remove("deselected");
    papel?.classList.add("deselected");
    papel?.classList.remove("selected");
  } else if (hand === "papel") {
    tijeras?.classList.add("deselected");
    tijeras?.classList.remove("selected");
    piedra?.classList.add("deselected");
    piedra?.classList.remove("selected");
    papel?.classList.add("selected");
    papel?.classList.remove("deselected");
  }
}

export default function codeGen() {
  // Get the first two numbers
  let firstTwoNumbers = Math.round(Math.random() * 99).toString();
  firstTwoNumbers =
    firstTwoNumbers.length == 1 ? firstTwoNumbers + "0" : firstTwoNumbers;

  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  // Verify if it's 1 on upper
  let firsTverifyer = Math.floor(Math.random() * 2);
  let chars =
    firsTverifyer == 1
      ? alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase()
      : alphabet[Math.floor(Math.random() * alphabet.length)];

  let secondVerifyer = Math.floor(Math.random() * 2);
  chars =
    secondVerifyer == 1
      ? chars +
        alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase()
      : chars + alphabet[Math.floor(Math.random() * alphabet.length)];

  let lastTwoNumbers = Math.round(Math.random() * 99).toString();
  lastTwoNumbers =
    lastTwoNumbers.length == 1 ? lastTwoNumbers + "0" : lastTwoNumbers;

  // Add all the results
  const codeGetted = firstTwoNumbers + chars + lastTwoNumbers;
  return codeGetted;
}

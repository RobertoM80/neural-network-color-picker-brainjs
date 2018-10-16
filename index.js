// const brain = require("brain.js"); in case of using the library downloaded with npm ( is in that case a node lib not for browser)
var network = new brain.NeuralNetwork();
let colorPicker = document.getElementById("head");
let colorPickerVal = colorPicker.value;
let freeChoiceBox = "card-free-choice";
let cardDark = "card-dark";
let cardBright = "card-bright";
let trainerBoxes = ["card-dark", "card-bright"];
let showResultBtn = document.querySelector("button");
let showWithTrainig = false;
let allTraining = [];

let updateTextAfterTrainig = bgColorTest => {
  if (allTraining.length != 0) {
    var output = network.run(getRgb(bgColorTest));
    output.black > output.white ? (output = "black") : (output = "white");
    document.querySelector(".card-free-choice__text").style.color = output;
  }
};

let isInt = n => {
  return n % 1 === 0;
};

let getHex = (r, g, b) => {
  let componentToHex = c => {
    !isInt(c) ? (c = c * 2.55 * 100) : null;
    var hex = c.toString(16);
    let res = hex.length == 1 ? "0" + hex : hex;
    return res.split(".")[0];
  };

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

let getRgb = hex => {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Math.round(parseInt(result[1], 16) / 2.55) / 100,
        g: Math.round(parseInt(result[2], 16) / 2.55) / 100,
        b: Math.round(parseInt(result[3], 16) / 2.55) / 100
      }
    : null;
};

let randomHex = () => {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
};

let updateBoxColor = (element, bgColor, textColor) => {
  document.querySelector("." + element).style.background = bgColor;
  document.querySelector("." + element + "__text").style.color = textColor;
};

let updateColorInTrainigBoxes = () => {
  let newColor = randomHex();
  updateBoxColor(cardDark, newColor, "black");
  updateBoxColor(cardBright, newColor, "white");
};

let addTrainig = (input, output) => {
  let newTraining = { input, output };
  allTraining.push(newTraining);
};

showResultBtn.addEventListener("click", () => {
  showWithTrainig = !showWithTrainig;
  if (showWithTrainig === true) {
    showResultBtn.innerHTML = "Deactivate training";
    showResultBtn.classList.remove("btn-success");
    showResultBtn.classList.add("btn-warning");
  } else {
    showResultBtn.innerHTML = "Activate training";
    showResultBtn.classList.remove("btn-warning");
    showResultBtn.classList.add("btn-success");
  }
});

colorPicker.addEventListener("change", e => {
  let text = showWithTrainig
    ? updateTextAfterTrainig(e.currentTarget.value)
    : "white";

  document.querySelector(".card-free-choice").style.background =
    e.currentTarget.value;
});

let readifyRgb = rgb => {
  rgb = rgb
    .replace(/rgb\(|\)/g, "")
    .split(",")
    .map(item => parseInt(item));

  return { r: rgb[0], g: rgb[1], b: rgb[2] };
};

trainerBoxes.map(item => {
  document.querySelector("." + item).addEventListener("click", e => {
    let text = e.currentTarget.id === "card-dark" ? { black: 1 } : { white: 1 };
    let color = document.getElementById(e.currentTarget.id).style.background;
    color = color
      .replace(/rgb\(|\)/g, "")
      .split(",")
      .map(item => parseInt(item));

    network = new brain.NeuralNetwork();

    addTrainig(getRgb(getHex(...color)), text);

    network.train(allTraining);

    updateColorInTrainigBoxes();
  });
});

updateBoxColor(freeChoiceBox, colorPickerVal, "white");
updateColorInTrainigBoxes();

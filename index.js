const labels = document.querySelectorAll(".filters label");
const inputs = document.querySelectorAll(".filters input");
const outputs = document.querySelectorAll(".filters output");
const reset = document.querySelector(".btn-reset");
const download = document.querySelector(".btn-save");
const next = document.querySelector(".btn-next");
const image = document.querySelector(".img1");
const canvas = document.querySelector("canvas");

//fullscreen
document.querySelector(".fullscreen").addEventListener("click", toggleScreen);
function toggleScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.fullscreenEnabled) {
      document.exitFullscreen();
    }
  }
}

function handleUpdate(e) {
  outputs.forEach((output) => {
    if (output.name === e.target.name) {
      output.textContent = `${e.target.value}`;
    }
  });
  const suffix = this.dataset.sizing || "";
  document.documentElement.style.setProperty(
    `--${this.name}`,
    this.value + suffix
  );
}

inputs.forEach((input, index) => {
  input.addEventListener("input", handleUpdate);
});

reset.addEventListener("click", (e) => {
  inputs.forEach((input) => {
    const suffix = input.dataset.sizing || "";
    let val = input.getAttribute("value");
    input.value = val;
    document.documentElement.style.setProperty(`--${input.name}`, val + suffix);
  });
  outputs.forEach((output) => {
    if (output.name == "saturate") {
      output.value = 100;
    } else {
      output.value = 0;
    }
    output.textContent = output.value;
  });
});

drawImage("assets/img/img.jpg");

const beginUrl =
  "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const nextButton = document.querySelector(".btn-next");

function viewImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    image.src = src;
  };
}

let imgNumber = 1;
let imageSrc = "assets/img/img.jpg";

function getImage() {
  let time = "";
  const date = new Date();
  if (date.getHours() >= 6 && date.getHours() < 12) {
    time = "morning";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    time = "day";
  } else if (date.getHours() >= 18 && date.getHours() < 24) {
    time = "evening";
  } else if (date.getHours() >= 0 && date.getHours() < 6) {
    time = "night";
  }

  let displayNumber;

  if (imgNumber < 10) {
    displayNumber = "0" + imgNumber;
  } else {
    displayNumber = imgNumber;
  }
  imageSrc = `${beginUrl}${time}/${displayNumber}.jpg`;
  viewImage(imageSrc);
  imgNumber++;
  if (imgNumber > 20) {
    imgNumber = 1;
  }
  drawImage(imageSrc);
}

nextButton.addEventListener("click", () => {
  getImage();
  image.onload = () => {
    drawImage(imageSrc);
  };
});

const fileInput = document.querySelector('input[type="file"]');
const imageContainer = document.querySelector(".image");

fileInput.addEventListener("change", function (e) {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    imageSrc = reader.result;
    image.src = img.src;
    image.onload = () => {
      drawImage(image.src);
    };
  };
  reader.readAsDataURL(file);
  e.target.value = "";
});

function drawImage(imageSrc) {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.src = imageSrc;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
  };
}

download.addEventListener("click", function (e) {
  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.src = imageSrc;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.filter = `blur(${
      (outputs[0].innerText * (img.naturalHeight / image.height)
    }px) invert(${outputs[1].innerText}%) sepia(${
      outputs[2].innerText
    }%) saturate(${outputs[3].innerText}%) hue-rotate(${
      outputs[4].innerText
    }deg)`;
    ctx.drawImage(img, 0, 0);
    var link = document.createElement("a");
    link.download = "download.png";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  };
});

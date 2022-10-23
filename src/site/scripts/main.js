function initExplanation() {
  const possibleExplanations = [
    "Wahrlich Alberner Frittierter Lametta",
    "Wein-Amphoren-Fern-Logistik",
  ];

  const getRandomExplanation = () =>
    possibleExplanations[
      Math.floor(Math.random() * possibleExplanations.length)
    ];

  const setExplanation = (el, exp) => {
    el.textContent = exp;
    el.style.visibility = "visible";
  };

  const element = document.getElementById("explanation");
  if (!element) {
    return;
  }

  if (!window.sessionStorage) {
    setExplanation(element, getRandomExplanation());
  }

  const currentExplanationKey = "currentExplanation";
  let currentExplanation = window.sessionStorage.getItem(currentExplanationKey);
  if (!currentExplanation) {
    currentExplanation = getRandomExplanation();
    window.sessionStorage.setItem(currentExplanationKey, currentExplanation);
  }

  setExplanation(element, currentExplanation);
}

initExplanation();

xInput.addEventListener("change", () => checkInputs());
yInput.addEventListener("change", () => checkInputs());

function checkInputs() {
  if (
    yInput.value == null ||
    yInput.value == "" ||
    xInput.value == null ||
    xInput.value == ""
  ) {
    document.getElementById("anlegenSpeichern").disabled = true;
  } else {
    document.getElementById("anlegenSpeichern").disabled = false;
  }
}

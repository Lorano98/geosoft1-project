/**
 * Steuert das Collapseverhalten der navbar, da es nur mit Bootstrap nicht funktioniert hat.
 */
function collapse() {
  let button = document.getElementById("collButton");
  let navbarContent = document.getElementById("navbarSupportedContent");
  if (button.getAttribute("aria-expanded") == "true") {
    navbarContent.classList.remove("show");

    document.getElementById("collButton").setAttribute("aria-expanded", false);
    document.getElementById("collButton").classList.add("collapsed");
  } else {
    document.getElementById("collButton").setAttribute("aria-expanded", true);
    document.getElementById("collButton").classList.remove("collapsed");

    navbarContent.classList.add("show");
  }
}

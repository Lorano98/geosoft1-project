function collapse() {
  let button = document.getElementById("collButton");
  let navbarContent = document.getElementById("navbarSupportedContent");
  if (button.getAttribute("aria-expanded") == "true") {
  } else {
    document.getElementById("collButton").setAttribute("aria-expanded", true);
    document.getElementById("collButton").remove("collapsed");

    navbarContent.classList.remove("collapse");
    navbarContent.classList.add("collapsing");
    navbarContent.style = "height: 208px";
    setTimeout(function () {
      navbarContent.classList.remove("collapsing");
      navbarContent.classList.add("collapse");
      navbarContent.classList.add("show");
      navbarContent.style = "";
    }, 1000);
  }
}

(function() {
  const items = document.getElementsByClassName("item");
  const cardPage = document.getElementById("card-page");
  // should be calculated based on the scaling to match 8px
  // when the cardPage is downscaled to the item card size
  const borderRadiusCalc = "40px";

  for (const item of items) {
    item.addEventListener("click", createAnim(item));
  }

  var onTransitionEnd = function() {
    this.classList.remove("animate-on-transforms");
    this.removeEventListener("transitionend", onTransitionEnd);
  };

  function createAnim(el) {
    return function() {
      // Abort if during animation
      if (cardPage.classList.contains("animate-on-transforms")) return;
      cardPage.style.transform = "";
      cardPage.style.opacity = 1;
      // Get the origin position.
      var before = el.getBoundingClientRect();

      // Now set the element to the last position.
      cardPage.classList.add("open");
      // should be setup in some other way, like passing the class/type deciding the bg
      cardPage.style.background = window
        .getComputedStyle(el)
        .getPropertyValue("background");

      // Read again. This forces a sync layout, so be careful.
      var after = cardPage.getBoundingClientRect();

      // You can do this for other computed styles as well, if needed.
      // Just be sure to stick to compositor-only props like transform
      // and opacity where possible.
      var invertX = before.left - after.left;
      var invertY = before.top - after.top;

      var scaleX = before.width / after.width;
      var scaleY = before.height / after.height;

      // Invert.
      cardPage.style.transform = `translate3d(${invertX}px,${invertY}px, 0px) scale(${scaleX}, ${scaleY})`;
      cardPage.style.borderRadius = borderRadiusCalc;

      // Wait for the next frame so we know all the style changes have taken hold.
      requestAnimationFrame(function() {
        cardPage.classList.add("animate-on-transforms");
        // this removes the additional styles we just put on the
        // element to look like the origin
        // so it will animate to the end state
        cardPage.style.transform = "";
        cardPage.style.borderRadius = "";
      });

      // Capture the end with transitionend
      cardPage.addEventListener("transitionend", onTransitionEnd);
      cardPage.addEventListener("click", () => {
        cardPage.addEventListener("transitionend", onTransitionEnd);
        function removeOpen() {
          cardPage.classList.remove("open");
          cardPage.removeEventListener("transitionend", removeOpen);
        }
        cardPage.addEventListener("transitionend", removeOpen);
        cardPage.classList.add("animate-on-transforms");
        cardPage.style.transform = `translate3d(${invertX}px,${invertY}px, 0px) scale(${scaleX}, ${scaleY})`;
        cardPage.style.borderRadius = borderRadiusCalc;
      });
    };
  }
})();

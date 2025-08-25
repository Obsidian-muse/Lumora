document.addEventListener("DOMContentLoaded", () => {
  // Get theme from body tag or user preferences
  const currentTheme = document.body.getAttribute("data-theme") || "galaxy";

  // Trigger theme-based animations
  if (currentTheme === "galaxy") createGalaxyStars();
  if (currentTheme === "sakura") createSakuraPetals();
  if (currentTheme === "pastel") createPastelClouds();
  if (currentTheme === "forest") createForestWind();
  if (currentTheme === "neon") createNeonLights();

  // Placeholder for loading games dynamically
  const gameCards = document.querySelectorAll(".game-card");
  gameCards.forEach(card => {
    card.addEventListener("click", () => {
      const gameName = card.textContent.trim();
      alert(`Coming soon: ${gameName}!`);
      // Later, you can redirect or show modal: launchGame(gameName);
    });
  });
});

// Example animation function (for galaxy)
function createGalaxyStars() {
  const count = 50;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "galaxy-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    document.body.appendChild(star);
  }
}

// Add more animation functions like:
function createSakuraPetals() { /* your sakura code */ }
function createPastelClouds() { /* your pastel code */ }
function createForestWind() { /* your forest code */ }
function createNeonLights() { /* your neon code */ }

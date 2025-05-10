function toggleDisclaimer() {
  const disclaimer = document.getElementById('disclaimer');
  disclaimer.style.display = (disclaimer.style.display === 'none' || disclaimer.style.display === '') ? 'block' : 'none';
}

function toggleAbout() {
  const about = document.getElementById('aboutSection');
  about.style.display = (about.style.display === 'none' || about.style.display === '') ? 'block' : 'none';
}

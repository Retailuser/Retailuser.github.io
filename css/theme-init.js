(function () {
  try {
    var saved = localStorage.getItem('tnb_ams_theme');
    var root = document.documentElement;
    if (saved === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();

document.getElementById('claimBtn').addEventListener('click', () => {
  fetch('/log', {
    method: 'POST',
  });
});

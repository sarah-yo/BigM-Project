// DOM XSS: directly inserting untrusted input into innerHTML
document.getElementById('post').addEventListener('click', () => {
  const c = document.getElementById('comment').value;
  const comments = document.getElementById('comments');
  // vulnerable: no escaping -> reflected/DOM XSS
  comments.innerHTML += '<p>' + c + '</p>';
});

// eval usage
document.getElementById('eval').addEventListener('click', () => {
  const e = document.getElementById('expr').value;
  try {
    // vulnerable: eval on user input
    const r = eval(e);
    document.getElementById('evalResult').textContent = 'Result: ' + r;
  } catch (err) {
    document.getElementById('evalResult').textContent = 'Error';
  }
});

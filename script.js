document.addEventListener('DOMContentLoaded', () => {
  const OFFSET = 0;

  // Smooth scroll for nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.offsetTop - OFFSET;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form submission
  const form = document.getElementById('contactform');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = new URLSearchParams(formData);

      try {
        const response = await fetch('/submit', {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const resultText = await response.text();

        if (response.ok) {
          alert('Message received! Thanks!');
          form.reset();
        } else {
          alert('Error submitting the form.');
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    });
  }
});

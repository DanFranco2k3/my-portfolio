document.addEventListener('DOMContentLoaded', () => {
  const OFFSET = 0; // Adjust value if fixed header or want to offset the scroll position
  
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
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactform');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

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

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Show success message as alert popup
        form.reset();          // Reset form after submission
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Message received! Thanks!');
        form.reset();
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      alert('Error submitting the form.');
      console.error(err);
    }
  });
});



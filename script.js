document.addEventListener('DOMContentLoaded', () => {
  const OFFSET = 80; // Adjust this if you have a fixed header

  // Select ALL anchor links that start with # (hash links)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  console.log('Found navigation links:', navLinks.length); // Debug line
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip empty href or just "#"
      if (!href || href === '#') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1); // Remove the #
      const targetElement = document.getElementById(targetId);

      console.log('Clicking link to:', targetId); // Debug line
      console.log('Target element found:', !!targetElement); // Debug line

      if (targetElement) {
        const elementPosition = targetElement.offsetTop - OFFSET;
        
        console.log('Scrolling to position:', elementPosition); // Debug line
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        console.warn('Target element not found:', targetId);
      }
    });
  

  // Alternative method using CSS scroll-behavior (fallback)
  document.documentElement.style.scrollBehavior = 'smooth';
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

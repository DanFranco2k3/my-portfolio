document.addEventListener('DOMContentLoaded', () => {
  const OFFSET = 100; // Adjust based on any fixed header you might have

  // Target your specific nav links with the nav-link class
  const navLinks = document.querySelectorAll('.nav-link');
  
  console.log('Found navigation links:', navLinks.length); // Should show 3
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default jump behavior
      
      const href = link.getAttribute('href');
      console.log('Clicked link href:', href); // Debug
      
      if (!href || href === '#') return;
      
      const targetId = href.substring(1); // Remove the # symbol
      const targetElement = document.getElementById(targetId);
      
      console.log('Looking for element with ID:', targetId); // Debug
      console.log('Target element found:', !!targetElement); // Debug

      if (targetElement) {
        // Get the element's position from top of page
        const elementPosition = targetElement.offsetTop - OFFSET;
        
        console.log('Element position:', targetElement.offsetTop);
        console.log('Scrolling to position:', elementPosition);
        
        // Smooth scroll to the target
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        
        // Alternative method if the above doesn't work
        // targetElement.scrollIntoView({ 
        //   behavior: 'smooth', 
        //   block: 'start' 
        // });
        
      } else {
        console.error('Could not find element with ID:', targetId);
      }
    });
  

  // Backup: Add CSS smooth scrolling to html element
  document.documentElement.style.scrollBehavior = 'smooth';
  
  console.log('Smooth scroll script loaded successfully');
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

// Interactive JavaScript logic for IAtot Landing Page

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu (Hamburger) Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('overflow-hidden');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // 3. FAQ Accordion Logic
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const currentItem = question.parentElement;
      const isActive = currentItem.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current item
      if (!isActive) {
        currentItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 4. Form Submission and N8N Webhook Integration
  const contactForm = document.getElementById('diagnostic-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (contactForm && successModal) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        businessType: formData.get('business-type'),
        message: formData.get('message'),
        submittedAt: new Date().toISOString()
      };
      
      console.log('Diagnostic requested:', payload);
      
      // Show success modal instantly for high responsiveness
      successModal.classList.add('active');
      document.body.classList.add('overflow-hidden');
      
      // Send data to N8N webhook in the background
      const N8N_WEBHOOK_URL = 'https://automatizaciones-n8n.rffba8.easypanel.host/webhook/iatot-leads';
      
      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('N8N Webhook responded with an error status: ' + response.status);
        }
        console.log('Lead successfully sent to N8N webhook.');
      })
      .catch(error => {
        // Log error but do not disrupt user experience (modal is already open)
        console.error('Failed to submit lead to N8N webhook:', error);
      });
      
      // Reset form
      contactForm.reset();
    });

    // Close modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      });
    }

    // Close modal on clicking backdrop
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }

  // 5. Scroll Spy (Highlight active navigation link)
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });
});

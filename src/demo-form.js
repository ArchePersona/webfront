const form = document.querySelector('[data-demo-form]');
const status = document.querySelector('[data-demo-status]');

if (form && status) {
  form.addEventListener('submit', () => {
    status.textContent = 'Sending demo request...';
  });
}

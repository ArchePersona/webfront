const demoForm = document.querySelector('[data-demo-form]');

if (demoForm) {
  const status = demoForm.querySelector('[data-demo-status]');

  demoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = 'Sending request...';
    }

    const formData = new FormData(demoForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(demoForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        throw new Error(result.error || 'Unable to send request.');
      }

      demoForm.reset();

      if (status) {
        status.textContent = 'Request sent. I will follow up from ArchePersona.';
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Something blocked the form. Please try again later.';
      }
    }
  });
}

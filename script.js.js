// Educover Home: lead form handling
// TODO: set LEAD_ENDPOINT once the lead destination (email / WhatsApp / CRM) is decided.
const LEAD_ENDPOINT = "";

function showMessage(el, text, isError) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("err", Boolean(isError));
}

document.querySelectorAll("form[data-lead]").forEach((form) => {
  const status = form.querySelector(".msg");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (!form.checkValidity()) {
      showMessage(status, "Please fill in all required fields.", true);
      form.reportValidity();
      return;
    }

    const mobile = String(data.mobile || "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showMessage(status, "Enter a valid 10-digit mobile number.", true);
      form.elements.mobile.focus();
      return;
    }

    const lead = { ...data, mobile, source: form.dataset.lead };

    if (!LEAD_ENDPOINT) {
      console.warn("Lead not sent: LEAD_ENDPOINT is empty.", lead);
      showMessage(status, "This form is not connected to a lead destination yet.", true);
      return;
    }

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error("Request failed");
      window.location.href = "thank-you.html";
    } catch (err) {
      showMessage(status, "Could not send your details. Please try again or message us on WhatsApp.", true);
    }
  });
});

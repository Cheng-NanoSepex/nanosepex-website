const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const contactForm = document.querySelector(".contact-form");
const roiCalculator = document.querySelector(".roi-calculator");

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const recipient = contactForm.dataset.contactEmail || "info@nanosepex.com";
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const company = formData.get("company") || "";
    const message = formData.get("message") || "";
    const subject = "NanoSepex website inquiry";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      "",
      String(message),
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

if (roiCalculator) {
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const gallonsFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  });
  const resultFields = {
    recoveredGallons: roiCalculator.querySelector('[data-roi="recoveredGallons"]'),
    wastewaterGallons: roiCalculator.querySelector('[data-roi="wastewaterGallons"]'),
    recoveredValue: roiCalculator.querySelector('[data-roi="recoveredValue"]'),
    dischargeCost: roiCalculator.querySelector('[data-roi="dischargeCost"]'),
    normalDisposal: roiCalculator.querySelector('[data-roi="normalDisposal"]'),
    valueDifference: roiCalculator.querySelector('[data-roi="valueDifference"]'),
  };

  const readNumber = (name) => {
    const value = Number(roiCalculator.elements[name]?.value);
    return Number.isFinite(value) ? Math.max(value, 0) : 0;
  };

  const updateRoi = () => {
    const gallons = readNumber("gallons");
    const concentration = Math.min(readNumber("concentration"), 100) / 100;
    const solventPrice = readNumber("solventPrice");
    const recoveredGallons = gallons * concentration;
    const wastewaterGallons = gallons - recoveredGallons;
    const recoveredValue = recoveredGallons * solventPrice;
    const dischargeCost = wastewaterGallons * 0.2;
    const normalDisposal = gallons * 2;
    const valueDifference = normalDisposal + recoveredValue - dischargeCost;

    resultFields.recoveredGallons.textContent = `${gallonsFormat.format(recoveredGallons)} gallons`;
    resultFields.wastewaterGallons.textContent = `${gallonsFormat.format(wastewaterGallons)} gallons`;
    resultFields.recoveredValue.textContent = currency.format(recoveredValue);
    resultFields.dischargeCost.textContent = currency.format(dischargeCost);
    resultFields.normalDisposal.textContent = currency.format(normalDisposal);
    resultFields.valueDifference.textContent = currency.format(valueDifference);
  };

  roiCalculator.addEventListener("input", updateRoi);
  updateRoi();
}

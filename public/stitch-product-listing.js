(() => {
  const catalogProducts = [
    { name: "Ortho Plus Mattress", slug: "ortho-plus-mattress", price: 16799, priceLabel: "₹16,799", listPrice: "₹21,000", specification: "Zoned Support", core: "Orthopedic Zoned Support", thickness: ["6", "8", "10", "12"], criteria: ["Zero Motion Isolation", "Doctor Recommended & Ortho Lab Tested"], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Natural Latex Mattress", slug: "latex-pro", price: 21499, priceLabel: "₹21,499", listPrice: "₹36,000", specification: "Natural Latex", core: "Natural Latex", thickness: ["6", "8", "10", "12"], criteria: [], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Pocketed Spring Mattress", slug: "pocketed-spring-mattress", price: 18500, priceLabel: "₹18,500", listPrice: "₹19,990", specification: "Zero Motion Spring System", core: "Pocketed Spring", thickness: ["6", "8", "10", "12"], criteria: ["Zero Motion Isolation"], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Memory Foam Mattress", slug: "memory-foam-mattress", price: 20499, priceLabel: "₹20,499", listPrice: "₹22,000", specification: "Memory Foam Comfort", core: "Memory Foam", thickness: ["6", "8", "10", "12"], criteria: ["Zero Motion Isolation"], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Ortho Mattress", slug: "ortho-mattress", price: 13299, priceLabel: "₹13,299", listPrice: "₹15,999", specification: "Orthopedic Alignment", core: "Orthopedic Zoned Support", thickness: ["6", "8", "10", "12"], criteria: ["Zero Motion Isolation", "Doctor Recommended & Ortho Lab Tested"], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"], image: "https://punuebwalhaavrbtinkq.supabase.co/storage/v1/object/public/product-images/mattresses/ortho-mattress/01-hero.jpg" },
    { name: "Latex Mattress", slug: "latex-mattress", price: 15699, priceLabel: "₹15,699", listPrice: "₹20,500", specification: "Natural Latex Comfort", core: "Natural Latex", thickness: ["6", "8", "10", "12"], criteria: [], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Bonnell Spring Mattress", slug: "bonnell-spring-mattress", price: 14999, priceLabel: "₹14,999", listPrice: "₹22,500", specification: "Hourglass Spring System", core: "Bonnell High-Tensile Spring", thickness: ["6", "8", "10", "12"], criteria: [], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Feel Good Mattress", slug: "feel-good-mattress", price: 22399, priceLabel: "₹22,399", listPrice: "₹34,000", specification: "Multi-Strata Comfort", core: "Super Soft", thickness: ["6", "8", "10", "12"], criteria: [], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Slim Mattress", slug: "shim-mattress", price: 1499, priceLabel: "₹1,499", listPrice: "", specification: "Slim Profile", core: "High Density HR Foam", thickness: [], firmness: "Balanced", criteria: [], sizes: ["Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] },
    { name: "Foam Mattress", slug: "foam-mattress", price: 12499, priceLabel: "₹12,499", listPrice: "₹18,999", specification: "High-Density Foam", core: "High Density HR Foam", thickness: ["6", "8", "10", "12"], criteria: [], sizes: ["Diwan Mattress — 72 × 36 in", "Single Mattress — 75 × 36 in", "Double Mattress — 75 × 48 in", "Queen Mattress — 75 × 60 in", "King Mattress — 75 × 72 in", "King Mattress — 78 × 72 in"] }
  ];

  const grid = document.getElementById("product-grid");
  const filterSidebar = document.querySelector("aside");
  const mobileFilterToggle = document.getElementById("mobile-filter-toggle");
  const filterInputs = Array.from(filterSidebar.querySelectorAll('input[type="checkbox"]'));
  const activeFilterList = document.getElementById("active-filter-list");
  const filterDefinitions = [
    ["price", "Under ₹10,000"], ["price", "₹10,000 - ₹20,000"], ["price", "₹20,000 - ₹30,000"], ["price", "Above ₹30,000"],
    ["size", "Diwan Mattress — 72 × 36 in"], ["size", "Single Mattress — 75 × 36 in"], ["size", "Double Mattress — 75 × 48 in"], ["size", "Queen Mattress — 75 × 60 in"], ["size", "King Mattress — 75 × 72 in"], ["size", "King Mattress — 78 × 72 in"],
    ["core", "Orthopedic Zoned Support"], ["core", "Natural Latex"], ["core", "Pocketed Spring"], ["core", "Bonnell High-Tensile Spring"], ["core", "Super Soft"], ["core", "Memory Foam"], ["core", "High Density HR Foam"], ["core", "Dual Comfort (Reversible)"],
    ["criteria", "Zero Motion Isolation"], ["criteria", "Doctor Recommended & Ortho Lab Tested"]
  ];
  filterInputs.forEach((input, index) => {
    input.checked = false;
    const definition = filterDefinitions[index];
    if (definition) {
      input.dataset.group = definition[0];
      input.dataset.label = definition[1];
    }
  });

  const thicknessButtons = Array.from(filterSidebar.querySelectorAll("button")).filter((button) => /^\d+\s*(?:"|in)$/.test(button.textContent.trim()));
  let selectedThickness = null;
  const updateThicknessButtons = () => {
    thicknessButtons.forEach((button) => {
      const value = button.textContent.trim().replace(/\s*(?:"|in)$/i, "");
      const active = value === selectedThickness;
      button.className = active
        ? "py-2 border border-primary bg-primary text-on-primary text-mono-data font-mono-data text-center font-bold"
        : "py-2 border border-surface-dim text-mono-data font-mono-data text-center hover:border-primary";
      button.setAttribute("aria-pressed", String(active));
    });
  };
  thicknessButtons.forEach((button) => {
    button.type = "button";
    button.addEventListener("click", () => {
      const value = button.textContent.trim().replace(/\s*(?:"|in)$/i, "");
      selectedThickness = selectedThickness === value ? null : value;
      updateThicknessButtons();
    });
  });
  updateThicknessButtons();

  const applyButton = document.createElement("button");
  applyButton.type = "button";
  applyButton.className = "w-full bg-primary text-on-primary px-4 py-3 text-label-caps font-label-caps uppercase font-bold hover:bg-secondary transition-colors";
  applyButton.textContent = "Apply filters";
  filterSidebar.appendChild(applyButton);

  const initialCards = Array.from(grid.querySelectorAll(":scope > article"));
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  const cardSizeOptions = ["Single Mattress — 75 × 36 in", "Queen Mattress — 75 × 60 in", "King Mattress — 78 × 72 in"];
  const sizeArea = { "Single Mattress — 75 × 36 in": 75 * 36, "Queen Mattress — 75 × 60 in": 75 * 60, "King Mattress — 78 × 72 in": 78 * 72 };
  const slimPrices = { "Single Mattress — 75 × 36 in": 1499, "Double Mattress — 75 × 48 in": 1999, "Queen Mattress — 75 × 60 in": 2498, "King Mattress — 75 × 72 in": 2998, "King Mattress — 78 × 72 in": 3118 };
  const displayedPrice = (product) => {
    const variant = (product.variants || []).find((item) => item.option_values?.size === product.selectedSize && (!item.option_values?.thickness || item.option_values.thickness === product.selectedThickness));
    if (variant) return { label: money.format(variant.price_paise / 100), variant };
    const amount = product.slug === "shim-mattress"
      ? slimPrices[product.selectedSize]
      : Math.round(product.price * (sizeArea[product.selectedSize] || (78 * 72)) / (78 * 72));
    return { label: money.format(amount), variant: null };
  };
  const updateCardSelection = (card, product) => {
    const { label, variant } = displayedPrice(product);
    product.selectedVariant = variant;
    card.querySelector(".font-price-xl").textContent = label;
    const selectedLabel = Array.from(card.querySelectorAll("span")).find((span) => /^(Single|Queen|King).*\d+[\"”]?\s*[×x]\s*\d+/.test(span.textContent.trim()));
    if (selectedLabel) selectedLabel.textContent = product.selectedSize.replace(" Mattress — ", " ");
    const buttons = Array.from(card.querySelectorAll(".grid.grid-cols-3 button"));
    buttons.forEach((button, buttonIndex) => {
      const active = cardSizeOptions[buttonIndex] === product.selectedSize;
      button.setAttribute("aria-pressed", String(active));
      button.className = active
        ? "py-1 text-mono-data font-mono-data border border-primary bg-surface-container font-bold text-primary text-center"
        : "py-1 text-mono-data font-mono-data border border-surface-dim hover:border-primary text-center";
    });
  };
  const applyCatalogData = (card, product, index) => {
    const image = card.querySelector("img[data-alt]");
    image.src = product.image || "/product-placeholder.svg";
    image.alt = product.image ? product.name : product.name + " image placeholder";
    image.classList.toggle("object-contain", !product.image);
    image.classList.toggle("object-cover", Boolean(product.image));
    card.querySelector("h3").textContent = product.name;
    card.querySelector(".font-price-xl").textContent = product.priceLabel;
    card.querySelector(".line-through").classList.add("hidden");
    card.querySelector(".tracking-widest").textContent = product.specification;
    card.dataset.productIndex = String(index);
    card.dataset.slug = product.slug;
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "View " + product.name);
    card.classList.add("cursor-pointer");
    updateCardSelection(card, product);
  };

  catalogProducts.forEach((product) => {
    product.selectedSize = product.slug === "shim-mattress" ? "Single Mattress — 75 × 36 in" : "King Mattress — 78 × 72 in";
    product.selectedThickness = product.slug === "shim-mattress" ? null : "6 in";
    product.variants = [];
  });
  initialCards.forEach((card, index) => applyCatalogData(card, catalogProducts[index], index));
  const foamCard = initialCards[initialCards.length - 1].cloneNode(true);
  applyCatalogData(foamCard, catalogProducts[catalogProducts.length - 1], catalogProducts.length - 1);
  const badge = foamCard.querySelector(".absolute.top-2.left-2 span");
  if (badge) badge.textContent = "Catalog model";
  grid.insertBefore(foamCard, document.getElementById("custom-configurator"));

  const productCards = Array.from(grid.querySelectorAll(":scope > article"));
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "sleepexcellent-product-data") return;
    catalogProducts.forEach((product) => {
      product.image = event.data.images?.[product.slug] || product.image;
      product.variants = event.data.variants?.[product.slug] || [];
    });
    productCards.forEach((card) => {
      applyCatalogData(card, catalogProducts[Number(card.dataset.productIndex)], Number(card.dataset.productIndex));
    });
  });
  const openProduct = (card) => {
    window.top.location.href = "/products/" + card.dataset.slug;
  };
  productCards.forEach((card) => {
    const product = catalogProducts[Number(card.dataset.productIndex)];
    Array.from(card.querySelectorAll(".grid.grid-cols-3 button")).forEach((button, buttonIndex) => {
      button.type = "button";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        product.selectedSize = cardSizeOptions[buttonIndex];
        updateCardSelection(card, product);
      });
    });
    const favorite = card.querySelector('button:has([data-icon="favorite"])');
    favorite?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const icon = favorite.querySelector("[data-icon='favorite']");
      const active = favorite.getAttribute("aria-pressed") === "true";
      favorite.setAttribute("aria-pressed", String(!active));
      if (icon) icon.style.fontVariationSettings = active ? "'FILL' 0" : "'FILL' 1";
    });
    const addToCart = Array.from(card.querySelectorAll("button")).find((button) => button.textContent.trim().toLowerCase() === "select slab");
    if (addToCart) {
      addToCart.textContent = "Add to cart";
      addToCart.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!product.selectedVariant) {
          openProduct(card);
          return;
        }
        addToCart.disabled = true;
        addToCart.textContent = "Adding…";
        window.parent.postMessage({
          type: "sleepexcellent-add-to-cart",
          productSlug: card.dataset.slug,
          variantSku: product.selectedVariant.sku,
          configuration: product.selectedVariant.option_values
        }, window.location.origin);
      });
    }
    card.addEventListener("click", () => openProduct(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target === card) openProduct(card);
    });
  });
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "sleepexcellent-cart-result") return;
    const card = productCards.find((item) => item.dataset.slug === event.data.productSlug);
    const button = card ? Array.from(card.querySelectorAll("button")).find((item) => ["add to cart", "adding…", "added"].includes(item.textContent.trim().toLowerCase())) : null;
    if (!button) return;
    button.disabled = false;
    button.textContent = event.data.ok ? "Added" : "Try again";
    window.setTimeout(() => { button.textContent = "Add to cart"; }, 1500);
  });

  const selectedByGroup = () => {
    const groups = {};
    filterInputs.filter((input) => input.checked).forEach((input) => {
      (groups[input.dataset.group] ||= new Set()).add(input.dataset.label);
    });
    return groups;
  };
  const matchesPrice = (price, labels) => {
    if (!labels || labels.size === 0) return true;
    return (labels.has("Under ₹10,000") && price < 10000)
      || (labels.has("₹10,000 - ₹20,000") && price >= 10000 && price < 20000)
      || (labels.has("₹20,000 - ₹30,000") && price >= 20000 && price <= 30000)
      || (labels.has("Above ₹30,000") && price > 30000);
  };
  const matchesAny = (values, selected) => !selected || selected.size === 0 || values.some((value) => selected.has(value));
  const renderActiveFilters = () => {
    const labels = filterInputs.filter((input) => input.checked).map((input) => input.dataset.label);
    if (selectedThickness) labels.push(selectedThickness + " in profile");
    activeFilterList.innerHTML = '<span class="text-mono-data font-mono-data uppercase text-on-surface-variant mr-1">Active Filters:</span>'
      + (labels.length
        ? labels.map((label) => '<span class="inline-flex items-center px-2.5 py-1 bg-surface-container border border-surface-dim text-body-sm font-body-sm text-primary">' + label + '</span>').join("")
        : '<span class="text-body-sm text-on-surface-variant">No filters applied.</span>');
  };
  let emptyState = document.getElementById("catalog-empty-state");
  if (!emptyState) {
    emptyState = document.createElement("p");
    emptyState.id = "catalog-empty-state";
    emptyState.className = "col-span-full hidden border border-surface-dim bg-surface-container-lowest p-8 text-center text-body-md text-on-surface-variant";
    emptyState.textContent = "No mattresses match these filters. Clear filters to view the full catalogue.";
    grid.insertBefore(emptyState, document.getElementById("custom-configurator"));
  }
  const applyFilters = () => {
    const groups = selectedByGroup();
    let visible = 0;
    productCards.forEach((card) => {
      const product = catalogProducts[Number(card.dataset.productIndex)];
      const matches = matchesPrice(product.price, groups.price)
        && matchesAny(product.sizes, groups.size)
        && matchesAny([product.core], groups.core)
        && matchesAny(product.criteria, groups.criteria)
        && (!selectedThickness || product.thickness.includes(selectedThickness));
      card.classList.toggle("hidden", !matches);
      if (matches) visible++;
    });
    emptyState.classList.toggle("hidden", visible > 0);
    renderActiveFilters();
    reportFrameHeight();
  };
  const clearFilters = () => {
    filterInputs.forEach((input) => { input.checked = false; });
    selectedThickness = null;
    updateThicknessButtons();
    applyFilters();
  };
  applyButton.addEventListener("click", applyFilters);
  applyButton.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      filterSidebar.classList.remove("mobile-open");
      mobileFilterToggle.setAttribute("aria-expanded", "false");
      mobileFilterToggle.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  });
  mobileFilterToggle.addEventListener("click", () => {
    const open = filterSidebar.classList.toggle("mobile-open");
    mobileFilterToggle.setAttribute("aria-expanded", String(open));
    mobileFilterToggle.querySelector("span:last-child").textContent = open ? "Close filters" : "Filters";
    reportFrameHeight();
  });
  document.getElementById("clear-catalog-filters").addEventListener("click", clearFilters);
  document.getElementById("reset-catalog-filters").addEventListener("click", clearFilters);
  renderActiveFilters();

  const gridView = document.getElementById("grid-view");
  const listView = document.getElementById("list-view");
  const setCatalogView = (view) => {
    const isList = view === "list";
    grid.classList.toggle("is-list", isList);
    grid.classList.toggle("grid-cols-3", !isList);
    gridView.className = "p-1.5 flex items-center " + (isList ? "bg-surface text-on-surface-variant hover:text-primary" : "bg-primary text-on-primary");
    listView.className = "p-1.5 flex items-center border-l border-surface-dim " + (isList ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant hover:text-primary");
    gridView.setAttribute("aria-pressed", String(!isList));
    listView.setAttribute("aria-pressed", String(isList));
  };
  gridView.addEventListener("click", () => setCatalogView("grid"));
  listView.addEventListener("click", () => setCatalogView("list"));
  document.getElementById("catalog-sort").addEventListener("change", (event) => {
    const mode = event.target.value;
    const cards = [...productCards];
    if (mode === "Price: Low to High") cards.sort((a, b) => catalogProducts[Number(a.dataset.productIndex)].price - catalogProducts[Number(b.dataset.productIndex)].price);
    if (mode === "Price: High to Low") cards.sort((a, b) => catalogProducts[Number(b.dataset.productIndex)].price - catalogProducts[Number(a.dataset.productIndex)].price);
    cards.forEach((card) => grid.insertBefore(card, emptyState));
  });

  const reportFrameHeight = () => {
    const bodyTop = document.body.getBoundingClientRect().top;
    const height = Array.from(document.body.children).reduce((bottom, child) => {
      const style = getComputedStyle(child);
      if (style.display === "none" || style.position === "fixed" || ["SCRIPT", "STYLE"].includes(child.tagName)) return bottom;
      return Math.max(bottom, child.getBoundingClientRect().bottom - bodyTop);
    }, 1);
    window.parent.postMessage({ type: "sleepexcellent-frame-height", height }, window.location.origin);
  };
  new ResizeObserver(reportFrameHeight).observe(document.body);
  window.addEventListener("load", reportFrameHeight);
  window.setTimeout(reportFrameHeight, 250);
})();

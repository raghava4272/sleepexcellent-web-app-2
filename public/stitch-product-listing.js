(() => {
  const catalogProducts = [
    { name: "Ortho Plus Mattress", slug: "ortho-plus-mattress", price: 16395, priceLabel: "₹16,395", listPrice: "₹21,000", specification: "Zoned Visco Support", core: "Orthopedic Zoned Support", thickness: ["6", "8", "10"], firmness: "Ortho Firm Calibration (7-9)", criteria: ["Zero Motion Isolation", "100-Night Free Trial Protocol", "Doctor Recommended & Ortho Lab Tested"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Latex Pro Mattress", slug: "latex-pro", price: 28315, priceLabel: "₹28,315", listPrice: "₹36,000", specification: "Organic Latex Core", core: "Natural Dunlop Latex", thickness: ["6", "8"], firmness: "Balanced", criteria: ["100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Pocketed Spring Mattress", slug: "pocketed-spring-mattress", price: 15595, priceLabel: "₹15,595", listPrice: "₹19,990", specification: "Zero Motion Spring System", core: "Pocketed Spring Sovereign", thickness: ["6", "8", "10"], firmness: "Balanced", criteria: ["Zero Motion Isolation", "100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Memory Foam Mattress", slug: "memory-foam-mattress", price: 16619, priceLabel: "₹16,619", listPrice: "₹22,000", specification: "Memory Foam Comfort", core: "Memory Foam Visco Elastic", thickness: ["6", "8"], firmness: "Balanced", criteria: ["Zero Motion Isolation", "100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Ortho Mattress", slug: "ortho-mattress", price: 12699, priceLabel: "₹12,699", listPrice: "₹15,999", specification: "Orthopedic Alignment", core: "Orthopedic Zoned Support", thickness: ["4", "6", "8"], firmness: "Ortho Firm Calibration (7-9)", criteria: ["Zero Motion Isolation", "100-Night Free Trial Protocol", "Doctor Recommended & Ortho Lab Tested"], sizes: ["Single", "Medium (Queen)", "Large (King)"], image: "https://punuebwalhaavrbtinkq.supabase.co/storage/v1/object/public/product-images/mattresses/ortho-mattress/01-hero.jpg" },
    { name: "Latex Mattress", slug: "latex-mattress", price: 15975, priceLabel: "₹15,975", listPrice: "₹20,500", specification: "Natural Latex Comfort", core: "Natural Dunlop Latex", thickness: ["6", "8"], firmness: "Balanced", criteria: ["100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Bonnell Spring Mattress", slug: "bonnell-spring-mattress", price: 17222, priceLabel: "₹17,222", listPrice: "₹22,500", specification: "Hourglass Spring System", core: "Bonnell High-Tensile Spring", thickness: ["6", "8", "10"], firmness: "Balanced", criteria: ["100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Feel Good Mattress", slug: "feel-good-mattress", price: 26929, priceLabel: "₹26,929", listPrice: "₹34,000", specification: "Multi-Strata Comfort", core: "Dual Comfort (Reversible)", thickness: ["6", "8"], firmness: "Balanced", criteria: ["100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Shim Mattress", slug: "shim-mattress", price: 2119, priceLabel: "₹2,119", listPrice: "₹2,999", specification: "Slim Profile", core: "High Density HR Foam", thickness: ["4"], firmness: "Balanced", criteria: [], sizes: ["Single", "Medium (Queen)", "Large (King)"] },
    { name: "Foam Mattress", slug: "foam-mattress", price: 14475, priceLabel: "₹14,475", listPrice: "₹18,999", specification: "High-Density Foam", core: "High Density HR Foam", thickness: ["4", "6", "8"], firmness: "Balanced", criteria: ["100-Night Free Trial Protocol"], sizes: ["Single", "Medium (Queen)", "Large (King)"] }
  ];

  const grid = document.getElementById("product-grid");
  const filterSidebar = document.querySelector("aside");
  const filterInputs = Array.from(filterSidebar.querySelectorAll('input[type="checkbox"]'));
  const activeFilterList = document.getElementById("active-filter-list");
  const filterDefinitions = [
    ["price", "Under ₹10,000"], ["price", "₹10,000 - ₹20,000"], ["price", "₹20,000 - ₹30,000"], ["price", "Above ₹30,000"],
    ["size", "Single"], ["size", "Medium (Queen)"], ["size", "Large (King)"],
    ["core", "Orthopedic Zoned Support"], ["core", "Natural Dunlop Latex"], ["core", "Pocketed Spring Sovereign"], ["core", "Bonnell High-Tensile Spring"], ["core", "Memory Foam Visco Elastic"], ["core", "High Density HR Foam"], ["core", "Dual Comfort (Reversible)"],
    ["firmness", "Ortho Firm Calibration (7-9)"],
    ["criteria", "Zero Motion Isolation"], ["criteria", "100-Night Free Trial Protocol"], ["criteria", "Doctor Recommended & Ortho Lab Tested"]
  ];
  filterInputs.forEach((input, index) => {
    input.checked = false;
    const definition = filterDefinitions[index];
    if (definition) {
      input.dataset.group = definition[0];
      input.dataset.label = definition[1];
    }
  });

  const thicknessButtons = Array.from(filterSidebar.querySelectorAll("button")).filter((button) => /^\d+"$/.test(button.textContent.trim()));
  let selectedThickness = null;
  const updateThicknessButtons = () => {
    thicknessButtons.forEach((button) => {
      const value = button.textContent.trim().replace('"', "");
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
      const value = button.textContent.trim().replace('"', "");
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
  const applyCatalogData = (card, product, index) => {
    const image = card.querySelector("img[data-alt]");
    image.src = product.image || "/product-placeholder.svg";
    image.alt = product.image ? product.name : product.name + " image placeholder";
    image.classList.toggle("object-contain", !product.image);
    image.classList.toggle("object-cover", Boolean(product.image));
    card.querySelector("h3").textContent = product.name;
    card.querySelector(".font-price-xl").textContent = product.priceLabel;
    card.querySelector(".line-through").textContent = product.listPrice;
    card.querySelector(".tracking-widest").textContent = product.specification;
    card.dataset.productIndex = String(index);
    card.dataset.slug = product.slug;
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "View " + product.name);
    card.classList.add("cursor-pointer");
  };

  initialCards.forEach((card, index) => applyCatalogData(card, catalogProducts[index], index));
  const foamCard = initialCards[initialCards.length - 1].cloneNode(true);
  applyCatalogData(foamCard, catalogProducts[catalogProducts.length - 1], catalogProducts.length - 1);
  const badge = foamCard.querySelector(".absolute.top-2.left-2 span");
  if (badge) badge.textContent = "Catalog model";
  grid.insertBefore(foamCard, document.getElementById("custom-configurator"));

  const productCards = Array.from(grid.querySelectorAll(":scope > article"));
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.data?.type !== "sleepexcellent-product-images" || !event.data.images) return;
    catalogProducts.forEach((product) => {
      product.image = event.data.images[product.slug] || product.image;
    });
    productCards.forEach((card) => {
      applyCatalogData(card, catalogProducts[Number(card.dataset.productIndex)], Number(card.dataset.productIndex));
    });
  });
  const openProduct = (card) => {
    window.top.location.href = "/products/" + card.dataset.slug;
  };
  productCards.forEach((card) => {
    const favorite = card.querySelector('button:has([data-icon="favorite"])');
    favorite?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const icon = favorite.querySelector("[data-icon='favorite']");
      const active = favorite.getAttribute("aria-pressed") === "true";
      favorite.setAttribute("aria-pressed", String(!active));
      if (icon) icon.style.fontVariationSettings = active ? "'FILL' 0" : "'FILL' 1";
    });
    card.addEventListener("click", () => openProduct(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target === card) openProduct(card);
    });
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
    if (selectedThickness) labels.push(selectedThickness + '" profile');
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
        && matchesAny([product.firmness], groups.firmness)
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

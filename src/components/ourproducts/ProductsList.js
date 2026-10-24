import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./ourproducts.css";

const API = process.env.REACT_APP_API_URL;
const UNITS = [
  { value: "g", label: "Gram (g)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ml", label: "Millilitre (ml)" },
  { value: "l", label: "Litre (l)" },
  { value: "pcs", label: "Pieces (pcs)" },
];

const emptyVariant = () => ({
  quantity: "",
  unit: "g",
  price: "",
  sellingPrice: "",
  stock: "0",
  sku: "",
});

const normalizeVariants = (variants) =>
  (Array.isArray(variants) ? variants : []).map((variant) => ({
    id: variant.id,
    quantity: String(variant.quantity ?? ""),
    unit: variant.unit || "g",
    price: String(variant.price ?? ""),
    sellingPrice: String(variant.sellingPrice ?? variant.price ?? ""),
    stock: String(variant.stock ?? 0),
    sku: variant.sku || "",
  }));

const formatQuantity = (quantity, unit) => {
  const amount = Number(quantity);
  const cleanAmount = Number.isFinite(amount)
    ? String(Number(amount.toFixed(3)))
    : quantity;
  return `${cleanAmount} ${unit || ""}`.trim();
};

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [editImages, setEditImages] = useState({});
  const [isStockEditing, setIsStockEditing] = useState(false);
  const [stockVariant, setStockVariant] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [stockLoadingId, setStockLoadingId] = useState(null);

  const fetchProducts = async () => {
    setDataLoading(true);
    try {
      const response = await axios.get(`${API}/products/api`);
      const payload = response.data;
      const list = Array.isArray(payload) ? payload : payload?.data;
      if (Array.isArray(list)) {
        setProducts(list);
      } else {
        console.error("Unexpected products API response:", payload);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(error.response?.data?.message || "Could not load products.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    axios
      .get(`${API}/categories`)
      .then((response) => {
        const payload = response.data;
        setCategories(Array.isArray(payload) ? payload : payload?.data || []);
      })
      .catch((error) => console.error("Error fetching categories:", error));
    // Fetch once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      `${product.productName || ""} ${product.slug || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  const closeEdit = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setVariants([]);
    setEditImages({});
  };

  const handleDelete = async (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const confirmed = window.confirm(
      `Deactivate "${product.productName}"?\n\nIt will no longer be visible to customers.`
    );
    if (!confirmed) return;

    try {
      setDeleteLoadingId(id);
      await axios.delete(`${API}/products/${id}`);
      setProducts((previous) => previous.filter((item) => item.id !== id));
      alert(`"${product.productName}" was deactivated.`);
    } catch (error) {
      console.error("Error deactivating product:", error);
      alert(error.response?.data?.message || "Failed to deactivate product.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleUpdateClick = (product) => {
    setCurrentProduct({
      ...product,
      productName: product.productName || "",
      description: product.description || "",
      categoryId: String(product.categoryId ?? product.Category?.id ?? ""),
      nickname1: product.nickname1 || "",
      nickname2: product.nickname2 || "",
      nickname3: product.nickname3 || "",
      video: product.video || "",
      recipe: product.recipe || "",
      productNamealsoyoumaylike: product.productNamealsoyoumaylike || "",
      link: product.link || "",
      restriction: product.restriction || "",
      type: product.type || "",
      rating: product.rating ?? 0,
      review: product.review ?? 0,
      is_liquid: Boolean(product.is_liquid),
      newLaunch: Boolean(product.newLaunch),
      OurComOffer: Boolean(product.OurComOffer),
    });
    setVariants(normalizeVariants(product.variants));
    setEditImages({});
    setIsEditing(true);
    setIsStockEditing(false);
  };

  const handleProductChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCurrentProduct((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateVariant = (index, field, value) => {
    setVariants((previous) =>
      previous.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addVariant = () => setVariants((previous) => [...previous, emptyVariant()]);

  const removeVariant = (index) => {
    setVariants((previous) => previous.filter((_, i) => i !== index));
  };

  const validateProductForm = () => {
    if (!currentProduct.productName.trim()) {
      alert("Product name is required.");
      return false;
    }
    if (!currentProduct.categoryId) {
      alert("Please select a category.");
      return false;
    }
    if (variants.length === 0) {
      alert("Add at least one packet option.");
      return false;
    }

    const seen = new Set();
    for (let i = 0; i < variants.length; i += 1) {
      const variant = variants[i];
      const quantity = Number(variant.quantity);
      const price = Number(variant.price); // MRP
      const sellingPrice = variant.sellingPrice === "" ? price : Number(variant.sellingPrice);
      const stock = Number(variant.stock);
      const key = `${quantity}:${variant.unit}`;

      if (!variant.quantity || !Number.isFinite(quantity) || quantity <= 0) {
        alert(`Packet ${i + 1}: quantity must be greater than 0.`);
        return false;
      }
      if (!UNITS.some((unit) => unit.value === variant.unit)) {
        alert(`Packet ${i + 1}: choose a valid unit.`);
        return false;
      }
      if (!variant.price || !Number.isFinite(price) || price <= 0) {
        alert(`Packet ${i + 1}: MRP must be greater than ₹0.`);
        return false;
      }
      if (
        variant.sellingPrice !== "" &&
        (!Number.isFinite(sellingPrice) || sellingPrice <= 0 || sellingPrice > price)
      ) {
        alert(`Packet ${i + 1}: selling price must be greater than ₹0 and cannot exceed MRP.`);
        return false;
      }
      if (!Number.isInteger(stock) || stock < 0 || String(variant.stock).trim() === "") {
        alert(`Packet ${i + 1}: stock must be a non-negative whole number.`);
        return false;
      }
      if (seen.has(key)) {
        alert(`Duplicate packet option: ${formatQuantity(quantity, variant.unit)}.`);
        return false;
      }
      seen.add(key);
    }

    if (
      currentProduct.rating !== "" &&
      (!Number.isFinite(Number(currentProduct.rating)) ||
        Number(currentProduct.rating) < 0 ||
        Number(currentProduct.rating) > 5)
    ) {
      alert("Rating must be between 0 and 5.");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateProductForm()) return;

    const formData = new FormData();
    const textFields = [
      "productName",
      "description",
      "nickname1",
      "nickname2",
      "nickname3",
      "video",
      "recipe",
      "productNamealsoyoumaylike",
      "link",
      "restriction",
      "type",
      "categoryId",
      "rating",
      "review",
    ];

    textFields.forEach((field) => {
      if (currentProduct[field] !== undefined && currentProduct[field] !== null) {
        formData.append(field, String(currentProduct[field]));
      }
    });

    // Send booleans as 0/1 for reliable multipart parsing.
    formData.append("is_liquid", currentProduct.is_liquid ? "1" : "0");
    formData.append("newLaunch", currentProduct.newLaunch ? "1" : "0");
    formData.append("OurComOffer", currentProduct.OurComOffer ? "1" : "0");
    formData.append(
      "variants",
      JSON.stringify(
        variants.map((variant) => ({
          ...(variant.id ? { id: variant.id } : {}),
          quantity: Number(variant.quantity),
          unit: variant.unit,
          price: Number(variant.price),
          sellingPrice: variant.sellingPrice === "" ? Number(variant.price) : Number(variant.sellingPrice),
          stock: Number(variant.stock),
          sku: variant.sku.trim() || null,
        }))
      )
    );

    Object.entries(editImages).forEach(([field, file]) => {
      if (file) formData.append(field, file);
    });

    try {
      setEditLoading(true);
      await axios.put(`${API}/products/${currentProduct.slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`"${currentProduct.productName}" updated successfully.`);
      closeEdit();
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Failed to update product.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleStockClick = (product, variant) => {
    setStockProduct(product);
    setStockVariant(variant);
    setNewStock(String(variant.stock ?? 0));
    setIsStockEditing(true);
    setIsEditing(false);
  };

  const handleStockUpdate = async (event) => {
    event.preventDefault();
    const stock = Number(newStock);

    if (String(newStock).trim() === "" || !Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a non-negative whole number.");
      return;
    }

    try {
      setStockLoadingId(stockVariant.id);
      // Keep this URL/method aligned with your backend route.
      await axios.patch(`${API}/product-variants/${stockVariant.id}/stock`, { stock });

      setProducts((previous) =>
        previous.map((product) =>
          product.id !== stockProduct.id
            ? product
            : {
                ...product,
                variants: (product.variants || []).map((variant) =>
                  variant.id === stockVariant.id ? { ...variant, stock } : variant
                ),
              }
        )
      );
      alert("Variant stock updated successfully.");
      setIsStockEditing(false);
      setStockProduct(null);
      setStockVariant(null);
    } catch (error) {
      console.error("Stock update error:", error);
      alert(
        error.response?.data?.message ||
          "Could not update stock. Check the variant stock API route."
      );
    } finally {
      setStockLoadingId(null);
    }
  };

  return (
    <main className="product-manager">
      <header className="product-manager__header">
        <div>
          <p className="product-manager__eyebrow">ADMINISTRATION</p>
          <h1>Product Manager</h1>
          <p className="product-manager__subtitle">
            Manage products, packet options, prices and inventory.
          </p>
        </div>
        <div className="product-manager__count">
          <strong>{products.length}</strong>
          <span>Active products</span>
        </div>
      </header>

      {!isEditing && !isStockEditing && (
        <div className="product-manager__toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product name..."
            aria-label="Search products"
          />
          <span>{filteredProducts.length} product(s)</span>
        </div>
      )}

      {isStockEditing && stockProduct && stockVariant ? (
        <form className="admin-panel admin-panel--narrow" onSubmit={handleStockUpdate}>
          <div className="admin-panel__heading">
            <div>
              <p className="product-manager__eyebrow">INVENTORY</p>
              <h2>Update packet stock</h2>
              <p>{stockProduct.productName}</p>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => setIsStockEditing(false)}
              aria-label="Close stock form"
            >
              ×
            </button>
          </div>
          <div className="selected-variant">
            <span>Packet size</span>
            <strong>{formatQuantity(stockVariant.quantity, stockVariant.unit)}</strong>
            <span>MRP / Selling price</span>
            <strong>₹{Number(stockVariant.price).toFixed(2)} / ₹{Number(stockVariant.sellingPrice ?? stockVariant.price).toFixed(2)}</strong>
          </div>
          <label className="admin-field">
            <span>Stock (packets)</span>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={newStock}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "" || /^\d+$/.test(value)) setNewStock(value);
              }}
            />
          </label>
          <div className="admin-actions">
            <button className="admin-button admin-button--primary" type="submit" disabled={stockLoadingId === stockVariant.id}>
              {stockLoadingId === stockVariant.id ? "Updating..." : "Save stock"}
            </button>
            <button className="admin-button admin-button--secondary" type="button" onClick={() => setIsStockEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : isEditing && currentProduct ? (
        <form className="admin-panel" onSubmit={handleFormSubmit}>
          <div className="admin-panel__heading">
            <div>
              <p className="product-manager__eyebrow">PRODUCT DETAILS</p>
              <h2>Edit product</h2>
              <p>Update product information and its packet options.</p>
            </div>
            <button type="button" className="icon-button" onClick={closeEdit} aria-label="Close edit form">
              ×
            </button>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Product name *</span>
              <input name="productName" required maxLength="255" value={currentProduct.productName} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Category *</span>
              <select name="categoryId" required value={currentProduct.categoryId} onChange={handleProductChange}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name || category.categoryName}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field admin-field--full">
              <span>Description</span>
              <textarea name="description" rows="3" value={currentProduct.description} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Nickname 1</span>
              <input name="nickname1" value={currentProduct.nickname1} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Nickname 2</span>
              <input name="nickname2" value={currentProduct.nickname2} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Nickname 3</span>
              <input name="nickname3" value={currentProduct.nickname3} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Rating (0–5)</span>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={currentProduct.rating}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0 && Number(value) <= 5)) {
                    setCurrentProduct((previous) => ({ ...previous, rating: value }));
                  }
                }}
              />
            </label>
            <label className="admin-field">
              <span>Review count</span>
              <input
                type="number"
                name="review"
                min="0"
                step="1"
                value={currentProduct.review}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setCurrentProduct((previous) => ({ ...previous, review: value }));
                  }
                }}
              />
            </label>
            <label className="admin-field">
              <span>Video URL</span>
              <input name="video" value={currentProduct.video} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Recipe URL</span>
              <input name="recipe" value={currentProduct.recipe} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Related product names</span>
              <input name="productNamealsoyoumaylike" value={currentProduct.productNamealsoyoumaylike} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Related product link</span>
              <input name="link" value={currentProduct.link} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Restriction</span>
              <input name="restriction" value={currentProduct.restriction} onChange={handleProductChange} />
            </label>
            <label className="admin-field">
              <span>Type</span>
              <input name="type" value={currentProduct.type} onChange={handleProductChange} />
            </label>
          </div>

          <div className="admin-checkboxes">
            <label><input type="checkbox" name="is_liquid" checked={currentProduct.is_liquid} onChange={handleProductChange} /> Liquid product</label>
            <label><input type="checkbox" name="newLaunch" checked={currentProduct.newLaunch} onChange={handleProductChange} /> New launch</label>
            <label><input type="checkbox" name="OurComOffer" checked={currentProduct.OurComOffer} onChange={handleProductChange} /> Combo offer</label>
          </div>

          <section className="variant-editor">
            <div className="variant-editor__heading">
              <div>
                <h3>Packet options</h3>
                <p>Each option has its own MRP, optional selling price, and stock. Leave selling price blank to use MRP. Removed options are deactivated on save.</p>
              </div>
              <button type="button" className="admin-button admin-button--secondary" onClick={addVariant}>
                + Add packet
              </button>
            </div>

            {variants.length === 0 && (
              <div className="empty-state empty-state--compact">No packet options. Add at least one option before saving.</div>
            )}

            {variants.map((variant, index) => (
              <div className="variant-row" key={variant.id || `new-${index}`}>
                <div className="variant-row__top">
                  <strong>Packet option {index + 1}</strong>
                  <button type="button" className="text-button text-button--danger" onClick={() => removeVariant(index)}>
                    Remove
                  </button>
                </div>
                <div className="variant-row__grid">
                  <label className="admin-field">
                    <span>Quantity *</span>
                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      required
                      value={variant.quantity}
                      onChange={(event) => updateVariant(index, "quantity", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Unit *</span>
                    <select value={variant.unit} onChange={(event) => updateVariant(index, "unit", event.target.value)}>
                      {UNITS.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
                    </select>
                  </label>
                  <label className="admin-field">
                    <span>MRP (₹) *</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={variant.price}
                      onChange={(event) => updateVariant(index, "price", event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Selling price (₹) <small className="optional-label">optional</small></span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={variant.price || undefined}
                      placeholder="Leave blank to use MRP"
                      value={variant.sellingPrice}
                      onChange={(event) => updateVariant(index, "sellingPrice", event.target.value)}
                    />
                    <small className="field-help">Leave blank to sell at MRP. Cannot exceed MRP.</small>
                  </label>
                  <label className="admin-field">
                    <span>Stock (packets) *</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={variant.stock}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "" || /^\d+$/.test(value)) updateVariant(index, "stock", value);
                      }}
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span>SKU (optional)</span>
                    <input value={variant.sku} onChange={(event) => updateVariant(index, "sku", event.target.value)} maxLength="255" />
                  </label>
                </div>
              </div>
            ))}
          </section>

          <section className="image-editor">
            <h3>Replace product images (optional)</h3>
            <p>Leave a file empty to keep the current image.</p>
            <div className="admin-form-grid">
              {[1, 2, 3, 4, 5].map((number) => {
                const field = `image${number}`;
                return (
                  <label className="admin-field" key={field}>
                    <span>Image {number}</span>
                    <input type="file" accept="image/*" onChange={(event) => setEditImages((previous) => ({ ...previous, [field]: event.target.files?.[0] || null }))} />
                  </label>
                );
              })}
            </div>
          </section>

          <div className="admin-actions">
            <button className="admin-button admin-button--primary" type="submit" disabled={editLoading}>
              {editLoading ? "Saving changes..." : "Save product"}
            </button>
            <button className="admin-button admin-button--secondary" type="button" onClick={closeEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : dataLoading ? (
        <div className="empty-state">Loading products…</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const activeVariants = (product.variants || []).filter((variant) => variant.status !== "deactive");
            return (
              <article className="product-card" key={product.id}>
                <div className="product-card__image-wrap">
                  {product.image1 ? (
                    <img
                      src={`${API}/public/userImages/${product.image1}`}
                      alt={product.productName}
                      className="product-card__image"
                    />
                  ) : (
                    <div className="product-card__image-placeholder">No image</div>
                  )}
                  {product.newLaunch && <span className="product-badge product-badge--new">NEW</span>}
                  {product.OurComOffer && <span className="product-badge product-badge--offer">OFFER</span>}
                </div>
                <div className="product-card__body">
                  <div className="product-card__title-row">
                    <h2>{product.productName}</h2>
                    <span className="product-card__id">#{product.id}</span>
                  </div>
                  <p className="product-card__description">{product.description || "No description added."}</p>

                  <div className="product-card__variants">
                    <h3>Packet options</h3>
                    {activeVariants.length ? activeVariants.map((variant) => (
                      <div className="product-variant" key={variant.id}>
                        <div>
                          <strong>{formatQuantity(variant.quantity, variant.unit)}</strong>
                          <span className="product-variant__prices">
                            {Number(variant.sellingPrice ?? variant.price) < Number(variant.price) ? (
                              <>
                                <strong className="product-variant__selling-price">₹{Number(variant.sellingPrice).toFixed(2)}</strong>
                                <del className="product-variant__mrp">₹{Number(variant.price).toFixed(2)}</del>
                                <small className="product-variant__discount">
                                  {Math.round((1 - Number(variant.sellingPrice) / Number(variant.price)) * 100)}% OFF
                                </small>
                              </>
                            ) : (
                              <strong className="product-variant__selling-price">₹{Number(variant.sellingPrice ?? variant.price).toFixed(2)}</strong>
                            )}
                          </span>
                        </div>
                        <div className="product-variant__inventory">
                          <span className={Number(variant.stock) > 0 ? "stock-indicator" : "stock-indicator stock-indicator--empty"}>
                            {variant.stock} packets
                          </span>
                          <button
                            type="button"
                            className="text-button"
                            onClick={() => handleStockClick(product, variant)}
                          >
                            Update stock
                          </button>
                        </div>
                      </div>
                    )) : <p className="muted-text">No active packet options</p>}
                  </div>

                  <div className="product-card__footer">
                    <span className="product-card__rating">★ {Number(product.rating || 0).toFixed(1)} </span>
                    <div className="product-card__actions">
                      <button type="button" className="admin-button admin-button--primary" onClick={() => handleUpdateClick(product)}>Edit</button>
                      <button
                        type="button"
                        className="admin-button admin-button--danger"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteLoadingId === product.id}
                      >
                        {deleteLoadingId === product.id ? "Deactivating…" : "Deactivate"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default DisplayProducts;

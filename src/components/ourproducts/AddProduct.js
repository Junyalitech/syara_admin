import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AddProduct.css";

const API_URL = process.env.REACT_APP_API_URL;
const createEmptyVariant = () => ({ quantity: "", unit: "g", price: "", stock: "0" });

const ProductForm = () => {
  const fileInputRefs = useRef({});
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [nickname1, setNickname1] = useState("");
  const [nickname2, setNickname2] = useState("");
  const [nickname3, setNickname3] = useState("");
  const [variants, setVariants] = useState([createEmptyVariant()]);
  const [video, setVideo] = useState("");
  const [recipe, setRecipe] = useState("");
  const [productNamealsoyoumaylike, setProductNamealsoyoumaylike] = useState("");
  const [link, setLink] = useState("");
  const [restriction, setRestriction] = useState("");
  const [type, setType] = useState("");
  const [newLaunch, setNewLaunch] = useState(false);
  const [ourComOffer, setOurComOffer] = useState(false);
  const [isLiquid, setIsLiquid] = useState(false);
  const [rating, setRating] = useState("");
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        // Supports APIs returning either an array or { data: [...] }.
        const categoryList = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const resetForm = () => {
    setProductName("");
    setCategory("");
    setDescription("");
    setNickname1("");
    setNickname2("");
    setNickname3("");
    setVariants([createEmptyVariant()]);
    setVideo("");
    setRecipe("");
    setProductNamealsoyoumaylike("");
    setLink("");
    setRestriction("");
    setType("");
    setNewLaunch(false);
    setOurComOffer(false);
    setIsLiquid(false);
    setRating("");
    setImages({ image1: null, image2: null, image3: null, image4: null, image5: null });
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  };

  const handleImageChange = (event) => {
    const { name, files } = event.target;
    setImages((current) => ({ ...current, [name]: files?.[0] || null }));
  };

  // Restrict invalid values while typing, not only on submit.
  const updateVariant = (index, field, value) => {
    if (field === "quantity") {
      if (value !== "" && !/^\d*(?:\.\d{0,3})?$/.test(value)) return;
      // Block zero as a value. Keep "0." temporarily so admins can type 0.5;
      // typing ".5" also works. A lone "0." is cleared on blur.
      if (value !== "0." && value !== "" && Number(value) === 0) return;
    }

    if (field === "price") {
      if (value !== "" && !/^\d*(?:\.\d{0,2})?$/.test(value)) return;
      // Price must be positive. Allow only the temporary "0." prefix for decimals.
      if (value !== "0." && value !== "" && Number(value) === 0) return;
    }

    if (field === "stock") {
      // Whole numbers only; negatives and decimals cannot be typed.
      if (value !== "" && !/^\d+$/.test(value)) return;
    }

    setVariants((current) =>
      current.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant))
    );
  };

  const handlePositiveFieldBlur = (index, field, label) => {
    const value = variants[index][field];
    if (value !== "" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
      updateVariant(index, field, "");
      alert(`${label} must be greater than 0. Zero is not allowed; the value was cleared.`);
    }
  };

  const handleRatingChange = (value) => {
    if (value === "") {
      setRating("");
      return;
    }
    // Only allow numbers from 0 through 5, with at most one decimal place.
    if (/^\d(?:\.\d?)?$/.test(value) && Number(value) <= 5) {
      setRating(value);
    }
  };

  const addVariant = () => setVariants((current) => [...current, createEmptyVariant()]);

  const removeVariant = (index) => {
    setVariants((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName.trim() || productName.trim().length > 255 || !category) {
      alert("Please enter a product name (maximum 255 characters) and select a category.");
      return;
    }

    if (rating !== "") {
      const numericRating = Number(rating);
      if (!Number.isFinite(numericRating) || numericRating < 0 || numericRating > 5) {
        alert("Rating must be between 0 and 5, inclusive.");
        return;
      }
    }

    if (!images.image1) {
      alert("Please upload the primary product image (Image 1).");
      return;
    }

    if (variants.length === 0) {
      alert("Add at least one packet option.");
      return;
    }

    const normalizedVariants = [];
    const seenSizes = new Set();

    for (let index = 0; index < variants.length; index += 1) {
      const variant = variants[index];
      const quantity = Number(variant.quantity);
      const price = Number(variant.price);
      const stock = Number(variant.stock);

      if (
        variant.quantity === "" || !Number.isFinite(quantity) || quantity <= 0 ||
        variant.price === "" || !Number.isFinite(price) || price <= 0 ||
        !/^\d+(\.\d{1,2})?$/.test(String(variant.price).trim()) ||
        variant.stock === "" || !Number.isSafeInteger(stock) || stock < 0 ||
        !["g", "kg", "ml", "l", "pcs"].includes(variant.unit)
      ) {
        alert(`Packet option ${index + 1}: quantity must be greater than 0, price must be greater than ₹0 (up to 2 decimal places), and stock must be a non-negative whole number.`);
        return;
      }

      const sizeKey = `${quantity}:${variant.unit}`;
      if (seenSizes.has(sizeKey)) {
        alert(`Packet option ${quantity} ${variant.unit} is duplicated. Each product must have unique packet sizes.`);
        return;
      }
      seenSizes.add(sizeKey);
      normalizedVariants.push({ quantity, unit: variant.unit, price, stock });
    }

    const formData = new FormData();
    formData.append("productName", productName.trim());
    formData.append("categoryId", category);
    formData.append("description", description);
    formData.append("nickname1", nickname1);
    formData.append("nickname2", nickname2);
    formData.append("nickname3", nickname3);
    formData.append("video", video);
    formData.append("recipe", recipe);
    formData.append("productNamealsoyoumaylike", productNamealsoyoumaylike);
    formData.append("link", link);
    formData.append("restriction", restriction);
    formData.append("type", type);
    formData.append("newLaunch", String(newLaunch));
    formData.append("OurComOffer", String(ourComOffer));
    formData.append("is_liquid", String(isLiquid));
    if (rating !== "") formData.append("rating", rating || 4);

    // The backend expects variants as a JSON string in multipart/form-data.
    // Each variant owns its quantity, unit, selling price, and stock.
    formData.append("variants", JSON.stringify(normalizedVariants));

    Object.entries(images).forEach(([field, file]) => {
      if (file) formData.append(field, file);
    });

    try {
      setLoading(true);
      await axios.post(`${API_URL}/products`, formData);
      alert("Product added successfully.");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form__header">
        <div>
          <p className="product-form__eyebrow">CATALOG MANAGEMENT</p>
          <h2>Add Product</h2>
          <p className="product-form__subtitle">Add product details and configure any number of packet options.</p>
        </div>
      </div>

      <section className="product-form__section">
        <h3>Basic information</h3>
        <div className="product-form__grid">
          <label className="product-form__field">
            <span>Product name <b>*</b></span>
            <input type="text" placeholder="e.g. Red Chilli Powder" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          </label>
          <label className="product-form__field">
            <span>Category <b>*</b></span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name || cat.categoryName}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="product-form__field">
          <span>Description</span>
          <textarea rows={4} placeholder="Describe the product, ingredients, or usage..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </section>

      <section className="product-form__section">
        <div className="product-form__section-heading">
          <div>
            <h3>Packet options and pricing</h3>
            <p>Add a separate price and stock quantity for each packet size.</p>
          </div>
          <button className="product-form__button product-form__button--secondary" type="button" onClick={addVariant}>＋ Add packet</button>
        </div>

        <div className="product-form__variants">
          {variants.map((variant, index) => (
            <div className="product-form__variant" key={index}>
              <div className="product-form__variant-title">
                <strong>Packet option {index + 1}</strong>
                {variants.length > 1 && (
                  <button className="product-form__remove" type="button" onClick={() => removeVariant(index)} aria-label={`Remove packet option ${index + 1}`}>Remove</button>
                )}
              </div>
              <div className="product-form__variant-grid">
                <label className="product-form__field">
                  <span>Quantity <b>*</b></span>
                  <input type="text" inputMode="decimal" min="0.001" placeholder="e.g. 100" value={variant.quantity} onChange={(e) => updateVariant(index, "quantity", e.target.value)} onBlur={() => handlePositiveFieldBlur(index, "quantity", "Packet quantity")} required aria-describedby={`quantity-help-${index}`} />
                </label>
                <label className="product-form__field">
                  <span>Unit <b>*</b></span>
                  <select value={variant.unit} onChange={(e) => updateVariant(index, "unit", e.target.value)} required>
                    <option value="g">Gram (g)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="ml">Millilitre (ml)</option>
                    <option value="l">Litre (l)</option>
                    <option value="pcs">Piece (pcs)</option>
                  </select>
                </label>
                <label className="product-form__field">
                  <span>Selling price (₹) <b>*</b></span>
                  <input type="text" inputMode="decimal" placeholder="e.g. 80.00" value={variant.price} onChange={(e) => updateVariant(index, "price", e.target.value)} onBlur={() => handlePositiveFieldBlur(index, "price", "Selling price")} required />
                </label>
                <label className="product-form__field">
                  <span>Available stock (packets) <b>*</b></span>
                  <input type="text" inputMode="numeric" placeholder="e.g. 50" value={variant.stock} onChange={(e) => updateVariant(index, "stock", e.target.value)} onBlur={(e) => { const value = e.target.value; if (value !== "" && (!Number.isSafeInteger(Number(value)) || Number(value) < 0)) updateVariant(index, "stock", ""); }} required />
                </label>
              </div>
            </div>
          ))}
        </div>
        <p className="product-form__hint">Example: 10 g at ₹10 and 100 g at ₹80 are two separate variants with independent stock.</p>
      </section>

      <section className="product-form__section">
        <h3>Product settings</h3>
        <div className="product-form__toggles">
          <label><input type="checkbox" checked={newLaunch} onChange={(e) => setNewLaunch(e.target.checked)} /> <span>New launch</span></label>
          <label><input type="checkbox" checked={ourComOffer} onChange={(e) => setOurComOffer(e.target.checked)} /> <span>Combo / offer</span></label>
          <label><input type="checkbox" checked={isLiquid} onChange={(e) => setIsLiquid(e.target.checked)} /> <span>Liquid product</span></label>
        </div>
        <div className="product-form__grid">
          <label className="product-form__field">
            <span>Nickname 1</span>
            <input type="text" value={nickname1} onChange={(e) => setNickname1(e.target.value)} placeholder="Optional" />
          </label>
          <label className="product-form__field">
            <span>Nickname 2</span>
            <input type="text" value={nickname2} onChange={(e) => setNickname2(e.target.value)} placeholder="Optional" />
          </label>
          <label className="product-form__field">
            <span>Nickname 3</span>
            <input type="text" value={nickname3} onChange={(e) => setNickname3(e.target.value)} placeholder="Optional" />
          </label>
          <label className="product-form__field">
            <span>Rating (0–5)</span>
            <input type="text" inputMode="decimal" value={rating} onChange={(e) => handleRatingChange(e.target.value)} placeholder="Optional (0–5)" aria-label="Rating between 0 and 5" />
          </label>
          <label className="product-form__field">
            <span>Video URL</span>
            <input type="url" value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://..." />
          </label>
          <label className="product-form__field">
            <span>Recipe URL</span>
            <input type="url" value={recipe} onChange={(e) => setRecipe(e.target.value)} placeholder="https://..." />
          </label>
          <label className="product-form__field">
            <span>Related product names</span>
            <input type="text" value={productNamealsoyoumaylike} onChange={(e) => setProductNamealsoyoumaylike(e.target.value)} placeholder="Optional" />
          </label>
          <label className="product-form__field">
            <span>Related link</span>
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </label>
          <label className="product-form__field">
            <span>Restriction</span>
            <input type="text" value={restriction} onChange={(e) => setRestriction(e.target.value)} placeholder="Optional" />
          </label>
          <label className="product-form__field">
            <span>Product type</span>
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Optional" />
          </label>
        </div>
      </section>

      <section className="product-form__section">
        <h3>Product images</h3>
        <p className="product-form__hint">Image 1 is required. You can add up to five images.</p>
        <div className="product-form__images">
          {["image1", "image2", "image3", "image4", "image5"].map((field, index) => (
            <label className="product-form__field" key={field}>
              <span>{`Image ${index + 1}${index === 0 ? " *" : " (optional)"}`}</span>
              <input type="file" name={field} accept="image/*" ref={(el) => { fileInputRefs.current[field] = el; }} onChange={handleImageChange} required={index === 0} />
              {images[field] && <small className="product-form__file-name">{images[field].name}</small>}
            </label>
          ))}
        </div>
      </section>

      <button className="product-form__button product-form__button--primary" type="submit" disabled={loading}>
        {loading ? "Saving product..." : "Add product"}
      </button>
    </form>
  );
};

export default ProductForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./TopCategory.css";

const TopCategory = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [headerImage, setHeaderImage] = useState(null);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [items, setItems] = useState([]);

  const [dataLoading, setDataLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Edit state
  const [editingSlug, setEditingSlug] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }

    // Optional image validation
    if (!selectedImage.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setImage(selectedImage);

    // Show preview
    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);
  };

  // =========================
  // HEADER IMAGE CHANGE
  // =========================
  const handleHeaderImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      alert("Please select a valid header image file.");
      e.target.value = "";
      return;
    }

    setHeaderImage(selectedImage);
    setHeaderImagePreview(URL.createObjectURL(selectedImage));
  };

  // =========================
  // NAME CHANGE
  // =========================
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // =========================
  // DESCRIPTION CHANGE
  // =========================
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setImage(null);
    setImagePreview(null);
    setHeaderImage(null);
    setHeaderImagePreview(null);
    setName('');
    setDescription('');
    setEditingSlug(null);
    setEditingId(null);
  };

  // =========================
  // GET ERROR MESSAGE
  // =========================
  const getErrorMessage = (error, defaultMessage) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.errors?.[0]?.message ||
      error?.message ||
      defaultMessage
    );
  };

  // =========================
  // SUBMIT / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter category description.");
      return;
    }

    // Both images are required when creating a category.
    // During editing, existing images are retained unless replaced.
    if (!editingSlug && !image) {
      alert("Please select a category image.");
      return;
    }

    if (!headerImagePreview && !headerImage) {
      alert("Please select a category header image.");
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description.trim());

    // Only send images when a new file is selected.
    if (image) {
      formData.append("image", image);
    }

    if (headerImage) {
      formData.append("headerImage", headerImage);
    }

    try {
      setUploadLoading(true);

      let response;

      // =========================
      // EDIT CATEGORY
      // =========================
      if (editingSlug) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/categories/${editingSlug}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        alert(
          response?.data?.message ||
          "Category updated successfully."
        );
      }

      // =========================
      // CREATE CATEGORY
      // =========================
      else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/categories`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        alert(
          response?.data?.message ||
          "Category created successfully."
        );
      }

      // Refresh category list
      await fetchItems();

      resetForm();

    } catch (error) {
      console.error(
        editingSlug
          ? "Error updating category:"
          : "Error creating category:",
        error
      );

      alert(
        getErrorMessage(
          error,
          editingSlug
            ? "Failed to update category."
            : "Failed to create category."
        )
      );
    } finally {
      setUploadLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchItems = async () => {
    try {
      setDataLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/categories`
      );

      // Handle both:
      // response.data = []
      // response.data.data = []
      const categories = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setItems(categories);

    } catch (error) {
      console.error("Error fetching categories:", error);

      alert(
        getErrorMessage(
          error,
          "Failed to fetch categories."
        )
      );
    } finally {
      setDataLoading(false);
    }
  };

  // =========================
  // FETCH ON LOAD
  // =========================
  useEffect(() => {
    fetchItems();
  }, []);

  // =========================
  // EDIT CATEGORY
  // =========================
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingSlug(item.slug);

    setName(item.name || '');
    setDescription(item.description || '');

    // Existing image preview
    if (item.image) {
      setImagePreview(
        `${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`
      );
    } else {
      setImagePreview(null);
    }

    setImage(null);

    // Existing header image preview
    if (item.headerImage) {
      setHeaderImagePreview(
        `${process.env.REACT_APP_API_URL}/public/userImages/${item.headerImage}`
      );
    } else {
      setHeaderImagePreview(null);
    }

    setHeaderImage(null);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // DELETE / DEACTIVATE
  // =========================
  const handleDeleteButtonClick = async (item) => {
    if (!item?.id) {
      alert("Invalid category ID.");
      return;
    }

    const confirmed = window.confirm(
      `WARNING!\n\n` +
      `Are you sure you want to delete the category "${item.name}"?\n\n` +
      `All products under this category will also be deactivated and will no longer be visible to customers.\n\n` +
      `This action cannot be undone from this screen.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoadingId(item.id);

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/categories/${item.id}`
      );

      alert(
        response?.data?.message ||
        "Category and its products were deactivated successfully."
      );

      // Remove from active category list
      setItems(prevItems =>
        prevItems.filter(category => category.id !== item.id)
      );

    } catch (error) {
      console.error("Error deleting category:", error);

      alert(
        getErrorMessage(
          error,
          "Failed to delete category."
        )
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="top-category-container">

      <h2 className="heading">
        {editingSlug ? "Edit Category" : "Category"}
      </h2>

      {/* =========================
          CATEGORY FORM
      ========================= */}
      <form
        className="upload-form-category"
        onSubmit={handleSubmit}
      >

        {/* =========================
    IMAGE UPLOAD
========================= */}
        <div className="category-image-upload">

          {imagePreview ? (
            <div className="category-preview-box">

              <div className="category-preview-image-wrapper">
                <img
                  src={imagePreview}
                  alt="Category Preview"
                  className="category-preview-image"
                  onError={(e) => {
                    e.target.src = "";
                    e.target.style.display = "none";
                  }}
                />

                {/* Remove image */}
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>

              <div className="category-preview-info">
                <span className="preview-title">
                  {image
                    ? image.name
                    : "Current category image"
                  }
                </span>

                <label className="change-image-button">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

            </div>
          ) : (
            <label className="category-upload-box">

              <div className="upload-icon">
                📷
              </div>

              <span className="upload-main-text">
                Choose Category Image
              </span>

              <span className="upload-sub-text">
                PNG, JPG or JPEG
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </label>
          )}

        </div>

        {/* CATEGORY HEADER IMAGE UPLOAD */}
        <div className="category-image-upload">
          <label className="field-label">Category Header Image <span className="required-mark">*</span></label>

          {headerImagePreview ? (
            <div className="category-preview-box category-header-preview-box">
              <div className="category-header-preview-image-wrapper">
                <img
                  src={headerImagePreview}
                  alt="Category header preview"
                  className="category-header-preview-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => {
                    setHeaderImage(null);
                    setHeaderImagePreview(null);
                  }}
                  title="Remove header image"
                  aria-label="Remove header image"
                >
                  ×
                </button>
              </div>

              <div className="category-preview-info">
                <span className="preview-title">
                  {headerImage ? headerImage.name : "Current category header image"}
                </span>
                <label className="change-image-button">
                  Change Header Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderImageChange}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="category-upload-box category-header-upload-box">
              <div className="upload-icon">🖼️</div>
              <span className="upload-main-text">Choose Category Header Image</span>
              <span className="upload-sub-text">PNG, JPG or JPEG</span>
              <input
                type="file"
                accept="image/*"
                required={!headerImagePreview}
                onChange={handleHeaderImageChange}
              />
            </label>
          )}
        </div>

        {/* IMAGE INPUT */}
        {/* <label className="custom-file-upload">

          <input
            className="file-input-home"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {image
            ? image.name
            : editingSlug
              ? "Choose new image (optional)"
              : "Choose category image"
          }

        </label> */}

        <input
          className="text-input"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter Name"
          required
        />

        <textarea
          className="description-input"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter category description (recommended: 250 characters or less)"
          maxLength={1000}
          required
        />
        <div className="description-counter">
          <span>{description.length}/1000 characters</span>
          <span className="description-counter-hint">Recommended: 250 characters or less</span>
        </div>

        <button
          className="upload-button1"
          type="submit"
          disabled={uploadLoading}
        >
          {uploadLoading
            ? editingSlug
              ? "Updating..."
              : "Uploading..."
            : editingSlug
              ? "Update Category"
              : "Upload Item"
          }
        </button>

        {/* CANCEL EDIT */}
        {editingSlug && (
          <button
            type="button"
            className="delete-button"
            style={{marginTop:"4px"}}
            onClick={resetForm}
            
          >
            Cancel Edit
          </button>
        )}

      </form>

      {/* =========================
          CATEGORY TABLE
      ========================= */}
      <div className="table-wrapper scroll-container">

        <table className="category-table">

          <thead>
            <tr>
              <th>Image</th>
              <th>Header Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {dataLoading ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px"
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px"
                  }}
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              items.map(item => (

                <tr key={item.id}>

                  {/* IMAGE */}
                  <td>

                    {item.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.image}`}
                        alt={item.name || "Category"}
                        onError={(e) => {
                          console.error(
                            "Category image failed:",
                            e.target.src
                          );

                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <p>No image available</p>
                    )}

                  </td>

                  {/* HEADER IMAGE */}
                  <td>
                    {item.headerImage ? (
                      <img
                        className="category-table-header-image"
                        src={`${process.env.REACT_APP_API_URL}/public/userImages/${item.headerImage}`}
                        alt={`${item.name || "Category"} header`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="no-image-label">No header image</span>
                    )}
                  </td>

                  {/* NAME */}
                  <td>
                    {item.name}
                  </td>

                  {/* DESCRIPTION WITH READ MORE */}
                  <td className="description-table-cell">
                    {(() => {
                      const fullDescription = item.description || "";
                      const isLong = fullDescription.length > 100;
                      const isExpanded = Boolean(expandedDescriptions[item.id]);

                      return (
                        <>
                          <span className="description-preview-text">
                            {isLong && !isExpanded
                              ? `${fullDescription.slice(0, 100).trim()}...`
                              : fullDescription || "—"}
                          </span>
                          {isLong && (
                            <button
                              type="button"
                              className="read-more-button"
                              onClick={() =>
                                setExpandedDescriptions((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }))
                              }
                            >
                              {isExpanded ? "Read less" : "Read more"}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </td>

                  {/* ACTIONS */}
                  <td>

                    <div className="category-actions">

                      {/* EDIT */}
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteButtonClick(item)
                        }
                        disabled={
                          deleteLoadingId === item.id
                        }
                      >
                        {deleteLoadingId === item.id
                          ? "Deactivating..."
                          : "Delete"
                        }
                      </button>

                    </div>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default TopCategory;
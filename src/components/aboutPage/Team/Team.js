import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OurTeam.css";

const OurTeam = () => {
  const [form, setForm] = useState({
    name: "",
    position: "",
    description: ""
  });

  const [expandedMember, setExpandedMember] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [team, setTeam] = useState([]);

  const resetForm = () => {
    setForm({
      name: "",
      position: "",
      description: "",
    });

    setImage(null);
    setImageName("");
    setEditingId(null);
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file?.name || "");
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId && !image) {
      alert("Image required");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("position", form.position);
    formData.append("description", form.description);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editingId) {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/edit-our-team/${editingId}`,
          formData
        );

        const updatedMember = res.data?.data || res.data;

        // Update UI instantly
        setTeam((prev) =>
          prev.map((member) =>
            member.id === editingId ? updatedMember : member
          )
        );

        alert("Team member updated successfully ✅");
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/create-our-team`,
          formData
        );

        const newMember = res.data?.data || res.data;

        // New member appears instantly
        setTeam((prev) => [newMember, ...prev]);

        alert("Team member added successfully ✅");
      }

      resetForm();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        `Failed to ${editingId ? "update" : "add"} team member`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      position: member.position || "",
      description: member.description || "",
    });

    // Image is optional while editing
    setImage(null);
    setImageName("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fetch team
  const fetchTeam = async () => {
    try {
      setFetchLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/create-our-team/api`
      );

      setTeam(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const member = team.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${member?.name || "this team member"
      }"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-our-team/${id}`
      );

      setTeam((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      alert("Team member deleted successfully");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to delete team member"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);


  console.log("Team data:", team);

  return (
    <div className="team-container" style={{ padding: "28px" }}>


      {/* Form */}
      <div className="card team-form">
        <h2>
          {editingId ? "Edit Team Member" : "Our Team Manager"}
        </h2>

        {editingId && (
          <button
            type="button"
            className="btn-cancel"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <label className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {imageName ||
              (editingId
                ? "Choose New Image (optional)"
                : "Choose Image")}
          </label>

          <button
            disabled={loading}
            type="submit"
            className="btn-primary"
          >
            {loading
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
                ? "Update Member"
                : "Add Member"}
          </button>

        </form>
      </div>

      {fetchLoading ? (
        <div className="team-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="card team-card skeleton-card" key={index}>
              <div className="skeleton skeleton-image" />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-position" />
              <div className="skeleton skeleton-description" />

              <div className="skeleton-buttons">
                <div className="skeleton skeleton-button" />
                <div className="skeleton skeleton-button" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="team-grid">
          {team.map((member) => (

            <div key={member.id} className="card team-card">
              <img
                src={`${process.env.REACT_APP_API_URL}/public/userImages/${member.image}`}
                alt={member.name}
              />

              <h3>{member.name}</h3>
              <p className="position">{member.position}</p>
              <div className={`desc ${expandedMember === member.id ? "expanded" : ""}`}>
                {member.description}
              </div>

              {member.description?.length > 120 && (
                <button
                  type="button"
                  className="show-more-btn"
                  onClick={() =>
                    setExpandedMember(
                      expandedMember === member.id ? null : member.id
                    )
                  }
                >
                  {expandedMember === member.id ? "Show less" : "Show more"}
                </button>
              )}

              <div className="team-actions">
                <button
                  type="button"
                  className="btn-edit"
                  disabled={deleteLoading === member.id || loading}
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn-danger"
                  disabled={deleteLoading === member.id}
                  onClick={() => handleDelete(member.id)}
                >
                  {deleteLoading === member.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );


};

export default OurTeam;
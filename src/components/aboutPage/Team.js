import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OurTeam.css";

const OurTeam = () => {
  const [form, setForm] = useState({
    name: "",
    position: "",
    description: ""
  });

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [team, setTeam] = useState([]);

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

    if (!image) {
      alert("Image required");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", form.name);
    formData.append("position", form.position);
    formData.append("description", form.description);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-our-team`,
        formData
      );

      alert("Team member added ✅");

      setTeam((prev) => [res.data, ...prev]);

      // reset
      setForm({ name: "", position: "", description: "" });
      setImage(null);
      setImageName("");
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch team
  const fetchTeam = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/create-our-team/api`
      );

      console.log("Fetched team data:", res);
      setTeam(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-our-team/${id}`
      );

      setTeam((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
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
           <h2 style={{marginBottom:'18px'}}>Our Team Manager</h2>

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
            <input type="file" onChange={handleImage} />
            {imageName || "Choose Image"}
          </label>

          <button type="submit" className="btn-primary">
            Add Member
          </button>
        </form>
      </div>

      {/* Team List */}
      <div className="team-grid">
        {team.map((member) => (
          <div key={member.id} className="card team-card">
            <img
              src={`${process.env.REACT_APP_API_URL}/public/userImages/${member.image}`}
              alt={member.name}
            />

            <h3>{member.name}</h3>
            <p className="position">{member.position}</p>
            <p className="desc">{member.description}</p>

            <button
              className="btn-danger"
              onClick={() => handleDelete(member.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
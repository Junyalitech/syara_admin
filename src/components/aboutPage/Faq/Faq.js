import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FAQ.css";

const FAQ = () => {
  const [form, setForm] = useState({
    question: "",
    answer: ""
  });

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/new-fetch-all-faqs`
      );

      setFaqs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Submit FAQ
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      alert("All fields required");
      return;
    }

    try {
      // Don't add anything to faqs here
      await axios.post(
        `${process.env.REACT_APP_API_URL}/add-faq`,
        form
      );

      setForm({
        question: "",
        answer: ""
      });

      alert("FAQ added ✅");

      // Reload complete FAQ list
      await fetchFaqs();

    } catch (err) {
      console.error(err);
      alert("Failed to add FAQ");
    }
  };

  // Delete FAQ
  const handleDelete = async (id) => {
    setDeleteLoading(id);

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete-faq/${id}`
      );

      // Reload complete FAQ list
      await fetchFaqs();

    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div className="faq-container" style={{ padding: "28px" }}>

      {/* Add FAQ */}
      <div className="card faq-form">
        <h2 style={{ marginBottom: "18px" }}>
          FAQ Manager
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="question"
            placeholder="Enter Question"
            value={form.question}
            onChange={handleChange}
          />

          <textarea
            name="answer"
            placeholder="Enter Answer"
            value={form.answer}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Loading..." : "Add FAQ"}
          </button>

        </form>
      </div>

      {/* FAQ List */}
      <div className="faq-list">

        {loading ? (

          // Show skeletons for ALL FAQs
          <>
            <FAQSkeleton />
            <FAQSkeleton />
            <FAQSkeleton />
            <FAQSkeleton />
            <FAQSkeleton />
          </>

        ) : (

          faqs.map((item) => (
            <div
              key={item.id}
              className="card faq-item"
            >
              <h3>
                Q: {item.question}
              </h3>

              <p>
                A: {item.answer}
              </p>

              <button
                className="btn-danger"
                disabled={deleteLoading === item.id}
                onClick={() => handleDelete(item.id)}
              >
                {deleteLoading === item.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          ))

        )}

      </div>
    </div>
  );
};


// Skeleton component
const FAQSkeleton = () => {
  return (
    <div className="card faq-item faq-skeleton-card">

      <div className="skeleton skeleton-question"></div>

      <div className="skeleton skeleton-answer"></div>

      <div className="skeleton skeleton-answer short"></div>

      <div className="skeleton skeleton-button"></div>

    </div>
  );
};

export default FAQ;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../contactus/contact.css';

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setDataLoading(true);

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/contact-us/api`
        );

        setContacts(response.data);

      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleteLoadingId(id);

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/contact-us/${id}`
      );

      alert('Contact deleted successfully');

      setContacts(
        contacts.filter(contact => contact.id !== id)
      );

    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="contact-us-container">
      <h2>Contact Us - All Contacts</h2>

      {dataLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading contacts...</p>
        </div>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No contacts found
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.message}</td>

                  <td>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deleteLoadingId === contact.id}
                    >
                      {deleteLoadingId === contact.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactUs;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../homePage/HomePage.css"; // Ensure to include your custom CSS file

const SyaraNews = () => {
  const [newsImage, setNewsImage] = useState(null);
  const [newsLink, setNewsLink] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);

  const handleNewsImageChange = (e) => {
    setNewsImage(e.target.files[0]);
  };

  const handleNewsLinkChange = (e) => {
    setNewsLink(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', newsImage);
    formData.append('link', newsLink);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/syara-vedios`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('News article uploaded successfully:', response.data);
      alert('Vedio uploaded successfully');

      // Prepend the new article to the beginning of the array
      setNewsArticles(prevNewsArticles => [response.data, ...prevNewsArticles]);
      setNewsImage(null);
      setNewsLink('');
      
    } catch (error) {
      console.error('Error uploading news article:', error);
    }
  };

  const fetchNewsArticles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/syara-vedios`);
      console.log('Fetched news articles:', response.data);

      // Reverse the order of items
      const reversedItems = response.data.reverse();
      setNewsArticles(reversedItems);
    } catch (error) {
      console.error('Error fetching news articles:', error);
    }
  };

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const handleDeleteNewsArticle = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/syara-vedios/${id}`);
      console.log('News article deleted successfully');
      alert('Vedio deleted successfully');

      setNewsArticles(prevNewsArticles => prevNewsArticles.filter(newsArticle => newsArticle.id !== id));
    } catch (error) {
      console.error('Error deleting news article:', error);
    }
  };

  return (
    <div className="news-container">
      <h2 className="heading">Syara Vedios</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
      <label className="custom-file-upload">
          <input className="file-input-home" type="file" onChange={handleNewsImageChange} />
          Choose any image
        </label>        <input className="text-input" type="text" value={newsLink} onChange={handleNewsLinkChange} placeholder="Enter Vedio Link" />
        <button className="upload-button1" type="submit">Upload News</button>
      </form>
      <div style={{ width: '100%', overflowY: 'auto', maxHeight: '400px', padding: '10px', border: '1px solid #ddd' }}>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Image</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Link</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsArticles.map(article => (
            <tr key={article.id}>
              <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>
                {article.image ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/public/userImages/${article.image}`}
                    alt="Uploaded"
                    style={{ maxWidth: '120px', height: 'auto' }}
                    // onError={(e) => { e.target.onerror = null; e.target.src = "placeholder.jpg"; }}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>{article.link}</td>
              <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>
                <button
                  onClick={() => handleDeleteNewsArticle(article.id)}
                  style={{ backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px', padding: '15px 15px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default SyaraNews;

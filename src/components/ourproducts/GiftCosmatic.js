import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayProducts = () => {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isStockEditing, setIsStockEditing] = useState(false);
    const [stockProduct, setStockProduct] = useState(null);
    const [newStock, setNewStock] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/api`);
                const data = response.data;
                console.log('API Response Data:', data);

                // Adjusted data extraction based on the response format
                if (data.success && Array.isArray(data.data)) {
                    console.log('Setting products:', data.data);
                    setProducts(data.data);
                } else {
                    console.error('Unexpected data format:', data);
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // Handle product deletion
    const handleDelete = async (id) => {
        console.log(`Attempting to delete product with slug: ${id}`);

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
            console.log(`Product with slug: ${id} successfully deleted.`);

            const deletedProduct = products.find(product => product.id === id);
            alert(`Product "${deletedProduct.productName}" deleted successfully.`);

            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Handle click to update a product
    const handleUpdateClick = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setEditLoading(true);
            await axios.put(`${process.env.REACT_APP_API_URL}/products/${currentProduct.slug}`, currentProduct); // Use slug instead of id
            alert(`Product "${currentProduct.productName}" updated successfully.`);
            setProducts(products.map(product => product.slug === currentProduct.slug ? currentProduct : product));
            setIsEditing(false);
            setCurrentProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
        finally {
            setEditLoading(false);
        }
    };

    // Handle input changes in the update form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleStockClick = (product) => {
        setIsStockEditing(true);
        setStockProduct(product);
        setNewStock(product.stock);
    };

    const handleStockUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/update-stock/${stockProduct.id}`,
                { stock: newStock }
            );

            alert("Stock updated successfully");

            // update UI instantly
            setProducts(products.map(p =>
                p.id === stockProduct.id ? { ...p, stock: newStock } : p
            ));

            setIsStockEditing(false);
            setStockProduct(null);

        } catch (error) {
            console.error("Stock update error:", error);
        }
    };

    return (
        <div style={container}>
            <h1 style={heading}>📦 Product Manager</h1>


            {isStockEditing && stockProduct ? (
                <form onSubmit={handleStockUpdate} style={form}>
                    <h2 style={formTitle}>Update Stock</h2>

                    <p style={{ textAlign: "center", marginBottom: "10px" }}>
                        {stockProduct.productName}
                    </p>

                    <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        placeholder="Enter new stock"
                        style={input}
                    />

                    <div style={btnGroup}>
                        <button type="submit" style={primaryBtn}>
                            Update
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsStockEditing(false)}
                            style={secondaryBtn}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) :
                isEditing && currentProduct ? (
                    <form onSubmit={handleFormSubmit} style={form}>
                        <h2 style={formTitle}>Edit Product</h2>

                        {/* Product Name */}
                        <label style={label}>Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            value={currentProduct.productName}
                            onChange={handleInputChange}
                            style={input}
                        />

                        <label style={label}>Product Description</label>
                        <input
                            type="text"
                            name="description"
                            value={currentProduct.description}
                            onChange={handleInputChange}
                            style={input}
                        />

                        {/* Price */}
                        <label style={label}>Base Price</label>
                        <input
                            type="text"
                            name="price"
                            value={currentProduct.price}
                            onChange={handleInputChange}
                            style={input}
                        />

                        {/* Flags */}
                        <div style={checkboxRow}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentProduct.newLaunch}
                                    onChange={(e) =>
                                        handleInputChange({
                                            target: { name: "newLaunch", value: e.target.checked },
                                        })
                                    }
                                />
                                New Launch
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentProduct.OurComOffer}
                                    onChange={(e) =>
                                        handleInputChange({
                                            target: { name: "OurComOffer", value: e.target.checked },
                                        })
                                    }
                                />
                                Offer
                            </label>
                        </div>

                        {/* Nicknames */}
                        <label style={label}>Nickname 1</label>
                        <input
                            type="text"
                            name="nickname1"
                            value={currentProduct.nickname1 || ""}
                            onChange={handleInputChange}
                            style={input}
                        />

                        <label style={label}>Nickname 2</label>
                        <input
                            type="text"
                            name="nickname2"
                            value={currentProduct.nickname2 || ""}
                            onChange={handleInputChange}
                            style={input}
                        />

                        <label style={label}>Nickname 3</label>
                        <input
                            type="text"
                            name="nickname3"
                            value={currentProduct.nickname3 || ""}
                            onChange={handleInputChange}
                            style={input}
                        />

                        {/* Prices */}
                        <label style={label}>1{currentProduct.is_liquid ? 'L' : 'kg'} Price</label>
                        <input
                            type="number"
                            name="packeoption1kgrate"
                            value={currentProduct.packeoption1kgrate || ""}
                            onChange={handleInputChange}
                            style={input}
                        />

                        <label style={label}>500{currentProduct.is_liquid ? 'ml' : 'g'} Price</label>
                        <input
                            type="number"
                            name="packeoption500gmrate"
                            value={currentProduct.packeoption500gmrate || ""}
                            onChange={handleInputChange}
                            style={input}
                        />

                        {/* Liquid */}
                        <label style={label}>
                            <input
                                type="checkbox"
                                checked={currentProduct.is_liquid || false}
                                onChange={(e) =>
                                    handleInputChange({
                                        target: { name: "isLiquid", value: e.target.checked },
                                    })
                                }
                            />
                            Is Liquid Product
                        </label>

                        {/* Images */}
                        <label style={label}>Image 1</label>
                        <input type="file" name="image1" onChange={(e) =>
                            setCurrentProduct({ ...currentProduct, image1: e.target.files[0] })
                        } />

                        <label style={label}>Image 2</label>
                        <input type="file" name="image2" onChange={(e) =>
                            setCurrentProduct({ ...currentProduct, image2: e.target.files[0] })
                        } />

                        <label style={label}>Image 3</label>
                        <input type="file" name="image3" onChange={(e) =>
                            setCurrentProduct({ ...currentProduct, image3: e.target.files[0] })
                        } />

                        <label style={label}>Image 4</label>
                        <input type="file" name="image4" onChange={(e) =>
                            setCurrentProduct({ ...currentProduct, image4: e.target.files[0] })
                        } />

                        <label style={label}>Image 5</label>
                        <input type="file" name="image5" onChange={(e) =>
                            setCurrentProduct({ ...currentProduct, image5: e.target.files[0] })
                        } />

                        {/* Buttons */}
                        <div style={btnGroup}>
                            <button type="submit" disabled={editLoading} style={primaryBtn}>
                                {editLoading ? "Updating..." : "Update"}
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} style={secondaryBtn}>
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={grid}>
                        {products.map((product) => (
                            <div key={product.id} style={card}>
                                <div style={imageWrapper}>
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/public/userImages/${product.image1}`}
                                        alt="product"
                                        style={image}
                                    />

                                    {product.newLaunch && <span style={badgeNew}>NEW</span>}
                                    {product.OurComOffer && <span style={badgeOffer}>OFFER</span>}
                                </div>

                                <div style={cardBody}>
                                    <h3 style={productName}>{product.productName}</h3>

                                    <p style={description}>
                                        {product.description?.slice(0, 60)}...
                                    </p>

                                    <div style={priceBox}>
                                        <p><strong>{product.is_liquid ? '1L' : '1kg'}:</strong> ₹ {product.packeoption1kgrate}</p>
                                        <p><strong>{product.is_liquid ? '500ml' : '500g'}:</strong> ₹ {product.packeoption500gmrate}</p>
                                    </div>

                                    <p style={stock}>
                                        Stock: <span>{product.stock}</span>
                                    </p>

                                    <div style={btnGroup}>
                                        <button
                                            onClick={() => handleStockClick(product)}
                                            style={secondaryBtn}
                                        >
                                            Update Stock
                                        </button>

                                        <button
                                            onClick={() => handleUpdateClick(product)}
                                            style={primaryBtn}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={dangerBtn}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
};

export default DisplayProducts;

// Styles
const container = {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh",
};

const heading = {
    textAlign: "center",
    marginBottom: "30px",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
};

const label = {
    display: "block",
    fontWeight: "600",
    marginBottom: "5px",
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
};


const card = {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "0.3s",
    overflowX: "hidden" // ✅ ADD THIS
};

const image = {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    scale: "0.6"
};

const cardBody = {
    padding: "15px",
    textAlign: "center",
};



const price = {
    color: "#28a745",
    fontWeight: "bold",
    margin: "10px 0",
};

const btnGroup = {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap", // ✅ prevents overflow
};

const primaryBtn = {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
};

const dangerBtn = {
    ...primaryBtn,
    background: "#dc3545",
};

const secondaryBtn = {
    ...primaryBtn,
    background: "#6c757d",
};


const form = {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const formTitle = {
    textAlign: "center",
    marginBottom: "15px",
};

const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
};

const checkboxRow = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
};

const imageWrapper = {
    position: "relative",
};

const badgeNew = {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "#28a745",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "4px",
};

const badgeOffer = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#ff9800",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "4px",
};

const description = {
    fontSize: "13px",
    color: "#666",
    margin: "8px 0",
};

const priceBox = {
    background: "#f8f9fa",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "10px",
};

const stock = {
    fontSize: "14px",
    marginBottom: "10px",
};

const productName = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "5px",
};
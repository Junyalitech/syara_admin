import { useEffect, useState } from "react";
import axios from "axios";
import "./shipping.css";

const API = process.env.REACT_APP_API_URL;

const ShippingPage = () => {
    const initialState = {
        pincode: "",
        free_delivery_available: false,
        porter_available: false,
        porter_charge: "",
        courier_road_available: false,
        courier_road_charge: "",
        courier_air_available: false,
        courier_air_charge: "",
    };

    const [form, setForm] = useState(initialState);
    const [list, setList] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/get-pincodes-at-admin`);
            setList(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ VALIDATION
    const validate = () => {
        if (!/^\d{6}$/.test(form.pincode)) {
            alert("Invalid pincode");
            return false;
        }

        if (form.porter_available && !form.porter_charge) {
            alert("Enter porter charge");
            return false;
        }

        if (form.courier_road_available && !form.courier_road_charge) {
            alert("Enter road charge");
            return false;
        }

        if (form.courier_air_available && !form.courier_air_charge) {
            alert("Enter air charge");
            return false;
        }

        return true;
    };

    // ✅ TOGGLE LOGIC
    const handleToggle = (field) => {
        let updated = { ...form, [field]: !form[field] };

        // ✅ FREE → disable all
        if (field === "free_delivery_available" && updated.free_delivery_available) {
            updated = {
                ...updated,
                porter_available: false,
                courier_road_available: false,
                courier_air_available: false,
            };
        }

        // ✅ PORTER → disable free + air
        if (field === "porter_available" && updated.porter_available) {
            updated = {
                ...updated,
                free_delivery_available: false,
                courier_air_available: false,
            };
        }

        // ✅ ROAD → disable free only
        if (field === "courier_road_available" && updated.courier_road_available) {
            updated = {
                ...updated,
                free_delivery_available: false,
            };
        }

        // ✅ AIR → disable free + porter
        if (field === "courier_air_available" && updated.courier_air_available) {
            updated = {
                ...updated,
                free_delivery_available: false,
                porter_available: false,
            };
        }

        setForm(updated);
    };

    // ✅ SUBMIT
    const handleSubmit = async () => {
        if (!validate()) return;


        try {
            setBtnLoading(true);

            const payload = {
                pincode: form.pincode,

                // ✅ FREE
                free_delivery_available: form.free_delivery_available,
                free_delivery_charge: form.free_delivery_available
                    ? Number(form.free_delivery_charge || 0)
                    : 0,
                free_delivery_time: form.free_delivery_available
                    ? form.free_delivery_time || ""
                    : null,

                // ✅ PORTER
                porter_available: form.porter_available,
                porter_charge: form.porter_available
                    ? Number(form.porter_charge || 0)
                    : 0,
                porter_time: form.porter_available
                    ? form.porter_time || ""
                    : null,

                // ✅ ROAD
                courier_road_available: form.courier_road_available,
                courier_road_charge: form.courier_road_available
                    ? Number(form.courier_road_charge || 0)
                    : 0,
                courier_road_time: form.courier_road_available
                    ? form.courier_road_time || ""
                    : null,

                // ✅ AIR
                courier_air_available: form.courier_air_available,
                courier_air_charge: form.courier_air_available
                    ? Number(form.courier_air_charge || 0)
                    : 0,
                courier_air_time: form.courier_air_available
                    ? form.courier_air_time || ""
                    : null,
            };

            if (editing) {
                await axios.put(`${API}/update-pincode/${form.pincode}`, payload);
            } else {
                await axios.post(`${API}/add-pincode`, payload);
            }

            setForm(initialState);
            setEditing(false);
            fetchData();

        } catch (err) {
            console.log(err);
        } finally {
            setBtnLoading(false);
        }
    };

    // ✅ DELETE
    const handleDelete = async (pincode) => {
        if (!window.confirm("Delete this pincode?")) return;

        try {
            setDeleteLoading(pincode);
            await axios.delete(`${API}/delete-pincode/${pincode}`);
            fetchData();
        } finally {
            setDeleteLoading(null);
        }
    };

    // ✅ EDIT
    const handleEdit = (item) => {
        setForm(item);
        setEditing(true);
    };

    return (
        <div className="shipping-page">

            {/* 🔥 FORM */}
            <div className="card form-card">
                <h2>{editing ? "Update Pincode" : "Add Pincode"}</h2>

                <div className="form-group">
                    <label >Pincode</label>
                    <input
                        className={error ? "input error" : "input"}
                        placeholder="Enter 6-digit pincode"
                        value={form.pincode}
                        maxLength={6}
                        disabled={editing}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // ❌ remove non-digits
                            setForm({ ...form, pincode: value });
                        }}
                    />
                    {error && <p className="error-text">{error}</p>}
                </div>

                <div className="options-grid">

                    {/* FREE */}
                    <div className="option-card">
                        <label >
                            <input
                                type="checkbox"
                                checked={form.free_delivery_available}
                                onChange={() => handleToggle("free_delivery_available")}
                            />
                            Free Delivery
                        </label>

                        {form.free_delivery_available && (
                            <input
                                className="input small"
                                placeholder="Delivery Time (e.g. 3-5 days)"
                                value={form.free_delivery_time}
                                onChange={(e) =>
                                    setForm({ ...form, free_delivery_time: e.target.value })
                                }
                            />
                        )}

                    </div>

                    {/* PORTER */}
                    <div className="option-card">
                        <label>
                            <input
                                type="checkbox"
                                checked={form.porter_available}
                                disabled={form.free_delivery_available || form.courier_air_available}
                                onChange={() => handleToggle("porter_available")}
                            />
                            Porter
                        </label>

                        {form.porter_available && (
                            <>
                                <input
                                    className="input small"
                                    placeholder="₹ Charge"
                                    value={form.porter_charge}
                                    onChange={(e) =>
                                        setForm({ ...form, porter_charge: e.target.value })
                                    }
                                />

                                <input
                                    className="input small"
                                    placeholder="Delivery Time (e.g. 2-3 hrs)"
                                    value={form.porter_time}
                                    onChange={(e) =>
                                        setForm({ ...form, porter_time: e.target.value })
                                    }
                                />
                            </>
                        )}
                    </div>

                    {/* ROAD */}
                    <div className="option-card">
                        <label>
                            <input
                                type="checkbox"
                                checked={form.courier_road_available}
                                disabled={form.free_delivery_available}
                                onChange={() => handleToggle("courier_road_available")}
                            />
                            Courier Road
                        </label>

                        {form.courier_road_available && (
                            <>
                                <input
                                    className="input small"
                                    placeholder="₹ Charge"
                                    value={form.courier_road_charge}
                                    onChange={(e) =>
                                        setForm({ ...form, courier_road_charge: e.target.value })
                                    }
                                />

                                <input
                                    className="input small"
                                    placeholder="Delivery Time (e.g. 2-4 days)"
                                    value={form.courier_road_time}
                                    onChange={(e) =>
                                        setForm({ ...form, courier_road_time: e.target.value })
                                    }
                                />
                            </>
                        )}
                    </div>

                    {/* AIR */}
                    <div className="option-card">
                        <label>
                            <input
                                type="checkbox"
                                checked={form.courier_air_available}
                                disabled={form.free_delivery_available}
                                onChange={() => handleToggle("courier_air_available")}
                            />
                            Courier Air
                        </label>

                        {form.courier_air_available && (
                            <>
                                <input
                                    className="input small"
                                    placeholder="₹ Charge"
                                    value={form.courier_air_charge}
                                    onChange={(e) =>
                                        setForm({ ...form, courier_air_charge: e.target.value })
                                    }
                                />

                                <input
                                    className="input small"
                                    placeholder="Delivery Time (e.g. 1-2 days)"
                                    value={form.courier_air_time}
                                    onChange={(e) =>
                                        setForm({ ...form, courier_air_time: e.target.value })
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>

                <button className="btn primary" onClick={handleSubmit} disabled={btnLoading}>
                    {btnLoading ? "Processing..." : editing ? "Update" : "Add"}
                </button>
            </div>
            {/* 🔥 TABLE */}
            <div className="card">
                <h2 className="title">Shipping Table</h2>

                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Pincode</th>
                                <th>Free</th>
                                <th>Porter</th>
                                <th>Courier (Road)</th>
                                <th>Courier (Air)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="6">
                                            <div className="skeleton"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                list.map((item) => (
                                    <tr key={item.pincode}>
                                        <td className="pincode">{item.pincode}</td>

                                        {/* FREE */}
                                        <td>
                                            {item.free_delivery_available ? (
                                                <>
                                                    <span className="badge success">Free</span>
                                                    <div className="time">{item.free_delivery_time}</div>
                                                </>
                                            ) : (
                                                <span className="badge danger">No</span>
                                            )}
                                        </td>

                                        {/* PORTER */}
                                        <td>
                                            {item.porter_available ? (
                                                <>
                                                    <span className="price">₹{item.porter_charge}</span>
                                                    <div className="time">{item.porter_time}</div>
                                                </>
                                            ) : (
                                                <span className="badge danger">No</span>
                                            )}
                                        </td>

                                        {/* ROAD */}
                                        <td>
                                            {item.courier_road_available ? (
                                                <>
                                                    <span className="price">₹{item.courier_road_charge}</span>
                                                    <div className="time">{item.courier_road_time}</div>
                                                </>
                                            ) : (
                                                <span className="badge danger">No</span>
                                            )}
                                        </td>

                                        {/* AIR */}
                                        <td>
                                            {item.courier_air_available ? (
                                                <>
                                                    <span className="price">₹{item.courier_air_charge}</span>
                                                    <div className="time">{item.courier_air_time}</div>
                                                </>
                                            ) : (
                                                <span className="badge danger">No</span>
                                            )}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="actions">
                                            <button className="btn edit" onClick={() => handleEdit(item)}>
                                                Edit
                                            </button>
                                            <button
                                                className="btn delete"
                                                onClick={() => handleDelete(item.pincode)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
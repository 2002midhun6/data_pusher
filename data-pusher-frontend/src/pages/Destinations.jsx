import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Destinations.css";

const Destinations = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [errors, setErrors] = useState({});
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const res = await api.get("/api/accounts/");
    setAccounts(res.data);
  };

  const fetchDestinations = async (accountUUID) => {
    if (!accountUUID) return;

    const res = await api.get(
      `/api/destinations/?account_id=${accountUUID}`
    );
    setDestinations(res.data);
  };

  const handleAccountChange = (e) => {
    const accountUUID = e.target.value;
    setSelectedAccount(accountUUID);
    fetchDestinations(accountUUID);
    resetForm();
  };

  const validateForm = () => {
  const newErrors = {};

  if (!selectedAccount) {
    newErrors.account = "Please select an account.";
  }

  if (!url.trim()) {
    newErrors.url = "Webhook URL is required.";
  } else {
    try {
      new URL(url);
    } catch {
      newErrors.url = "Enter a valid URL.";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // CREATE destination
  const createDestination = async () => {
  if (!validateForm()) return;

  const selectedAccountObj = accounts.find(
    (acc) => acc.account_id === selectedAccount
  );

  try {
    await api.post("/api/destinations/", {
      account: selectedAccountObj.id,
      url,
      http_method: method,
      headers: {
        "Content-Type": "application/json",
      },
    });

    resetForm();
    fetchDestinations(selectedAccount);
  } catch (err) {
    if (err.response?.data?.url) {
      setErrors({ url: err.response.data.url[0] });
    }
  }
};

  // UPDATE destination
  const updateDestination = async () => {
  if (!validateForm()) return;

  const selectedAccountObj = accounts.find(
    (acc) => acc.account_id === selectedAccount
  );

  await api.put(`/api/destinations/${editingId}/`, {
    account: selectedAccountObj.id,
    url,
    http_method: method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  resetForm();
  fetchDestinations(selectedAccount);
};


  // DELETE destination
  const deleteDestination = async (id) => {
    await api.delete(`/api/destinations/${id}/`);
    fetchDestinations(selectedAccount);
  };

  // Start edit
  const startEdit = (dest) => {
    setEditingId(dest.id);
    setUrl(dest.url);
    setMethod(dest.http_method);
  };

  const resetForm = () => {
    setUrl("");
    setMethod("POST");
    setEditingId(null);
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Destinations</h2>

        {/* Account Selector */}
        <select onChange={handleAccountChange} value={selectedAccount}>
          <option value="">Select Account</option>
          {errors.account && <p className="error">{errors.account}</p>}

          {accounts.map((acc) => (
            <option key={acc.account_id} value={acc.account_id}>
              {acc.account_name}
            </option>
          ))}
        </select>

        <hr />

        {/* Create / Edit Destination */}
        <h3>{editingId ? "Edit Destination" : "Create Destination"}</h3>

     <textarea
  placeholder="Webhook URL"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  rows={1}
  className="auto-textarea"
  onInput={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
/>
{errors.url && <p className="error">{errors.url}</p>}


        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>

        {editingId ? (
          <>
            <button onClick={updateDestination}>Update</button>
            <button onClick={resetForm}>Cancel</button>
          </>
        ) : (
          <button onClick={createDestination}>Create</button>
        )}

        <hr />

        {/* Destination List */}
        <h3>Destinations List</h3>

        <ul>
          {destinations.map((dest) => (
            <li key={dest.id}>
              <div>
                <b>{dest.http_method}</b> <span className="email-black"> ---— {dest.url}</span>
              </div>

              <div>
                <button onClick={() => startEdit(dest)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => deleteDestination(dest.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Destinations;

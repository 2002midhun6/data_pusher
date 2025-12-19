import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const res = await api.get("/api/accounts/");
    setAccounts(res.data);
  };

  const createAccount = async () => {
    if (!validateForm()) return;

    try {
      await api.post("/api/accounts/", {
        email,
        account_name: name,
      });
      resetForm();
      fetchAccounts();
    } catch (err) {
      if (err.response?.data?.email) {
        setErrors({ email: err.response.data.email[0] });
      }
    }
  };

  const updateAccount = async () => {
    if (!validateForm()) return;

    try {
      await api.put(`/api/accounts/${editingId}/`, {
        email,
        account_name: name,
      });
      resetForm();
      fetchAccounts();
    } catch (err) {
      if (err.response?.data?.email) {
        setErrors({ email: err.response.data.email[0] });
      }
    }
  };

  const deleteAccount = async (id) => {
    await api.delete(`/api/accounts/${id}/`);
    fetchAccounts();
  };

  const startEdit = (account) => {
    setEditingId(account.id);
    setEmail(account.email);
    setName(account.account_name);
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setEditingId(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!name.trim()) {
      newErrors.name = "Account name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Account name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Accounts</h2>

        <div className="form">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            placeholder="Account Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {editingId ? (
            <>
              <button onClick={updateAccount}>Update</button>
              <button onClick={resetForm}>Cancel</button>
            </>
          ) : (
            <button onClick={createAccount}>Create</button>
          )}
        </div>

        <ul className="list">
          {accounts.map((acc) => (
            <li key={acc.id} className="account-item">
              <div>
                <b>{acc.account_name}</b>
                <div className="email-black">{acc.email}</div>

                {/* 🔐 TOKEN DISPLAY */}
                <div className="token-box">
                  <small>App Secret Token</small>
                  <div className="token-row">
                    <code>{acc.app_secret_token}</code>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(acc.app_secret_token)
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="actions">
                <button onClick={() => startEdit(acc)}>Edit</button>
                <button onClick={() => deleteAccount(acc.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Accounts;

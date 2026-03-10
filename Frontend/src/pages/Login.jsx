import { useState, useContext } from "react";
import { login } from "../api/auth";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.email || !form.password) {
      return "All fields are required";
    }
    if (!form.email.includes("@")) {
      return "Invalid email format";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login(form);

      if (!res.token) {
        throw new Error(res.message || "Login failed");
      }

      loginUser(res);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          disabled={loading}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [signing, setSigning] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Email regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return "All fields are required";

    if (!isValidEmail(form.email))
      return "Invalid email format";

    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSigning(true);
    setError("");
    const res = await signup(form);

    if (res.status === 200) {
      toast.success("Account created. Verify your email")
      navigate("/login");
    } else {
      setError(res.message || "Signup failed");
    }
    setSigning(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button className={`${signing ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'} text-white w-full py-2 rounded`} disabled={signing}>
          Signup
        </button>
      </form>
    </div>
  );
}
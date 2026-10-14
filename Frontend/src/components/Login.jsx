import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    let valid = true;
    setSuccess(false);

    // Email validation
    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.trim())) {
        setEmailError("Please enter a valid email");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password validation
    if (password === "") {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    // Stop if validation fails
    if (!valid) return;

    setLoading(true);

    try {
      // Send login details to the backend
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: email.trim(),
          password,
        },
      );

      // Save token if returned by the backend
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save user details if returned by the backend
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      setSuccess(true);

      // Navigate after successful login
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSuccess(false);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials or backend server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-sm px-4">
        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-6 shadow-lg">
            <legend className="fieldset-legend text-lg font-semibold px-2">
              Login
            </legend>

            {/* Email */}
            <label htmlFor="login-email" className="label">
              Email <span className="text-error">*</span>
            </label>

            <input
              id="login-email"
              type="email"
              className={`input w-full ${emailError ? "input-error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="Enter Your Email"
            />

            {emailError && (
              <p className="text-error text-sm mt-1">{emailError}</p>
            )}

            {/* Password */}
            <label htmlFor="login-password" className="label mt-3">
              Password <span className="text-error">*</span>
            </label>

            <input
              id="login-password"
              type="password"
              className={`input w-full ${passwordError ? "input-error" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder="Enter Your Password"
            />

            {passwordError && (
              <p className="text-error text-sm mt-1">{passwordError}</p>
            )}

            {/* Success Message */}
            {success && (
              <div role="alert" className="alert alert-success mt-3">
                <span>Login successful!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-neutral mt-4 w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center mt-4 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register
              </Link>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    let valid = true;
    setSuccess(false);

    // Name validation
    if (name.trim() === "") {
      setNameError("Username is required");
      valid = false;
    } else if (name.trim().length < 3) {
      setNameError("Username must contain at least 3 characters");
      valid = false;
    } else {
      setNameError("");
    }

    // Email validation
    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setEmailError("Please enter a valid email");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    // Password validation
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (password.trim() === "") {
      setPasswordError("Password is required");
      valid = false;
    } else if (!passwordPattern.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and contain uppercase, lowercase, digit, and special character",
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    // Confirm password validation
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Confirm password is required");
      valid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) return;

    // Registration successful
    setSuccess(true);
    // TODO: Perform API call to register user here
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse gap-10">
        {/* Left Side */}
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl font-bold">Create Account!</h1>
          <p className="py-6 text-base-content/70">
            Join our platform today and explore all features. It only takes a minute to set up your account.
          </p>
        </div>

        {/* Registration Card */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            {/* Success Alert */}
            {success && (
              <div role="alert" className="alert alert-success mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Account created successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="fieldset">
                {/* Full Name */}
                <label htmlFor="name" className="label">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={`input w-full ${nameError ? "input-error" : ""}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  placeholder="Enter Your Name"
                />
                {nameError && (
                  <p className="text-error text-sm mt-1">{nameError}</p>
                )}

                {/* Email */}
                <label htmlFor="email" className="label mt-3">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  id="email"
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
                <label htmlFor="password" className="label mt-3">
                  Password <span className="text-error">*</span>
                </label>
                <input
                  id="password"
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

                {/* Confirm Password */}
                <label htmlFor="confirmPassword" className="label mt-3">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`input w-full ${confirmPasswordError ? "input-error" : ""}`}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  placeholder="Confirm Your Password"
                />
                {confirmPasswordError && (
                  <p className="text-error text-sm mt-1">
                    {confirmPasswordError}
                  </p>
                )}

                {/* Submit */}
                <button type="submit" className="btn btn-neutral mt-4 w-full">
                  Create Account
                </button>

                {/* Login Link */}
                <p className="text-center mt-4 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="link link-primary">
                    Login
                  </Link>
                </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
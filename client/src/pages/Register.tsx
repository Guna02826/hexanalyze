import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setAuthCredentials } from "../store/authSlice";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      registerSchema.parse({ name, email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. Send registration request to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );

      // 2. The backend responds with the user & token, so we save it directly to Redux!
      dispatch(
        setAuthCredentials({
          user: {
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
          },
          token: response.data.token,
        }),
      );

      // 3. Send them to the homepage
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Simple Branding Header */}
      <div className="w-full p-6 flex justify-center sm:justify-start">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/favicon.png" alt="Hexalyze Logo" className="h-8 w-8 mr-3" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Hexalyze
          </h1>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="text-slate-300 font-semibold mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold mb-2 block">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold mb-2 block">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* A link to switch back to the login page */}
        <p className="text-slate-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Register;

import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setAuthCredentials } from "../store/authSlice";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useDispatch allows us to trigger our Redux actions
  const dispatch = useDispatch();
  // useNavigate allows us to change pages
  const navigate = useNavigate();

  const submitLogin = async (loginEmail: string, loginPassword: string) => {
    setError("");
    setIsLoading(true);

    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. Send login request to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
        {
          email: loginEmail,
          password: loginPassword,
        },
        { withCredentials: true }
      );

      // 2. If successful, save the data to Redux using the action we created!
      dispatch(
        setAuthCredentials({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      // 3. Redirect the user to the homepage
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoEmail = "demo@aijobanalyzer.com";
    const demoPassword = "demoPassword123";
    // Visually fill the inputs
    setEmail(demoEmail);
    setPassword(demoPassword);
    // Execute the login
    submitLogin(demoEmail, demoPassword);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    submitLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">or</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Use Demo Account"}
          </button>
        </form>

        {/* A link to switch to the register page */}
        <p className="text-slate-400 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

'use client';
import { useAlert } from "@/components/AlertProvider/AlertContext";
import api from "@/lib/axios";
import { LogIn, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";


export default function Login() {
  const { showAlert } = useAlert();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        showAlert("Email is required!", "warning")
        return;
      }

      if (!password) {
        showAlert("Password is required!", "warning")
        return;
      }


      if (isLogin) {
        const res = await api.post("action/login", {
          email,
          password
        });

        if (res.status === 200) {
          showAlert(res.data.message, "success");
          window.location.href = '/dashboard'
        } else {
          showAlert(res.data.message, "error");
        }

      } else {
        if (!confirmPassword) {
          showAlert("Confirm password is required!", "warning")
          return;
        }

        if (!confirmPassword.match(password)) {
          showAlert("Confirm password is not matched the password!", "warning")
          return;
        }

        const res = await api.post("action/sign_up", {
          username,
          email,
          password
        });

        if (res.status === 201) {
          showAlert(res.data.message, "success");
          setIsLogin(true);
          window.location.href = '/'
        } else {
          showAlert(res.data.message, "error");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 text-gray-800"
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 text-gray-800"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 text-gray-800"
              placeholder="********"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 text-gray-800"
                placeholder="********"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md
                       hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? <><LogIn size={20} className="mr-2" /> Login</> : <><UserPlus size={20} className="mr-2" /> Sign Up</>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
            disabled={loading}
          >
            {isLogin ? 'Sign up here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}

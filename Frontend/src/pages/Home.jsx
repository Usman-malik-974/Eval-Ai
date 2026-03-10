import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-indigo-700 text-white">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur">
        <h1 className="text-2xl font-bold">AI Interview Simulator</h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded font-semibold"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="border border-white px-4 py-2 rounded font-semibold"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-32 px-6">
        <h2 className="text-5xl font-bold mb-6">
          Crack Your Dream Job with AI
        </h2>

        <p className="max-w-2xl text-lg mb-8">
          Practice real interview scenarios powered by AI.
          Get coding, behavioral, and system design interviews
          tailored to your target role.
        </p>

        <Link
          to="/signup"
          className="bg-yellow-400 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
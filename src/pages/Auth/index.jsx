import {useEffect, useState} from "react"
import {Link} from "react-router-dom";

export default function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        document.title = "Sign In";
    }, [])

    const loginHandler = async event => {
        event.preventDefault()

        const userInfo = {
            email: email.trim().toLowerCase(),
            password: password.trim().toLowerCase()
        }

        console.log(userInfo)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-200">Welcome Back</h2>
                <p className="text-sm text-center text-gray-300">Please login to your account</p>

                <form className="space-y-4" onSubmit={loginHandler}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            name="email"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="your password"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2 text-sm text-gray-500 hover:text-violet-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            Remember me
                        </label>
                        <a href="#" className="text-violet-500 hover:underline">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-500 text-white font-semibold rounded-lg py-2 hover:bg-violet-600 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Don’t have an account?{" "}
                    <Link to="/auth/signup" className="text-violet-500 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    )
}
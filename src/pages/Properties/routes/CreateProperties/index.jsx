import {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {errorMessageHandler} from "@/callApi/callApi-utils.js"
import {signupUsers} from "@/callApi/callApi.js";

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        document.title = "Sign up"
    }, []);

    const signupHandler = async event => {
        event.preventDefault();

        errorMessageHandler(null, setError)
        setSuccess("")

        const userInfo = {
            displayName: name.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password: password.trim().toLowerCase()
        }

        try {
            const res = await signupUsers(userInfo)

            if (res) {
                setEmail("");
                setName("");
                setPassword("");
                setSuccess("Sign up successfully.")
            }
        } catch (e) {
            console.log(e)
            errorMessageHandler(e, setError)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-200">Create Account</h2>
                <p className="text-sm text-center text-gray-300">Sign up to start your journey</p>
                <h3 className={"text-emerald-500 text-center"}>{success}</h3>
                <h3 className={"text-center text-rose-600 font-medium"}>{error}</h3>

                <form className="space-y-4" onSubmit={signupHandler}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                        <input
                            required
                            value={name}
                            onChange={event => setName(event.target.value)}
                            name="name"
                            type="text"
                            id="name"
                            placeholder="Your full name"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            required
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            name="email"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                required
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="********"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2 text-sm text-gray-500 hover:text-blue-500 cursor-pointer"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold rounded-lg py-2 hover:bg-blue-600 transition cursor-pointer"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-500 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
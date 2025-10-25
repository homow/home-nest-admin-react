import {useEffect, useState, useRef} from "react";
import AlertModal from "@components/ui/AlertModal";
import {useAuth} from "@/context/AuthContext";
import {login} from "@api/requests/auth.js";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [alertModal, setAlertModal] = useState({isOpen: false, type: "error", message: ""});
    const inputRef = useRef(null);
    const alertTimeoutRef = useRef(null);
    const {setAuthInfo} = useAuth();

    useEffect(() => {
        document.title = "ورود به اکانت ادمین | آشیانه";
        inputRef?.current?.focus();
    }, []);

    useEffect(() => {
        if (alertModal.isOpen) {
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);

            alertTimeoutRef.current = setTimeout(() => {
                setAlertModal({isOpen: false, type: "error", message: ""});
            }, 5000);
        }

        // cleanUp Timer
        return () => {
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        }
    }, [alertModal]);

    const loginHandler = async event => {
        event.preventDefault();

        const userInfo = {
            email: email.trim().toLowerCase(),
            password: password.trim(),
            remember
        };

        try {
            setAlertModal({isOpen: false, type: "error", message: ""});

            const res = await login(userInfo);

            if (res.ok && res.user.role === "admin") {
                setAlertModal({isOpen: true, type: "success", message: "خب، بالاخره وارد شدی."});

                setTimeout(() => {
                    setAuthInfo({userData: res.user, token: res.accessToken});
                }, 3000)
            }

        } catch (err) {
            console.log(err);

            const data = err.response?.data || {};
            const status = err.response?.status;

            let message = "خطای ناشناخته یا شبکه رخ داد";

            if (status === 503 || data.error === "NETWORK_ERROR") {
                message = "ارتباط با سرور برقرار نشد، اینترنت یا سرور را بررسی کن";
            } else if (status === 401 || data.error === "INVALID_CREDENTIALS") {
                message = "رمز یا ایمیلت اشتباهه";
            } else if (status === 403 || data.error === "ACCESS_DENIED") {
                message = "شما اجازه ورود ندارید";
            } else if (status >= 500) {
                message = "خطا از سمت سرور، بعداً تلاش کن";
            }

            setAlertModal({
                isOpen: true,
                type: "error",
                message
            });
        }
    }

    return (
        <>
            <AlertModal {...alertModal}/>
            <section className="flex items-center justify-center min-h-screen">
                <div className="max-w-9/10 w-full xs:max-w-sm sm:max-w-md bg-white/10 rounded-2xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center">خوش اومدی</h2>
                    <p className="text-sm text-center text-secondary-txt">
                        به اکانت ادمین وارد شو.
                    </p>

                    <form className="space-y-6" onSubmit={loginHandler}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">ایمیل</label>
                            <input
                                ref={inputRef}
                                required
                                dir={"ltr"}
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                                name="email"
                                autoComplete={"email"}
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">پسورد</label>
                            <div className="relative">
                                <input
                                    required
                                    dir={"ltr"}
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="*******"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide Password" : "Show Password"}
                                    className="absolute right-2 top-2 text-sm text-gray-500 hover:text-violet-500 cursor-pointer"
                                >
                                    {showPassword ? "مخفی" : "نمایش"}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                                <input
                                    id="remember"
                                    name={"remember"}
                                    onChange={event => setRemember(event.target.checked)}
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-2 border-gray-400 appearance-none checked:bg-violet-500 checked:border-violet-600 cursor-pointer"/>
                                <span>منو یادت باشه</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-violet-500 text-white font-semibold rounded-lg py-2 hover:bg-violet-600 transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}
import {useEffect, useState, useRef} from "react";
import AlertModal from "@components/ui/AlertModal";
import {useAuth} from "@/context/AuthContext";
import Input from "@components/ui/Input";
import {login} from "@api/requests/auth.js";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [alertModalData, setAlertModalData] = useState({type: "error", message: ""});
    const [isOpenAlertModal, setIsOpenAlertModal] = useState(false);
    const inputRef = useRef(null);
    const alertTimeoutRef = useRef(null);
    const {setAuthInfo} = useAuth();

    useEffect(() => {
        document.title = "ورود به اکانت ادمین | آشیانه";
        inputRef?.current?.focus();
    }, []);

    useEffect(() => {
        if (isOpenAlertModal) {
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);

            alertTimeoutRef.current = setTimeout(() => {
                setAlertModalData({type: "error", message: ""});
                setIsOpenAlertModal(false);
            }, 5000);
        }

        // cleanUp Timer
        return () => {
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        }
    }, [isOpenAlertModal]);

    const loginHandler = async event => {
        event.preventDefault();

        const userInfo = {
            email: email.trim().toLowerCase(),
            password: password.trim(),
            remember
        };

        try {
            setAlertModalData({type: "error", message: ""});
            setIsOpenAlertModal(false);

            const res = await login(userInfo);

            if (res.ok && res.user.role === "admin") {
                setAlertModalData({type: "success", message: "خب، بالاخره وارد شدی."});
                setIsOpenAlertModal(true);

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

            setAlertModalData({
                type: "error",
                message
            });
            setIsOpenAlertModal(true);
        }
    }

    const dataInput = [
        {
            onChange: setEmail,
            name: "email",
            label: "ایمیل",
            value: email,
            placeholder: "you@example.com",
            id: "email",
            props: {
                ref: inputRef,
                required: true,
                dir: "ltr",
                autoComplete: "email",
            }
        },
        {
            onChange: setPassword,
            name: "password",
            label: "پسورد",
            value: password,
            placeholder: "******",
            id: "password",
            type: showPassword ? "text" : "password",
            parentClassName: "relative",
            props: {
                required: true,
                dir: "ltr",
            },
            children: (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide Password" : "Show Password"}
                    className="absolute right-2 top-1/2 text-sm text-gray-500 hover:text-violet-500 cursor-pointer"
                >
                    {showPassword ? "مخفی" : "نمایش"}
                </button>
            )
        }
    ]

    return (
        <>
            <AlertModal {...alertModalData} isOpen={isOpenAlertModal} setIsOpen={setIsOpenAlertModal}/>
            <section className="flex items-center justify-center min-h-screen">
                <div className="max-w-9/10 w-full xs:max-w-sm sm:max-w-md bg-white/10 rounded-2xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center">خوش اومدی</h2>
                    <p className="text-sm text-center text-secondary-txt">
                        به اکانت ادمین وارد شو.
                    </p>

                    <form className="space-y-6" onSubmit={loginHandler}>
                        {dataInput.map(data => (
                            <Input key={data.id} {...data}/>
                        ))}

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
    );
};
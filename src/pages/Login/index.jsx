import {useEffect, useState, useRef} from "react";
import AlertModal from "@components/ui/modals/AlertModal";
import {useAuth} from "@/context/AuthContext";
import Input from "@components/ui/forms/Input";
import CheckBox from "@components/ui/forms/CheckBox";
import loginHandler from "@api/handlers/loginHandler.js";

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

    // focus and set title
    useEffect(() => {
        document.title = "ورود به اکانت ادمین | آشیانه";
        inputRef?.current?.focus();
    }, []);

    // close AlertModal and clear timeOut
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

    const submitHandler = async event => {
        event.preventDefault();

        const userInfo = {
            email: email.trim().toLowerCase(),
            password: password.trim(),
            remember
        };

        await loginHandler(userInfo, setAlertModalData, setIsOpenAlertModal, setAuthInfo);
    }

    // data inputs
    const dataInput = [
        {
            onChange: setEmail,
            name: "email",
            label: "ایمیل",
            value: email,
            placeholder: "you@example.com",
            id: "email",
            autoComplete: "email",
            inputProps: {
                ref: inputRef,
                required: true,
                dir: "ltr",
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
            inputProps: {
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

                    <form className="space-y-6" onSubmit={submitHandler}>
                        {dataInput.map(data => (
                            <Input key={data.id} {...data}/>
                        ))}

                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <CheckBox id={"remember"} checked={remember} onChange={setRemember} label={"منو یادت باشه"}/>
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
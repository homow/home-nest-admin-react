import {login} from "@api/requests/auth.js";

const loginHandler = async (data, setAlertModalData, setIsOpenAlertModal, setAuthInfo) => {
    try {
        // reset modal
        setAlertModalData({type: "error", message: ""});
        setIsOpenAlertModal(false);

        const res = await login(data);

        if (res.ok) {
            // admin
            if (res.user.role === "admin") {
                setAlertModalData({type: "success", message: "خب، بالاخره وارد شدی."});
                setIsOpenAlertModal(true);

                setTimeout(() => {
                    setAuthInfo({userData: res.user, token: res.accessToken});
                }, 3000)
                // user
            } else {
                setAlertModalData({type: "error", message: "اجازه ورود به این بخش رو نداری."})
            }
            setIsOpenAlertModal(true)
        }

    } catch (err) {
        const data = err.response?.data || {};
        const status = err.response?.status;
        let message;

        switch (true) {
            case (status === 503 || data.error === "NETWORK_ERROR"): {
                message = "ارتباط با سرور برقرار نشد، اینترنت یا سرور را بررسی کن";
                break;
            }
            case (status === 401 || data.error === "INVALID_CREDENTIALS"): {
                message = "رمز یا ایمیلت اشتباهه";
                break;
            }
            case (status === 403 || data.error === "ACCESS_DENIED"): {
                message = "شما اجازه ورود ندارید";
                break;
            }
            case (status >= 500): {
                message = "خطا از سمت سرور، بعداً تلاش کن";
                break;
            }
            default: {
                message = "مشکلی ناشناخته";
                break;
            }
        }

        setAlertModalData({
            type: "error",
            message
        });
        setIsOpenAlertModal(true);
    }
}

export default loginHandler;
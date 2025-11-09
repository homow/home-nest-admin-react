import {login} from "@api/requests/auth.js";
import {delay} from "@api/api-utils.js";

const loginHandler = async (data, setAlertModalData, setIsOpenAlertModal, setAuthInfo) => {
    // show alert modal
    const showAlert = (type, message) => {
        setAlertModalData({type, message});
        setIsOpenAlertModal(true);
    }

    try {
        // reset modal
        setAlertModalData({type: "error", message: ""});
        setIsOpenAlertModal(false);

        const res = await login(data);

        if (res.ok) {
            switch (res.user.role) {
                // admin
                case "admin": {
                    showAlert("success", "خب، بالاخره وارد شدی.")

                    await delay(5000);

                    setAuthInfo({userData: res.user, token: res.accessToken});
                    return true;
                }
                // user
                default: {
                    showAlert("error", "اجازه ورود به این بخش رو نداری.")
                    return false;
                }
            }
        } else {
            showAlert("error", res.message || "ورود ناموفق بود، دوباره تلاش کن.");
            return false;
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

        showAlert("error", message);
        return false;
    }
}

export default loginHandler;
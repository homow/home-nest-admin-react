import cookie from "cookie";

const cookies = cookie.parse(req.headers.cookie || '');

export {cookies};
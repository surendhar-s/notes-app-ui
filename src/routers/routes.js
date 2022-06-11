import Login from "../components/login/login"
import Register from "../components/register/register"
import Home from "../components/home/home";

const routes = [
    {
        path: "/",
        component: Home,
        access: "private"
    },
    {
        path: "/login",
        component: Login,
        access: "public"
    },
    {
        path: "/register",
        component: Register,
        access: "public"
    }
]

export default routes;
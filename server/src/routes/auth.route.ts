import { Router } from "express"
import AuthController from "../controllers/auth.controller"
import { validateRequest } from "../utils/validateRequest"
import { registerRequest } from "../schemas/auth/register"
import { loginRequest } from "../schemas/auth/login"
import { authenticated } from "../middlewares/authenticated"

const router = Router()
const auth = new AuthController()

router.post('/register',
    validateRequest({
        body: registerRequest
    }),
    auth.register())

router.post('/login',
    validateRequest({
        body: loginRequest
    }), 
    auth.login())

router.get("/current-user", authenticated, auth.currenUser())

export default router

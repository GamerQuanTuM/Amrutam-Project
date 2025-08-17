import AuthService from "../services/auth.service";
import { RegisterRequestType, RegisterResponseType } from "../schemas/auth/register";
import { LoginRequestType, LoginResponseType } from "../schemas/auth/login";
import { ValidatedHandler, AuthenticatedHandler } from "../types/validatedHandler.types";
import { InternalServerErrorException } from "../utils/httpException";
import { CurrentUserRequestType, CurrentUserResponseType } from "../schemas/auth/getCurrentUser";

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    public register(): ValidatedHandler<RegisterRequestType, any, any, RegisterResponseType> {
        return async (req, res) => {
            try {
                const { email, name, password, role } = req.body
                const response = await this.authService.register(
                    {
                        email, name, password, role
                    }
                );

                res.status(200).json({
                    message: "Register successful",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        };
    }

    public login(): ValidatedHandler<LoginRequestType, any, any, LoginResponseType> {
        return async (req, res) => {
            try {
                const { email, password } = req.body;
                const response = await this.authService.login(email, password);
                res.status(200).json({
                    message: "Login successful",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        };
    }

    public currenUser(): AuthenticatedHandler<any, any, CurrentUserRequestType, CurrentUserResponseType> {
        return async (req, res) => {
            const { appointments } = req.query
            const user = req.user;
            const response = await this.authService.currentUser(user?.id, user?.email, appointments);
            res.status(200).json({
                message: "User fetched successfully",
                data: response
            });
        };
    }
}


export default AuthController;
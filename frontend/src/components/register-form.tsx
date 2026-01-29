import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/userApi";

type data = {
    username: string;
    password: string;
}

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate()

    const registerUser = async (data: data) => {
        try {
            const res = await api.post("/users/register", data)
            console.log("User registered successfully");
            navigate("/login")
            return res.data;
        }
        catch (error) {
            console.log("Failed to register", error)
            setError("Registration failed. Please try again.")
        }
    }

    const handleSubmit = async (data: data) => {
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        await registerUser(data);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit({ username: name, password })
                        }}
                    >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor='username'>
                                    Username
                                </FieldLabel>
                                <Input
                                    id='username'
                                    type='text'
                                    placeholder='Enter your username'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='password'>
                                    Password
                                </FieldLabel>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder='Enter your password'
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='confirmPassword'>
                                    Confirm Password
                                </FieldLabel>
                                <Input
                                    id='confirmPassword'
                                    type='password'
                                    placeholder='Confirm your password'
                                    required
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </Field>
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <Field>
                                <Button type='submit'>Register</Button>
                                <Button variant='outline' type='button'>
                                    Sign up with Google
                                </Button>
                                <FieldDescription className='text-center'>
                                    Already have an account?{" "}
                                    <Link to='/login'>Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

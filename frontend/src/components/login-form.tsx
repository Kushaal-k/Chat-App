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

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");



	const navigate = useNavigate()
	const loginUser = async (data: data) => {
		try {
			const res = await api.post("/users/login", data)

			console.log("User logged in successfully");
      localStorage.setItem('user', JSON.stringify(res.data.user))
			navigate("/")
			return res.data;
		}
		catch (error) {
			console.log("Failed to login", error)
		}
	}

	const handleSubmit = async (data: data) => {
		await loginUser(data);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your Username below to login to your account
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
									placeholder='Enter your name'
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</Field>
							<Field>
								<div className='flex items-center'>
									<FieldLabel htmlFor='password'>
										Password
									</FieldLabel>
									<a
										href='#'
										className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
									>
										Forgot your password?
									</a>
								</div>
								<Input
									id='password'
									type='password'
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</Field>
							<Field>
								<Button type='submit'>Login</Button>
								<Button variant='outline' type='button'>
									Login with Google
								</Button>
								<FieldDescription className='text-center'>
									Don&apos;t have an account?{" "}
									<Link to='/register'>Sign up</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

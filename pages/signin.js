import {
    Alert,
    AlertIcon,
    Box,
    Button,
    chakra,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabaseClient } from "../lib/client";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await supabaseClient.auth.signIn({
                email,
            });
            if (error) {
                setError(error.message);
            } else {
                setIsSubmitted(true);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const changeHandler = (event) => {
        setEmail(event.target.value);
    };

    return (
        <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }} bg="gray.50">
            <Box maxW="md" mx="auto">
                <Heading textAlign="center" m="6" color={"black"}>
                    Welcome to Blog App
                </Heading>
                {error && (
                    <Alert status="error" mb="6">
                        <AlertIcon />
                        <Text textAlign="center">{error}</Text>
                    </Alert>
                )}
                <Box
                    py="8"
                    px={{ base: "4", md: "10" }}
                    shadow="base"
                    rounded={{ sm: "lg" }}
                    bg="white"
                >
                    {isSubmitted ? (
                        <Heading size="md" textAlign="center" color="gray.600">
                            Please check
                            <Box
                                border="1px solid"
                                bgColor="#F7FAFC"
                                color={"black"}

                            >
                                {email}
                            </Box>
                            for signup/login link
                        </Heading>
                    ) : (
                        <chakra.form onSubmit={submitHandler}>
                            <Stack spacing="6">
                                <FormControl id="email">
                                    <FormLabel color={"black"}>Email address</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        border={"1px solid black"}
                                        color={"black"}
                                        placeholder="Enter your email address"
                                        required
                                        value={email}
                                        onChange={changeHandler}
                                    />
                                </FormControl>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                            </Stack>
                        </chakra.form>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SignIn;
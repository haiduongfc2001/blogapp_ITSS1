import {
    Box,
    Button,
    ButtonGroup, color,
    Flex, FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftElement, Stack
} from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabaseClient } from "../lib/client";
import {PhoneIcon, SearchIcon} from "@chakra-ui/icons";

const Navbar = ({ onOpen }) => {
    const router = useRouter();
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const logoutHandler = async () => {
        try {
            setIsLogoutLoading(true);
            await supabaseClient.auth.signOut();
            await router.push("/signin");
        } catch (error) {
            await router.push("/signin");
        } finally {
            setIsLogoutLoading(false);
        }
    };

    return (
        <Box height="100%" p="5" bg="gray.100">
            <Box maxW="6xl" mx="auto">
                <Flex
                    as="nav"
                    aria-label="Site navigation"
                    align="center"
                    justify="space-between"
                >
                    <Box display={'flex'}>
                        <NavLink href="/">
                            <Heading mr="4" as="button" color={"black"}>
                                BlogApp
                            </Heading>
                        </NavLink>
                        <Stack id="search" ml={'20px'} marginTop={'2px'}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <SearchIcon color='gray.500' />
                                </InputLeftElement>
                                <Input
                                    className='my-input'
                                    type='text'
                                    placeholder='Search Blog'
                                    color = 'black'
                                    borderColor={'black'}
                                />
                            </InputGroup>
                        </Stack>
                    </Box>
                    <Box>
                        <ButtonGroup spacing="4" ml="6">
                            <Button
                                colorScheme="pink"
                            >
                                <NavLink href="/profile">Profile</NavLink>
                            </Button>
                            {router.pathname === "/" && (
                                <Button colorScheme="blue" onClick={onOpen}>
                                    Add Blog
                                </Button>
                            )}
                            <Button
                                colorScheme="red"
                                onClick={logoutHandler}
                                isLoading={isLogoutLoading}
                            >
                                Logout
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default Navbar;
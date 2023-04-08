import {
    Box,
    Button,
    ButtonGroup, color, Divider,
    Flex, FormControl,
    FormLabel,
    Heading, IconButton,
    Input,
    InputGroup,
    InputLeftElement, InputRightElement, Stack, Text
} from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { supabaseClient } from "../lib/client";
import {SearchIcon} from "@chakra-ui/icons";

const Navbar = ({ onOpen, onSearch }) => {
    const router = useRouter();
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // const handleSearch = (event) => {
    //     onSearch(event.target.value.toLowerCase());
    // };

    const handleSearchClick = () => {
        const input = document.querySelector('.my-input');
        onSearch(input.value.toLowerCase());
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchClick();
        }
    };

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
                            <InputGroup
                                _hover={{
                                    borderColor: "rgba(7,50,135,0.4)",
                                    borderWidth: "2px",
                                    borderRadius: "0.375rem"
                            }}
                            >
                                <Input
                                    className='my-input'
                                    type='text'
                                    placeholder='Search Blog'
                                    color = 'black'
                                    borderColor={'black'}
                                    boxShadow={'md'}
                                    onKeyDown={handleKeyDown}
                                    // onChange={handleSearch}
                                />
                                <InputRightElement>
                                    <Box mx="0" h="24px" borderRight="1px solid black"></Box>
                                    <IconButton
                                        mr={"2px"}
                                        height={"38px"}
                                        backgroundColor={"transparent"}
                                        aria-label="Search"
                                        _hover={{
                                            color: 'blue.500',
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                        icon={<SearchIcon
                                            _hover={{
                                                color: 'blue.500',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                            color='gray.500' />}
                                        onClick={handleSearchClick}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Stack>
                    </Box>
                    <Box>
                        <ButtonGroup spacing="4" ml="6">
                            <NavLink href="/profile">
                                <Button colorScheme="pink">
                                    Profile
                                </Button>
                            </NavLink>
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
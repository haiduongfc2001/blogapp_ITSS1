import {
    Avatar,
    Box,
    Button, Divider,
    Flex,
    FormControl,
    FormLabel,
    Input, InputGroup, InputLeftElement,
    Stack,
    useToast,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import { supabaseClient } from "../lib/client";
import {PhoneIcon} from "@chakra-ui/icons";
import {FaAddressCard, FaUserEdit} from "react-icons/fa";
import {MdEmail} from "react-icons/md";
const Profile = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarurl, setAvatarurl] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);

    const user = supabaseClient.auth.user();
    const toast = useToast();

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            supabaseClient
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .then(({ data, error }) => {
                    if (!error) {
                        setUsername(data[0].username || "");
                        setAddress(data[0].address || "");
                        setPhone(data[0].phone || "");
                        setAvatarurl(data[0].avatarurl || "");
                    }
                });
        }
    }, [user]);

    const updateHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const body = { username, address, phone };
        const userId = user.id;
        const { error } = await supabaseClient
            .from("profiles")
            .update(body)
            .eq("id", userId);
        if (!error) {
            setUsername(body.username);
            setAddress(body.address);
            setPhone(body.phone);
            toast({
                title: "Profile updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    function makeid(length) {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const uploadHandler = async (event) => {
        setIsImageUploadLoading(true);
        const avatarFile = event.target.files[0];
        const fileName = makeid(10);

        const { error } = await supabaseClient.storage
            .from("avatars")
            .upload(fileName, avatarFile, {
                cacheControl: "3600",
                upsert: false,
            });
        if (error) {
            setIsImageUploadLoading(false);
            console.log("error", error);
            return;
        }
        const { publicURL, error: publicURLError } = supabaseClient.storage
            .from("avatars")
            .getPublicUrl(fileName);
        if (publicURLError) {
            setIsImageUploadLoading(false);
            console.log("publicURLError", publicURLError);
            return;
        }
        const userId = user.id;
        await supabaseClient
            .from("profiles")
            .update({
                avatarurl: publicURL,
            })
            .eq("id", userId);
        setAvatarurl(publicURL);
        setIsImageUploadLoading(false);
    };

    return (
        <Box>
            <Navbar />
            <Box mt="8" maxW="xl" mx="auto">
                <Flex align="center" justify="center" direction="column">
                    {/*<Avatar*/}
                    {/*    size="2xl"*/}
                    {/*    src={avatarurl || ""}*/}
                    {/*    alt={"avatar"}*/}
                    {/*    name={username || user?.email}*/}
                    {/*></Avatar>*/}
                    <Avatar
                        alt={"avatar"}
                        size="2xl"
                        src={avatarurl}
                        // name={user?.email}
                    />
                    <FormLabel
                        htmlFor="file-input"
                        my="5"
                        borderRadius="2xl"
                        borderWidth="1px"
                        textAlign="center"
                        p="2"
                        bg="blue.400"
                        color="white"
                        cursor="pointer"
                    >
                        {isImageUploadLoading ? "Uploading....." : "Upload Profile Picture"}
                    </FormLabel>
                    <Input
                        type="file"
                        hidden
                        id="file-input"
                        onChange={uploadHandler}
                        multiple={false}
                        disabled={isImageUploadLoading}
                    />
                </Flex>
                <Stack
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={5}
                    mt="-2"
                    spacing="4"
                    as="form"
                    onSubmit={updateHandler}
                >
                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none' marginLeft='8px'>
                                <MdEmail color={'gray'}/>
                                <Box mx="2" h="20px" borderRight="1px solid #E2E8F0"></Box>
                            </InputLeftElement>
                            <Input type="email" isDisabled={true} value={email} />
                        </InputGroup>
                    </FormControl>

                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none' marginLeft='8px'>
                                <FaUserEdit color='black' />
                                <Box mx="2" h="20px" borderRight="1px solid #E2E8F0"></Box>
                            </InputLeftElement>
                            <Input
                                placeholder="Add your username here"
                                type="text"
                                onChange={(event) => setUsername(event.target.value)}
                                value={username}
                            />
                        </InputGroup>
                    </FormControl>

                    <FormControl id="phone" isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Box w="5px" bg="gray.300" mx="2" />
                        <InputGroup>
                            <InputLeftElement pointerEvents='none' marginLeft='8px'>
                                <PhoneIcon color='black' />
                                <Box mx="2" h="20px" borderRight="1px solid #E2E8F0"></Box>
                            </InputLeftElement>
                            <Input
                                type='tel'
                                placeholder='Add your phone here'
                                onChange={(event) => setPhone(event.target.value)}
                                value={phone}
                            />
                        </InputGroup>
                    </FormControl>

                    <FormControl id="address">
                        <FormLabel>Address</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none' marginLeft='8px'>
                                <FaAddressCard color='black' />
                                <Box mx="2" h="20px" borderRight="1px solid #E2E8F0"></Box>
                            </InputLeftElement>
                            <Input
                                placeholder="Add your address here"
                                type="text"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                            />
                        </InputGroup>
                    </FormControl>
                    <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                        Update
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Profile;
import {
    Alert,
    AlertIcon,
    Button,
    ButtonGroup,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Switch,
    Text,
    Textarea, Select, useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/client";

const ManageTodo = ({ isOpen, onClose, initialRef, todo, setTodo }) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const toast = useToast();

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setCategory(todo.category);
            setDescription(todo.description);
            setIsComplete(todo.isComplete);
        }
    }, [todo]);

    const submitHandler = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        if (description.length <= 10) {
            setErrorMessage("Description must have more than 10 characters");
            return;
        }
        setIsLoading(true);
        const user = supabaseClient.auth.user();
        let supabaseError;
        if (todo) {
            const { error } = await supabaseClient
                .from("todos")
                .update({ title, category, description, isComplete, user_id: user.id })
                .eq("id", todo.id);
            supabaseError = error;
            toast({
                title: "Updated Blog",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            const { error } = await supabaseClient
                .from("todos")
                .insert([{ title, category, description, isComplete, user_id: user.id }]);
            supabaseError = error;
            toast({
                title: "Created Blog",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }

        setIsLoading(false);
        if (supabaseError) {
            setErrorMessage(supabaseError.message);
        } else {
            closeHandler();
        }
    };

    const closeHandler = () => {
        setTitle("");
        setCategory("");
        setDescription("");
        setIsComplete(false);
        setTodo(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            initialFocusRef={initialRef}
        >
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={submitHandler}>
                    <ModalHeader>{todo ? "Update Blog" : "Add Blog"}</ModalHeader>
                    <ModalCloseButton onClick={closeHandler} />
                    <ModalBody pb={6}>
                        {errorMessage && (
                            <Alert status="error" borderRadius="lg" mb="6">
                                <AlertIcon />
                                <Text textAlign="center">{errorMessage}</Text>
                            </Alert>
                        )}

                        <FormControl mt={4} isRequired={true}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                ref={initialRef}
                                placeholder="Add your title here"
                                onChange={(event) => setTitle(event.target.value)}
                                value={title}
                            />
                        </FormControl>

                        <FormControl mt={4} isRequired={true}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Add your description here"
                                onChange={(event) => setDescription(event.target.value)}
                                value={description}
                            />
                            <FormHelperText>
                                Description must have more than 10 characters.
                            </FormHelperText>
                        </FormControl>

                        <FormControl mt={4} isRequired={true}>
                            <FormLabel>Select Category</FormLabel>
                            <Select
                                placeholder='Select category'
                                onChange={(event) => setCategory(event.target.value)}
                                value={category}
                            >
                                <option value='Travel'>Travel</option>
                                <option value='Sport'>Sport</option>
                                <option value='Music'>Music</option>
                                <option value='Other'>Other</option>
                            </Select>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Publish</FormLabel>
                            <Switch
                                isChecked={isComplete}
                                id="is-completed"
                                onChange={() => {
                                    setIsComplete(!isComplete);
                                }}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup spacing="3">
                            <Button
                                onClick={closeHandler}
                                colorScheme="red"
                                type="reset"
                                isDisabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                                {todo ? "Update" : "Save"}
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default ManageTodo;
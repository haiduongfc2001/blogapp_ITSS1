import { useDisclosure } from "@chakra-ui/hooks";
import {
    Box,
    Button,
    ButtonGroup, Flex,
    FormControl,
    FormLabel,
    HStack,
    Select,
    SimpleGrid,
    Tag,
    Text, useToast
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";
import { supabaseClient } from "../lib/client";

const Home = () => {
    const initialRef = useRef();
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isCompleteFilter, setIsCompleteFilter] = useState(null);
    const [published, setPublished] = useState([]);
    const [unpublished, setUnPublished] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const toast = useToast();

    const [allBlogsClicked, setAllBlogsClicked] = useState(false);

    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = supabaseClient.auth.user();

    useEffect(() => {
        if (!user) {
            router.push("/signin");
        }
    }, [user, router]);

    useEffect(() => {
        if (user) {
            supabaseClient
                .from("todos")
                .select("*")
                .eq("user_id", user?.id)
                .order("id", { ascending: false })
                .then(({ data, error }) => {
                    if (!error) {
                        setTodos(data);
                    }
                });
        }
    }, [user]);

    useEffect(() => {
        const todoListener = supabaseClient
            .from("todos")
            .on("*", (payload) => {
                if (payload.eventType !== "DELETE") {
                    const newTodo = payload.new;
                    setTodos((oldTodos) => {
                        const exists = oldTodos.find((todo) => todo.id === newTodo.id);
                        let newTodos;
                        if (exists) {
                            const oldTodoIndex = oldTodos.findIndex(
                                (obj) => obj.id === newTodo.id
                            );
                            oldTodos[oldTodoIndex] = newTodo;
                            newTodos = oldTodos;
                        } else {
                            newTodos = [...oldTodos, newTodo];
                        }
                        newTodos.sort((a, b) => b.id - a.id);
                        return newTodos;
                    });
                }
            })
            .subscribe();

        return () => {
            todoListener.unsubscribe();
        };
    }, []);

    const openHandler = (clickedTodo) => {
        // setSelectedStatus(clickedTodo.isComplete);
        // setTodo(clickedTodo);
        // onOpen();
        setTodo(clickedTodo);
        setSelectedStatus(clickedTodo.isComplete);
        onOpen();
    };

    const deleteHandler = async (todoId) => {
        setIsDeleteLoading(true);
        const { error } = await supabaseClient
            .from("todos")
            .delete()
            .eq("id", todoId);
        if (!error) {
            setTodos(todos.filter((todo) => todo.id !== todoId));
            toast({
                title: "Deleted Blog",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
        setIsDeleteLoading(false);
    };

    const allTodos = () => {
        setSelectedStatus(null);
        setSelectedCategory(null);
        setAllBlogsClicked(true);
    };


    // const allTodos = () => {
    //     setSelectedStatus(null);
    //     setSelectedCategory(null);
    // };

    const publishHandler = () => {
        setPublished(todos.filter((t) => t.isComplete === true));
        setSelectedCategory(null);
        setSelectedStatus(true);
    };
    // const publishHandler = () => {
    //     const publishedTodos = todos.filter((t) => t.isComplete === true);
    //     setPublished(publishedTodos);
    //     setSelectedStatus(true);
    //     setSelectedCategory(null);
    // };

    const unpublishHandler = () => {
        setUnPublished(todos.filter((t) => t.isComplete === false));
        setSelectedCategory(null);
        setSelectedStatus(false);
    };
    // const unpublishHandler = () => {
    //     const unpublishedTodos = todos.filter((t) => t.isComplete === false);
    //     setUnPublished(unpublishedTodos);
    //     setSelectedStatus(false);
    //     setSelectedCategory(null);
    // };

    // const filteredTodos = selectedCategory !== null
    //     ? todos.filter(todo => todo.category === selectedCategory && todo.isComplete === selectedStatus)
    //     : selectedStatus !== null
    //         ? todos.filter(todo => todo.isComplete === selectedStatus)
    //         : todos;

    const filteredTodos = selectedCategory !== null
        ? todos.filter(
            todo => todo.category === selectedCategory
                && (selectedStatus === null || todo.isComplete === selectedStatus)
        )
        : selectedStatus !== null
            ? todos.filter(todo => todo.isComplete === selectedStatus)
            : todos;


    // const filteredTodos = selectedCategory !== null
    //     ? todos.filter(todo => todo.category === selectedCategory && todo.isComplete === selectedStatus)
    //     : todos.filter(todo => todo.isComplete === selectedStatus);

    // const filteredTodos =
    //     selectedStatus !== null
    //         ? selectedStatus
    //             ? published
    //             : unpublished
    //         : selectedCategory !== null
    //             ? todos.filter(todo => todo.category === selectedCategory)
    //             : todos;

    return (
        <div>
            <Head>
                <title>BlogApp</title>
                <meta
                    name="description"
                    content="Awesome blogapp to store your awesome blogs"
                />
                <link rel="icon" href="/iconpage.png" />
            </Head>
            <main>
                <Navbar onOpen={onOpen} />
                <ManageTodo
                    isOpen={isOpen}
                    onClose={onClose}
                    initialRef={initialRef}
                    todo={todo}
                    setTodo={setTodo}
                    selectedStatus={selectedStatus}
                />

                <Flex justify="space-between" align="center" m="10">
                    <HStack spacing="4">
                        <ButtonGroup>
                            <Button
                                minWidth={"106px"}
                                colorScheme={"pink"}
                                onClick={allTodos}
                            >
                                All Blogs
                            </Button>
                            <Button
                                minWidth={"106px"}
                                colorScheme={"green"}
                                onClick={publishHandler}
                            >
                                Publish
                            </Button>
                            <Button
                                colorScheme={"yellow"}
                                onClick={unpublishHandler}>
                                Unpublish
                            </Button>
                        </ButtonGroup>
                    </HStack>
                    <Box display="flex" alignItems="center" flexWrap="nowrap">
                        <Text mr={2} minWidth={"54px"}>Sort by</Text>
                        <Select
                            placeholder="Category"
                            borderColor={"black"}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={
                                allBlogsClicked
                                    ? ''
                                    : selectedCategory || ''
                            }
                        >
                            <option value="Travel">Travel</option>
                            <option value="Sport">Sport</option>
                            <option value="Music">Music</option>
                            <option value="Other">Other</option>
                        </Select>
                    </Box>
                </Flex>

                <SimpleGrid
                    columns={{ base: 2, md: 3, lg: 4 }}
                    gap={{ base: "4", md: "6", lg: "8" }}
                    m="10"
                >
                    {filteredTodos.map((todo) => (
                        <SingleTodo
                            todo={todo}
                            key={todo.id}
                            openHandler={openHandler}
                            deleteHandler={deleteHandler}
                            isDeleteLoading={isDeleteLoading}
                        />
                    ))}
                </SimpleGrid>
            </main>

        </div>
    );
};

export default Home;
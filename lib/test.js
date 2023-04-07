import { useDisclosure } from "@chakra-ui/hooks";
import {
    Box,
    Button,
    ButtonGroup, Flex,
    HStack,
    Select,
    SimpleGrid,
    Text, useToast
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";
import { supabaseClient } from "../lib/client";

const Home = () => {
    const initialRef = useRef();
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState(null);
    const [published, setPublished] = useState([]);
    const [unpublished, setUnPublished] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const toast = useToast();

    const [allBlogsClicked, setAllBlogsClicked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = supabaseClient.auth.user();

    const openHandler = (clickedTodo) => {
        setTodo(clickedTodo);
        onOpen();
    };

    const allTodos = () => {
        setSelectedStatus(null);
        setSelectedCategory(null);
        setAllBlogsClicked(true);
    };

    const publishHandler = () => {
        setPublished(todos.filter((t) => t.isComplete === true));
        setSelectedCategory(null);
        setSelectedStatus(true);
    };

    const unpublishHandler = () => {
        setUnPublished(todos.filter((t) => t.isComplete === false));
        setSelectedCategory(null);
        setSelectedStatus(false);
    };

    const filteredTodos = selectedCategory !== null
        ? todos.filter(
            (todo) =>
                todo.category === selectedCategory &&
                (selectedStatus === null || todo.isComplete === selectedStatus) &&
                (searchTerm === "" || (todo.title.toLowerCase().includes(searchTerm) ||
                    todo.description.toLowerCase().includes(searchTerm)))
        )
        : selectedStatus !== null
            ? todos.filter(
                (todo) =>
                    todo.isComplete === selectedStatus &&
                    (searchTerm === "" || (todo.title.toLowerCase().includes(searchTerm) ||
                        todo.description.toLowerCase().includes(searchTerm)))
            )
            : todos.filter((todo) => (todo.title.toLowerCase().includes(searchTerm) ||
                todo.description.toLowerCase().includes(searchTerm)));

    return (
        <div>
            <main>
                <Navbar onOpen={onOpen} onSearch={setSearchTerm} />
                <ManageTodo
                    isOpen={isOpen}
                    onClose={onClose}
                    initialRef={initialRef}
                    todo={todo}
                    setTodo={setTodo}
                    selectedStatus={selectedStatus}
                />

                <Flex>
                    <HStack>
                        <ButtonGroup>
                            <Button colorScheme={"pink"}
                                onClick={allTodos}
                            >
                                All Blogs
                            </Button>
                            <Button colorScheme={"green"}
                                onClick={publishHandler}
                            >
                                Publish
                            </Button>
                            <Button onClick={unpublishHandler}>
                                Unpublish
                            </Button>
                        </ButtonGroup>
                    </HStack>
                    <Box>
                        <Select
                            placeholder="Category"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={
                                allBlogsClicked ? '' : selectedCategory || ''
                            }
                        >
                            <option value="Travel">Travel</option>
                        </Select>
                    </Box>
                </Flex>

                <SimpleGrid>
                    {filteredTodos.map((todo) => (
                        <SingleTodo
                            todo={todo}
                            key={todo.id}
                            openHandler={openHandler}
                        />
                    ))}
                </SimpleGrid>
            </main>

        </div>
    );
};

export default Home;
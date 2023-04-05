import { useDisclosure } from "@chakra-ui/hooks";
import {
    Box,
    Button,
    ButtonGroup,
    HStack,
    Select,
    SimpleGrid,
} from "@chakra-ui/react";
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
    const [published, setPublished] = useState([]);
    const [unpublished, setUnPublished] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const openHandler = (clickedTodo) => {
        setTodo(clickedTodo);
        setSelectedStatus(clickedTodo.isComplete);
        onOpen();
    };

    const allTodos = () => {
        setSelectedStatus(null);
        setSelectedCategory(null);
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
        ? todos.filter(todo => todo.category === selectedCategory && todo.isComplete === selectedStatus)
        : selectedStatus !== null
            ? todos.filter(todo => todo.isComplete === selectedStatus)
            : todos;

    return (
        <div>
            <main>
                <ManageTodo
                    isOpen={isOpen}
                    onClose={onClose}
                    initialRef={initialRef}
                    todo={todo}
                    setTodo={setTodo}
                    selectedStatus={selectedStatus}
                />
                    <HStack>
                        <ButtonGroup>
                            <Button onClick={allTodos}>All Blogs</Button>
                            <Button onClick={publishHandler}>Publish</Button>
                            <Button onClick={unpublishHandler}>Unpublish</Button>
                        </ButtonGroup>
                    </HStack>
                    <Box>
                        <Select
                            placeholder="Category"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}>
                            <option value="Travel">Travel</option>
                            <option value="Sport">Sport</option>
                            <option value="Music">Music</option>
                            <option value="Other">Other</option>
                        </Select>
                    </Box>

                <SimpleGrid>
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
import { useDisclosure } from "@chakra-ui/hooks";
import {SimpleGrid,} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";

const Home = () => {
    const initialRef = useRef();
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const filteredTodos =
        selectedCategory !== null
            ? todos.filter(
                (todo) =>
                    todo.category === selectedCategory &&
                    (selectedStatus === null || todo.isComplete === selectedStatus) &&
                    (searchTerm === "" ||
                        todo.title.toLowerCase().includes(searchTerm) ||
                        todo.description.toLowerCase().includes(searchTerm))
            )
            : selectedStatus !== null
                ? todos.filter(
                    (todo) =>
                        todo.isComplete === selectedStatus &&
                        (searchTerm === "" ||
                            todo.title.toLowerCase().includes(searchTerm) ||
                            todo.description.toLowerCase().includes(searchTerm))
                )
                : todos.filter(
                    (todo) =>
                        todo.title.toLowerCase().includes(searchTerm) ||
                        todo.description.toLowerCase().includes(searchTerm)
                );

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
import {
    Box,
    Divider,
    Heading,
    Tag,
    Text,
    Button,
    Center, Badge,
} from "@chakra-ui/react";

const SingleTodo = ({ todo, openHandler, deleteHandler, isDeleteLoading }) => {
    const getDateInMonthDayYear = (date) => {
        const d = new Date(date);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
        };
        const n = d.toLocaleDateString("en-US", options);
        const replace = n.replace(",", "").replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3");
        return replace;
    };

    return (
        <Box
            position="relative"
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p="4"
            backgroundColor={'#edf2f7'}
        >
            <Heading size="md" mt="3" color={'black'}>
                {todo.title}
            </Heading>
            <Badge margin='8px auto'
                   borderRadius='full'
                   px='2'
                   colorScheme='teal'>
                {todo.category}
            </Badge>
            <Tag
                position="absolute"
                top="3"
                right="2"
                bg={todo.isComplete ? "green.500" : "yellow.400"}
                borderRadius="3xl"
                size="sm"
            />
            <Text color="gray.400" mt="1" fontSize="sm">
                {getDateInMonthDayYear(todo.insertedat)}
            </Text>
            <Divider my="4" h='1px' bg="gray.800" />
            <Text noOfLines={[1, 2, 3]} color="gray.800">
                {todo.description}
            </Text>
            <Center>
                <Button
                    mt="4"
                    size="sm"
                    colorScheme="blue"
                    marginRight = "2"
                    onClick={() => openHandler(todo)}
                >
                    Update
                </Button>
                <Button
                    mt="4"
                    size="sm"
                    colorScheme="red"
                    marginLeft = "2"
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteHandler(todo.id);
                    }}
                    isDisabled={isDeleteLoading}
                >
                    Delete
                </Button>
            </Center>
        </Box>
    );
};

export default SingleTodo;
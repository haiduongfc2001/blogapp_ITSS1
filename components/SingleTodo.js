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
            pb={20}
            // transition="transform 0.2s ease-in-out"
            // _hover={{ transform: "scale(1.05)" }}
            _hover={{
                transform: "translateY(-5px)",
                transition: "transform 0.2s ease-out",
                boxShadow: "lg",
            }}
        >
            <Heading noOfLines={[1, 2, 3]}
                size="md" mt="3" color={'black'}>
                {todo.title}
            </Heading>
            <Badge margin='16px auto 8px'
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

            <Box
                my="4"
                h='2px'
                bg="gray.800"
                w="88"
                // mt="10px"
                mb="10px"
                mt="calc(6% - 1px)"
                display="flex"
                justifyContent="center"
                alignItems="center"
            />
            <Text
                noOfLines={[1, 2, 3, 4]}
                color="gray.800"
                // mt="14px"
            >
                {todo.description}
            </Text>
            <Center
                position="absolute"
                bottom="20px"
                left="50%"
                transform="translateX(-50%)">
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
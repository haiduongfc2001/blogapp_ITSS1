import { useDisclosure } from "@chakra-ui/hooks";
import Navbar from "../components/Navbar";

const Home = () => {
    const { onOpen } = useDisclosure();


    return (
        <div>
            <main>
                <Navbar onOpen={onOpen}  />
            </main>
        </div>
    );
};

export default Home;
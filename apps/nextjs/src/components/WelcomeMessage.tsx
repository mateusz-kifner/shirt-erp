// import simpleHash from "../utils/simpleHash";

// import Markdown from "./details/Markdown"

// const fetchWelcomeMessage = async () => {
//   const res = await axios.get("/global")
//   return res.data
// }

// const mutateWelcomeMessageHash = async (welcomeMessageHash: string) => {
//   const res = await axios.put("/users-permissions/setWelcomeMessageHash", {
//     welcomeMessageHash,
//   })
//   return res.data
// }

const WelcomeMessage = () => {
  // const [opened, setOpened] = useState<boolean>(true);
  // const { data } = trpc.session.me.useQuery();
  // const { setWelcomeMessageHash, user } = useAuthContext()
  // const { data, refetch } = useQuery(["global"], fetchWelcomeMessage, {
  //   enabled: false,
  // })
  // const welcomeMessage = "";

  // useEffect(() => {
  //  refetch()
  //  eslint-disable-next-line
  // }, []);

  // if (!data) return null;
  // const hash = simpleHash(welcomeMessage);
  // if (!data || data?.welcomeMessageHash === hash.toString()) return null

  return (
    <></>
    // <Modal
    //   open={opened}
    //   onClose={async () => {
    //     // mutateWelcomeMessageHash(hash.toString())
    //     // setWelcomeMessageHash(hash.toString())
    //     setOpened(false)
    //   }}
    // >
    //     {/* <Markdown value={data.data.welcomeMessage ?? ""} /> */}
    // </Modal>
  );
};

export default WelcomeMessage;

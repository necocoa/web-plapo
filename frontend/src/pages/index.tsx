import { Avatar, Box, Button, Container, InputBase, Paper, Typography } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import io from "socket.io-client";

type ChatType = {
  userName: string;
  message: string;
  datetime: string;
};

const Home = () => {
  const uri = "http://localhost:3001";
  const [socket] = useState(() => {
    return io(uri);
  });
  const [isConnected, setIsConnected] = useState(false);
  const [newChat, setNewChat] = useState<ChatType>({
    userName: "",
    message: "",
    datetime: "",
  });
  const [chats, setChats] = useState<ChatType[]>([
    {
      userName: "TEST BOT",
      message: "Hello World",
      datetime: "2020-09-01 12:00:00",
    },
  ]);
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected!!");
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("socket disconnected!!");
      setIsConnected(false);
    });
    socket.on("update-data", (newData: ChatType) => {
      console.log("Get Updated Data", newData);
      setNewChat(newData);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (newChat.message) {
      setChats([...chats, newChat]);
    }
  }, [newChat]);

  const handleSubmit = async () => {
    const datetime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const res = await fetch(uri, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        message,
        datetime,
      }),
    });
    setMessage("");
  };

  return (
    <Component
      isConnected={isConnected}
      chats={chats}
      userName={userName}
      message={message}
      setUserName={setUserName}
      setMessage={setMessage}
      handleSubmit={handleSubmit}
    />
  );
};

type Props = {
  className?: string;
  isConnected: boolean;
  chats: ChatType[];
  userName: string;
  message: string;
  setUserName: (value: string) => void;
  setMessage: (value: string) => void;
  handleSubmit: () => void;
};

const Component = (props: Props) => {
  return (
    <Container maxWidth="sm" className={props.className}>
      <Box height="100vh" display="flex" flexDirection="column">
        <Box flexGrow={1} py={1} overflow="hidden" display="flex" flexDirection="column" justifyContent="flex-end">
          {props.chats.map((chat, index) => {
            return (
              <Paper key={index} variant="outlined">
                <Box display="flex" p={1}>
                  <Avatar variant="square">{chat.userName.slice(0, 1).toUpperCase() || "T"}</Avatar>
                  <Box pl={1.5}>
                    <Box display="flex" alignItems="center">
                      <Typography className="name">{chat.userName || "TEST BOT"}</Typography>
                      <Typography variant="caption">{dayjs(chat.datetime).format("HH:mm")}</Typography>
                    </Box>
                    <Typography>{chat.message}</Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
        <Box border={1} borderRadius={5} borderColor="grey.500" mb={1}>
          <Box px={2}>
            <InputBase
              placeholder="name"
              value={props.userName}
              onChange={(e) => {
                return props.setUserName(e.target.value);
              }}
              fullWidth
            />
            <InputBase
              required
              placeholder="message"
              value={props.message}
              onChange={(e) => {
                return props.setMessage(e.target.value);
              }}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              disabled={!props.message || !props.isConnected}
              onClick={() => {
                return props.handleSubmit();
              }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

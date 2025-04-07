import { Grid, Flex, Title, Button, Box, Paper, Text, TextInput, Container } from '@mantine/core';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getUserMessages, getChatMessages } from './api/api';
import { useQuery} from '@tanstack/react-query';
import { useUser } from './api/usercontext';

export default function Chat() {
  const router = useRouter();
  const { setUserName: setContextUserName } = useUser();
  const { UserName } = router.query; // Retrieve UserName from query params
  const [Query, setQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [firstChatTitle, setFirstChatTitle] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch user messages based on UserName
  const { data, isLoading, error, refetch } = useQuery(
    ['userMessages', UserName],
    () => getUserMessages(UserName),
    {
      enabled: !!UserName, // Only run the query if UserName is available
      onSuccess: (data) => {
        if (data && data.length > 0) {
          setChats(data.map(item => ({
            ChatTitle: item.ChatTitle,
          })));
          setFirstChatTitle(data[0]?.ChatTitle);  // Set the first ChatTitle
        }
      }
    }
  );

  // Reset chat messages when UserName changes
  useEffect(() => {
    setChatMessages([]); // Clear previous chat messages on UserName change
    refetch();  // Manually trigger refetch to load data for the new user
  }, [UserName, refetch]);

  // Fetch chat messages based on UserName and firstChatTitle
  const { data: chatMessagesData, isLoading: isChatLoading, error: chatError } = useQuery(
    ['chatMessages', UserName, firstChatTitle],  // Pass UserName and ChatTitle as query parameters
    () => getChatMessages(UserName, firstChatTitle),
    {
      enabled: !!firstChatTitle,  // Only trigger if firstChatTitle is available
      onSuccess: (data) => {
        const processedMessages = data
          ? data.split(",").map((message) => message.trim().replace(/^'|'$/g, ''))
          : [];
        setChatMessages(processedMessages);  // Update the state with the processed messages
      }
    }
  );

  const createMessage = (ChatTitle) => {
    const messageData = {
      UserName: UserName,
      ChatTitle: ChatTitle,
      Message: ""  // Default message
    };
    createMessageApi(messageData);
  };

  // API call to create a new message
  const createMessageApi = (messageData) => {
    fetch('http://localhost:8000/posts/createmessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Message created successfully:", data);
    })
    .catch((error) => {
      console.error("Error creating message:", error);
    });
  };

  const renderChatBubbles = () => {
    return chatMessages.map((message, index) => {
      // Alternate between "User" and "Bot"
      const isUserMessage = index % 2 === 0; // Even index for "User", odd for "Bot"
      return (
        <Box
          key={index}
          style={{
            display: "flex",
            justifyContent: isUserMessage ? "flex-start" : "flex-end",
            marginBottom: "10px",
          }}
        >
          <Paper
            style={{
              maxWidth: "60%",
              backgroundColor: isUserMessage ? "#f1f1f1" : "#007bff",
              color: isUserMessage ? "#000" : "#fff",
              borderRadius: "10px",
              padding: "15px"
            }}
          >
            <Text>{message}</Text>
          </Paper>
        </Box>
      );
    });
  };

  const Back = () => {
    setChatMessages([])
    setContextUserName('')
    router.push("/"); // Navigate back to the previous page in Next.js
  };

  const DeleteChat = () => {
    if (!firstChatTitle) {
      console.error("No active chat selected!");
      return;
    }
  
    console.log(`Deleting chat with ChatTitle: ${firstChatTitle}`);
  
    // Send DELETE request to the API
    fetch(`http://localhost:8000/posts/delete?UserName=${UserName}&ChatTitle=${firstChatTitle}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Chat deleted successfully:", data);
  
        // Remove the deleted chat from the chats list (state)
        setChats((prevChats) => prevChats.filter((chat) => chat.ChatTitle !== firstChatTitle));
  
        // Clear the chat messages for the deleted chat
        setChatMessages([]);  // Clear the messages associated with the deleted chat
  
        refetch();  // Re-fetch the chats to make sure they reflect the deleted state
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
      });
  };

  const getChatHistory = (ChatTitle) => {
    setFirstChatTitle(ChatTitle);  // Update the first chat title state
  };

  const CreateChat = () => {
    // Generate a new chat title based on the current length of chats
    const newChatTitle = `chat${chats.length + 1}`;  // Create a new chat title as "chat" + (current length + 1)
  
    console.log(`Creating new chat with title: ${newChatTitle}`);
  
    // Reset the chatMessages state before creating a new chat
    setChatMessages([]); // Clear previous chat messages
  
    // Call the function to create a new message for the new chat
    createMessage(newChatTitle);  // Use the createMessage function you already have
  
    // Add the new chat to the chats state
    setChats([...chats, { ChatTitle: newChatTitle }]);  // Add the new chat to the list
  };

  const sendQuery = (UserName, ChatTitle, query) => {
    // Construct the URL with query parameters
    const url = `http://localhost:8000/posts/query?UserName=${encodeURIComponent(UserName)}&ChatTitle=${encodeURIComponent(ChatTitle)}&query=${encodeURIComponent(query)}`;
  
    // Send the PUT request to the server with the URL
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',  // Set Accept header for JSON response
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log("Query sent successfully:", data);
      // Assuming the response contains updated chat messages:
      const updatedChatMessages = data.chatMessages || []; // Adjust this based on your API response format

      // Update the chat messages state
      setChatMessages(updatedChatMessages);

      // Optionally, trigger a refetch or other actions here if needed
      refetch()
    })
    .catch((error) => {
      console.error("Error sending query:", error);
    });
  };

  return (
    <>
      <Flex
        mih={50}
        gap="0px"
        justify="space-between"
        align="center"
        direction="row"
        wrap="wrap"
        > <div>
          <Button onClick={Back} color='red' style={{ marginTop: "5px", marginLeft: "20px"}}>Back</Button>
          <Button onClick={CreateChat} color='green' style={{ marginTop: "5px", marginLeft: "20px"}}>Create Chat</Button>
          </div>
          <Title order={1}>Chat</Title>
          <Button onClick={DeleteChat} color='red' style={{ marginTop: "5px", marginRight: "20px"}}>Delete Chat</Button>
      </Flex>
      <Grid>
        <Grid.Col span={2} bor>
          <div style={{ marginTop: "2px" }}>
            {chats.map((button, index) => (
              <Button
              key={index}
              onClick={() => getChatHistory(button.ChatTitle)} // Handle click
              style={{ marginTop: "5px", marginLeft: "20px", height: "100px", width: "200px" }}
            >
              {button.ChatTitle}
            </Button>
            ))}
          </div>
        </Grid.Col>
        <Grid.Col span={8}>
            <Container
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',  // Full height of the viewport
                justifyContent: 'flex-end',  // Push content to the bottom
                padding: '20px',
              }}>
            {renderChatBubbles()}
            <Flex
              gap="10px"
              mih={50}
              justify="left"
              align="center"
              direction="row"
              wrap="wrap"
              style={{ width: '100%' }}>
              <TextInput
                placeholder="Query"
                value={Query}  // Bind the value of TextInput to the Query state
                onChange={(e) => setQuery(e.target.value)}  // Update Query state when TextInput changes
                required
                style={{ flex: 1 }}
              />
              <Button onClick={() => sendQuery(UserName, firstChatTitle, Query)}>Send</Button>
            </Flex>
            </Container>
        </Grid.Col>
      </Grid>
    </>
  );
}

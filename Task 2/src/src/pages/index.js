import { Flex, TextInput, Center, Button } from '@mantine/core';
import { useRouter } from "next/router";
import { useState } from "react";
import { useUser } from './api/usercontext';

export default function Home() {
  const { setUserName: setContextUserName } = useUser();
  const router = useRouter();  // Get the router to navigate programmatically
  const [UserName, setUserName] = useState(""); // Manage input state

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    if (UserName.trim()) {
      setContextUserName(UserName);  // Set the global context for UserName
      router.push(`/chat?UserName=${UserName}`);  // Navigate to chat page with UserName as a query param
    }
  };

  return (
    <>
      <Center maw={700} h={600} mx="auto">
        <Flex
        mih={50}
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        >
          <h1>Enter Username to continue</h1>
          <TextInput
            label="Username:"
            placeholder="Username"
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <Button type="submit" mt="md" fullWidth onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      </Center>
    </>
  );
}

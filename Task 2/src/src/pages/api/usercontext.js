import { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Provider to wrap around the app
export function UserProvider({ children }) {
  const [userName, setUserName] = useState(""); // Define the userName state
  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  return useContext(UserContext);
}
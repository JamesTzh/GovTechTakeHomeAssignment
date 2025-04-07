import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { UserProvider } from './api/usercontext';

// Create a new instance of QueryClient
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>  {/* Wrap your app in UserProvider */}
      <QueryClientProvider client={queryClient}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Component {...pageProps} />
        </MantineProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default MyApp;
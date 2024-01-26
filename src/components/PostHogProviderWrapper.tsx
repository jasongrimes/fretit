import { PostHogProvider } from "posthog-js/react";
import { PropsWithChildren } from "react";

export default function PostHogProviderWrapper({
  children,
}: PropsWithChildren) {
  const usePosthog = import.meta.env.PROD;
  if (!usePosthog) return <>{children}</>;

  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{ api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST }}
    >
      {children}
    </PostHogProvider>
  );
}

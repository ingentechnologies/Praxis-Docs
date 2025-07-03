import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/pria-api",
    },
    {
      type: "category",
      label: "Testing",
      items: [
        {
          type: "doc",
          id: "api/check-database-connection-status",
          label: "Check database connection status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/health-check-endpoint-to-verify-service-status",
          label: "Health check endpoint to verify service status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/test-a-url-and-retrieve-associated-information",
          label: "Test a URL and retrieve associated information",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Authentication",
      items: [
        {
          type: "doc",
          id: "api/user-authentication-and-sign-in",
          label: "User authentication and sign-in",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/automatic-user-signup-and-authentication",
          label: "Automatic user signup and authentication",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "AI Personal Assistant",
      items: [
        {
          type: "doc",
          id: "api/process-personal-q-a-requests-with-ai-assistant",
          label: "Process personal Q&A requests with AI assistant",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "User Commands",
      items: [
        {
          type: "doc",
          id: "api/refresh-user-profile-data",
          label: "Refresh user profile data",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/refresh-user-entitlements-and-permissions",
          label: "Refresh user entitlements and permissions",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-user-conversation-histories",
          label: "Retrieve user conversation histories",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-users-favorite-conversations",
          label: "Retrieve user's favorite conversations",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-user-courses",
          label: "Retrieve user courses",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/search-and-retrieve-user-uploaded-files",
          label: "Search and retrieve user uploaded files",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-user-settings",
          label: "Retrieve user settings",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;

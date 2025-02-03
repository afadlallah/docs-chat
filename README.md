# Docs Chat

Chat with your PDF documents using AI. Upload multiple PDF files and have intelligent conversations about their content. Supports multiple AI providers.

![Screenshot](/public/screenshot.png)

## Features

- **Multiple PDF Support**: Upload and analyze multiple PDF documents simultaneously
- **AI-Powered Chat**: Have natural conversations about your document content
- **Smart Context**: AI understands and remembers the context of your documents
- **Modern UI**: Clean and responsive interface with dark mode support
- **Authentication**: Secure user authentication powered by Clerk
- **Real-time Updates**: Instant message streaming and updates

## Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Vercel Postgres](https://vercel.com/storage/postgres) with [Drizzle ORM](https://orm.drizzle.team/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **File Storage**: [Vercel Blob](https://vercel.com/storage/blob)

## Getting Started

### Prerequisites

Obtain API keys & tokens:

- [Clerk](https://clerk.com/)
- [Vercel Blob](https://vercel.com/storage/blob)
- [Vercel Postgres](https://vercel.com/storage/postgres)
- *At least one of:*
  - [Anthropic](https://console.anthropic.com/settings/keys)
  - [Google](https://aistudio.google.com/app/apikey)
  - [Groq](https://console.groq.com/keys)
  - [OpenAI](https://platform.openai.com/api-keys)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/afadlallah/docs-chat.git
cd docs-chat
```

2. Install dependencies:

```bash
bun install
```

3. Create `.env.local` file and add the environment variables.

```bash
cp .env.example .env.local
```

4. Set up the database:

```bash
bun db:generate
bun db:migrate
```

5. Start the development server:

```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) to use the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

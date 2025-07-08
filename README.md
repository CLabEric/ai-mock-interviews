# Enhanced React + Vite App

A modern, production-ready React application built with Vite, TypeScript, Tailwind CSS, ESLint, and Prettier.

## 🚀 Features

- ⚡ **Vite** - Lightning fast development with Hot Module Replacement (HMR)
- 🔷 **TypeScript** - Type safety and enhanced developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- ✅ **ESLint** - Code quality and consistency enforcement
- 💅 **Prettier** - Automatic code formatting
- 🧩 **Component Architecture** - Modular and reusable component structure
- 📁 **Organized Structure** - Clean project organization with barrel exports

## 📦 Tech Stack

- **React 19** - Latest React with functional components and hooks
- **Vite 7** - Next generation frontend tooling
- **TypeScript 5** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint 9** - Linting utility for JavaScript and TypeScript
- **Prettier 3** - Code formatter
- **PostCSS** - CSS processing

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:

   ```bash
   cd react-vite-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Header component
│   ├── Footer.tsx      # Footer component
│   └── index.ts        # Barrel exports
├── types/              # TypeScript type definitions
│   └── index.ts        # Common types and interfaces
├── App.tsx             # Main application component
├── App.css             # App-specific styles
├── index.css           # Global styles with Tailwind directives
└── main.tsx            # Application entry point
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Custom color palette
- Responsive design utilities
- Component-based styling approach
- Dark mode support (configurable)

### Adding Custom Styles

1. **Tailwind Classes**: Use Tailwind utility classes directly in your JSX
2. **Custom CSS**: Add custom styles to `src/App.css` or component-specific CSS files
3. **Tailwind Config**: Extend the theme in `tailwind.config.js`

## 🔧 Configuration

### ESLint

ESLint is configured with:

- React and TypeScript rules
- React Hooks rules
- Strict type checking
- Custom rules for code quality

### Prettier

Prettier is configured for:

- Consistent code formatting
- Single quotes preference
- Semicolons
- 2-space indentation

### TypeScript

TypeScript is configured with:

- Strict mode enabled
- Path mapping support
- Modern ES features
- React JSX support

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Firebase Hosting**: Deploy using Firebase CLI

## 🧪 Development Workflow

1. **Code**: Write your components using TypeScript and React
2. **Style**: Use Tailwind CSS classes for styling
3. **Lint**: Run `npm run lint` to check code quality
4. **Format**: Run `npm run format` to format code
5. **Type Check**: Run `npm run type-check` to verify types
6. **Build**: Run `npm run build` to create production build

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

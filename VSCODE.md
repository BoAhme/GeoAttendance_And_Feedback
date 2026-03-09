# Using Jules in VS Code

Jules is Google's autonomous AI coding agent. You can integrate it into your VS Code workflow using the following methods:

## 1. Official Jules CLI (@google/jules)

The most robust way to use Jules locally is through the official command-line interface. This allows you to delegate tasks to Jules directly from your VS Code terminal.

### Installation
Install the Jules CLI globally using npm:
```bash
npm install -g @google/jules
```

### Basic Commands
- **Login:** Authenticate with your Google account.
  ```bash
  jules login
  ```
- **Start a New Task:** Delegate a task to Jules for the current repository.
  ```bash
  jules remote new --session "Add unit tests for the auth service"
  ```
- **List Sessions:** See your active and past coding sessions.
  ```bash
  jules remote list --session
  ```
- **Pull Results:** Pull the code changes from a completed session to your local machine.
  ```bash
  jules remote pull --session <session_id>
  ```
- **Interactive Dashboard:** Launch the Terminal User Interface (TUI) for a guided experience.
  ```bash
  jules
  ```

---

## 2. Community VS Code Extension

There is a community-developed extension that provides a graphical interface for Jules within VS Code.

- **Extension Name:** [Jules Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- **Features:**
  - Control Jules directly from the VS Code sidebar.
  - View task progress and apply patches with a single click.
- **Setup:**
  1. Install the extension from the VS Code Marketplace.
  2. Generate an API key at [jules.google.com](https://jules.google.com).
  3. Configure the extension with your API key.

---

## 3. Working on this Project in VS Code

To work on the **Geo-Attendance & Course Feedback System** locally:

1. **Open the Project:** Open the root folder in VS Code.
2. **Open Terminal:** Press ``Ctrl + ` `` to open the integrated terminal.
3. **Install Dependencies:**
   ```bash
   cd my-app
   npm install
   ```
4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

For more information, visit the [official Jules documentation](https://jules.google/docs/).

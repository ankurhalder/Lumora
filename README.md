# Lumora

Lumora is a React Native post feed app that aggregates posts, users, and comments from [https://dummyjson.com](https://dummyjson.com/). The app provides an engaging user experience with features such as infinite scrolling, user profiles, notifications, and customizable themes.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Download](#download)
- [Contact](#contact)

## Overview

Lumora is designed to provide users with a seamless and interactive post feed experience. The app fetches data from [https://dummyjson.com](https://dummyjson.com/) and uses it to display posts, user profiles, and comments. In addition to the feed, Lumora includes several interactive features such as:

- **Infinite Scrolling:** Automatically loads new posts as you scroll.
- **"Go to Top" Button:** Quickly navigate back to the top of the feed.
- **User Profiles:** View and edit detailed user profiles.
- **Notifications:** Receive alerts when profile images are changed and other custom notifications.
- **Theme Customization:** Switch between Dark Mode and Light Mode in the settings.

## Features

- **Post Feed:**

  - Displays all posts on the Home Screen.
  - Implements infinite scrolling for continuous content loading.
  - "Go to Top" button for quick navigation.

- **User Profiles:**

  - View detailed user profiles.
  - Change user profile images.
  - See additional details of users along with associated comments.

- **Notifications:**

  - Custom notifications when a profile picture is updated.
  - Additional custom notifications to enhance user engagement.

- **Settings:**

  - Toggle between Dark Mode and Light Mode.

- **Data Integration:**
  - Fetches posts, users, and comments from [https://dummyjson.com](https://dummyjson.com/) and links them together throughout the app.

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ankurhalder/lumora.git
   cd lumora
   ```

2. **Install dependencies:**

   ```bash
   npm install

   yarn install
   ```

3. **Run the application:**

   For iOS:

   ```bash
   npx react-native run-ios
   ```

   For Android:

   ```bash
   npx react-native run-android
   ```

## Usage

Once the app is running:

- **Home Screen:** Browse through posts with infinite scrolling and use the "Go to Top" button to navigate quickly.
- **User Profiles:** Tap on the user profile icon to view detailed profiles. Change profile images and view comments from other users.
- **Notifications:** Receive notifications on profile picture updates and other custom events.
- **Settings:** Switch between Dark Mode and Light Mode to suit your preference.

## Project Structure

Below is an overview of the project structure:

```bash
lumora
├── components/
├── screens/
├── navigation/
├── assets/
├── styles/
├── theme/
├── functions/
├── index.js
├── app.json
├── package.json
```

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m 'Add some feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request.

Please ensure you update tests as needed.

## License

Distributed under the GNU AFFERO GENERAL PUBLIC LICENSE License. See [LICENSE](LICENSE) for more details.

## Download

Download the latest version of **Lumora.apk**: [Click here to download](Lumora.apk)

## Contact

Ankur Halder – [ankur.halder12345@gmail.com](mailto:ankur.halder12345@gmail.com)

Project Link: [https://github.com/ankurhalder/lumora](https://github.com/ankurhalder/lumora)

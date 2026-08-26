# I Ching UNO Game

## Overview

This project is an offline single-player card game that merges the traditional Chinese I Ching hexagrams with UNO gameplay. Its main purpose is to offer an engaging and culturally rich card game experience. Key capabilities include intelligent AI opponents with varied personalities, a comprehensive scoring system, global leaderboard integration, and a full offline audio experience with Chinese voice packs. The business vision is to create a unique and immersive game that appeals to a broad audience interested in both card games and traditional Chinese culture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (server state), React hooks (local state)
- **Routing**: Wouter
- **UI Components**: Radix UI
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Real-time**: WebSocket (for multiplayer, though current focus is single-player offline)
- **API**: RESTful

### Data Storage
- **Database**: PostgreSQL (Neon Database for production)
- **ORM**: Drizzle ORM
- **Schema Management**: Drizzle Kit

### Game Core
- **Game Engine**: Handles single-player logic and AI
- **AI System**: Features multiple AI personalities, smart decision-making, and AI assist.
- **UI/UX**: Focuses on an intuitive game board, player areas, and central game elements. Incorporates custom theming and accessible components.
- **Offline First**: All game data, audio, and AI processing are localized to ensure a true single-player offline experience.
- **I Ching Integration**: Incorporates the full 64 I Ching hexagram system with corresponding text and symbols, including a "Daily Hexagram" feature.
- **Elemental Skills**: Implements an "Eight Trigram Elemental Skill" system with unique abilities, elemental resonance mechanics, and visual animations.
- **Scoring System**: Features a permanent scoring system with leaderboard, historical records, and special score calculations (e.g., negative score rewards).
- **Audio System**: Utilizes Web Audio API for dynamic sound effects and includes pre-recorded Chinese voice packs for card names, completely localized.
- **Visuals**: Incorporates custom animations for events like "Reverse Direction" and skill activations, with custom fonts (HanYi YanKai Fan) for traditional calligraphy aesthetics and color schemes optimized for elemental skills.

## External Dependencies

- **React Query**: For data fetching and caching (though less prominent in offline mode).
- **Drizzle ORM**: Database interaction.
- **WebSocket (ws)**: Real-time communication library (used for potential multiplayer, though core game is offline).
- **Express**: Web server framework.
- **Radix UI**: UI component primitives.
- **Web Audio API**: Browser-native audio processing.
- **Vite**: Development and build tool.
- **TypeScript**: Programming language.
- **Neon Database**: Production PostgreSQL hosting.
- **HanYi YanKai Fan Font**: Custom font for traditional Chinese calligraphy.

## Recent Updates (August 5, 2025)

### AI Player Skill Audio Implementation
- **Achievement**: Successfully implemented AI player skill audio functionality
- **Technical Details**: Added audioManager.playSkillAudio() to skill event listener in GameBoard.tsx
- **Impact**: AI players now play skill voices (云希/小艺) when using skills, creating unified audio experience
- **Status**: Complete and production-ready

### Deployment Readiness
- **Build Status**: Production build successful (2.7MB including full audio system)
- **Audio System**: 144 audio files (128 card voices + 16 skill voices) fully localized
- **Database**: PostgreSQL stable, leaderboard integrity protected
- **Core Features**: All game mechanics, AI system, scoring, and skill system operational
- **Quality Assurance**: Comprehensive testing completed, ready for deployment
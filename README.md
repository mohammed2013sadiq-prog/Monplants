# MoPlants

## 1. Project Overview

**Project Name:** MoPlants

**Project Type:** AI-powered Mobile Application

**Description**

MoPlants is a mobile application that enables users to identify plant species — with a focus on plants commonly found or cultivated in Morocco — using artificial intelligence. Users can capture or upload a photo of a plant and instantly receive detailed care information, including watering needs, light requirements, soil type, climate adaptation, and toxicity level. The application also acts as a personal care assistant, sending AI-adjusted watering reminders based on real weather conditions.

---

# 2. Objectives

- Identify plant species using AI image recognition.

- Educate users about plant care and local Moroccan flora.

- Provide reliable, verified care information.

- Help users distinguish safe from toxic plants.

- Encourage consistent plant care through smart reminders.

- Build a personal plant collection and care history.

---

# 3. Target Audience

- Plant care beginners

- Students

- Apartment dwellers

- Gardeners

- Families

- Anyone who forgets to water their plants

---

# 4. Core Features

## 4.1 AI Plant Identification

Users can:

- Capture a photo using the camera

- Upload an existing image

- Receive AI predictions

- View confidence scores

- Compare similar species

---

## 4.2 Species Information

Each species page includes:

- Common name

- Scientific name

- Family

- Description

- Physical characteristics

- Light requirements

- Watering frequency

- Soil type

- Climate adaptation (e.g. suited to arid/coastal/mountain climate)

- Toxicity level

- Care difficulty level

- Image gallery

---

## 4.3 Regional Growing Map

- Distribution across Moroccan regions/climates

- Region-level suitability (coastal, arid, mountain)

- User's own plant locations (optional, city-level only)

---

## 4.4 Search & Filters

Search by:

- Species name

- Family

- Light needs

- Watering frequency

- Climate suitability

- Toxicity level

- Care difficulty

---

## 4.5 Personal Collection

Users can:

- Save favorite species

- View identification history

- Organize their own plants into a personal collection

---

## 4.6 Care Journal

Each entry includes:

- Photo

- Date and time

- Watering/repotting action logged

- Weather at time of logging (optional)

- Personal notes

- Identified species

---

## 4.7 Offline Mode

Users can download a local database containing common Moroccan plant species for offline access.

---

## 4.8 Educational Section

Includes:

- Interactive quizzes

- Daily plant care facts

- Plant care myths vs. facts

- Learning modules

- Beginner guides

---

## 4.9 Notifications

- Watering/repotting reminders

- Weather-based reminder adjustments

- New species added

- Care streak badges

---

# 5. Artificial Intelligence

The AI system should provide:

- Image classification (species identification)

- Confidence scoring

- Similar species suggestions

- RAG-based question answering from the verified species database

- Function calling to create/adjust watering reminders

- Weather-based reminder adjustment via an external MCP tool

---

# 6. Non-Functional Requirements

- Fast identification (under 3 seconds online)

- Responsive UI

- Android and iOS support

- Secure authentication

- Cloud synchronization

- Offline capability

- Accessibility support

- Multi-language support (French, Arabic)

---

# 7. Technology Stack

### Mobile

- React Native

- Expo

- TypeScript

### State Management

- Zustand

### Backend

- Node.js

- Express

### Database

- PostgreSQL

### Vector Database

- pgvector

### Authentication

- JWT Authentication

### Cloud Storage

- AWS S3 or Cloudinary

### Artificial Intelligence

- RAG (species database) + Function calling (reminders)

### External Tools

- MCP (weather API)

---

# 8. Database Design

## Users

- id

- full_name

- email

- password

- avatar

- created_at

## Species

- id

- scientific_name

- common_name

- family

- description

- light_needs

- watering_frequency

- soil_type

- climate_adaptation

- toxicity_level

- image_url

## UserPlants

- id

- user_id

- species_id

- nickname

- image_url

- added_at

## Reminders

- id

- user_plant_id

- type

- frequency_days

- next_date

- status

## Favorites

- id

- user_id

- species_id

---

# 9. Application Screens

- Splash Screen

- Onboarding

- Login

- Register

- Home

- Camera Scanner

- Upload Image

- AI Results

- Species Details

- Search

- Favorites

- Care Journal

- Regional Map

- Learning Center

- Quiz

- AI Chat

- Notifications

- User Profile

- Settings

---

# 10. UI/UX Requirements

The interface should be:

- Modern

- Minimal

- Nature-inspired

- Easy to navigate

- Mobile-first

- Accessible

### Color Palette

- Forest Green

- Earth Brown

- White

- Light Gray

- Natural Beige

---

# 11. Security

- JWT Authentication

- Password hashing with bcrypt

- Input validation

- Rate limiting

- Secure API communication (HTTPS)

- Cloud backups

- Privacy-compliant data handling

- Prompt-injection protection on AI agent routes

---

# 12. Future Enhancements

- Plant disease recognition via photo

- Augmented Reality (AR) plant preview before buying

- Community-shared plant observations

- Offline AI model

- Insect/pest identification

- Herb and medicinal plant identification

- AI chatbot for gardening education

---

# 13. Deliverables

- Android application

- iOS application

- Backend REST API

- PostgreSQL database + vector database

- AI identification & agent service

- API documentation

- Technical documentation

- User documentation

- UI/UX design system

- Source code repository

- Automated tests

- Production deployment (Docker)

---

# 14. Success Criteria

The project will be considered successful if:

- AI identification accuracy exceeds 90% for supported species.

- The application provides results within three seconds under normal network conditions.

- Users can successfully identify, save, and track care for their plants.

- Watering reminders adjust correctly based on real weather data (MCP demo).

- No reminder or data change is applied without user confirmation.

- The application delivers a smooth, intuitive, and engaging user experience.

- Care information is accurate, regularly updated, and sourced from trusted references.

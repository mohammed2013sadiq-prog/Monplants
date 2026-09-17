classDiagram
    %% Layer 1: Core Domain Entities
    class User {
        +UUID id
        +String fullName
        +String email
        +String passwordHash
        +String avatar
        +DateTime createdAt
        +authenticate()
    }

    class Species {
        +UUID id
        +String scientificName
        +String commonName
        +String family
        +String description
        +String lightNeeds
        +String wateringFrequency
        +String soilType
        +String climateAdaptation
        +String toxicityLevel
        +String imageUrl
        +Vector embedding
    }

    class UserPlant {
        +UUID id
        +UUID userId
        +UUID speciesId
        +String nickname
        +String imageUrl
        +DateTime addedAt
    }

    class Reminder {
        +UUID id
        +UUID userPlantId
        +String type
        +int frequencyDays
        +DateTime nextDate
        +String status
        +adjustFrequency(days)
    }

    class Favorite {
        +UUID id
        +UUID userId
        +UUID speciesId
    }

    class JournalEntry {
        +UUID id
        +UUID userPlantId
        +String photoUrl
        +DateTime dateTime
        +String actionLogged
        +String weatherData
        +String notes
    }

    class Quiz {
        +UUID id
        +String title
        +List~String~ questions
        +String difficulty
    }

    %% Layer 2: External & Infrastructure Services
    class WeatherMCPClient {
        +String apiKey
        +fetchCurrentWeather(city) WeatherData
    }

    class NotificationService {
        +sendPushNotification(userId, message)
        +scheduleLocalReminder(reminderId, date)
    }

    %% Layer 3: AI & Business Logic Layer
    class PlantAIService {
        +classifyImage(imageBuffer) IdentificationResult
        +getSimilarSpecies(speciesId) List~Species~
    }

    class RAGService {
        +pgvectorClient vectorDb
        +querySpeciesKnowledge(query) String
    }

    class ReminderAgent {
        +WeatherMCPClient weatherClient
        +evaluateReminders(userPlantId)
        +adjustForWeather(city)
    }

    %% Layer 4: Controllers / Orchestration Layer
    class PlantController {
        +identifyPlant(image)
        +getSpeciesDetails(id)
        +searchSpecies(filters)
    }

    class UserCollectionController {
        +addUserPlant(userPlant)
        +logJournal(journalEntry)
        +toggleFavorite(speciesId)
    }

    class ReminderController {
        +createReminder(reminder)
        +updateReminderStatus(id, status)
    }

    %% Relationships
    User "1" --> "*" UserPlant : owns
    User "1" --> "*" Favorite : marks
    Species "1" --> "*" UserPlant : instantiates
    Species "1" --> "*" Favorite : referenced_in
    UserPlant "1" --> "*" Reminder : triggers
    UserPlant "1" --> "*" JournalEntry : records

    PlantController --> PlantAIService : uses
    PlantController --> RAGService : queries
    UserCollectionController --> UserPlant : manages
    ReminderController --> ReminderAgent : delegates
    ReminderAgent --> WeatherMCPClient : calls
    ReminderAgent --> NotificationService : dispatches
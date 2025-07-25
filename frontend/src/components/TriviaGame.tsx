import React, { useState, useEffect } from 'react';
import { Clock, Rocket, Heart } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  hint: string;
}

interface TriviaGameProps {
  language: string;
  onGameEnd: () => void;
}

// Updated Lift Cash trivia questions organized by round number with all 15 questions (10 main + 5 bonus)
const TRIVIA_QUESTIONS_BY_ROUND: Record<number, Record<string, Question[]>> = {
  1: {
    en: [
      {
        id: 1,
        question: "What is the primary purpose of Lift Cash?",
        options: { 
          A: "Social media platform", 
          B: "Gaming platform", 
          C: "Decentralized finance and rewards platform", 
          D: "E-commerce marketplace" 
        },
        correctAnswer: "C",
        hint: "Think about financial services and earning rewards"
      },
      {
        id: 2,
        question: "Which blockchain technology does Lift Cash utilize?",
        options: { 
          A: "Ethereum", 
          B: "Bitcoin", 
          C: "Internet Computer Protocol (ICP)", 
          D: "Solana" 
        },
        correctAnswer: "C",
        hint: "It's known for its speed and low transaction costs"
      },
      {
        id: 3,
        question: "What can users earn through Lift Cash activities?",
        options: { 
          A: "Only cryptocurrency", 
          B: "Tokens and rewards", 
          C: "Physical products only", 
          D: "Nothing" 
        },
        correctAnswer: "B",
        hint: "Users are incentivized for their participation"
      },
      {
        id: 4,
        question: "How does Lift Cash ensure security for its users?",
        options: { 
          A: "Traditional passwords only", 
          B: "Blockchain technology and smart contracts", 
          C: "Email verification", 
          D: "Phone number verification" 
        },
        correctAnswer: "B",
        hint: "It leverages decentralized technology for security"
      },
      {
        id: 5,
        question: "What type of identity system does Lift Cash use?",
        options: { 
          A: "Traditional username/password", 
          B: "Social media login", 
          C: "Internet Identity", 
          D: "Email-based authentication" 
        },
        correctAnswer: "C",
        hint: "It's a decentralized identity solution"
      },
      {
        id: 6,
        question: "What makes Lift Cash different from traditional financial platforms?",
        options: { 
          A: "Higher fees", 
          B: "Slower transactions", 
          C: "Decentralized and user-owned", 
          D: "More paperwork required" 
        },
        correctAnswer: "C",
        hint: "Users have more control and ownership"
      },
      {
        id: 7,
        question: "How often can users participate in Lift Cash activities?",
        options: { 
          A: "Once per month", 
          B: "Once per week", 
          C: "Daily", 
          D: "Only on weekends" 
        },
        correctAnswer: "C",
        hint: "Regular engagement is encouraged"
      },
      {
        id: 8,
        question: "What is required to start using Lift Cash?",
        options: { 
          A: "Bank account verification", 
          B: "Credit check", 
          C: "Internet Identity setup", 
          D: "Physical address verification" 
        },
        correctAnswer: "C",
        hint: "It's the same authentication system used in this trivia"
      },
      {
        id: 9,
        question: "What type of rewards can users expect from Lift Cash?",
        options: { 
          A: "Only cash", 
          B: "Tokens, NFTs, and other digital assets", 
          C: "Only physical products", 
          D: "Discount coupons only" 
        },
        correctAnswer: "B",
        hint: "Digital assets are the primary reward type"
      },
      {
        id: 10,
        question: "How does Lift Cash handle transaction fees?",
        options: { 
          A: "Very high fees", 
          B: "Moderate fees", 
          C: "Low to no fees due to ICP technology", 
          D: "Fees vary randomly" 
        },
        correctAnswer: "C",
        hint: "The underlying blockchain technology is cost-efficient"
      },
      // Bonus questions (11-15)
      {
        id: 11,
        question: "What is the governance model of Lift Cash?",
        options: { 
          A: "Centralized corporate control", 
          B: "Government regulated", 
          C: "Community-driven and decentralized", 
          D: "No governance structure" 
        },
        correctAnswer: "C",
        hint: "Users have a say in the platform's direction"
      },
      {
        id: 12,
        question: "How does Lift Cash ensure transparency?",
        options: { 
          A: "Private databases", 
          B: "Blockchain ledger and open protocols", 
          C: "Annual reports only", 
          D: "No transparency measures" 
        },
        correctAnswer: "B",
        hint: "Everything is recorded on an immutable ledger"
      },
      {
        id: 13,
        question: "What is the long-term vision of Lift Cash?",
        options: { 
          A: "Replace all banks", 
          B: "Create a decentralized financial ecosystem", 
          C: "Become a social media platform", 
          D: "Focus only on gaming" 
        },
        correctAnswer: "B",
        hint: "It aims to revolutionize how people interact with finance"
      },
      {
        id: 14,
        question: "How does Lift Cash support financial inclusion?",
        options: { 
          A: "Only serves wealthy users", 
          B: "Requires extensive documentation", 
          C: "Provides accessible DeFi services to everyone", 
          D: "Limited to certain countries only" 
        },
        correctAnswer: "C",
        hint: "It aims to make financial services available to all"
      },
      {
        id: 15,
        question: "What role do smart contracts play in Lift Cash?",
        options: { 
          A: "No role at all", 
          B: "Only for decoration", 
          C: "Automate processes and ensure trustless operations", 
          D: "Used only for marketing" 
        },
        correctAnswer: "C",
        hint: "They eliminate the need for intermediaries"
      }
    ],
    es: [
      {
        id: 1,
        question: "¿Cuál es el propósito principal de Lift Cash?",
        options: { 
          A: "Plataforma de redes sociales", 
          B: "Plataforma de juegos", 
          C: "Plataforma de finanzas descentralizadas y recompensas", 
          D: "Mercado de comercio electrónico" 
        },
        correctAnswer: "C",
        hint: "Piensa en servicios financieros y ganar recompensas"
      },
      {
        id: 2,
        question: "¿Qué tecnología blockchain utiliza Lift Cash?",
        options: { 
          A: "Ethereum", 
          B: "Bitcoin", 
          C: "Protocolo de Computadora de Internet (ICP)", 
          D: "Solana" 
        },
        correctAnswer: "C",
        hint: "Es conocida por su velocidad y bajos costos de transacción"
      },
      {
        id: 3,
        question: "¿Qué pueden ganar los usuarios a través de las actividades de Lift Cash?",
        options: { 
          A: "Solo criptomonedas", 
          B: "Tokens y recompensas", 
          C: "Solo productos físicos", 
          D: "Nada" 
        },
        correctAnswer: "B",
        hint: "Los usuarios son incentivados por su participación"
      },
      {
        id: 4,
        question: "¿Cómo garantiza Lift Cash la seguridad para sus usuarios?",
        options: { 
          A: "Solo contraseñas tradicionales", 
          B: "Tecnología blockchain y contratos inteligentes", 
          C: "Verificación por correo electrónico", 
          D: "Verificación por número de teléfono" 
        },
        correctAnswer: "B",
        hint: "Aprovecha la tecnología descentralizada para la seguridad"
      },
      {
        id: 5,
        question: "¿Qué tipo de sistema de identidad usa Lift Cash?",
        options: { 
          A: "Usuario/contraseña tradicional", 
          B: "Inicio de sesión en redes sociales", 
          C: "Identidad de Internet", 
          D: "Autenticación basada en correo electrónico" 
        },
        correctAnswer: "C",
        hint: "Es una solución de identidad descentralizada"
      },
      {
        id: 6,
        question: "¿Qué hace que Lift Cash sea diferente de las plataformas financieras tradicionales?",
        options: { 
          A: "Tarifas más altas", 
          B: "Transacciones más lentas", 
          C: "Descentralizado y propiedad del usuario", 
          D: "Más papeleo requerido" 
        },
        correctAnswer: "C",
        hint: "Los usuarios tienen más control y propiedad"
      },
      {
        id: 7,
        question: "¿Con qué frecuencia pueden participar los usuarios en las actividades de Lift Cash?",
        options: { 
          A: "Una vez al mes", 
          B: "Una vez a la semana", 
          C: "Diariamente", 
          D: "Solo los fines de semana" 
        },
        correctAnswer: "C",
        hint: "Se fomenta la participación regular"
      },
      {
        id: 8,
        question: "¿Qué se requiere para comenzar a usar Lift Cash?",
        options: { 
          A: "Verificación de cuenta bancaria", 
          B: "Verificación de crédito", 
          C: "Configuración de Identidad de Internet", 
          D: "Verificación de dirección física" 
        },
        correctAnswer: "C",
        hint: "Es el mismo sistema de autenticación usado en esta trivia"
      },
      {
        id: 9,
        question: "¿Qué tipo de recompensas pueden esperar los usuarios de Lift Cash?",
        options: { 
          A: "Solo efectivo", 
          B: "Tokens, NFTs y otros activos digitales", 
          C: "Solo productos físicos", 
          D: "Solo cupones de descuento" 
        },
        correctAnswer: "B",
        hint: "Los activos digitales son el tipo principal de recompensa"
      },
      {
        id: 10,
        question: "¿Cómo maneja Lift Cash las tarifas de transacción?",
        options: { 
          A: "Tarifas muy altas", 
          B: "Tarifas moderadas", 
          C: "Tarifas bajas o nulas debido a la tecnología ICP", 
          D: "Las tarifas varían aleatoriamente" 
        },
        correctAnswer: "C",
        hint: "La tecnología blockchain subyacente es rentable"
      },
      {
        id: 11,
        question: "¿Cuál es el modelo de gobernanza de Lift Cash?",
        options: { 
          A: "Control corporativo centralizado", 
          B: "Regulado por el gobierno", 
          C: "Impulsado por la comunidad y descentralizado", 
          D: "Sin estructura de gobernanza" 
        },
        correctAnswer: "C",
        hint: "Los usuarios tienen voz en la dirección de la plataforma"
      },
      {
        id: 12,
        question: "¿Cómo garantiza Lift Cash la transparencia?",
        options: { 
          A: "Bases de datos privadas", 
          B: "Libro mayor blockchain y protocolos abiertos", 
          C: "Solo informes anuales", 
          D: "Sin medidas de transparencia" 
        },
        correctAnswer: "B",
        hint: "Todo se registra en un libro mayor inmutable"
      },
      {
        id: 13,
        question: "¿Cuál es la visión a largo plazo de Lift Cash?",
        options: { 
          A: "Reemplazar todos los bancos", 
          B: "Crear un ecosistema financiero descentralizado", 
          C: "Convertirse en una plataforma de redes sociales", 
          D: "Enfocarse solo en juegos" 
        },
        correctAnswer: "B",
        hint: "Busca revolucionar cómo las personas interactúan con las finanzas"
      },
      {
        id: 14,
        question: "¿Cómo apoya Lift Cash la inclusión financiera?",
        options: { 
          A: "Solo sirve a usuarios adinerados", 
          B: "Requiere documentación extensa", 
          C: "Proporciona servicios DeFi accesibles para todos", 
          D: "Limitado solo a ciertos países" 
        },
        correctAnswer: "C",
        hint: "Busca hacer que los servicios financieros estén disponibles para todos"
      },
      {
        id: 15,
        question: "¿Qué papel juegan los contratos inteligentes en Lift Cash?",
        options: { 
          A: "Ningún papel en absoluto", 
          B: "Solo para decoración", 
          C: "Automatizar procesos y garantizar operaciones sin confianza", 
          D: "Usado solo para marketing" 
        },
        correctAnswer: "C",
        hint: "Eliminan la necesidad de intermediarios"
      }
    ],
    fr: [
      {
        id: 1,
        question: "Quel est l'objectif principal de Lift Cash?",
        options: { 
          A: "Plateforme de médias sociaux", 
          B: "Plateforme de jeux", 
          C: "Plateforme de finance décentralisée et de récompenses", 
          D: "Marché de commerce électronique" 
        },
        correctAnswer: "C",
        hint: "Pensez aux services financiers et à gagner des récompenses"
      },
      {
        id: 2,
        question: "Quelle technologie blockchain utilise Lift Cash?",
        options: { 
          A: "Ethereum", 
          B: "Bitcoin", 
          C: "Protocole Internet Computer (ICP)", 
          D: "Solana" 
        },
        correctAnswer: "C",
        hint: "Elle est connue pour sa vitesse et ses faibles coûts de transaction"
      },
      {
        id: 3,
        question: "Que peuvent gagner les utilisateurs grâce aux activités Lift Cash?",
        options: { 
          A: "Seulement des cryptomonnaies", 
          B: "Tokens et récompenses", 
          C: "Seulement des produits physiques", 
          D: "Rien" 
        },
        correctAnswer: "B",
        hint: "Les utilisateurs sont incités pour leur participation"
      },
      {
        id: 4,
        question: "Comment Lift Cash assure-t-il la sécurité de ses utilisateurs?",
        options: { 
          A: "Mots de passe traditionnels uniquement", 
          B: "Technologie blockchain et contrats intelligents", 
          C: "Vérification par email", 
          D: "Vérification par numéro de téléphone" 
        },
        correctAnswer: "B",
        hint: "Il exploite la technologie décentralisée pour la sécurité"
      },
      {
        id: 5,
        question: "Quel type de système d'identité utilise Lift Cash?",
        options: { 
          A: "Nom d'utilisateur/mot de passe traditionnel", 
          B: "Connexion via les médias sociaux", 
          C: "Identité Internet", 
          D: "Authentification basée sur l'email" 
        },
        correctAnswer: "C",
        hint: "C'est une solution d'identité décentralisée"
      },
      {
        id: 6,
        question: "Qu'est-ce qui rend Lift Cash différent des plateformes financières traditionnelles?",
        options: { 
          A: "Frais plus élevés", 
          B: "Transactions plus lentes", 
          C: "Décentralisé et appartenant aux utilisateurs", 
          D: "Plus de paperasserie requise" 
        },
        correctAnswer: "C",
        hint: "Les utilisateurs ont plus de contrôle et de propriété"
      },
      {
        id: 7,
        question: "À quelle fréquence les utilisateurs peuvent-ils participer aux activités Lift Cash?",
        options: { 
          A: "Une fois par mois", 
          B: "Une fois par semaine", 
          C: "Quotidiennement", 
          D: "Seulement les week-ends" 
        },
        correctAnswer: "C",
        hint: "L'engagement régulier est encouragé"
      },
      {
        id: 8,
        question: "Qu'est-ce qui est requis pour commencer à utiliser Lift Cash?",
        options: { 
          A: "Vérification de compte bancaire", 
          B: "Vérification de crédit", 
          C: "Configuration d'Identité Internet", 
          D: "Vérification d'adresse physique" 
        },
        correctAnswer: "C",
        hint: "C'est le même système d'authentification utilisé dans ce trivia"
      },
      {
        id: 9,
        question: "Quel type de récompenses les utilisateurs peuvent-ils attendre de Lift Cash?",
        options: { 
          A: "Seulement de l'argent", 
          B: "Tokens, NFTs et autres actifs numériques", 
          C: "Seulement des produits physiques", 
          D: "Seulement des coupons de réduction" 
        },
        correctAnswer: "B",
        hint: "Les actifs numériques sont le type principal de récompense"
      },
      {
        id: 10,
        question: "Comment Lift Cash gère-t-il les frais de transaction?",
        options: { 
          A: "Frais très élevés", 
          B: "Frais modérés", 
          C: "Frais faibles à nuls grâce à la technologie ICP", 
          D: "Les frais varient aléatoirement" 
        },
        correctAnswer: "C",
        hint: "La technologie blockchain sous-jacente est rentable"
      },
      {
        id: 11,
        question: "Quel est le modèle de gouvernance de Lift Cash?",
        options: { 
          A: "Contrôle corporatif centralisé", 
          B: "Réglementé par le gouvernement", 
          C: "Dirigé par la communauté et décentralisé", 
          D: "Aucune structure de gouvernance" 
        },
        correctAnswer: "C",
        hint: "Les utilisateurs ont leur mot à dire dans la direction de la plateforme"
      },
      {
        id: 12,
        question: "Comment Lift Cash assure-t-il la transparence?",
        options: { 
          A: "Bases de données privées", 
          B: "Registre blockchain et protocoles ouverts", 
          C: "Rapports annuels uniquement", 
          D: "Aucune mesure de transparence" 
        },
        correctAnswer: "B",
        hint: "Tout est enregistré sur un registre immuable"
      },
      {
        id: 13,
        question: "Quelle est la vision à long terme de Lift Cash?",
        options: { 
          A: "Remplacer toutes les banques", 
          B: "Créer un écosystème financier décentralisé", 
          C: "Devenir une plateforme de médias sociaux", 
          D: "Se concentrer uniquement sur les jeux" 
        },
        correctAnswer: "B",
        hint: "Il vise à révolutionner la façon dont les gens interagissent avec la finance"
      },
      {
        id: 14,
        question: "Comment Lift Cash soutient-il l'inclusion financière?",
        options: { 
          A: "Ne sert que les utilisateurs riches", 
          B: "Nécessite une documentation extensive", 
          C: "Fournit des services DeFi accessibles à tous", 
          D: "Limité à certains pays seulement" 
        },
        correctAnswer: "C",
        hint: "Il vise à rendre les services financiers disponibles pour tous"
      },
      {
        id: 15,
        question: "Quel rôle jouent les contrats intelligents dans Lift Cash?",
        options: { 
          A: "Aucun rôle du tout", 
          B: "Seulement pour la décoration", 
          C: "Automatiser les processus et assurer des opérations sans confiance", 
          D: "Utilisé seulement pour le marketing" 
        },
        correctAnswer: "C",
        hint: "Ils éliminent le besoin d'intermédiaires"
      }
    ],
    de: [
      {
        id: 1,
        question: "Was ist der Hauptzweck von Lift Cash?",
        options: { 
          A: "Social Media Plattform", 
          B: "Gaming-Plattform", 
          C: "Dezentrale Finanz- und Belohnungsplattform", 
          D: "E-Commerce-Marktplatz" 
        },
        correctAnswer: "C",
        hint: "Denken Sie an Finanzdienstleistungen und das Verdienen von Belohnungen"
      },
      {
        id: 2,
        question: "Welche Blockchain-Technologie nutzt Lift Cash?",
        options: { 
          A: "Ethereum", 
          B: "Bitcoin", 
          C: "Internet Computer Protocol (ICP)", 
          D: "Solana" 
        },
        correctAnswer: "C",
        hint: "Es ist bekannt für seine Geschwindigkeit und niedrigen Transaktionskosten"
      },
      {
        id: 3,
        question: "Was können Benutzer durch Lift Cash-Aktivitäten verdienen?",
        options: { 
          A: "Nur Kryptowährung", 
          B: "Token und Belohnungen", 
          C: "Nur physische Produkte", 
          D: "Nichts" 
        },
        correctAnswer: "B",
        hint: "Benutzer werden für ihre Teilnahme belohnt"
      },
      {
        id: 4,
        question: "Wie gewährleistet Lift Cash die Sicherheit für seine Benutzer?",
        options: { 
          A: "Nur traditionelle Passwörter", 
          B: "Blockchain-Technologie und Smart Contracts", 
          C: "E-Mail-Verifizierung", 
          D: "Telefonnummer-Verifizierung" 
        },
        correctAnswer: "B",
        hint: "Es nutzt dezentrale Technologie für die Sicherheit"
      },
      {
        id: 5,
        question: "Welches Identitätssystem verwendet Lift Cash?",
        options: { 
          A: "Traditioneller Benutzername/Passwort", 
          B: "Social Media Login", 
          C: "Internet Identity", 
          D: "E-Mail-basierte Authentifizierung" 
        },
        correctAnswer: "C",
        hint: "Es ist eine dezentrale Identitätslösung"
      },
      {
        id: 6,
        question: "Was macht Lift Cash anders als traditionelle Finanzplattformen?",
        options: { 
          A: "Höhere Gebühren", 
          B: "Langsamere Transaktionen", 
          C: "Dezentral und benutzereigen", 
          D: "Mehr Papierkram erforderlich" 
        },
        correctAnswer: "C",
        hint: "Benutzer haben mehr Kontrolle und Eigentum"
      },
      {
        id: 7,
        question: "Wie oft können Benutzer an Lift Cash-Aktivitäten teilnehmen?",
        options: { 
          A: "Einmal pro Monat", 
          B: "Einmal pro Woche", 
          C: "Täglich", 
          D: "Nur am Wochenende" 
        },
        correctAnswer: "C",
        hint: "Regelmäßige Teilnahme wird gefördert"
      },
      {
        id: 8,
        question: "Was ist erforderlich, um Lift Cash zu nutzen?",
        options: { 
          A: "Bankkonto-Verifizierung", 
          B: "Kreditprüfung", 
          C: "Internet Identity Setup", 
          D: "Physische Adressverifizierung" 
        },
        correctAnswer: "C",
        hint: "Es ist das gleiche Authentifizierungssystem, das in diesem Trivia verwendet wird"
      },
      {
        id: 9,
        question: "Welche Art von Belohnungen können Benutzer von Lift Cash erwarten?",
        options: { 
          A: "Nur Bargeld", 
          B: "Token, NFTs und andere digitale Assets", 
          C: "Nur physische Produkte", 
          D: "Nur Rabattgutscheine" 
        },
        correctAnswer: "B",
        hint: "Digitale Assets sind die primäre Belohnungsart"
      },
      {
        id: 10,
        question: "Wie handhabt Lift Cash Transaktionsgebühren?",
        options: { 
          A: "Sehr hohe Gebühren", 
          B: "Moderate Gebühren", 
          C: "Niedrige bis keine Gebühren dank ICP-Technologie", 
          D: "Gebühren variieren zufällig" 
        },
        correctAnswer: "C",
        hint: "Die zugrunde liegende Blockchain-Technologie ist kosteneffizient"
      },
      {
        id: 11,
        question: "Was ist das Governance-Modell von Lift Cash?",
        options: { 
          A: "Zentralisierte Unternehmenskontrolle", 
          B: "Staatlich reguliert", 
          C: "Community-getrieben und dezentralisiert", 
          D: "Keine Governance-Struktur" 
        },
        correctAnswer: "C",
        hint: "Benutzer haben ein Mitspracherecht bei der Richtung der Plattform"
      },
      {
        id: 12,
        question: "Wie gewährleistet Lift Cash Transparenz?",
        options: { 
          A: "Private Datenbanken", 
          B: "Blockchain-Ledger und offene Protokolle", 
          C: "Nur Jahresberichte", 
          D: "Keine Transparenzmaßnahmen" 
        },
        correctAnswer: "B",
        hint: "Alles wird in einem unveränderlichen Ledger aufgezeichnet"
      },
      {
        id: 13,
        question: "Was ist die langfristige Vision von Lift Cash?",
        options: { 
          A: "Alle Banken ersetzen", 
          B: "Ein dezentrales Finanzökosystem schaffen", 
          C: "Eine Social Media Plattform werden", 
          D: "Sich nur auf Gaming konzentrieren" 
        },
        correctAnswer: "B",
        hint: "Es zielt darauf ab, zu revolutionieren, wie Menschen mit Finanzen interagieren"
      },
      {
        id: 14,
        question: "Wie unterstützt Lift Cash finanzielle Inklusion?",
        options: { 
          A: "Dient nur wohlhabenden Benutzern", 
          B: "Erfordert umfangreiche Dokumentation", 
          C: "Bietet zugängliche DeFi-Dienste für alle", 
          D: "Beschränkt auf bestimmte Länder nur" 
        },
        correctAnswer: "C",
        hint: "Es zielt darauf ab, Finanzdienstleistungen für alle verfügbar zu machen"
      },
      {
        id: 15,
        question: "Welche Rolle spielen Smart Contracts in Lift Cash?",
        options: { 
          A: "Überhaupt keine Rolle", 
          B: "Nur zur Dekoration", 
          C: "Prozesse automatisieren und vertrauenslose Operationen gewährleisten", 
          D: "Nur für Marketing verwendet" 
        },
        correctAnswer: "C",
        hint: "Sie eliminieren die Notwendigkeit von Zwischenhändlern"
      }
    ],
    it: [
      {
        id: 1,
        question: "Qual è lo scopo principale di Lift Cash?",
        options: { 
          A: "Piattaforma di social media", 
          B: "Piattaforma di giochi", 
          C: "Piattaforma di finanza decentralizzata e ricompense", 
          D: "Mercato e-commerce" 
        },
        correctAnswer: "C",
        hint: "Pensa ai servizi finanziari e al guadagnare ricompense"
      },
      {
        id: 2,
        question: "Quale tecnologia blockchain utilizza Lift Cash?",
        options: { 
          A: "Ethereum", 
          B: "Bitcoin", 
          C: "Internet Computer Protocol (ICP)", 
          D: "Solana" 
        },
        correctAnswer: "C",
        hint: "È conosciuta per la sua velocità e bassi costi di transazione"
      },
      {
        id: 3,
        question: "Cosa possono guadagnare gli utenti attraverso le attività di Lift Cash?",
        options: { 
          A: "Solo criptovalute", 
          B: "Token e ricompense", 
          C: "Solo prodotti fisici", 
          D: "Niente" 
        },
        correctAnswer: "B",
        hint: "Gli utenti sono incentivati per la loro partecipazione"
      },
      {
        id: 4,
        question: "Come garantisce Lift Cash la sicurezza per i suoi utenti?",
        options: { 
          A: "Solo password tradizionali", 
          B: "Tecnologia blockchain e smart contract", 
          C: "Verifica email", 
          D: "Verifica numero di telefono" 
        },
        correctAnswer: "B",
        hint: "Sfrutta la tecnologia decentralizzata per la sicurezza"
      },
      {
        id: 5,
        question: "Che tipo di sistema di identità usa Lift Cash?",
        options: { 
          A: "Username/password tradizionale", 
          B: "Login social media", 
          C: "Internet Identity", 
          D: "Autenticazione basata su email" 
        },
        correctAnswer: "C",
        hint: "È una soluzione di identità decentralizzata"
      },
      {
        id: 6,
        question: "Cosa rende Lift Cash diverso dalle piattaforme finanziarie tradizionali?",
        options: { 
          A: "Commissioni più alte", 
          B: "Transazioni più lente", 
          C: "Decentralizzato e di proprietà degli utenti", 
          D: "Più burocrazia richiesta" 
        },
        correctAnswer: "C",
        hint: "Gli utenti hanno più controllo e proprietà"
      },
      {
        id: 7,
        question: "Quanto spesso possono partecipare gli utenti alle attività di Lift Cash?",
        options: { 
          A: "Una volta al mese", 
          B: "Una volta a settimana", 
          C: "Quotidianamente", 
          D: "Solo nei weekend" 
        },
        correctAnswer: "C",
        hint: "L'impegno regolare è incoraggiato"
      },
      {
        id: 8,
        question: "Cosa è richiesto per iniziare a usare Lift Cash?",
        options: { 
          A: "Verifica conto bancario", 
          B: "Controllo del credito", 
          C: "Configurazione Internet Identity", 
          D: "Verifica indirizzo fisico" 
        },
        correctAnswer: "C",
        hint: "È lo stesso sistema di autenticazione usato in questo trivia"
      },
      {
        id: 9,
        question: "Che tipo di ricompense possono aspettarsi gli utenti da Lift Cash?",
        options: { 
          A: "Solo contanti", 
          B: "Token, NFT e altri asset digitali", 
          C: "Solo prodotti fisici", 
          D: "Solo coupon sconto" 
        },
        correctAnswer: "B",
        hint: "Gli asset digitali sono il tipo principale di ricompensa"
      },
      {
        id: 10,
        question: "Come gestisce Lift Cash le commissioni di transazione?",
        options: { 
          A: "Commissioni molto alte", 
          B: "Commissioni moderate", 
          C: "Commissioni basse o nulle grazie alla tecnologia ICP", 
          D: "Le commissioni variano casualmente" 
        },
        correctAnswer: "C",
        hint: "La tecnologia blockchain sottostante è efficiente in termini di costi"
      },
      {
        id: 11,
        question: "Qual è il modello di governance di Lift Cash?",
        options: { 
          A: "Controllo aziendale centralizzato", 
          B: "Regolamentato dal governo", 
          C: "Guidato dalla comunità e decentralizzato", 
          D: "Nessuna struttura di governance" 
        },
        correctAnswer: "C",
        hint: "Gli utenti hanno voce in capitolo nella direzione della piattaforma"
      },
      {
        id: 12,
        question: "Come garantisce Lift Cash la trasparenza?",
        options: { 
          A: "Database privati", 
          B: "Registro blockchain e protocolli aperti", 
          C: "Solo rapporti annuali", 
          D: "Nessuna misura di trasparenza" 
        },
        correctAnswer: "B",
        hint: "Tutto è registrato su un registro immutabile"
      },
      {
        id: 13,
        question: "Qual è la visione a lungo termine di Lift Cash?",
        options: { 
          A: "Sostituire tutte le banche", 
          B: "Creare un ecosistema finanziario decentralizzato", 
          C: "Diventare una piattaforma di social media", 
          D: "Concentrarsi solo sui giochi" 
        },
        correctAnswer: "B",
        hint: "Mira a rivoluzionare come le persone interagiscono con la finanza"
      },
      {
        id: 14,
        question: "Come supporta Lift Cash l'inclusione finanziaria?",
        options: { 
          A: "Serve solo utenti facoltosi", 
          B: "Richiede documentazione estesa", 
          C: "Fornisce servizi DeFi accessibili a tutti", 
          D: "Limitato solo a certi paesi" 
        },
        correctAnswer: "C",
        hint: "Mira a rendere i servizi finanziari disponibili a tutti"
      },
      {
        id: 15,
        question: "Che ruolo giocano gli smart contract in Lift Cash?",
        options: { 
          A: "Nessun ruolo", 
          B: "Solo per decorazione", 
          C: "Automatizzare processi e garantire operazioni trustless", 
          D: "Usato solo per marketing" 
        },
        correctAnswer: "C",
        hint: "Eliminano la necessità di intermediari"
      }
    ],
    pt: [
      {
        id: 1,
        question: "Qual é o propósito principal do Lift Cash?",
        options: { 
          A: "Plataforma de mídia social", 
          B: "Plataforma de jogos", 
          C: "Plataforma de finanças descentralizadas e recompensas", 
          D: "Mercado de e-commerce" 
        },
        correctAnswer: "C",
        hint: "Pense em serviços financeiros e ganhar recompensas"
      },
      {
        id: 2,
        question: "Qual tecnologia blockchain o Lift Cash utiliza?",
        options: { 
          A: "Ethereum", 
          B: "Bitcoin", 
          C: "Internet Computer Protocol (ICP)", 
          D: "Solana" 
        },
        correctAnswer: "C",
        hint: "É conhecida por sua velocidade e baixos custos de transação"
      },
      {
        id: 3,
        question: "O que os usuários podem ganhar através das atividades do Lift Cash?",
        options: { 
          A: "Apenas criptomoedas", 
          B: "Tokens e recompensas", 
          C: "Apenas produtos físicos", 
          D: "Nada" 
        },
        correctAnswer: "B",
        hint: "Os usuários são incentivados por sua participação"
      },
      {
        id: 4,
        question: "Como o Lift Cash garante segurança para seus usuários?",
        options: { 
          A: "Apenas senhas tradicionais", 
          B: "Tecnologia blockchain e contratos inteligentes", 
          C: "Verificação por email", 
          D: "Verificação por número de telefone" 
        },
        correctAnswer: "B",
        hint: "Aproveita a tecnologia descentralizada para segurança"
      },
      {
        id: 5,
        question: "Que tipo de sistema de identidade o Lift Cash usa?",
        options: { 
          A: "Usuário/senha tradicional", 
          B: "Login de mídia social", 
          C: "Internet Identity", 
          D: "Autenticação baseada em email" 
        },
        correctAnswer: "C",
        hint: "É uma solução de identidade descentralizada"
      },
      {
        id: 6,
        question: "O que torna o Lift Cash diferente das plataformas financeiras tradicionais?",
        options: { 
          A: "Taxas mais altas", 
          B: "Transações mais lentas", 
          C: "Descentralizado e de propriedade do usuário", 
          D: "Mais burocracia necessária" 
        },
        correctAnswer: "C",
        hint: "Os usuários têm mais controle e propriedade"
      },
      {
        id: 7,
        question: "Com que frequência os usuários podem participar das atividades do Lift Cash?",
        options: { 
          A: "Uma vez por mês", 
          B: "Uma vez por semana", 
          C: "Diariamente", 
          D: "Apenas nos fins de semana" 
        },
        correctAnswer: "C",
        hint: "O engajamento regular é encorajado"
      },
      {
        id: 8,
        question: "O que é necessário para começar a usar o Lift Cash?",
        options: { 
          A: "Verificação de conta bancária", 
          B: "Verificação de crédito", 
          C: "Configuração do Internet Identity", 
          D: "Verificação de endereço físico" 
        },
        correctAnswer: "C",
        hint: "É o mesmo sistema de autenticação usado neste trivia"
      },
      {
        id: 9,
        question: "Que tipo de recompensas os usuários podem esperar do Lift Cash?",
        options: { 
          A: "Apenas dinheiro", 
          B: "Tokens, NFTs e outros ativos digitais", 
          C: "Apenas produtos físicos", 
          D: "Apenas cupons de desconto" 
        },
        correctAnswer: "B",
        hint: "Ativos digitais são o tipo principal de recompensa"
      },
      {
        id: 10,
        question: "Como o Lift Cash lida com taxas de transação?",
        options: { 
          A: "Taxas muito altas", 
          B: "Taxas moderadas", 
          C: "Taxas baixas ou nulas devido à tecnologia ICP", 
          D: "Taxas variam aleatoriamente" 
        },
        correctAnswer: "C",
        hint: "A tecnologia blockchain subjacente é eficiente em custos"
      },
      {
        id: 11,
        question: "Qual é o modelo de governança do Lift Cash?",
        options: { 
          A: "Controle corporativo centralizado", 
          B: "Regulamentado pelo governo", 
          C: "Dirigido pela comunidade e descentralizado", 
          D: "Nenhuma estrutura de governança" 
        },
        correctAnswer: "C",
        hint: "Os usuários têm voz na direção da plataforma"
      },
      {
        id: 12,
        question: "Como o Lift Cash garante transparência?",
        options: { 
          A: "Bancos de dados privados", 
          B: "Registro blockchain e protocolos abertos", 
          C: "Apenas relatórios anuais", 
          D: "Nenhuma medida de transparência" 
        },
        correctAnswer: "B",
        hint: "Tudo é registrado em um registro imutável"
      },
      {
        id: 13,
        question: "Qual é a visão de longo prazo do Lift Cash?",
        options: { 
          A: "Substituir todos os bancos", 
          B: "Criar um ecossistema financeiro descentralizado", 
          C: "Tornar-se uma plataforma de mídia social", 
          D: "Focar apenas em jogos" 
        },
        correctAnswer: "B",
        hint: "Visa revolucionar como as pessoas interagem com finanças"
      },
      {
        id: 14,
        question: "Como o Lift Cash apoia a inclusão financeira?",
        options: { 
          A: "Serve apenas usuários ricos", 
          B: "Requer documentação extensa", 
          C: "Fornece serviços DeFi acessíveis para todos", 
          D: "Limitado apenas a certos países" 
        },
        correctAnswer: "C",
        hint: "Visa tornar os serviços financeiros disponíveis para todos"
      },
      {
        id: 15,
        question: "Que papel os contratos inteligentes desempenham no Lift Cash?",
        options: { 
          A: "Nenhum papel", 
          B: "Apenas para decoração", 
          C: "Automatizar processos e garantir operações sem confiança", 
          D: "Usado apenas para marketing" 
        },
        correctAnswer: "C",
        hint: "Eles eliminam a necessidade de intermediários"
      }
    ]
  }
  // Future rounds can be added here:
  // 2: { en: [...], es: [...], etc. },
  // 3: { en: [...], es: [...], etc. },
};

// Helper function to get current round number based on time
function getCurrentRoundNumber(): number {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const hoursFromStart = Math.floor((now.getTime() - startOfDay.getTime()) / (1000 * 60 * 60));
  const roundsToday = Math.floor(hoursFromStart / 3) + 1;
  
  // For simplicity, we'll cycle through available rounds
  // In a real app, this would be more sophisticated
  const availableRounds = Object.keys(TRIVIA_QUESTIONS_BY_ROUND).length;
  return ((roundsToday - 1) % availableRounds) + 1;
}

function TriviaGame({ language, onGameEnd }: TriviaGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Array<{ questionId: number; answer: string | null; correct: boolean }>>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [heartIsBlack, setHeartIsBlack] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const currentRound = getCurrentRoundNumber();
  const roundQuestions = TRIVIA_QUESTIONS_BY_ROUND[currentRound];
  const questions = roundQuestions?.[language] || roundQuestions?.['en'] || [];
  
  // Check if questions are available for this round
  const hasQuestions = questions.length > 0;
  
  const currentQuestion = hasQuestions ? questions[currentQuestionIndex] : null;
  const isLastQuestion = hasQuestions ? currentQuestionIndex === questions.length - 1 : false;

  // Timer countdown - always declare this hook
  useEffect(() => {
    if (hasQuestions && timeLeft > 0 && !isAnswerLocked && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (hasQuestions && timeLeft === 0 && !isAnswerLocked && !gameEnded) {
      // Time's up - auto advance with no answer
      handleAnswerSubmit(null);
    }
  }, [timeLeft, isAnswerLocked, gameEnded, hasQuestions]);

  // Reset timer and states when question changes - always declare this hook
  useEffect(() => {
    if (hasQuestions) {
      setTimeLeft(15);
      setSelectedAnswer(null);
      setShowHint(false);
      setIsAnswerLocked(false);
    }
  }, [currentQuestionIndex, hasQuestions]);

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerLocked && !gameEnded) {
      setSelectedAnswer(answer);
    }
  };

  const handleAnswerSubmit = (answer: string | null) => {
    if (isAnswerLocked || gameEnded || !currentQuestion) return;

    setIsAnswerLocked(true);
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Record the answer
    const newAnswer = {
      questionId: currentQuestion.id,
      answer,
      correct: isCorrect
    };
    
    setAnswers(prev => [...prev, newAnswer]);

    // Auto advance after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        // Game finished - show results and end
        handleGameEnd();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const handleGameEnd = async () => {
    if (gameEnded) return;
    
    setGameEnded(true);
    
    // Calculate final score including the current answer
    const currentAnswerCorrect = selectedAnswer === currentQuestion?.correctAnswer;
    const correctAnswers = answers.filter(a => a.correct).length + (currentAnswerCorrect ? 1 : 0);
    
    // Show results after a brief delay
    setTimeout(() => {
      alert(`Round ${currentRound} Complete!\n\nYou got ${correctAnswers} out of ${questions.length} questions correct!\n\nReturning to lobby...`);
      
      // Return to lobby - this will trigger the reset of player readiness
      onGameEnd();
    }, 1000);
  };

  const handleHeartDoubleClick = () => {
    setHeartIsBlack(true);
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-400';
    if (timeLeft <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getTimerBgColor = () => {
    if (timeLeft <= 5) return 'bg-red-500/20 border-red-500/30';
    if (timeLeft <= 10) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  // If no questions available, show message
  if (!hasQuestions) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header with Logo */}
        <header className="flex items-center justify-center p-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://wlnir-2iaaa-aaaal-ascwa-cai.icp0.io/assets/your-logo-07b5f3fa.png" 
              alt="Lift Cash Trivia" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Lift Cash Trivia</h1>
              <p className="text-lg text-secondary">Round {currentRound}</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="card p-8 text-center hover-lift">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">No Questions Available</h2>
              <p className="text-secondary text-lg mb-6 leading-relaxed">
                There are no trivia questions available for Round {currentRound} at this time.
              </p>
              <p className="text-muted mb-8">
                Please come back later when new questions have been added for this round.
              </p>
              <button
                onClick={onGameEnd}
                className="btn btn-primary px-8 py-3 text-lg font-semibold"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-muted">
          <p className="flex items-center justify-center">
            © 2025. Started with{' '}
            <span 
              className="mx-1 cursor-pointer select-none"
              onDoubleClick={() => setHeartIsBlack(true)}
              title="Double-click for a surprise!"
            >
              {heartIsBlack ? '🖤' : '❤️'}
            </span>
            {' '}using{' '}
            <a href="https://caffeine.ai" className="ml-1 text-accent hover:text-orange-400 transition-colors">
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="flex items-center justify-center p-6">
        <div className="flex items-center gap-4">
          <img 
            src="https://wlnir-2iaaa-aaaal-ascwa-cai.icp0.io/assets/your-logo-07b5f3fa.png" 
            alt="Lift Cash Trivia" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Lift Cash Trivia</h1>
            <p className="text-lg text-secondary">Round {currentRound} in Progress</p>
          </div>
        </div>
      </header>

      {/* Main Game Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          {/* Progress and Timer */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="card px-6 py-3">
              <span className="text-primary font-semibold text-lg">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            
            <div className={`card px-6 py-3 border ${getTimerBgColor()}`}>
              <div className="flex items-center">
                <Clock className={`w-5 h-5 mr-2 ${getTimerColor()}`} />
                <span className={`font-bold text-xl ${getTimerColor()}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="card p-8 mb-8 hover-lift">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-relaxed">
                {currentQuestion.question}
              </h2>
              
              {/* Hint Button */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="btn btn-secondary px-4 py-2 text-sm"
                disabled={isAnswerLocked || gameEnded}
              >
                <Rocket className="w-4 h-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              
              {showHint && (
                <div className="mt-4 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <p className="text-blue-300 text-lg">💡 {currentQuestion.hint}</p>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    handleAnswerSelect(key);
                    handleAnswerSubmit(key);
                  }}
                  disabled={isAnswerLocked || gameEnded}
                  className={`p-6 rounded-xl text-left transition-all duration-200 border-2 ${
                    selectedAnswer === key
                      ? isAnswerLocked
                        ? key === currentQuestion.correctAnswer
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-accent/20 border-accent text-accent'
                      : isAnswerLocked && key === currentQuestion.correctAnswer
                        ? 'bg-green-500/20 border-green-500 text-green-300'
                        : 'bg-tertiary border-default text-primary hover:bg-secondary hover:border-hover'
                  } ${isAnswerLocked || gameEnded ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${
                      selectedAnswer === key
                        ? isAnswerLocked
                          ? key === currentQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-accent text-white'
                        : isAnswerLocked && key === currentQuestion.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-primary'
                    }`}>
                      {key}
                    </div>
                    <span className="text-lg font-medium">{value}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Answer Feedback */}
            {isAnswerLocked && (
              <div className="mt-6 text-center">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                    <p className="text-green-300 text-xl font-bold">✓ Correct!</p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                    <p className="text-red-300 text-xl font-bold">
                      ✗ {selectedAnswer ? 'Incorrect' : 'Time\'s up!'}
                    </p>
                    <p className="text-red-300 text-sm mt-1">
                      The correct answer was: {currentQuestion.correctAnswer}
                    </p>
                  </div>
                )}
                
                {!isLastQuestion && (
                  <p className="text-muted text-sm mt-2">
                    Moving to next question...
                  </p>
                )}
                
                {isLastQuestion && (
                  <p className="text-muted text-sm mt-2">
                    Calculating final score...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="card p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-secondary text-sm">Progress</span>
              <span className="text-secondary text-sm">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-tertiary rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent to-orange-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-muted">
        <p className="flex items-center justify-center">
          © 2025. Started with{' '}
          <span 
            className="mx-1 cursor-pointer select-none"
            onDoubleClick={handleHeartDoubleClick}
            title="Double-click for a surprise!"
          >
            {heartIsBlack ? '🖤' : '❤️'}
          </span>
          {' '}using{' '}
          <a href="https://caffeine.ai" className="ml-1 text-accent hover:text-orange-400 transition-colors">
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default TriviaGame;

import imgOnlan from "@/assets/work-onlan.jpg";
import imgSaarthi from "@/assets/work-saarthi.jpg";
import imgQsphere from "@/assets/work-qsphere.jpg";
import imgFincopilot from "@/assets/work-fincopilot.jpg";

export type ProjectTier = "featured" | "secondary" | "experiment";

export type ProjectSection = {
  heading: string;
  body?: string;
  items?: string[];
};

export type Project = {
  id: string;
  num: string;
  title: string;
  subtitle?: string;
  fullName?: string;
  description: string;
  label: string;
  img: string;
  tier: ProjectTier;
  tags: string[];
  sections: ProjectSection[];
  stack: string[];
  status?: string;
  authors?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "onlan",
    num: "01",
    title: "OnLAN",
    subtitle: "Encrypted, real-time communication for local networks — and beyond.",
    description:
      "OnLAN is a self-hosted LAN messenger designed around privacy, real-time communication and control.",
    label: "PRIVATE / IN DEVELOPMENT",
    img: imgOnlan,
    tier: "featured",
    tags: ["e2e encryption", "real-time", "self-hosted", "webrtc"],
    status: "Private Repository · Under Development",
    sections: [
      {
        heading: "Problem",
        body: "Local network communication tools are either closed-source, lack end-to-end encryption, or require external servers. OnLAN addresses this by being fully self-hosted, encrypted, and operating entirely within a LAN — with optional connectivity beyond it.",
      },
      {
        heading: "Approach",
        body: "A Signal-protocol-inspired encryption stack layered on a FastAPI WebSocket backend, with a React frontend supporting PWA installation for mobile. All messages are end-to-end encrypted; the server never sees plaintext.",
      },
      {
        heading: "Architecture",
        items: [
          "Python + FastAPI + Uvicorn backend",
          "PostgreSQL for persistence",
          "React + Vite + Tailwind CSS frontend",
          "TanStack Router + TanStack Query",
          "Framer Motion for interactions",
          "WebSocket real-time transport",
          "PWA / mobile support",
        ],
      },
      {
        heading: "Security",
        items: [
          "X25519 key exchange",
          "Ed25519 signatures",
          "X3DH key agreement",
          "Double Ratchet for forward secrecy",
          "Sender Keys for group messaging",
          "ChaCha20-Poly1305 + AES-256-GCM encryption",
          "Argon2id password hashing",
        ],
      },
      {
        heading: "Features",
        items: [
          "End-to-end encrypted direct messaging",
          "End-to-end encrypted group chats",
          "Encrypted file sharing",
          "WebRTC voice / video calls",
          "Push notifications",
          "Groups and membership management",
          "Admin panel",
          "OffLAN integration",
          "Steganography",
          "Self-hosted architecture",
        ],
      },
      {
        heading: "Stack",
        items: ["Python", "FastAPI", "Uvicorn", "PostgreSQL", "React", "Vite", "Tailwind CSS", "TanStack Router", "TanStack Query", "Framer Motion", "WebRTC", "WebSocket"],
      },
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "React", "Vite", "Tailwind CSS", "WebRTC", "WebSocket"],
  },
  {
    id: "saarthi",
    num: "02",
    title: "SAARTHI",
    fullName: "Strategic AI-Assisted Rail Traffic & Headway Initiative",
    subtitle: "An AI-assisted framework for improving railway traffic control and section throughput.",
    description:
      "An AI-assisted framework for improving railway traffic control and section throughput.",
    label: "CONCEPT / RESEARCH PROJECT",
    img: imgSaarthi,
    tier: "secondary",
    tags: ["multi-agent RL", "digital twin", "railway", "AI"],
    status: "SIH 2025 · College-Level Finalist · Team Code Galaxy",
    sections: [
      {
        heading: "Problem",
        body: "Maximizing section throughput using AI-powered precise train traffic control — Problem Statement 25022 from the Smart India Hackathon 2025, Transportation & Logistics category.",
      },
      {
        heading: "Approach",
        body: "A proposed framework using decentralized multi-agent learning and a digital twin of the railway network. Train, station, and section agents learn to coordinate traffic flow with predictive conflict detection and dynamic speed advisories.",
      },
      {
        heading: "Architecture",
        items: [
          "Multi-Agent Deep Reinforcement Learning",
          "Digital Twin of the railway network",
          "Train / station / section agents",
          "Predictive conflict detection",
          "Traffic optimization",
          "Controller decision support",
          "Dynamic Speed Advisory",
        ],
      },
      {
        heading: "Context",
        body: "Presented as a research and problem-solving project. The framework proposes an AI-driven multi-agent system with a railway digital twin for real-time traffic optimization. Proposed benefits are not claimed as measured real-world results.",
        items: ["Smart India Hackathon 2025", "Problem Statement 25022", "Transportation & Logistics", "Team: Code Galaxy", "College-Level Finalist"],
      },
      {
        heading: "Stack",
        items: ["Multi-Agent Deep RL", "Digital Twin", "Python", "Reinforcement Learning"],
      },
    ],
    stack: ["Multi-Agent RL", "Digital Twin", "Python", "AI"],
  },
  {
    id: "q-sphere",
    num: "03",
    title: "Q-Sphere",
    subtitle: "The Quantum State Visualizer",
    description:
      "An interactive tool for making quantum states easier to understand visually.",
    label: "QUANTUM COMPUTING / EXPERIMENT",
    img: imgQsphere,
    tier: "secondary",
    tags: ["quantum", "visualization", "bloch sphere", "qiskit"],
    status: "Experiment",
    sections: [
      {
        heading: "Problem",
        body: "Quantum states are notoriously difficult to build intuition for. Q-Sphere makes multi-qubit states tangible by visualizing each qubit's reduced density matrix on an interactive Bloch sphere.",
      },
      {
        heading: "Approach",
        body: "The application accepts a multi-qubit quantum circuit, uses partial trace to isolate individual qubit reduced density matrices, and visualizes each qubit's mixed state on a Bloch sphere.",
      },
      {
        heading: "Features",
        items: [
          "Multi-qubit circuit composition",
          "Gate-based circuit building",
          "Partial trace computation",
          "Reduced density matrices",
          "Bloch sphere visualization",
          "Purity measurement",
          "Density matrix heatmaps",
          "Measurement histograms",
          "Step-through circuit execution",
        ],
      },
      {
        heading: "Stack",
        items: ["JavaScript", "React", "Tailwind CSS", "Plotly.js", "Python", "FastAPI", "Qiskit Aer", "NumPy", "JSON / OpenQASM"],
      },
    ],
    stack: ["React", "Python", "Qiskit", "Plotly.js", "FastAPI", "NumPy"],
  },
  {
    id: "fincopilot",
    num: "04",
    title: "FinCopilot",
    subtitle: "Personal finance across web and Android.",
    description:
      "Personal finance application for tracking money, budgets and spending across web and Android.",
    label: "APPLICATION / IN DEVELOPMENT",
    img: imgFincopilot,
    tier: "secondary",
    tags: ["finance", "full-stack", "android", "capacitor"],
    status: "Under Development",
    sections: [
      {
        heading: "Problem",
        body: "Personal finance tools are often fragmented across platforms. FinCopilot brings budgeting, transactions, and spending insights into one app that works on both web and Android.",
      },
      {
        heading: "Features",
        items: [
          "Dashboard with balance overview",
          "Income and expense tracking",
          "Budgeting tools",
          "Transaction history",
          "Visual charts and analytics",
          "Google OAuth authentication",
          "Guest mode for quick access",
          "Android application support via Capacitor",
        ],
      },
      {
        heading: "Stack",
        items: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Framer Motion", "React Query", "Capacitor", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic", "JWT"],
      },
    ],
    stack: ["React", "FastAPI", "PostgreSQL", "Capacitor", "Tailwind CSS", "JWT"],
  },
  {
    id: "learn-your-way",
    num: "05",
    title: "Learn Your Way",
    subtitle: "An educational platform built around flexible learning and exploration.",
    description:
      "An educational platform built around flexible learning and exploration.",
    label: "WORK IN PROGRESS",
    img: "",
    tier: "experiment",
    tags: ["education", "platform"],
    status: "Work in Progress",
    authors: "Rishik × Jagadish × Subhash",
    sections: [
      {
        heading: "About",
        body: "An educational platform built around flexible learning and exploration. Currently in active development.",
      },
      {
        heading: "Authors",
        items: ["Rishik", "Jagadish", "Subhash"],
      },
    ],
    stack: ["In Development"],
  },
  {
    id: "clear-skys",
    num: "06",
    title: "Clear Skys",
    subtitle: "AI-GIS Travel Assistant for Low-Pollution, Sustainable Tourism",
    description:
      "A concept for using AI, GIS, air-quality data and travel planning to help users discover lower-pollution destinations and routes.",
    label: "AI / GIS / PRODUCT CONCEPT",
    img: "",
    tier: "experiment",
    tags: ["AI", "GIS", "travel", "sustainability"],
    status: "Product Concept",
    sections: [
      {
        heading: "Concept",
        body: "A concept for using AI, GIS, air-quality data and travel planning to help users discover lower-pollution destinations and routes.",
      },
      {
        heading: "Core Ideas",
        items: [
          "AI-GIS based travel planning",
          "Real-time air quality information",
          "Satellite data integration",
          "Clean-air destination discovery",
          "Personalized filters (Asthma-Safe, Family-Friendly, Eco-Explorer)",
          "Sustainable tourism focus",
        ],
      },
    ],
    stack: ["AI", "GIS", "Concept"],
  },
];

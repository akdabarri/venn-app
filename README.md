
# 🎯 Venn - Find Your Journal!

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk_Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

**Venn** is an intelligent, full-stack web application designed to accelerate academic research. By leveraging the power of Google's Gemini AI, Venn analyzes your research abstract or keywords and instantly recommends the most suitable Scopus-indexed journals for your publication, complete with deep AI reasoning.

🔗 **Live Demo:** [https://venn-app-barres-projects.vercel.app/](https://venn-app-barres-projects.vercel.app/)

---
## 🚀 Latest Update: v2.0 (The Intelligence Update)
*March 2026*

In this major update, **Venn** has been upgraded with a more robust architecture for academic research:

- **🧠 Intelligence Level Switcher:** Toggle between **Fast Mode** (Gemini Flash/Llama 8B) and **Smart Mode** (Llama-3-70B).
- **🛡️ Robust Parsing Engine:** Integrated **Self-Healing Regex Recovery** to handle LLM formatting errors.
- **📊 Direct Research Access:** Smart-link integration with **SCImago (SJR)**, **Google Scholar**, and Official Websites.
- **🔐 Persistence Layer:** Full **Supabase** & **Clerk** integration for saving journal shortlists.
---

## ✨ Key Features

* 🧠 **Smart AI Matching:** Uses `Gemini 2.5 Flash` to deeply analyze research abstracts and find the perfect semantic match within a vast database of Scopus journals.
* 📊 **Comprehensive Metrics:** Displays critical journal metrics including SJR Quartiles (Q1-Q4), H-index, APC status (Free/Paid), and Country of origin.
* 🔐 **Secure Authentication:** Seamless and secure user login flow powered by **Clerk**.
* 📚 **Personalized History:** Users can bookmark their favorite journal recommendations and AI reasoning. Data is persistently stored in a real-time **Supabase (PostgreSQL)** database.
* ⚡ **Modern Architecture:** Built with the latest **Next.js 15 (App Router)** for lightning-fast server-side rendering and highly responsive UI with **Tailwind CSS**.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15, React 19, Tailwind CSS, Lucide Icons.
* **Backend:** Next.js API Routes (Serverless Functions).
* **Database:** Supabase (PostgreSQL) with integrated Row Level Security (RLS).
* **Authentication:** Clerk.
* **AI Provider:** Google Gemini API (`gemini-2.5-flash`).
* **Deployment:** Vercel.

---

## 🚀 How to Run Locally

Want to test this project on your local machine? Follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/akdabarri/venn-app.git](https://github.com/akdabarri/venn-app.git)
cd venn-app
````

**2. Install dependencies**

```bash
npm install --legacy-peer-deps
```

**3. Set up Environment Variables**
Create a `.env.local` file in the root directory and add your API keys:

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

-----

## 💡 About The Project

This project was developed as a robust exploration into **AI in Education (AI-in-Ed)**, bridging the gap between advanced Large Language Models and practical academic workflows to support researchers and students in discovering impactful publication venues.

*Developed by **Akda Barri**.*

```

---



<h1 align="center">🚀 Legal-Case-Tracker</h1>


<p align="center">
  <img src="https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg" alt="GitHub Snake Animation" width="100%">
</p>

---

⚡ Overview

The Legal Case Tracker is a full-stack Django application with a custom-designed frontend, enabling law firms and individual practitioners to:

1.Track case progress

2.Store and validate documents

3.Manage deadlines with overdue detection

4.Organize parties involved in each case

5.Ensure secure access via authentication

6.The project demonstrates clean backend engineering, frontend UI design, database modelling, and production-ready structure.

---

🧬 Architecture

                   ┌──────────────────────────┐
                   │        FRONTEND          │
                   │  HTML • CSS • JS (custom)│
                   └─────────────┬────────────┘
                                 │
                                 ▼
                   ┌──────────────────────────┐
                   │          DJANGO          │
                   │   Views • Forms • URLs   │
                   └─────────────┬────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────────────┐
        │                     BUSINESS LOGIC                  │
        │ Case workflows • Deadline engine • File validators │
        └─────────────┬──────────────────────────────────────┘
                      │
                      ▼
           ┌──────────────────────────┐
           │         DATABASE         │
           │   SQLite (dev) / Postgres│
           └──────────────────────────┘

---

🛠️ Tech Stack
<p align="left"> <img src="https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python&logoColor=white" /> <img src="https://img.shields.io/badge/Django-4.x-092E20?style=for-the-badge&logo=django&logoColor=white" /> <img src="https://img.shields.io/badge/HTML5-F06529?style=for-the-badge&logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/CSS3-264DE4?style=for-the-badge&logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" /> <img src="https://img.shields.io/badge/Pillow-Image%20Processing-3670A0?style=for-the-badge&logo=python&logoColor=white" /> <img src="https://img.shields.io/badge/DotEnv-Env%20Config-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" /> <img src="https://img.shields.io/badge/Custom%20UI-Frontend%20Design-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" /> <img src="https://img.shields.io/badge/MVT%20Pattern-Django-0A7E07?style=for-the-badge&logo=django&logoColor=white" /> <img src="https://img.shields.io/badge/Git-Version%20Control-F05032?style=for-the-badge&logo=git&logoColor=white" /> </p>

---

✨ Core Features
🔐 Authentication

--> Secure login/logout + page access restrictions.

📁 Case Management

--> Create, update, view, delete cases with status & metadata.

👥 Party Handling

--> Add plaintiffs, defendants, or custom roles per case.

⏳ Deadline Engine

--> Add deadlines with overdue detection & completion status.

📄 Document Upload System

--> Secure uploads with validation (file size + extension), stored under per-case folders.

🖥 Custom Frontend UI

1.Responsive layout

2.Smooth animations

3.Futuristic card design

4.Styled forms (Django Form Mixins)

-----

⚙️ Installation
1️⃣ Clone Repo:
git clone https://github.com/yourusername/legal-case-tracker.git
cd legal-case-tracker

2️⃣ Virtual Environment:
python -m venv venv
venv\Scripts\activate

3️⃣ Install Dependencies:
pip install -r requirements.txt

4️⃣ Apply Migrations:
python manage.py makemigrations
python manage.py migrate

5️⃣ Create Superuser:
python manage.py createsuperuser

6️⃣ Run Server:
python manage.py runserver

--------
<h3 align="center">🌐 Connect-With-Me</h3>

<p align="center">
  <a href="workforaniruddh31@gmail.com">
    <img src="https://img.shields.io/badge/Contact%20HQ-Email%20Now-00FFFF?style=for-the-badge&logo=gmail&logoColor=black" />
  </a>
  <a href="linkedin.com/in/aniruddh-srivastav-058312365">
    <img src="https://img.shields.io/badge/LinkedIn-Connected-ff007f?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://github.com/still-trying">
    <img src="https://img.shields.io/badge/GitHub-Repository-7fff00?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

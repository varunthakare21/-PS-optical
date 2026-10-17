# 🚀 PS Optical - GitHub Setup & Ongoing Updates Guide

This guide details how your repository is connected to GitHub and how to publish updates anytime.

---

## 📌 Repository Information
- **GitHub Username:** `varunthakare21`
- **Email:** `varunthakare21@gmail.com`
- **Target Repository URL:** `https://github.com/varunthakare21/ps-optical.git`
- **Primary Branch:** `main`

---

## 🛠️ Step 1: Create the Empty Repository on GitHub (One-Time)

If you haven't created the repository on GitHub yet:

1. Open your browser and go to: **[https://github.com/new](https://github.com/new)**
2. In **Repository name**, enter: `ps-optical`
3. Choose **Public** or **Private** based on your preference.
4. ⚠️ **IMPORTANT**: Do **NOT** check *"Add a README file"*, and do **NOT** add a .gitignore or license (these are already configured locally in your project).
5. Click the green **Create repository** button.

---

## 🚀 Step 2: Push the Initial Code to GitHub

Open your terminal in this project folder (`c:\Users\ASUS\OneDrive\Desktop\Ps optical`) and run:

```powershell
git push -u origin main
```

*(If GitHub prompts you to authenticate, sign in with your GitHub browser window or Personal Access Token).*

---

## 🔄 How to Push Updates Time to Time

Whenever you modify any code, add new features, or update styles, use any of these methods:

### Method 1: Double-Click Helper (Easiest)
1. Open File Explorer to your project folder: `c:\Users\ASUS\OneDrive\Desktop\Ps optical`
2. Double-click **`push-update.bat`**.
3. Type a short description of what you changed (e.g., `Updated eyeglasses filter`) and press **Enter**.
4. The tool automatically stages files, commits them, and pushes to GitHub!

### Method 2: From VS Code / PowerShell Terminal
In your terminal, simply run:
```powershell
.\push-update.ps1 "Added new sunglasses products"
```
*(If you run without arguments, it will prompt you for a message).*

### Method 3: Standard Git Commands
```bash
git add .
git commit -m "Describe your changes here"
git push
```

---

## 🔒 Security Notes
- Your `.env` files with sensitive credentials (JWT secret, database strings) are safely excluded in `.gitignore` and will never be pushed to GitHub.
- Large folders like `node_modules` and build directories (`dist`) are ignored.

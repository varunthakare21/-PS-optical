# 🚀 PS Optical - GitHub Setup & Ongoing Updates Guide

This guide details how your repository is connected to GitHub and how to publish updates anytime.

---

## 📌 Repository Information
- **GitHub Username:** `varunthakare21`
- **Email:** `varunthakare21@gmail.com`
- **Target Repository URL:** `https://github.com/varunthakare21/-PS-optical.git`
- **GitHub Web URL:** `https://github.com/varunthakare21/-PS-optical`
- **Primary Branch:** `main`

---

## 🚀 Step 1: Initial Upload to GitHub (One-Time)

Your repository on GitHub was created as **`-PS-optical`**. 

To upload your entire local code:

### Option A: Double-Click Helper (Easiest)
1. Double-click the file **`first-push.bat`** in your project folder.
2. A window will open. If prompted, click **"Sign in with your browser"** to authorize GitHub.
3. The upload will complete automatically!

### Option B: Terminal Command
Run this command in your terminal (`c:\Users\ASUS\OneDrive\Desktop\Ps optical`):

```powershell
git push -u origin main --force
```

*(The `--force` flag is only needed for the first push because GitHub created an empty initial README.md when the repository was created).*

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

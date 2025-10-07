# Squarewatch-chess Scripts

Automation and utility scripts for squarewatch-chess.

## 📂 Directory Structure

```
scripts/
├── README.md              # This file
├── .gitignore            # Auto-ignore secrets
├── deployment/           # Deployment scripts (when needed)
├── testing/              # Testing scripts (when needed)
├── database/             # Database scripts (when needed)
├── setup/                # Setup scripts (when needed)
└── utils/                # Utility scripts (when needed)
```

## 🔐 Security

**IMPORTANT:** This directory has a `.gitignore` that automatically prevents committing:
- Files with "secret", "password", "credential" in the name
- API keys and tokens
- Environment files (except `.example` files)
- Private keys (.pem, .key, etc.)

Always use `.example` suffix for template files with placeholder values.

## 📝 Scripts

This directory is currently empty. Scripts will be added as needed for:

- **Deployment** - Deployment automation
- **Testing** - Testing utilities
- **Setup** - Project setup and initialization
- **Database** - Database migrations and maintenance
- **Utilities** - General-purpose helper scripts

---

**For workspace-level scripts, see:** `../../_scripts/`

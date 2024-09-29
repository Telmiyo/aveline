# Commit Message Guidelines

## Overview

This document outlines the guidelines for writing commit messages in this repository. Following these conventions helps maintain a clear and consistent history of changes, which improves collaboration and project management.

## Commit Message Format

Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format. The format consists of a type, an optional scope, and a description. Here’s the general structure:
<type>(<scope>): <description>

### Types

- **feat**: A new feature for the user or an enhancement to existing features.
- **fix**: A bug fix for the user.
- **docs**: Documentation changes.
- **style**: Code style changes (formatting, missing semi-colons, etc.).
- **refactor**: Code changes that neither fix a bug nor add a feature.
- **test**: Adding or correcting tests.
- **chore**: Routine tasks or changes that do not modify src or test files.

### Scope

The scope is optional and indicates the part of the project affected by the commit. For example:

- **desktop**: Changes related to the desktop app.
- **mobile**: Changes related to the mobile app.

### Description

The description should be a short and clear summary of the change. Use the imperative mood (e.g., "fix bug" instead of "fixed bug").

## Examples

Here are some examples of well-formatted commit messages:

- `feat: initialize project setup and design initial homepage layout`
- `feat(desktop): setup local npm package for editor`
- `docs: update README with development workflow`
- `fix(mobile): resolve issue with user authentication`

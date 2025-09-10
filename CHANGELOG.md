# Changelog

## [Unreleased]
- Basic JSON deck importer with validation and localStorage persistence.
- Flashcards study mode with keyboard navigation.
- Utility `parseDeck` with unit tests.
- `parseDeck` now supports CSV input and improved validation.
- Flashcards key handler effect runs once to avoid redundant bindings.
- Basic multiple-choice Test mode with scoring.
- Test mode now shows per-question results and supports retaking incorrect answers.
- Flashcards now display optional images, audio playback, and explanations.
- Test mode gains keyboard shortcuts for option selection and navigation.
- Test mode now displays optional images, audio playback, explanations, and references.
- Importer tests cover explanation and reference fields.
- Test mode keyboard handler stabilized with useCallback to avoid re-binding listeners.
- Flashcards mode adds shuffle button and progress bar for better study tracking.
- JSON importer assigns an ID when missing to ensure decks are storable.
- Added adaptive Learn mode with keyboard support and mastery progress.
- Learn queue utility with unit tests.


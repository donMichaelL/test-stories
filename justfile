default:
    @just --list

# one-time: enable the git pre-commit hook (ktlint gate)
setup:
    git config core.hooksPath .githooks

# auto-format Kotlin with ktlint
format:
    ./gradlew ktlintFormat

# check style/format without modifying files
lint:
    ./gradlew ktlintCheck

# full gate: lint + unit tests
check:
    ./gradlew check

# unit tests only (JVM, no emulator)
test:
    ./gradlew test

# UI/E2E tests (requires a running emulator/device)
e2e:
    ./gradlew connectedAndroidTest
